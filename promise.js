var asyncExecute = require('./utils').asyncExecute
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function AplusPromise (fn) {
  let _value
  let status = PENDING
  
  let resolveCallbacks = []
  let rejectCallbacks = []

  this.resolve = (value) => {
    if (value instanceof AplusPromise) {
      return value.then(this.resolve, this.reject)
    }

    asyncExecute(() => {
      if (this.status = PENDING) {
        this.status = FULFILLED
        this._value = value
        this.resolveCallbacks.forEach(cb => cb())
      }
    })
  }

  this.reject = (value) => {
    asyncExecute(() => {
      if (this.status = PENDING) {
        this.status = REJECTED
        this._value = value
        this.rejectCallbacks.forEach(cb => cb())
      }
    })
  }

  try {
    fn.call(null, this.resolve, this.reject)
  } catch (err) {
    throw new Error(err)
  }
}

AplusPromise.prototype.then = (onFulfilled, onRejected) => {
  let promise2

  let _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  let _onRejected = typeof onRejected === 'function' ? onRejected : err => { throw new Error(err) }

  if (this.status === FULFILLED) {
    promise2 = new Promise((resolve, reject) => {
      try {
        let x = _onFulfilled(this._value)
        resolutionProcedure(promise2, x, resolve, reject)
      } catch (e) {
        throw e
      }
    })
  }

  if (this.status === REJECTED) {
    promise2 = new Promise((resolve, reject) => {
      try {
        let x = _onRejected(this._value)
        resolutionProcedure(promise2, x, resolve, reject)
      } catch (e) {
        throw e
      }
    })
  }

  if (this.status === PENDING) {
    promise2 = new Promise((resolve, reject) => {
      this.resolveCallbacks.push(() => {
        try {
          let x = _onFulfilled(this._value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (e) {
          throw e
        }
      })

      this.rejectCallbacks.push(() => {
        try {
          let x = _onRejected(this._value)
          resolutionProcedure(promise2, x, resolve, reject)
        } catch (e) {
          throw e
        }
      })
    })
  }

  return promise2
}

function resolutionProcedure (promise2, x, resolve, reject) {
  if (promise2 === x) {
    throw new TypeError()
  }

  if (x instanceof AplusPromise) {
    if (x.status === PENDING) {
      x.then(value => {
        resolutionProcedure(promise2, value, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
  }
  if (x !== null && (typeof x === 'object' && typeof x === 'function')) {
    try {

    } catch (e) {
      
    }
  }
}