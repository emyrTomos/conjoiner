describe("BaseController", function() {
	const model = {
		title: "Some String",
		members : {first: {title: 'First member'}, second: {title: 'Second member'}}
	}
	model.getMemberByTitle = title => {return model.members.reduce(member => member.title === title)}
	const el = document.createElement('span')
	const controller = new conjoiner.BaseController(model)
	console.log(controller.addBinding)
	const binding = {target: el, event: 'functionCall', property: 'getMemberByTitle'}
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
});