export function RequireAuth() {
    return function (constructor: Function) {
        constructor.prototype.__requireAuth = true
    }
}