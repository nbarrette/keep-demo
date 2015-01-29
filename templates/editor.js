define(function(){
	return '<div class="editor-container">\
			<div class="editor-btn-container">\
				<%for(x in colors){\
					var btnColor=colors[x];\
				%>\
					<button value="<%=btnColor%>" style="background-color:<%=btnColor%>;" class="<%= color==btnColor?"active-color":"color-btn" %>"></button>\
				<%}%>\
			</div>\
			<div class="spectrum-container">\
				<input value="" type="text" id="custom-btn" class="color-btn"></input>\
			</div>\
			<div autofocus contenteditable class="content"><%=content%></div>\
		</div>';
});
