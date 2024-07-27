const UTC_OFFSET = 3* 60*60*1000

export const getFormattedDate = (inputDate: string) => {
  const date = new Date(new Date(inputDate).getTime() + UTC_OFFSET);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Месяцы начинаются с 0
  const year = date.getFullYear();

  // Форматируем день и месяц, добавляя ведущий ноль, если это необходимо
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}.${formattedMonth}.${year}`;
};
