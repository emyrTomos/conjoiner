(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
function Handler(controller) {
  this.set = function(target, property, value, receiver) {
    controller.notify({
      event: 'propertyChange',
      property: property,
      value: value
    });
    return Reflect.set(target, property, value, receiver);
  };
  this.get = function(target, property, receiver) {
    var value = Reflect.get(target, property, receiver);
    if (typeof value === 'function') {
      return (function() {
        var retVal = value.call(receiver, arguments);
        var notification = {
          event: 'functionCall',
          property: property,
          arguments: arguments
        };
        if (retVal.then) {
          notification.completed = false;
          controller.notify(notification);
          retVal.then((function(resolution) {
            notification.result = resolution;
            notification.completed = true;
            controller.notify(notification);
          }));
        } else {
          notification.result = retVal;
          notification.completed = true;
          controller.notify(notification);
        }
        return retVal;
      });
    } else {
      return value;
    }
  };
}
function BaseController(model, view) {
  Object.call(this);
  this.view = view;
  this.model = new Proxy(model, this);
  this.bindings = [];
}
BaseController.prototype = Object.create(Object.prototype);
BaseController.prototype.constructor = BaseController;
BaseController.prototype.notify = function(notification) {
  this.bindings.forEach((function(binding) {
    if (binding.event === notification.event && binding.property === notification.property) {
      var modelEvent = new CustomEvent(notification.event, {detail: notification});
      binding.target.dispatchEvent(modelEvent);
    }
  }));
};
BaseController.prototype.addBinding = function(binding) {
  this.bindings.push(binding);
};
BaseController.prototype.removeBinding = function(binding) {
  this.binding = this.bindings.filter((function(oldbinding) {
    return oldbinding !== binding;
  }));
};
var $__default = BaseController;

//# sourceURL=/home/emyr/WebstormProjects/conjoiner/classes/BaseController.js
},{}]},{},[1]);
