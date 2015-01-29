define(function(){
	return '<div class="note-shadow"></div>\
		<div class="note-btn-container">\
			<button class="delete-btn"></button>\
			<button class="edit-btn"></button>\
		</div>\
		<div class="content-wrapper">\
			<div class="content">\
				<%=content%>\
			</div>\
		</div>\
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="206" height="206" xmlns:xlink="http://www.w3.org/1999/xlink" class="note-bg">\
			<rect width="206" height="206" fill="<%=color%>" mask="url(\'#m<%=id%>\')"></rect>\
			<defs>\
				<mask id="m<%=id%>"><image xlink:href="img/note/note-mask.png" width="206" height="206"></image></mask>\
			</defs>\
		</svg>';
});
