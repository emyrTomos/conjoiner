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


function ModelProxier(model, controller){
  const handler = new Handler(controller)
  this.model = new Proxy(model, handler)
  this.bindings = []

}
ModelProxier.prototype.notify = function(notification) {
  this.bindings.forEach(binding => {
    console.log(binding.event, binding.property)
    if(binding.event === notification.event && binding.property === notification.property) {
      const modelEvent = new CustomEvent(notification.event, {detail: notification})
      binding.target.dispatchEvent(modelEvent)
    }
  })
}
ModelProxier.prototype.addBinding = function(binding) {
  this.bindings.push(binding)
}
ModelProxier.prototype.removeBinding = function(binding) {
  this.binding = this.bindings.filter(oldbinding => oldbinding !== binding)
}

export default ModelProxier