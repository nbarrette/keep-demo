define(["backbone","defaults/colors"],function(Backbone,colors){
	var randColor=function(){
		var r=parseInt((Math.random()*1000000000))%colors.length;
		return colors[r];
	}
	return Backbone.Model.extend({
		defaults:function(){
			return {
			content:"",
			spawnNext:true,
			left:10,
			top:10,
			index:0,
			wallId:"unassigned",
			color:randColor()}
		}
	});
});
