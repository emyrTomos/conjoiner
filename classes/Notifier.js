function NotifierTraps(notifier) {
  this.set = function(target, property, value, receiver, path) {
    const deepPath = path ? path + '.' + property : property
    const notification = {event: 'propertyChange', property: deepPath, value: value}
    notifier.notify(notification)
    return Reflect.set(target, property, value, receiver)
  }
  this.get = function(target, property, receiver, path) {
    const deepPath = path ? path + '.' + property : property
    const value = Reflect.get(target, property, receiver)
    if (typeof value === 'function') {
      return (function() {
        const args = Array.from(arguments)
        const retVal = value.apply(receiver, args)
        const notification = {event: 'functionCall', property: deepPath, arguments: arguments}
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
      const handler = new Handler(this, deepPath)
      const retVal = new Proxy(value, handler)
      return retVal
      //return {}
    } else {
      return value
    }
  }

}


function Handler(traps, path) {
  this.set = function(target, property, value, receiver){
    return traps.set(target, property, value, receiver, path)
  }
  this.get = function(target, property, receiver) {
    return traps.get(target, property, receiver, path)
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
    console.log('binding ', binding, ' notification ', notification)
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