define(["backbone","model/noteList","view/noteView","defaults/help-notes","templates/wall"],
function(Backbone,NoteList,NoteView,helpNotes,template){
	return Backbone.View.extend({
		tagName:"div",
		className:"wall",
		mouseX:0,
		mouseY:0,
		width:0,
		height:0,
		scrollTreshold:10,/*how close to an edge before we scroll*/
		events:{
			"mousemove":"onMouseMove",
			"touchmove":"onTouchMove",
			"click .help-btn":"showHelp"
		},
		template:_.template(template),
		noteList:new NoteList(),
		onNoteMoved:function(model,val,options){
			if(model.get("wallId")==this.model.id){
				var left=model.get("left");
				var top=model.get("top");
				if(top<this.scrollTreshold){/*top edge*/
				
				}else if(top+this.scrollTreshold>this.height){/*bottom edge*/
					
				}
				if(left<this.scrollTreshold){/*left edge*/
				
				}else if(left+this.scrollTreshold>this.width){/*right edge*/
				
				}
				this.model.setInnerHTML(this.$el.html());/*don't want to save here*/
			}
		},
		onMouseMove:function(e){
			this.mouseX=e.pageX;
			this.mouseY=e.pageY;
		},
		onTouchMove:function(e){
			this.mouseX=e.originalEvent.touches[0].pageX;
			this.mouseY=e.originalEvent.touches[0].pageY;
			e.preventDefault();/*to enable drag on mobiles*/
		},
		addListener:function(note){/*only used for this wall's note list*/
			if(note.get("wallId")==this.model.id){
				var todoView=new NoteView({model:note});
				todoView.render();
				this.$el.append(todoView.el);
				this.saveHTML();
			}
		},
		saveHTML:function(){
			this.model.setInnerHTML(this.$el.html());
			this.model.save();
		},
		createNote:function(args){
			if(typeof(args)=="undefined"){
				args={};
			}
			args.wallId=this.model.id;
			this.noteList.newNote(args);
		},
		addNote:function(note){
			this.add(note);
		},
		removeNote:function(note){
			if(note.get("wallId")==this.model.id){
				note.set({wallId:"unassigned"});
			}
		},
		onWallIdChanged:function(note){
			if(note.get("wallId")!=this.model.id){
				/*note no longer belongs to this wall*/
			}else{
				this.add(note);
			}
		},
		showHelp:function(){
			for(var x in helpNotes){
				var note=helpNotes[x];
				var notes=this.noteList.where({id:note.id});
				if(notes.length>0)notes[0].destroy();
				//this.noteList.remove(notes);
				this.createNote(note);
			}
		},
		add:function(notes){
			if(typeof(notes)!="object"){
				notes=[notes];
			}
			for(var x in notes){
				var note=notes[x];
				this.addListener(note);
			}
		},
		clearNotes:function(){
			this.noteList.clean();
		},
		fetchSuccess:function(collection,response,options){
			var notes=collection.where({wallId:this.model.id});
			var oldNotes=collection.where({wallId:"unassigned"});
			if(notes.length+oldNotes.length<1){/*first run or localStorage was cleared*/
				if(collection.length<1){
					this.showHelp();/*assuming first use*/
				}
				this.createNote();/*new note to start note chain*/
			}
			if(oldNotes.length>0){
				for(var x in oldNotes){/*set wallids so that they are sent to this wall*/
					var note=oldNotes[x];
					note.set({wallId:this.model.id});
					note.save();
				}
			}
		},
		fetchError:function(collection,response,options){
			
		},
		initialize:function(){
			this.noteList.clean();
			this.listenTo(this.model,"change:width change:height change:left change:top",this.render);
			this.listenTo(this.model,"destroy",this.remove);
			this.listenTo(this.noteList,"add",this.addListener);
			this.listenTo(this.noteList,"change:left change:top",this.onNoteMoved);
			this.listenTo(this.noteList,"change:wallId",this.onWallIdChanged);
			var obj=this;
			$().ready(setTimeout(function(){
				obj.noteList.fetch({
					success:function(collection,response,options){
						obj.fetchSuccess(collection,response,options);
					},
					error:function(collection,response,options){
						obj.fetchError(collection,response,options);
					},
					remove:false
				});
			},100));
		},
		render:function(){
			this.$el.html(this.template());
		}
	});
});
