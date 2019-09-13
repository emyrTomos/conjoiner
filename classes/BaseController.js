function Handler(controller) {
  this.set = function(target, property, value, receiver) {
    controller.notify({event: 'propertyChange', property: property, value: value})
    return Reflect.set(target, property, value, receiver)
  }
  this.get = function(target, property, receiver) {
    const value = Reflect.get(target, property, receiver)
    if (typeof value === 'function') {
      return (function() {
        const retVal = value.call(receiver, arguments)
        const notification = {event: 'functionCall', property: property, arguments: arguments}
        if(retVal.then) {
          notification.completed = false
          controller.notify(notification)
          retVal.then(resolution => {
            notification.result = resolution
            notification.completed = true
            controller.notify(notification)
          })
        } else {
          notification.result = retVal
          notification.completed = true
          controller.notify(notification)
        }
        return retVal
      })
    } else {
      return value
    }
  }
}


function BaseController(model, view){
  Object.call(this)
  this.view = view
  this.model = new Proxy(model, this)
  this.bindings = []
}

BaseController.prototype = Object.create(Object.prototype);
BaseController.prototype.constructor = BaseController

BaseController.prototype.notify = function(notification) {
  this.bindings.forEach(binding => {
    if(binding.event === notification.event && binding.property === notification.property) {
      const modelEvent = new CustomEvent(notification.event, {detail: notification})
      binding.target.dispatchEvent(modelEvent)
    }
  })
}
BaseController.prototype.addBinding = function(binding) {
  this.bindings.push(binding)
}
BaseController.prototype.hasBinding = function(binding) {
  if(this.bindings.find(oldbinding => oldbinding === binding)) {
    return true
  }
  return false
}
BaseController.prototype.removeBinding = function(binding) {
  this.bindings = this.bindings.filter(oldbinding => oldbinding !== binding)
}

export default BaseController