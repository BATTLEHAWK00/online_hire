// eslint-disable-next-line import/prefer-default-export
export function RequireAuth() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (constructor: Function) => {
    // eslint-disable-next-line no-param-reassign,no-underscore-dangle
    constructor.prototype.__requireAuth = true;
  };
}
