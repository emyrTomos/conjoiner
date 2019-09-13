describe("BaseController", function() {
	const model = {
		title: "Some String",
		members : {first: {title: 'First member'}, second: {title: 'Second member'}}
	}
	model.getMemberByTitle = title => {return model.members.reduce(member => member.title === title)}
	const el = document.createElement('span')
	const controller = new conjoiner.BaseController(model)
	describe('#addBinding', function(){
		const lenBindings = controller.bindings.length
		const binding = {target: el, event: 'functionCall', property: 'getMemberByTitle'}
		it("adds an element to the bindings", function() {
			controller.addBinding(binding)
			chai.assert.equal(controller.bindings.length, (lenBindings+1))
		});
	})

});