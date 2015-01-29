define(["backbone","view/editor","spectrum","templates/note"],function(Backbone,Editor,Spectrum,template){
	return Backbone.View.extend({
		tagName:"div",
		className:"note",
		template:_.template(template),
		dragging:false,
		isDrawn:false,
		lastClick:0,
		shouldClick:false,
		shouldDelete:false,
		shouldEdit:false,
		dragStartX:0,
		dragStartY:0,
		mouseOutTimeout:null,
		mouseOutDelay:200,/*device to counter ui lag messing up mouse movement*/
		doubleClickDelay:200,/*TODO global options object containing this and other stuff*/
		events:{
			/*
				the reason I don't use the click event is 
				to allow greater control on event type detection
				and so I can use the same code for touch events
			*/
			"mousedown":"onMouseDown",
			"mouseup":"onMouseUp",
			"touchstart":"onMouseDown",
			"touchend":"onMouseUp",
			"mouseleave":"onMouseOut",
			"mouseenter":"onMouseIn",
			"mousedown .delete-btn":"onMouseDown",
			"mouseup .delete-btn":"onMouseUp",
			"mousedown .edit-btn":"onMouseDown",
			"mouseup .edit-btn":"onMouseUp",
		},
		deleteNote:function(){
			if(this.model.get("spawnNext")){
				KEEP.wall.createNote();
			}
			this.model.destroy();
		},
		editNote:function(){
			var editor=new Editor({model:this.model});
			editor.render();
			$("body").append(editor.el);
		},
		onMouseDown:function(e){
			if($(e.target).hasClass("delete-btn")){
				this.shouldDelete=true;
			}else if($(e.target).hasClass("edit-btn")){
				this.shouldEdit=true;
			}else{/*event is for this.el */
				if(!this.dragging){
					this.dragging=true;
					this.dragStartX=KEEP.wall.mouseX;
					this.dragStartY=KEEP.wall.mouseY;
					var obj=this;
					setTimeout(function(){
						obj.dragLoop();
					},10);
				}
				this.shouldClick=true;
			}
			e.preventDefault();/*to enable drag on mobiles*/
			this.prevent(e);/*prevent event with same target going up the dom*/
		},
		onMouseUp:function(e){
			if($(e.target).hasClass("delete-btn")){
				this.shouldDelete=false;
				this.deleteNote();
			}else if($(e.target).hasClass("edit-btn")){
				this.shouldEdit=false;
				this.editNote();
			}else{/*event is for this.el */
				if(this.dragging){
					this.dragging=false;
					this.model.save();
				}
				if(this.shouldClick){
					this.onClick(e);
				}
				this.shouldClick=false;
			}
			this.prevent(e);/*prevent event with same target going up the dom*/
		},
		prevent:function(e){
			e.stopPropagation();
		},
		onClick:function(e){
			var now=new Date().getTime();
			if(now-this.lastClick<this.doubleClickDelay){/*if double click*/
				this.editNote();
			}
			this.lastClick=now;
		},
		dragLoop:function(){
			if(this.dragging){
				if(Math.abs(this.dragStartX-KEEP.wall.mouseX)>5 || Math.abs(this.dragStartY-KEEP.wall.mouseY)>5){
					if(this.model.get("spawnNext")){/*note creation chain*/
						this.model.set({spawnNext:false});
						KEEP.wall.createNote();
						this.model.save();
					}
					if(this.model.get("index")+1!=KEEP.wall.noteList.nextIndex()){/*if not on top*/
						this.model.set({
							index:KEEP.wall.noteList.nextIndex()
						});
						KEEP.wall.noteList.sort();
					}
					var offset = this.$el.parent().offset();
					offset.left+=103;
					offset.top+=103;
					this.model.set({
						left:KEEP.wall.mouseX - offset.left,
						top:KEEP.wall.mouseY - offset.top
					});
				}
				var obj=this;
				setTimeout(function(){
					obj.dragLoop();
				},10);
			}
			
		},
		onMouseOut:function(e){
			if(this.dragging){
				var obj=this;
				var stopDrag=function(){
					obj.dragging=false;
					obj.model.save();
					var btns=obj.$el.children(".note-btn-container")[0];
					$(btns).removeClass("fade-in");
				};
				this.mouseOutTimeout=setTimeout(stopDrag,this.mouseOutDelay);
				return;
			}
			var btns=this.$el.children(".note-btn-container")[0];
			$(btns).removeClass("fade-in");
		},
		onMouseIn:function(e){
			if(this.mouseOutTimeout!=null){
				clearTimeout(this.mouseOutTimeout);
				this.mouseOutTimeout=null;
			}
			var btns=this.$el.children(".note-btn-container")[0];
			$(btns).addClass("fade-in");
		},
		render:function(){
			var obj=this.model.toJSON();
			if(!("id" in obj)){
				obj.id="temp";/*fix for first load*/
			}
			//check if need to redraw
			if("color" in this.model.changed || "id" in this.model.changed || !this.isDrawn){
				//TODO find a way to use template for whole div not just content
				this.$el.html(this.template(obj));
				this.$el.css({
					top:obj.top+"px",
					left:obj.left+"px",
					"z-index":obj.index
				});
				this.isDrawn=true;
			}
			if("top" in this.model.changed || "left" in this.model.changed){
				this.$el.css({
					top:obj.top+"px",
					left:obj.left+"px"
				});
			}
			if("index" in this.model.changed){ 
				this.$el.css({
					"z-index":obj.index
				});
			}
			if("content" in this.model.changed){ 
				var contentElem=this.$el.find(".content")[0];
				$(contentElem).html(obj.content);
			}
		},
		
		initialize:function(){
			this.listenTo(this.model,"change:wallId",this.remove);
			this.listenTo(this.model,"change",this.render);
			this.listenTo(this.model,"destroy",this.remove);
		}
	});
});
