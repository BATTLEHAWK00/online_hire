// eslint-disable-next-line import/prefer-default-export
export function listToObject(list: any[], key: string) {
  const obj: any = {};
  // eslint-disable-next-line no-return-assign
  list.forEach(item => (obj[item[key]] = item));
  return obj;
}
