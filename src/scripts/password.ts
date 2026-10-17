// Имена наборов совпадают с атрибутами name у чекбоксов в index.html
export const CHARACTER_SET_NAMES = [
  'uppercase',
  'lowercase',
  'numbers',
  'symbols',
] as const;

export type CharacterSetName = (typeof CHARACTER_SET_NAMES)[number];

// Символы без пробела, кавычек и обратного слэша: их легко потерять
// при копировании или сломать ими строку в конфиге или терминале
const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/',
} as const satisfies Record<CharacterSetName, string>;

// Сколько разных значений помещается в Uint32: 2^32
const UINT32_RANGE = 2 ** 32;

// Функция: возвращает криптостойкий случайный индекс без перекоса (modulo bias)
// Принимает: количество вариантов — индекс будет от 0 до этого числа не включительно
// Возвращает: случайный целый индекс
function getRandomIndex(optionCount: number): number {
  if (
    !Number.isInteger(optionCount) ||
    optionCount <= 0 ||
    optionCount > UINT32_RANGE
  ) {
    throw new RangeError(`Некорректное число вариантов: ${optionCount}`);
  }

  // Самое большое кратное optionCount, которое помещается в Uint32.
  // Всё, что выше, — «хвост», который дал бы перекос, его отбрасываем.
  const limit = UINT32_RANGE - (UINT32_RANGE % optionCount);
  const buffer = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buffer);
    const randomValue = buffer[0];

    // noUncheckedIndexedAccess: buffer[0] имеет тип number | undefined
    if (randomValue === undefined) {
      throw new Error('crypto.getRandomValues не заполнил буфер');
    }

    if (randomValue < limit) {
      return randomValue % optionCount;
    }
  }
}

// Функция: выбирает один случайный символ из строки-набора
// Принимает: строку допустимых символов
// Возвращает: один символ
function pickRandomCharacter(characters: string): string {
  const character = characters[getRandomIndex(characters.length)];

  if (character === undefined) {
    throw new Error('Случайный индекс вышел за пределы набора символов');
  }

  return character;
}

// Функция: перемешивает символы алгоритмом Фишера–Йетса, не меняя исходный массив
// Принимает: массив символов
// Возвращает: новый массив тех же символов в случайном порядке
function shuffle(characters: readonly string[]): string[] {
  const result = [...characters];

  for (let i = result.length - 1; i > 0; i--) {
    const j = getRandomIndex(i + 1);
    const current = result[i];
    const other = result[j];

    // Оба индекса в пределах массива, но компилятор об этом не знает
    if (current === undefined || other === undefined) {
      throw new Error('Индекс перемешивания вышел за пределы массива');
    }

    result[i] = other;
    result[j] = current;
  }

  return result;
}

// Функция: генерирует пароль из выбранных наборов; если длины хватает,
// гарантирует хотя бы один символ из каждого набора
// Принимает: длину пароля и список выбранных наборов
// Возвращает: готовый пароль
export function generatePassword(
  length: number,
  selectedSets: readonly CharacterSetName[]
): string {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError(`Длина пароля должна быть больше 0: ${length}`);
  }

  if (selectedSets.length === 0) {
    throw new RangeError('Не выбран ни один набор символов');
  }

  const pool = selectedSets.map((setName) => CHARACTER_SETS[setName]).join('');
  const characters: string[] = [];

  // Гарантия «по одному из каждого набора» возможна, только если хватает места
  if (length >= selectedSets.length) {
    selectedSets.forEach((setName) => {
      characters.push(pickRandomCharacter(CHARACTER_SETS[setName]));
    });
  }

  while (characters.length < length) {
    characters.push(pickRandomCharacter(pool));
  }

  // Без перемешивания первые символы всегда шли бы в порядке наборов: A, a, 1, !
  return shuffle(characters).join('');
}
