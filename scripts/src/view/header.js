define(["backbone"],function(Backbone){
	return Backbone.View.extend({
		tagName:"div",
		className:"header",
		template:_.template($("#header-template").html()),
		events:{
			"click #add-btn":"newNote",
			"click #clear-btn":"clearNotes"
		},
		newNote:function(){
			KEEP.wall.addNote();
		},
		clearNotes:function(){
			KEEP.wall.clearNotes();
		},
		render:function(){
			this.$el.html(this.template());
		}
	});
});
