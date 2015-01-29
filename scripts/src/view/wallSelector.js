define(["backbone","templates/wallSelector","model/wallList","view/wallThumb"],function(Backbone,template,WallList,WallThumb){
	return Backbone.View.extend({
		tagName:"div",
		className:"wall-selector",
		template:_.template(template),
		wallList:new WallList(),
		events:{
			"click .toggle":"toggle",
			"click #new-wall-btn":"newWall",
			"mouseleave":"toggle",
			"mouseleave .toggle":"prevent"
		},
		newWall:function(){
			KEEP.newWall();
		},
		toggle:function(){
			var toggle=this.$el.find(".toggle")[0];
			if(this.$el.hasClass("wall-selector-shown")){
				this.$el.removeClass("wall-selector-shown");
				$(toggle).removeClass("toggle-hidden");
			}else{
				this.$el.addClass("wall-selector-shown");
				$(toggle).addClass("toggle-hidden");
			}
		},
		prevent:function(e){
			e.stopPropagation();
		},
		addListener:function(wall){
			var thumb=new WallThumb({model:wall});
			thumb.render();
			$(this.$el.find(".wall-list")[0]).append(thumb.el);
		},
		addWall:function(wall){
			this.wallList.add(wall);
		},
		initialize:function(){
			this.listenTo(this.wallList,"add",this.addListener);
		},
		render:function(){
			this.$el.html(this.template());
		}
	});
});
