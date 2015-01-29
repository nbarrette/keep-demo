define(["backbone","templates/wallThumb"],function(Backbone,template){
	return Backbone.View.extend({
		tagName:"div",
		className:"wall-thumb",
		template:_.template(template),
		events:{
			"click .wall-thumb-image":"onClickThumb",
			"click .delete-btn":"onClickDelete"
		},
		onClickDelete:function(e){
			KEEP.deleteWall(this.model);
			this.remove();
		},
		onClickThumb:function(e){
			KEEP.wall.saveHTML();
			KEEP.switchWall(this.model);
			this.prevent(e);
		},
		prevent:function(e){
			e.stopPropagation();
		},
		initialize:function(){
			this.listenTo(this.model,"change:innerHTML",this.render);
			this.listenTo(this.model,"destroy",this.remove);
		},
		render:function(){
			var obj=this.model.toJSON();
			this.$el.html(this.template(obj));
			var width=obj.width;
			var height=obj.height;
			var left=-width/2;
			var top=-height/2;
			var scaleX=1/(width/190);
			var scaleY=1/(height/106);
			/*apply css scaling to create smart thumbnail*/
			$(this.$el.find(".wall-thumb-image")[0]).css({
				"left":left+"px",
				"top":top+"px",
				"width":width+"px",
				"height":height+"px",
				"-ms-transform": "scale("+scaleY+","+scaleY+")",
				"-webkit-transform": "scale("+scaleY+","+scaleY+")",
				"transform": "scale("+scaleY+","+scaleY+")"
			});
		}
	});
});
