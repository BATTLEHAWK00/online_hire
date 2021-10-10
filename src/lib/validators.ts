// eslint-disable-next-line no-unused-vars
export type Validator = (v: any) => boolean | string;

export const isUname: Validator = (v: string) =>
  v.length > 3 || '用户名必须大于3位！';
export const isName: Validator = (v: string) =>
  v.length > 4 || '名称必须大于4位！';
export const isPassword: Validator = (v: string) =>
  v.length > 3 || '密码未满足要求！';
export const isPhone: Validator = (v: string) =>
  /^1[0-9]{10}$/.test(v) || '电话号码无效！';
export const isEmail: Validator = (v: string) =>
  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) || '邮箱无效！';
export const isChineseName: Validator = (v: string) =>
  /^[\u4e00-\u9fa5]{2,4}$/.test(v) || '姓名无效！';
