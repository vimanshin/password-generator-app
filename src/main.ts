import '@/style.scss';
import { copyText } from '@/scripts/clipboard';
import {
  CHARACTER_SET_NAMES,
  generatePassword,
  type CharacterSetName,
} from '@/scripts/password';
import {
  STRENGTH_LABELS,
  getStrength,
  type StrengthLevel,
} from '@/scripts/strength';

const HINT_ZERO_LENGTH = 'Set a password length greater than 0';
const HINT_NO_SETS = 'Select at least one character type';
const HINT_NOTHING_TO_COPY = 'Generate a password first';
const HINT_COPY_FAILED =
  'Copy failed — press Ctrl+C to copy the selected password';

// Заглавными текст делает CSS
const COPIED_TEXT = 'Copied';
const COPIED_VISIBLE_MS = 2000;
// Пауза между очисткой и записью статуса: скринридер должен увидеть изменение
const ANNOUNCE_DELAY_MS = 100;

// Функция: находит элемент по id и проверяет, что он нужного типа
// Принимает: id элемента и его конструктор, например HTMLInputElement
// Возвращает: найденный элемент уже нужного типа; если его нет — бросает ошибку
function getElement<TElement extends HTMLElement>(
  id: string,
  elementType: new () => TElement
): TElement {
  const element = document.getElementById(id);

  if (!(element instanceof elementType)) {
    throw new Error(`Не найден элемент #${id} нужного типа`);
  }

  return element;
}

const form = getElement('generator-form', HTMLFormElement);
const passwordInput = getElement('password', HTMLInputElement);
const copyButton = getElement('copy-button', HTMLButtonElement);
const copyStatus = getElement('copy-status', HTMLParagraphElement);
const lengthSlider = getElement('password-length', HTMLInputElement);
const lengthOutput = getElement('length-value', HTMLOutputElement);
const strengthBlock = getElement('strength', HTMLDivElement);
const strengthLevel = getElement('strength-level', HTMLParagraphElement);
const hint = getElement('generator-hint', HTMLParagraphElement);
const generatorStatus = getElement('generator-status', HTMLParagraphElement);

// Один таймер на обе фазы статуса: «показать Copied» и «спрятать Copied».
// window.setTimeout всегда возвращает number (DOM), без конфликта с типами Node
let copyStatusTimer: number | undefined;

// Функция: создаёт «диктора» для live region — функцию, которая сначала очищает
// регион, а через паузу пишет текст, чтобы скринридер прочитал даже повтор.
// Таймер живёт в замыкании, поэтому у каждого региона он свой
// Принимает: элемент live region (role="status")
// Возвращает: функцию объявления; пустая строка очищает регион сразу
function createAnnouncer(region: HTMLElement): (message: string) => void {
  let announceTimer: number | undefined;

  // Функция: отменяет отложенную запись, очищает регион и планирует новый текст
  // Принимает: текст объявления или пустую строку
  // Возвращает: ничего
  return (message) => {
    window.clearTimeout(announceTimer);
    announceTimer = undefined;
    // Строго пустая строка, иначе не сработает :empty в SCSS
    region.textContent = '';

    if (message === '') return;

    // Колбэк: после паузы записывает текст в уже пустой регион
    announceTimer = window.setTimeout(() => {
      region.textContent = message;
    }, ANNOUNCE_DELAY_MS);
  };
}

// Подсказка под кнопкой: пустая строка прячет её через :empty
const setHint = createAnnouncer(hint);
// Невидимый статус генерации — только для скринридера
const announceGeneratorStatus = createAnnouncer(generatorStatus);

// Функция: находит чекбокс набора внутри формы по атрибуту name
// Принимает: имя набора символов
// Возвращает: чекбокс; если его нет — бросает ошибку
function getSetCheckbox(setName: CharacterSetName): HTMLInputElement {
  const control = form.elements.namedItem(setName);

  if (!(control instanceof HTMLInputElement) || control.type !== 'checkbox') {
    throw new Error(`Не найден чекбокс name="${setName}"`);
  }

  return control;
}

// Пары «имя набора — его чекбокс», ищем один раз при загрузке
const setCheckboxes = CHARACTER_SET_NAMES.map((setName) => ({
  setName,
  checkbox: getSetCheckbox(setName),
}));

// Функция: собирает имена наборов, чьи чекбоксы отмечены
// Принимает: ничего
// Возвращает: список выбранных наборов
function getSelectedSets(): CharacterSetName[] {
  return setCheckboxes
    .filter(({ checkbox }) => checkbox.checked)
    .map(({ setName }) => setName);
}

// Функция: красит заполненную часть слайдера через CSS-переменную --fill
// Принимает: ничего — читает текущее состояние слайдера
// Возвращает: ничего
function updateSliderFill(): void {
  const min = Number(lengthSlider.min);
  const max = Number(lengthSlider.max);
  const range = max - min;
  // Защита от деления на ноль, если min и max когда-нибудь совпадут
  const percent =
    range > 0 ? ((lengthSlider.valueAsNumber - min) / range) * 100 : 0;

  lengthSlider.style.setProperty('--fill', `${percent}%`);
}

// Функция: синхронизирует число длины и заливку со значением слайдера
// Принимает: ничего
// Возвращает: ничего
function syncLengthDisplay(): void {
  lengthOutput.value = String(lengthSlider.valueAsNumber);
  updateSliderFill();
}

// Функция: показывает уровень силы визуально; скринридеру его объявляет
// #generator-status, поэтому #strength больше не live region
// Принимает: новый уровень силы
// Возвращает: ничего
function renderStrength(level: StrengthLevel): void {
  strengthBlock.dataset.strength = level;
  strengthLevel.textContent = STRENGTH_LABELS[level];
}

// Функция: прячет «Copied» и отменяет любую запланированную фазу статуса
// Принимает: ничего
// Возвращает: ничего
function resetCopyStatus(): void {
  // clearTimeout спокойно принимает undefined — проверка не нужна
  window.clearTimeout(copyStatusTimer);
  copyStatusTimer = undefined;
  // Строго пустая строка, иначе не сработает :empty в SCSS
  copyStatus.textContent = '';
}

// Функция: объявляет «Copied» и через COPIED_VISIBLE_MS прячет его;
// очистка и запись разнесены по времени, чтобы повторное копирование тоже озвучивалось
// Принимает: ничего
// Возвращает: ничего
function showCopiedStatus(): void {
  resetCopyStatus();

  // Колбэк: после паузы пишет статус и планирует его скрытие
  copyStatusTimer = window.setTimeout(() => {
    copyStatus.textContent = COPIED_TEXT;
    copyStatusTimer = window.setTimeout(resetCopyStatus, COPIED_VISIBLE_MS);
  }, ANNOUNCE_DELAY_MS);
}

// Функция: выделяет пароль в поле, чтобы его можно было скопировать вручную
// Принимает: ничего
// Возвращает: ничего
function selectPasswordForManualCopy(): void {
  // Без фокуса выделение в input не попадёт под Ctrl+C
  passwordInput.focus();
  passwordInput.select();
}

// Функция: копирует текущий пароль и сообщает результат
// Принимает: ничего
// Возвращает: промис, который завершается после показа результата
async function handleCopyClick(): Promise<void> {
  const password = passwordInput.value;

  if (password === '') {
    setHint(HINT_NOTHING_TO_COPY);
    return;
  }

  const isCopied = await copyText(password);

  // Пока ждали буфер обмена, пользователь мог сгенерировать новый пароль —
  // тогда результат относится к старому значению и показывать его нельзя
  if (passwordInput.value !== password) return;

  if (!isCopied) {
    resetCopyStatus();
    selectPasswordForManualCopy();
    setHint(HINT_COPY_FAILED);
    return;
  }

  setHint('');
  showCopiedStatus();
}

// Функция: прячет подсказку, как только пользователь меняет настройки, —
// старый совет («выбери набор», «скопируй вручную») к новым настройкам уже не относится
// Принимает: ничего — событие input всплывает от слайдера и чекбоксов до формы
// Возвращает: ничего
function handleSettingsInput(): void {
  setHint('');
}

// Функция: проверяет настройки, генерирует пароль и объявляет результат
// Принимает: событие отправки формы
// Возвращает: ничего
function handleFormSubmit(event: SubmitEvent): void {
  event.preventDefault();

  const length = lengthSlider.valueAsNumber;
  const selectedSets = getSelectedSets();

  if (length === 0) {
    // Отменяем возможное отложенное «New password generated» от прошлого клика
    announceGeneratorStatus('');
    setHint(HINT_ZERO_LENGTH);
    return;
  }

  if (selectedSets.length === 0) {
    announceGeneratorStatus('');
    setHint(HINT_NO_SETS);
    return;
  }

  const strength = getStrength(length, selectedSets.length);

  passwordInput.value = generatePassword(length, selectedSets);
  renderStrength(strength);
  // Новый пароль ещё не скопирован — «Copied» рядом с ним был бы ложью
  resetCopyStatus();
  setHint('');
  announceGeneratorStatus(
    `New password generated. Strength: ${STRENGTH_LABELS[strength]}`
  );
}

lengthSlider.addEventListener('input', syncLengthDisplay);
form.addEventListener('input', handleSettingsInput);
form.addEventListener('submit', handleFormSubmit);
copyButton.addEventListener('click', handleCopyClick);

// Браузер может восстановить значение слайдера после перезагрузки
syncLengthDisplay();
