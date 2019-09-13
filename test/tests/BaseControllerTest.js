describe("BaseController", function() {
	const model = {
		title: "Some String",
		notTitle: "Some String",
		members : {first: {title: 'First member'}, second: {title: 'Second member'}}
	}
	model.getMemberByTitle = title => {return model.members.reduce(member => member.title === title)}
	const el = document.createElement('span')
	document.body.appendChild(el)
	let receivedEvent
	el.addEventListener('propertyChange', function(ev){
		receivedEvent = ev
		console.log('received event ', receivedEvent)
	})
	const controller = new conjoiner.BaseController(model)
	const binding = {target: el, event: 'propertyChange', property: 'title'}
	let lenBindings
	beforeEach(function(){
		lenBindings = controller.bindings.length
	})
	describe('#addBinding', function(){
		it("should add a binding to the bindings array", function() {
			controller.addBinding(binding)
			controller.bindings.length.should.equal(lenBindings + 1)
		});
	})
	describe('#hasBinding', function(){
		it('is expected to return true for binding', function(){
			expect(controller.hasBinding(binding)).to.be.true
		})
	})
	describe('#removeBinding', function(){
		it("should remove an element from the bindings", function() {
			controller.removeBinding(binding)
			controller.bindings.length.should.equal(lenBindings - 1)
		});
	})
	describe('#hasBinding', function(){
		it('is expected to return false for binding', function(){
			expect(controller.hasBinding(binding)).to.be.false
		})
	})
	describe('#notify', function(){
		it('element bound to propertyChange should receive an event when the field it is bound to is modified', function(){
			controller.addBinding(binding)
			should.not.exist(receivedEvent)
			controller.model.title = "Modified String"
			should.exist(receivedEvent)
		})
		it('event field should be propertyChange', function(){
			receivedEvent.detail.event.should.equal('propertyChange')
		})
		it('property field should be property modified', function(){
			receivedEvent.detail.property.should.equal('title')
		})
		it('value field should be the value that was set on the property', function(){
			receivedEvent.detail.value.should.equal("Modified String")
		})
	})

});