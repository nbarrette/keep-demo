define(["backbone","localStorage","model/note"],function(Backbone,localStorage,Note){
	return Backbone.Collection.extend({
		model:Note,
		localStorage:new Backbone.LocalStorage("notes-backbone"),
		nextIndex:function(){
			if(!this.length)return 1;
			return this.last().get("index")+1;
		},
		clean:function(){
			this.remove(this.models);
		},
		newNote:function(args){
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
