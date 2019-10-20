const Notifier = require('./Notifier')

function BaseController(model, view){
  Notifier.prototype.constructor.call(this, model)
  this.view = view
}

BaseController.prototype = Object.create(Notifier.prototype);
BaseController.prototype.constructor = BaseController


module.exports = BaseController