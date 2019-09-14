(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
var $__Notifier__;
var Notifier = ($__Notifier__ = require("./Notifier"), $__Notifier__ && $__Notifier__.__esModule && $__Notifier__ || {default: $__Notifier__}).default;
function BaseController(model, view) {
  Notifier.prototype.constructor.call(this, model);
  this.view = view;
}
BaseController.prototype = Object.create(Notifier.prototype);
BaseController.prototype.constructor = BaseController;
var $__default = BaseController;

//# sourceURL=/home/emyr/WebstormProjects/conjoiner/classes/BaseController.js
},{"./Notifier":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
function NotifierTraps(notifier) {
  this.set = function(target, property, value, receiver, path) {
    var deepPath = path ? path + '.' + property : property;
    var notification = {
      event: 'propertyChange',
      property: deepPath,
      value: value
    };
    notifier.notify(notification);
    return Reflect.set(target, property, value, receiver);
  };
  this.get = function(target, property, receiver, path) {
    var deepPath = path ? path + '.' + property : property;
    var value = Reflect.get(target, property, receiver);
    if (typeof value === 'function') {
      return (function() {
        var args = Array.from(arguments);
        var retVal = value.apply(receiver, args);
        var notification = {
          event: 'functionCall',
          property: deepPath,
          arguments: arguments
        };
        if (retVal.then) {
          notification.completed = false;
          notifier.notify(notification);
          retVal.then((function(resolution) {
            notification.result = resolution;
            notification.completed = true;
            notifier.notify(notification);
          }));
        } else {
          notification.result = retVal;
          notification.completed = true;
          notifier.notify(notification);
        }
        return retVal;
      });
    } else if (typeof value === 'object' && value !== null) {
      var handler = new Handler(this, deepPath);
      var retVal = new Proxy(value, handler);
      return retVal;
    } else {
      return value;
    }
  };
}
function Handler(traps, path) {
  this.set = function(target, property, value, receiver) {
    return traps.set(target, property, value, receiver, path);
  };
  this.get = function(target, property, receiver) {
    return traps.get(target, property, receiver, path);
  };
}
function Notifier(model) {
  Object.call(this);
  var traps = new NotifierTraps(this);
  var handler = new Handler(traps, '');
  this.model = new Proxy(model, handler);
  this.bindings = [];
}
Notifier.prototype = Object.create(Object.prototype);
Notifier.prototype.constructor = Notifier;
Notifier.prototype.notify = function(notification) {
  this.bindings.forEach((function(binding) {
    console.log('binding ', binding, ' notification ', notification);
    if (binding.event === notification.event && binding.property === notification.property) {
      var modelEvent = new CustomEvent(notification.event, {detail: notification});
      binding.target.dispatchEvent(modelEvent);
    }
  }));
};
Notifier.prototype.addBinding = function(binding) {
  this.bindings.push(binding);
};
Notifier.prototype.hasBinding = function(binding) {
  if (this.bindings.find((function(oldbinding) {
    return oldbinding === binding;
  }))) {
    return true;
  }
  return false;
};
Notifier.prototype.removeBinding = function(binding) {
  this.bindings = this.bindings.filter((function(oldbinding) {
    return oldbinding !== binding;
  }));
};
var $__default = Notifier;

//# sourceURL=/home/emyr/WebstormProjects/conjoiner/classes/Notifier.js
},{}],3:[function(require,module,exports){
"use strict";
var $__BaseController__,
    $__Notifier__;
window.conjoiner = {};
var BaseController = ($__BaseController__ = require("./BaseController"), $__BaseController__ && $__BaseController__.__esModule && $__BaseController__ || {default: $__BaseController__}).default;
var Notifier = ($__Notifier__ = require("./Notifier"), $__Notifier__ && $__Notifier__.__esModule && $__Notifier__ || {default: $__Notifier__}).default;
window.conjoiner.BaseController = BaseController;
window.conjoiner.Notifier = Notifier;

//# sourceURL=/home/emyr/WebstormProjects/conjoiner/classes/conjoiner.js
},{"./BaseController":1,"./Notifier":2}]},{},[3]);
