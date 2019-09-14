describe("Notifier", function() {
	const model = {
		title: "Some String",
		notTitle: "Some String",
		members: {first: {title: 'First member'}, second: {title: 'Second member'}},
		syncFunction: input => 'Synchronous: ' + input,
		asyncFunction: async input => {
			await new Promise(resolve => setTimeout(resolve, 1000))
			return Promise.resolve('Asynchronous: ' + input)
		}
	}
	const el = document.createElement('span')
	let propertyChangeEvent
	let syncFunctionCallEvent
	let asyncFunctionCallPendingEvent
	let asyncFunctionCallCompletedEvent
	el.addEventListener('propertyChange', function(ev){
		propertyChangeEvent = ev
	})
	el.addEventListener('functionCall', function(ev){
		if (ev.detail.property === 'syncFunction')
		{
			syncFunctionCallEvent = ev
		}
		if (ev.detail.property === 'asyncFunction') {
			if(ev.detail.completed) {
				asyncFunctionCallCompletedEvent = ev
			} else {
				asyncFunctionCallPendingEvent = ev
			}
		}
	})
	const propertyBinding = {target: el, event: 'propertyChange', property: 'title'}
	const syncFunctionBinding = {target: el, event: 'functionCall', property: 'syncFunction'}
	const asyncFunctionBinding = {target: el, event: 'functionCall', property: 'asyncFunction'}
	let lenBindings

	const notifier = new conjoiner.Notifier(model)
	beforeEach(function(){
		lenBindings = notifier.bindings.length
	})
	describe('#addBinding', function(){
		it("should add a binding to the bindings array", function() {
			notifier.addBinding(propertyBinding)
			notifier.bindings.length.should.equal(lenBindings + 1)
		});
	})
	describe('#hasBinding', function(){
		it('is expected to return true for binding', function(){
			expect(notifier.hasBinding(propertyBinding)).to.be.true
		})
	})
	describe('#removeBinding', function(){
		it("should remove an element from the bindings", function() {
			notifier.removeBinding(propertyBinding)
			notifier.bindings.length.should.equal(lenBindings - 1)
		});
	})
	describe('#hasBinding', function(){
		it('is expected to return false for binding', function(){
			expect(notifier.hasBinding(propertyBinding)).to.be.false
		})
	})
	describe('#notify', function(){
		describe('property change notifications', function(){
			it('bound element should receive an event when the property it is bound to is modified', function(){
				notifier.addBinding(propertyBinding)
				should.not.exist(propertyChangeEvent)
				notifier.model.title = "Modified String"
				should.exist(propertyChangeEvent)
			})
			it('event detail "event" property should be propertyChange', function(){
				propertyChangeEvent.detail.event.should.equal('propertyChange')
			})
			it('event detail "property" property should be the property modified', function(){
				propertyChangeEvent.detail.property.should.equal('title')
			})
			it('event detail "value" property should be the value that was set on the property', function(){
				propertyChangeEvent.detail.value.should.equal("Modified String")
			})
		})
		describe('synchonous function call notifications', function(){
			let syncFunctionReturn
			it('bound element should receive an event when the function it is bound to is called', function(){
				notifier.addBinding(syncFunctionBinding)
				should.not.exist(syncFunctionCallEvent)
				syncFunctionReturn = notifier.model.syncFunction('Function call')
				should.exist(syncFunctionCallEvent)
			})
			it('event detail "event" property should be functionCall', function(){
				syncFunctionCallEvent.detail.event.should.equal('functionCall')
			})
			it('event detail "property" property should be the name of the function called', function(){
				syncFunctionCallEvent.detail.property.should.equal('syncFunction')
			})
			it('event detail "argument" property should be the argument object that was sent to the function', function(){
				syncFunctionCallEvent.detail.arguments.length.should.equal(1)
				syncFunctionCallEvent.detail.arguments[0].should.equal('Function call')
			})
			it('event detail "result" property should be the value that was returned from the function', function(){
				syncFunctionCallEvent.detail.result.should.equal(syncFunctionReturn)
			})
		})
		describe('asynchonous function call pending notifications', function(){
			let asyncFunctionReturn
			it('bound element should receive an event when the function it is bound to is called', function(){
				notifier.addBinding(asyncFunctionBinding)
				should.not.exist(asyncFunctionCallPendingEvent)
				should.not.exist(asyncFunctionCallCompletedEvent)
				asyncFunctionReturn = notifier.model.asyncFunction('Function call')
				should.exist(asyncFunctionCallPendingEvent)
			})
			it('event detail "event" property should be functionCall', function(){
				asyncFunctionCallPendingEvent.detail.event.should.equal('functionCall')
			})
			it('event detail "property" property should be the name of the function called', function(){
				asyncFunctionCallPendingEvent.detail.property.should.equal('asyncFunction')
			})
			it('event detail "argument" property should be the argument object that was sent to the function', function(){
				asyncFunctionCallPendingEvent.detail.arguments.length.should.equal(1)
				asyncFunctionCallPendingEvent.detail.arguments[0].should.equal('Function call')
			})
			it('event detail "result" property is expected to be undefined', function(){
				expect(asyncFunctionCallPendingEvent.detail.result).to.be.undefined
			})
			it('bound element should receive an event when the function return is resolved', async function(){
				const result = await asyncFunctionReturn
				describe('resolved promise', function(){
					it('should exist', function(){
						should.exist(asyncFunctionCallCompletedEvent)
					})
					it('should have same properties and values as pending event except for "result"', function(){
						asyncFunctionCallCompletedEvent.detail.event.should.equal('functionCall')
						asyncFunctionCallCompletedEvent.detail.arguments.length.should.equal(1)
						asyncFunctionCallCompletedEvent.detail.arguments[0].should.equal('Function call')
					})
					it('event detail "result" property is expected to be defined', function(){
						expect(asyncFunctionCallPendingEvent.detail.result).not.to.be.undefined
					})
					it('event detail "result" property should match resolution of function return', function(){
						asyncFunctionCallCompletedEvent.detail.result.should.equal(result)
					})
				})
				return Promise.resolve(result)
			})
		})
	})

});