// Функция: копирует текст в буфер обмена через Clipboard API
// Принимает: текст для копирования
// Возвращает: промис с true при успехе и false, если копирование недоступно или запрещено
export async function copyText(text: string): Promise<boolean> {
  // В типах DOM clipboard обязателен, но вне secure context (http, не localhost)
  // браузер его не создаёт. Проверка через in честная: без any и без !
  if (!('clipboard' in navigator)) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Отказ в разрешении, неактивная вкладка и т. п. — промис writeText отклонён
    return false;
  }
}
