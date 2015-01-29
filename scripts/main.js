require.config({
	paths: {
		underscore: 'libs/underscore',
		jquery: 'libs/jquery',
		backbone: 'libs/backbone',
		localStorage:'libs/backbone-localstorage',
		svg:'libs/svg',
		spectrum:'libs/spectrum',
		view:'src/view',
		model:'src/model',
		templates:'../templates'
	}
});
var __loadedCSS=[];
function loadCSS(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
function requireCSS(args){
	if(typeof(args)!="object"){
		args=[args];
	}
	for(var x in args){
		var path=args[x];
		if(__loadedCSS.indexOf(path)<0){
			loadCSS(path+".css");
			__loadedCSS[__loadedCSS.length]=path;
		}
	}
}
requireCSS(["css/spectrum","css/style"]);
require(["src/keep"]);
