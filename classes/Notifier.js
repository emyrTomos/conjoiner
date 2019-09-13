function Handler(notifier) {
  this.set = function(target, property, value, receiver) {
    notifier.notify({event: 'propertyChange', property: property, value: value})
    return Reflect.set(target, property, value, receiver)
  }
  this.get = function(target, property, receiver) {
    const value = Reflect.get(target, property, receiver)
    if (typeof value === 'function') {
      return (function() {
        const args = Array.from(arguments)
        const retVal = value.apply(receiver, args)
        const notification = {event: 'functionCall', property: property, arguments: arguments}
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
    } else {
      return value
    }
  }
}


function Notifier(model){
  Object.call(this)
  const handler = new Handler(this)
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

export default Notifier