//TO PRINT LOG
function log(message){
	if(window.console != undefined)
		console.log(message);
}

function login(uname,pass){
	_server.post({
		url:serviceURL+"user/login",
		data:{uname,pass},
		success:function(response){
			if(response.status==0){
				$("#invalid").show();
			}else{
				localStorage.setItem("auth_token",response.auth_token);
				window.location.href = "GolfAdminHome"
				
			}
		}
	})
}
function clearInput(clas){
	$("."+clas).each(function(ind,val){		
		var type = $(this).attr("type");
		if(type == "text"){
			$(this).val('');
		}
	})
}
function getSession(){
	_server.post({
		url:serviceURL+"user/session",
		success:function(response){
			if(response.status==0){
				logout();
			}
		},
		error:function(){
			logout();
		}
	})
}
function logout(){
	localStorage= null;
	window.location.href = "golfAdmin";
}
function getLocalStorage(key){
	return localStorage.getItem(key);
}
