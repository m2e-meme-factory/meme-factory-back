import { IWebQueryAnswer } from '../webQueryWorks';

export const buildQueryMessage = (
  { body, type }: IWebQueryAnswer
) => {
  let message = "mes"

  if (type == "is_banned") {
    message = "Ошибка, ваш аккаунт заблокирован"
  }

  if (type == 'verification')
    message = 'Вы успешно прошли верификацию!';
  else if (type == 'alert')
    message = `
    Вы уже состоите в этой поездке, так что повторно присоединиться не можете! Вот так
    `;
  else if (type == 'request')
      message = `
        
      `;

  return message
};
