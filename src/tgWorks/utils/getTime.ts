const UTC_OFFSET = 3* 60*60*1000


export const getTime = (dateString: any) => {
  const date = new Date(new Date(dateString).getTime() + UTC_OFFSET);

  // const date = new Date(dateString);
  let hours: any = date.getUTCHours(); // Используем getUTCHours для UTC времени
  let minutes: any = date.getUTCMinutes();

  // Добавляем ведущий ноль, если число меньше 10
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
};

// const date = new Date(dateString);

// // Получаем смещение временной зоны в минутах и преобразуем его в миллисекунды
// const timezoneOffset = date.getTimezoneOffset() * 60000;

// // Создаем новый объект Date, скорректированный на смещение временной зоны
// const localDate = new Date(date.getTime() - timezoneOffset);

// // const date = new Date(dateString);
// let hours = localDate.getUTCHours(); // Используем getUTCHours для UTC времени
// let minutes = localDate.getUTCMinutes();

// // Добавляем ведущий ноль, если число меньше 10
// hours = hours < 10 ? '0' + hours : hours;
// minutes = minutes < 10 ? '0' + minutes : minutes;

// return `${hours}:${minutes}`;
