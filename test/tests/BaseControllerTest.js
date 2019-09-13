describe("BaseController", function() {
	const model = {
		title: "Some String",
		notTitle: "Some String",
		members: {first: {title: 'First member'}, second: {title: 'Second member'}},
		syncFunction: input => 'Synchronous: ' + input
	}
	console.log(model.syncFunction(' Inline console call'))
	const el = document.createElement('span')
	document.body.appendChild(el)
	let propertyChangeEvent
	let syncFunctionCallEvent
	el.addEventListener('propertyChange', function(ev){
		propertyChangeEvent = ev
		console.log('received propertyChange event ', propertyChangeEvent)
	})
	el.addEventListener('functionCall', function(ev){
		if (ev.detail.property === 'syncFunction')
		{
			syncFunctionCallEvent = ev
			console.log('received functionCall event ', syncFunctionCallEvent)
		}
	})
	const propertyBinding = {target: el, event: 'propertyChange', property: 'title'}
	const syncFunctionBinding = {target: el, event: 'functionCall', property: 'syncFunction'}
	let lenBindings

	const controller = new conjoiner.BaseController(model)
	beforeEach(function(){
		lenBindings = controller.bindings.length
	})
	describe('#addBinding', function(){
		it("should add a binding to the bindings array", function() {
			controller.addBinding(propertyBinding)
			controller.bindings.length.should.equal(lenBindings + 1)
		});
	})
	describe('#hasBinding', function(){
		it('is expected to return true for binding', function(){
			expect(controller.hasBinding(propertyBinding)).to.be.true
		})
	})
	describe('#removeBinding', function(){
		it("should remove an element from the bindings", function() {
			controller.removeBinding(propertyBinding)
			controller.bindings.length.should.equal(lenBindings - 1)
		});
	})
	describe('#hasBinding', function(){
		it('is expected to return false for binding', function(){
			expect(controller.hasBinding(propertyBinding)).to.be.false
		})
	})
	describe('#notify', function(){
		describe('property change notifications', function(){
			it('bound element should receive an event when the property it is bound to is modified', function(){
				controller.addBinding(propertyBinding)
				should.not.exist(propertyChangeEvent)
				controller.model.title = "Modified String"
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
				controller.addBinding(syncFunctionBinding)
				should.not.exist(syncFunctionCallEvent)
				syncFunctionReturn = controller.model.syncFunction('Function call')
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
	})

});