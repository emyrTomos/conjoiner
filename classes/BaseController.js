import Notifier from './Notifier'

function BaseController(model, view){
  Notifier.prototype.constructor.call(this, model)
  this.view = view
}

BaseController.prototype = Object.create(Notifier.prototype);
BaseController.prototype.constructor = BaseController


export default BaseController