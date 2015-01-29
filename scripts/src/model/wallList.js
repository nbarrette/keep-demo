define(["backbone","localStorage","model/wall"],function(Backbone,localStorage,Wall){
	return Backbone.Collection.extend({
		model:Wall,
		localStorage:new Backbone.LocalStorage("walls-backbone"),
		nextIndex:function(){
			if(!this.length)return 1;
			return this.last().get("index")+1;
		},
		clean:function(){
			this.remove(this.models);
		},
		newWall:function(args){
			if(typeof(args)!="object"){
				args={};
			}
			args.index=this.nextIndex();
			this.create(args);
		},
		initialize:function(){
			this.bind("remove", this.removeModel);
		},
		removeModel:function(model,response){
			//model.destroy();
		},
		comparator:"index"
		
	});
});
