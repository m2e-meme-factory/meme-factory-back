export const checkObjExistence = (arr: Array<any>, id: number) => {
  return arr.some((item) => item.telegramId === id);
};
