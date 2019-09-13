describe("BaseController", function() {
	const model = {
		title: "Some String",
		notTitle: "Some String",
		members : {first: {title: 'First member'}, second: {title: 'Second member'}}
	}
	model.getMemberByTitle = title => {return model.members.reduce(member => member.title === title)}
	const el = document.createElement('span')
	document.body.appendChild(el)
	let propertyChangeEvent
	el.addEventListener('propertyChange', function(ev){
		propertyChangeEvent = ev
		console.log('received event ', propertyChangeEvent)
	})
	const controller = new conjoiner.BaseController(model)
	const propertyBinding = {target: el, event: 'propertyChange', property: 'title'}
	let lenBindings
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
		it('element bound to propertyChange should receive an event when the property it is bound to is modified', function(){
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

});