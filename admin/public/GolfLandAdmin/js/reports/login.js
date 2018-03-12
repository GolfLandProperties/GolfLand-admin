$(document).ready(function(e){
	$("#GL-adminLogin").click(function(e){
		var uname = $("#GL_uname").val().trim();
		var pass = $("#GL_pass").val().trim();
		login(uname,pass);
	})
})