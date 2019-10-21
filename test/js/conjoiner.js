(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Notifier = require('./Notifier')

function BaseController(model, view){
  Notifier.prototype.constructor.call(this, model)
  this.view = view
}

BaseController.prototype = Object.create(Notifier.prototype);
BaseController.prototype.constructor = BaseController


module.exports = BaseController
},{"./Notifier":2}],2:[function(require,module,exports){
function NotifierTraps(notifier) {
  this.set = function(target, property, value, receiver, path) {
    const notification = {event: 'propertyChange', property: path, value: value}
    notifier.notify(notification)
    return Reflect.set(target, property, value, receiver)
  }
  this.get = function(target, property, receiver, path) {
    const value = Reflect.get(target, property, receiver)
    if (typeof value === 'function') {
      return (function() {
        const args = Array.from(arguments)
        const retVal = value.apply(receiver, args)
        const notification = {event: 'functionCall', property: path, arguments: args}
        if(retVal.then) {
          notification.completed = false
          notifier.notify(notification)
          retVal.then(resolution => {
            notification.result = resolution
            notification.completed = true
            notifier.notify(notification)
          })
        } else {
          notification.result = retVal
          notification.completed = true
          notifier.notify(notification)
        }
        return retVal
      })
    } else if (typeof value === 'object' && value !== null) {
      const handler = new Handler(this, path)
      const retVal = new Proxy(value, handler)
      return retVal
    } else {
      return value
    }
  }

}


function Handler(traps, path) {
  this.set = function(target, property, value, receiver){
    const deepPath = path ? path + '.' + property : property
    return traps.set(target, property, value, receiver, deepPath)
  }
  this.get = function(target, property, receiver) {
    const deepPath = path ? path + '.' + property : property
    return traps.get(target, property, receiver, deepPath)
  }
}


function Notifier(model){
  Object.call(this)
  const traps = new NotifierTraps(this)
  const handler = new Handler(traps, '')
  this.model = new Proxy(model, handler)
  this.bindings = []
}

Notifier.prototype = Object.create(Object.prototype);
Notifier.prototype.constructor = Notifier

Notifier.prototype.notify = function(notification) {
  this.bindings.forEach(binding => {
    if(binding.event === notification.event && binding.property === notification.property) {
      const modelEvent = new CustomEvent(notification.event, {detail: notification})
      binding.target.dispatchEvent(modelEvent)
    }
  })
}
Notifier.prototype.addBinding = function(binding) {
  this.bindings.push(binding)
}
Notifier.prototype.hasBinding = function(binding) {
  if(this.bindings.find(oldbinding => oldbinding === binding)) {
    return true
  }
  return false
}
Notifier.prototype.removeBinding = function(binding) {
  this.bindings = this.bindings.filter(oldbinding => oldbinding !== binding)
}

module.exports = Notifier
},{}],3:[function(require,module,exports){
window.conjoiner = {}
window.conjoiner.BaseController = require('./classes/BaseController')
window.conjoiner.Notifier = require('./classes/Notifier')

},{"./classes/BaseController":1,"./classes/Notifier":2}]},{},[3]);
