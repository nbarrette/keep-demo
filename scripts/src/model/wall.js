define(["backbone","templates/svgBasic"],function(Backbone,svgBasic){
	var template=_.template(svgBasic);
	function svgToDiv(svg){
		if(typeof(svg)!="object" || svg.tagName!="svg"){
			return null;
		}
		var mask=$(svg).find("mask")[0];
		var rect=$(svg).find("rect")[0];
		if(typeof(mask)=="undefined" || typeof(rect)=="undefined"){
			return null;
		}
		var obj={};
		obj.width=svg.attributes.width.value;
		obj.height=svg.attributes.height.value;
		obj.color=rect.attributes.fill.value;
		obj.className=svg.className.baseVal;
		var html=template(obj);
		return html;
	}
	function fixHTML(html){
		var svgs=$(html).find("svg");
		for(var x in svgs){
			var svg=svgs[x];
				var div=svgToDiv(svg);
				if(div!=null){
					html=html.replace(svg.outerHTML, div);
				}
		}
		return html;
	}
	return Backbone.Model.extend({
		defaults:{
			name:"new wall",
			width:1920,
			height:1080,
			left:0,
			top:0,
			index:0,
			innerHTML:""
		},
		setInnerHTML:function(html){
			this.set({"innerHTML":fixHTML(html)});
		}
	});
});
