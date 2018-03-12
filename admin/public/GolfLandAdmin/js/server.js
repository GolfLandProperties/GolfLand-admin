var _server = (function(){
	function api(obj) {
		var cookieVal = getLocalStorage('auth_token');
		var tempData = '';
		var currDate = new Date();
		if(cookieVal!=null){
			tempData = $.extend(obj.data, { auth_token :  cookieVal, rnd: currDate.getTime()});
		}else{
			tempData = obj.data;
		}
		for(var key in tempData){
			if ( tempData[key]!=undefined && tempData[key]!="") {
				tempData[key] = tempData[key].toString().trim()
			}
		};
		obj.dataType = "JSON";
		obj.complete = (obj.complete || function(){});
		obj.crossDomain = true;
		obj.data = tempData;
		/*obj.headers = {
			"cache-control": "no-cache"
		};*/
		$.ajax(obj);
	}
	
	function get(obj){
		if(obj.data && obj.data.id != undefined && obj.data.id != "") {
			obj.url = obj.url + '/'+obj.data.id;
			delete obj.data;
		}
		obj.method = "GET";
		api(obj);
	}
	
	function post(obj){
		if(obj.data && obj.data.id != undefined && obj.data.id != "") {
			put(obj);
		}
		else {
			obj.method = "POST";
			api(obj);
		}
	}
	
	function put(obj){
		if(obj.data && obj.data.id != undefined && obj.data.id != "") {
			obj.url = obj.url + '/'+obj.data.id;
		}
		obj.method = "PUT";
		api(obj);
	}
	
	function remove(obj){
		if(obj.data && obj.data.id != undefined && obj.data.id != "") {
			obj.url = obj.url + '/'+obj.data.id;
			delete obj.data;
		}
		obj.method = "DELETE";
		api(obj);
	}
	
	function success(response){
		console.log(response);
	}
	
	function error(jqXHR, ex){
		console.log(response);
	}
	
	return {
		get	: get,
		post: post,
		put	: put,
		remove: remove
	};
})();