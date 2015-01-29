define(["backbone","defaults/colors","templates/editor"],function(Backbone,colors,template){
	return Backbone.View.extend({
		tagName:"div",
		className:"editor-shade",
		template:_.template(template),
		shouldClose:false,
		events:{
			"click .editor-container":"prevent",
			"mousedown .editor-container":"prevent",
			"mouseup .editor-container":"onMouseUp",
			"click .color-btn":"setColor",
			"mousedown":"onMouseDown",
			"mouseup":"close",
			"change #custom-btn":"setColor"
		},
		close:function(e){
			if(this.shouldClose){
				this.saveNote();
			}
		},
		onMouseDown:function(e){
			this.shouldClose=true;
		},
		onMouseUp:function(e){
			this.shouldClose=false;
			this.prevent(e);
		},
		setColor:function(e){
			var elem=this.$el.find(".content")[0];
      var value=$(elem).html();
      this.model.set({content:value});
      this.model.set({color:e.target.value});
		},
		prevent:function(e){
			e.stopPropagation();
		},
		saveNote:function(){
			var elem=this.$el.find(".content")[0];
			var value=$(elem).html();
			this.model.set({content:value});
			this.model.save();
			this.remove();
		},
		getDateString:function(){
			var d = new Date();
			return(d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate());
		},
		render:function(){
			var obj=this.model.toJSON();
			obj.colors=colors;/*send color choices to template*/
			if(obj.content.length<1){
				obj.content=this.getDateString();
			}
			this.$el.html(this.template(obj));
			var elem=this.$el.find(".content")[0];
			var picker=this.$el.find("#custom-btn")[0];
			$(picker).spectrum({
    		color: obj.color,
    		clickoutFiresChange:true,
    		replacerClassName:"spectrum"
			});
			setTimeout(function(){
				$(elem).selectText();
				$(elem).focus();
			},50);
		},
		initialize:function(){
			this.listenTo(this.model,"change",this.render);
			this.listenTo(this.model,"destroy",this.remove);
		}
	});
});
