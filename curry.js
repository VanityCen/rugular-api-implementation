function curry (fn) {
  let arity = fn.length

  return function _curry () {
    if (arguments.length < arity) {
      return _curry.bind(this, ...arguments)
    }
    return fn.apply(this, arguments)
  }
}