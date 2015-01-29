define(["backbone","templates/footer"],function(Backbone,template){
	return Backbone.View.extend({
		tagName:"div",
		className:"footer",
		template:_.template(template),
		render:function(){
			this.$el.html(this.template());
		}
	});
});
