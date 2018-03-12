$(document).ready(function(e){
	var auth_token = getLocalStorage("auth_token");
	if(auth_token==undefined || auth_token.trim()=="" || auth_token==null){
		logout();
	}else{
		getSession()
	}
	addRecidentialsForm("add_res_property_form");
	$("body").delegate(".add_form_tab","click",function(e){
		var type = $(this).data("tabtype");
		switch(type){
			case "residential":addRecidentialsForm("add_res_property_form");break;
			case "comersial":addComercialForm("add_comm_property_form");break;
		}
	})
})