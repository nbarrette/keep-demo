define(["backbone","view/footer","model/wallList","view/wall","view/wallSelector"],
function(Backbone,Footer,WallList,WallView,WallSelector){
	return Backbone.View.extend({
		tagName:"div",
		className:"wrapper",
		footer:new Footer(),
		wallSelector:new WallSelector(),
		wall:null,
		firstWall:true,/*flag to not animate wall on load*/
		wallList:new WallList(),
		addWall:function(args){
			this.wallList.newWall(args);
		},
		deleteWall:function(wall){
			if(this.wall.model.id==wall.id){
				if(this.wallList.length<2){
					var oldWall=this.wall;
					oldWall.$el.removeClass("wall-show");
					oldWall.$el.addClass("wall-hide");
					oldWall.$el.css({zIndex:5});
					this.wall=null;
					this.wallList.newWall();
				}else{
					if(this.wallList.indexOf(this.wall.model)<1){
						this.switchWall(this.wallList.at(1));
					}else{
						this.switchWall(this.wallList.first());
					}
				}
				setTimeout(function(){wall.destroy();},1000);
			}else{
				wall.destroy();
			}
		},
		newWall:function(){
			var oldWall=this.wall;
			oldWall.$el.removeClass("wall-show");
			oldWall.$el.addClass("wall-hide");
			oldWall.$el.css({zIndex:5});
			setTimeout(function(){
				oldWall.remove();
			},1000);
			this.wall=null;
			this.wallList.newWall();
		},
		switchWall:function(wall){
			if(this.wall.model.get("id")!=wall.get("id")){
				var oldWall=this.wall;
				oldWall.$el.removeClass("wall-show");
				oldWall.$el.addClass("wall-hide");
				oldWall.$el.css({zIndex:5});
				var newWall=new WallView({model:wall});
				newWall.render();
				this.wall=newWall;
				this.$el.append(newWall.el);
				setTimeout(function(){
					newWall.$el.addClass("wall-show");
				},1);
				setTimeout(function(){
					oldWall.remove();
				},1000);
			}
		},
		destroyListener:function(wall){
			if(wall.id==this.wall.model.id){
				if(this.wallList.length<1){
					this.newWall();
				}else{
					this.switchWall(this.wallList.first());
				}
			}
		},
		addListener:function(wall){
			this.wallSelector.addWall(wall);//TODO separate wrapper and wallSelector
			if(this.wall==null){/*first wall*/
				this.wall=new WallView({model:wall});
				this.wall.render();
				this.$el.append(this.wall.el);
				var newWall=this.wall;
				if(this.firstWall==true){
					this.firstWall=false;
					newWall.$el.addClass("wall-show");
				}else{
					setTimeout(function(){
						newWall.$el.addClass("wall-show");
					},1);
				}
			}
		},
		fetchSuccess:function(collection,response,options){
			if(collection.length<1){/*first run or localStorage was cleared*/
				this.addWall();
			}
		},
		fetchError:function(collection,response,options){
			
		},
		initialize:function(){
			window.KEEP=this;
			this.listenTo(this.wallList,"add",this.addListener);
			this.listenTo(this.wallList,"destroy",this.destroyListener);
			var obj=this;
			$().ready(setTimeout(function(){obj.wallList.fetch({
				success:function(collection,response,options){
					obj.fetchSuccess(collection,response,options);
				},
				error:function(collection,response,options){
					obj.fetchError(collection,response,options);
				},
				remove:false
			});},100));
			$("body").append(this.el);
			this.wallSelector.render();
			this.$el.append(this.wallSelector.el);
			this.footer.render();
			this.$el.append(this.footer.el);
		},
		render:function(){

		}
	});	
});
