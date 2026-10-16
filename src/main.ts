import '@/style.scss';
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
const lengthSlider = getElement('password-length', HTMLInputElement);
const lengthOutput = getElement('length-value', HTMLOutputElement);
const strengthBlock = getElement('strength', HTMLDivElement);
const strengthLevel = getElement('strength-level', HTMLParagraphElement);
const hint = getElement('generator-hint', HTMLParagraphElement);

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

// Функция: показывает уровень силы; текст меняет, только если уровень другой,
// чтобы live region не объявлял одно и то же повторно
// Принимает: новый уровень силы
// Возвращает: ничего
function renderStrength(level: StrengthLevel): void {
  if (strengthBlock.dataset.strength === level) return;

  strengthBlock.dataset.strength = level;
  strengthLevel.textContent = STRENGTH_LABELS[level];
}

// Функция: выводит подсказку под кнопкой; пустая строка прячет её через :empty
// Принимает: текст подсказки или пустую строку
// Возвращает: ничего
function setHint(message: string): void {
  hint.textContent = message;
}

// Функция: проверяет настройки, генерирует пароль и обновляет силу
// Принимает: событие отправки формы
// Возвращает: ничего
function handleFormSubmit(event: SubmitEvent): void {
  event.preventDefault();

  const length = lengthSlider.valueAsNumber;
  const selectedSets = getSelectedSets();

  if (length === 0) {
    setHint(HINT_ZERO_LENGTH);
    return;
  }

  if (selectedSets.length === 0) {
    setHint(HINT_NO_SETS);
    return;
  }

  passwordInput.value = generatePassword(length, selectedSets);
  renderStrength(getStrength(length, selectedSets.length));
  setHint('');
}

lengthSlider.addEventListener('input', syncLengthDisplay);
form.addEventListener('submit', handleFormSubmit);

// Браузер может восстановить значение слайдера после перезагрузки
syncLengthDisplay();
