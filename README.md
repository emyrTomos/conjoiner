# Conjoiner

Conjoiner is intended to provide a simple native framework for MVC front end applications. It is born out of a frustration with Angular and an excitement about new ES6 developments like Proxies Custom Elements/Web Components along with new HTML constructs such as the template tag and the slot tag.

The notifier part is first out of the blocks - I hope to make the various parts individually useful so they are seperate exports.

The transpiler world still struggles a little with ES6 imports and the best feature of CommonJS/require, granular modules grouped together into a whole piece of code, struggles with ES6 import depth restrictions in ways I haven't bottomed out yet so the modules are grouped using require

Since class syntax is advertised as being for the most part syntactic sugar rather than a novel way of creating class-based code the old prototype syntax is used. This may change if the trees deepen as it does seem to make calling superclass methods simpler.

## Usage

### Notifier

The notifier provides the two-way bindings. It will return a proxy with bindings wherever a property field is an object, so deep properties can be bound to using dot notation in the usual way. Arrays are currently returned as is - it seems unwise to add too much overhead to iterables if the array elements themselves turn out to be themselves objects. There is an assumption that array elements will not be individually bound to but rather singled out for having a notifier of their own set. 
What there is of this is not guaranteed to be stable but likely to be. The most likely thing to change is the structure of the modules as views/web components are added in. 

From your project root run:

 `
		npm install conjoiner --save
	`

Then in your javascript:

```
		const Notifier = require('conjoiner').Notifier
		let model = {
			someProperty: "foo",
			someFunction: par => { console.log('Parameter => ', par)}
		}
		const notifier = new Notifier(model)
		model = notifier.model
		const el = document.createElement('span')
```	

Add some bindings:

```
		const propertyBinding = {target: el, event: 'propertyChange', property: 'someProperty'}
		notifier.addBinding(propertyBinding)
		el.addEventListener('propertyChange', function(ev){
			if(ev.detail.property === 'someProperty') {
				console.log('Got event ', ev.detail.property, ' changed to ', ev.detail.value)
			}
		})
```

Then make a change to the notifier.model.someProperty field:

```
		model.someProperty = 'bar'
		//expected result: 'Got event someProperty changed to bar'
```

A more useful pattern might be to use the base controller, which also takes a view as an argument, and extend this to make controllers with bindings (which is the target goal of this part of the project):

 ```
		const BaseController = require('conjoiner').BaseController
		function ReadingContext(model, view){
		  BaseController.call(this, model, view)
		  this.model.addBinding({target: view, event: 'propertyChange', property: 'someProperty'})
		  this.view.addEventListener('change', ev => this.model.someProperty = this.view.value)
		}
		ReadingContext.prototype = Object.create(BaseController.prototype);
		ReadingContext.prototype.constructor = ReadingContext;
```

Available events:

* **propertyChange** :
    *detail.property: property modified
    *detail.value: new value
* **functionCall**:
  *detail.property: name of function called
  *detail.completed: true for synchronous or completed asynchronous, false for pending asynchronous function
    *detail.arguments: arguments
    *detail.result: undefined for pending (where completed is falese) o/w return value of function/resolution of promise

## Tests

The tests can be run with `npm test` in the usual way. At the moment the script in test also transpiles and relies on browserify being available locally this may change.  The headless browser landscape seems to be in some flux at the moment so test will open a browser and run the tests in there. 
