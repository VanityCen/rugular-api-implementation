module.exports = {
  asyncExecute: function (fn, context = null) {
    setTimeout(fn.bind(context), 0)
  }
}