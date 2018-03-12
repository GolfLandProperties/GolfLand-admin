

var utils = (function(){
	var url = "/api/v1/";
	var _colorLimit = 4;
	var notify ="";
	var img_url ="";
	
	var table_sortDescArr = [
		"ii300", "focus", "points", "yes votes", "no votes", "# of calls",
		"# of votes", "contacts", "heatmap", "vote result", "received",
		"read", "readership"/*, "region"*/, "commission %", "# of",
		"squawk", "am meeting", "commission", "total", "goal", 
		"other", "syndicate", "equity", "derivative", "electronic", "cash",
		"delta", "roi %", "secondary", "loss", " ecm", "$", "%", "annual",
		"prorated", "platinum", "boston", "canada", "europe", "philly balt",
		"ny nj ct", "south east", "texas", "wc pacnw", "prev year", "actual ytd", "growth", " count",
		"blast voice mail", "mid west", "vote", "13f holder","interest ", "quantity", " 60days", "options", "stock/opt",
		"errors"
		
	];
	
	var searchStringURL = url+"search/list/";
	var asyncCalls =[];

	
	 function dayFormat(days){
     var result=""   
            if(days==0){ 
				result= 'Today'; 
			}
            else if(days==1){ 
				result= 'Yesterday'; 
			}
            else if(days>=2){ 
				result= days +' days ago';
			}
			return result;
	}
	
	function callAjax(keyObj, details){
		var ajaxType="GET";
		var ajaxData="";
		if(keyObj.ajaxType){
			ajaxType="POST";
		}
		if(keyObj.ajaxData){
			ajaxData=keyObj.ajaxData;
		}
		if((keyObj.exportXLS) && ($("#"+details.id+keyObj.container).parents(".panel:first").find(".export_xls").length > 0)){
			$("#"+details.id+keyObj.container).parents(".panel:first").find(".export_xls").data("url",keyObj.url);
		}
		try {
			var xhr = $.ajax({
				type	: ajaxType,
				url		: keyObj.url,
				dataType: "json",
				data:ajaxData,
				beforeSend: function(){
					showLoadingMsg({"id":details.id,"container":keyObj.container});
				},
				success	: function(response) {
					try {
						//alert(JSON.stringify(response));
						var result = {data:response};
						
						if(result.data.status <0){
							noDataMsg({"id":details.id,"container":keyObj.container},result.data.txt);
							$("#loading_screen").hide();
							if(keyObj.showPopup){
								$("#pop_up_element_1").bPopup({
										opacity :0.6,
										modalClose :true,
										onOpen :function(){
											$("#pop_up_element_1").css({"width":"80%"});
											if($("#pop_up_element_1 .bg-white:first").length > 0){
												$("#pop_up_element_1 .bg-white:first").html(result.data.txt).css({"text-align":"center"});
											}else{
												var pHtml = '<div class="bpop-header"><i class="icon-list"></i>&nbsp;<button class="b-close"></button></div>';
													pHtml += '<div class="bg-white"><div class="bg-white text-center">'+result.data.txt+'</div></div>';
												$("#pop_up_element_1").html(pHtml);
											}
											
										},
										onClose : function(){
											$("#pop_up_element_1").empty();
										}
									}, function(){
									setTimeout(function(){ 
										var h = $("#pop_up_element_1 .bpop-header:first").height() + $("#pop_up_element_1 div.bg-white:first").height();
										$("#pop_up_element_1").css({"height":h+"px","min-height":"5%"}) 
									}, 500);
								});
							}
							else if(keyObj.isnotify){
								utils.status({type:"notify",txt:result.data.txt});
							}
							else{
								noDataMsg({"id":details.id,"container":keyObj.container},result.data.txt);
							}
							return;
						}
						keyObj.callback(result, keyObj, details);
					}
					catch(ex) {
						
						log('Exception: Ajax Success '+ex.message);
					}
				},
				error	: function(jqXHR, ex) {	
					
					log('Error: Server Error in '+jqXHR.responseText);
					utils.errorCallback(jqXHR.responseText, details, keyObj.container);
				}
			});
			asyncCalls.push(xhr);
		}
		catch(ex) {
			
			log("Error in utils.callAjax:"+ex.message);
		}
	}
	var datatableHeaderNumberFormat = function(val,type){
		if(type == "moneymask"){
			type = "headermoneymask";
		}
		if(type == "percentage"){
			type = "percentagemask"
		}
		return utils.datatableNumberFormat(val,type)
	}
	var datatableNumberFormat = function(val,type){
		value  = number = (isNaN(val))?val.replace('$','').replace(',',''):val;
		titlevalue = utils.commonDecimalNumberFormat(val,"1");
		value += '',x = value.split('.'),x1 = x[0],x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /\B(?=(\d{3})+(?!\d))/g;
		if(type.toLowerCase()== "noformating"){
            return val;
        }
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, ',');
		}
		if(x1==number && isNaN(number) || type=='string'){
			ret = number;
		}else{
			if(type.toLowerCase() == 'money'){
				if(number == 0){
					ret = '$0';
					ret = '<span title="'+titlevalue+'">'+ret+'</span>';
					return ret;
				}
				if(x1.replace(/,/g, '')>0){
					ret = value.replace(/,/g, '').replace(/$/g, '');
					ret = Math.round(ret).toString();
					ret = ret.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					ret = '$'+ret;
					ret = '<span title="'+titlevalue+'">'+ret+'</span>';
				}else if(x1.replace(/,/g, '') == 0){
					if(x2>0){
						if(x1.indexOf('-') != -1){
							var tempx1 = x1.replace('-','');
							if(tempx1==0){
								ret = '$0';
								ret = '<span title="'+titlevalue+'">'+ret+'</span>';
							}else{
								x1 = x1.replace('-','-$');
								ret = '$'+x1;	
								ret = '<span title="'+titlevalue+'">'+ret+'</span>';
							}
						}
						if(x1.indexOf('$') != -1){
							ret = x1;
							ret = '<span title="'+titlevalue+'">'+ret+'</span>';
						}
						if(typeof ret == 'string'){
							ret = '$0';
							ret = '<span title="'+titlevalue+'">'+ret+'</span>';
						}
					}else{
						ret = '$0';
						ret = '<span title="'+titlevalue+'">'+ret+'</span>';
					}
				}else{
					if(x1 == '-'){
						ret = '$0';
						ret = '<span title="'+titlevalue+'">'+ret+'</span>';
					}else{
						ret = Math.round(val).toString().replace('-','-$').replace(/,/g, '').replace(/$/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
						ret = '<span title="'+titlevalue+'">'+ret+'</span>';
					}
				}
			}else if(type.toLowerCase() == "percentage" || type.toLowerCase() == 'percentagecont'){
				if(val == 0){
					ret = '-';
					return ret;
				}
				ret = Math.round(val)+ '%';
			}else if(type.toLowerCase() == "percentagemask"){
				if(val == 0){
					ret = '';
					return ret;
				}
				ret = Math.round(val)+ '%';
			}else if(type.toLowerCase() == "percentagedecimal"){
				var x1 = parseFloat(val);
				if(x1.toFixed(2) == 0){
					return '-';
				}else{
					return x1.toFixed(2)+'%';
				}
			}else if(type.toLowerCase() == "number"){
				if(number == 0){
					ret = '0';
					return ret;
				}
				ret = x1;
			}else if(type.toLowerCase() == "numbermask"){
				if(number == 0 || x1 == 0){
					ret = '-';
					return ret;
				}
				ret = x1;
			}else if(type.toLowerCase() == "moneymask"){
				if(number == 0 || number == '' || number == undefined){
					ret = '-';
					return ret;
				}
				if(x1.replace(/,/g, '')>0){
					ret = '$' + x1
				}else if(x1.replace(/,/g, '') == 0){
					if(x2>0){
						if(x1.indexOf('-') != -1){
							var tempx1 = x1.replace('-','');
							if(tempx1==0){
								ret = '-';
							}else{
								x1 = x1.replace('-','-$');
								ret = '$'+x1;	
							}
						}
						if(x1.indexOf('$') != -1){
							ret = x1;
						}
						if(typeof ret == 'string'){
							ret = '-';
						}
					}else{
						ret = '-';
					}
				}else{
					if(x1 == '-'){
						ret = '-';
					}else{
						ret = x1.replace('-','-$');
					}
				}
			}else if(type.toLowerCase() == "suffix"){
				ret = utils.NumberFormat(number);
			}else if(type.toLowerCase() == 'headermoneymask'){
				if(number == 0 || number == '' || number == undefined){
					ret = '';
					return ret;
				}
				if(x1.replace(/,/g, '')>0){
					ret = '$' + x1
				}else if(x1.replace(/,/g, '') == 0){
					if(x2>0){
						if(x1.indexOf('-') != -1){
							var tempx1 = x1.replace('-','');
							if(tempx1==0){
								ret = '-';
							}else{
								x1 = x1.replace('-','-$');
								ret = '$'+x1;	
							}
						}
						if(x1.indexOf('$') != -1){
							ret = x1;
						}
						if(typeof ret == 'string'){
							ret = '-';
						}
					}else{
						ret = '-';
					}
				}else{
					if(x1 == '-'){
						ret = '-';
					}else{
						ret = x1.replace('-','-$');
					}
				}
			}else{
				ret = number;
			}
		}
		return ret;
	}
	/*SPLIT THE NUMBER WITH COMMA*/
	var NumberFormat = function (value)
	{
		if(value==0){
			return 0;
		}
		if(value > 999){
			return utils.NumberFormatter(value);
		}
		value += '',x = value.split('.'),x1 = x[0],x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		ret = x1 + x2;
		ret = parseFloat(ret).toFixed(1)
		return ret;
	}
	
	/*SPLIT THE NUMBER ONLY WITH COMMA*/
	var NumberFormatWithOutSuffix = function (value, decFlg)
	{
		if(typeof decFlg === "undefined" || decFlg === null) { 
			decFlg = false; 
		}
		/*if(value == '' || value == ' '){
			value = 0;
		}*/
		if(value.indexOf('$') >= 0){
			value = value.replace('$','');
		}
		if(value == 0){
			return '$'+0;
		}
		
		value += '',x = value.split('.'),x1 = x[0],x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		if(decFlg){
			ret = x1 + parseFloat(x2).toFixed(2);
			return '$'+ret;
		}else{
			if(x1 != '' && parseFloat(x1) >0){
				return '$'+x1;
			}else{
				return '$'+x1;
			}
		}
	}
	
	//TO RESIZE THE GRID STACK PANEL
	function fillgridPanel(tabID){
		if(tabID != undefined && tabID != '' && tabID != 'undefined'){//FOR SEARCHABLE REPORTS
			$("#"+tabID+" .gridHt").each(function(i,obj){
				$(obj).height($(obj).parent().parent().height()-10);
			});
		}else{
			if($('.dashboard-header.searchHeadDiv').length == 0){ //IF NOT TEARSHEET(ADDED BECAUSE IT CAUSES HEIGHT 0 FOR OTHER TABS)
				$(".gridHt").each(function(i,obj){
					$(obj).height($(obj).parent().parent().height()-10);
				});
			}
		}
		$(".gridHt").css('border','');//TO HIDE AUTO ADD BORDER
	}
	
	/*SPLIT THE NUMBER ONLY WITH COMMA*/
	var CommonNumberFormatWithOutSuffix = function (value, decFlg)
	{
		if(typeof decFlg === "undefined" || decFlg === null) { 
			decFlg = false; 
		}
		/*if(value == '' || value == ' '){
			value = 0;
		}*/
		if(value.indexOf('$') >= 0){
			value = value.replace('$','');
		}
		if(value == 0){
			return '$'+0;
		}
		
		value += '',x = value.split('.'),x1 = x[0],x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		if(decFlg){
			ret = x1 + parseFloat(x2).toFixed(2);
			return '$'+ret;
		}else{
			if(x1 != '' && parseFloat(x1) >0){
				return '$'+x1;
			}else if(x1 != '' && parseFloat(x1) == 0){
				return '$'+0;
			}else{
				x1 = x1.replace('-','');
				return '<font class="redValue" >($'+x1+')</font>';
			}
		}
	}
	
	//TO CALCULATE MILLION, BILLION
	function NumberFormatter(num){
		if(num>99999999){
			return (num/1000000000).toFixed(1) + 'B';
		}else if(num>999999){
			return (num/1000000).toFixed(1) + 'M';
		}else if(num > 999){
			return (num/1000).toFixed(1) + 'K';
		}else{
			return (num/1).toFixed(1);
		}
	}
	
	//TO FORMAT THE DECIMAL NUMBER
	function decimalNumberFormat(num){
		return num.toFixed(2);
	}
	
	//SPLIT THE NUMBER ONLY WITH COMMA AND TO FORMAT THE VALUE WITH SUFFIX
	function commonDecimalNumberFormat(value, decFlg){
		if(typeof decFlg === "undefined" || decFlg === null) { 
			decFlg = false; 
		}
		value += '',x = value.split('.'),x1 = x[0],x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /\B(?=(\d{3})+(?!\d))/g;
		x1 = x1.replace(/\$/g,'');
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx,',');
		}
		if(decFlg){
			if(x2 == undefined || x2 == ''){
				ret = '.'+'00'	
			}else{
				ret = parseFloat(x2).toFixed(2);
				ret = '.'+ret.split('.')[1];
			}
			if(x1.indexOf('-') !=-1){
				x1 = x1.replace(/\-/g, '($');
				return x1+ret+')';
			}else{
				return '$'+x1+ret;
			}
		}else{
			if(x1 != '' && parseFloat(x1) >0){
				return '$'+x1;
			}else if(x1 != '' && parseFloat(x1) == 0){
				return '$'+0;
			}else{
				x1 = x1.replace('-','');
				return '<font class="redValue" >($'+x1+')</font>';
			}
		}
	}
	
	//TO GET URL VALUE AFTER HASH
	function getURLExt(){
		var windHREF = window.location.hash.substr(1);
		if(windHREF){
			windHREF = windHREF.split('/');
			return windHREF[0]+"~"+windHREF[windHREF.length-1]+"~"+windHREF[1];
		}else{
			return ""+"~"+""+"~"+"";
		}
	}
	
	//TO GET CURRENT LOADED HTML NAME
	function getHtmlName(){
		var currurl = window.location.href;
		var index = currurl.lastIndexOf("/") + 1;
		var filenameWithExtension = currurl.substr(index);
		var filename = filenameWithExtension.split(".")[0]; // <-- added this line
		filename = filename.toLowerCase();
	}
	
	//TO SET REPORT FILE CALLBACK DETAILS INTO VARIABLE
	function setReportCallbacks(pageName, callback, panelID){
		//TO SET CALLBACK TO RELOAD REPORT
		if(_reportsCallbckDtls[pageName] == undefined){
			_reportsCallbckDtls[pageName] = callback+'~!'+panelID;
		}else{
			if(_reportsCallbckDtls[pageName].indexOf(callback+'~!'+panelID) == -1){
				_reportsCallbckDtls[pageName] += '``'+callback+'~!'+panelID;
			}
		}
	}
	
	function DrawServerSideDatatable(Obj) {
		try{
			// if datatable default header.. 
			if(Obj.length==0 || Obj==undefined){
				utils.scriptErrorHandling('utils.js' ,'DrawServerSideDatatable' ,"Table Object Is Undefined/Empty");
				return false;
			}
			if(Obj.id == undefined){
				utils.scriptErrorHandling('utils.js' ,'DrawServerSideDatatable' ,"Table Id Is Not Defined");
				return false;	
			}
			if(Obj.ajax == undefined){
				utils.scriptErrorHandling('utils.js' ,'DrawServerSideDatatable' ,"Ajax Id Is Not Defined");
				return false;	
			}
			Obj = $.extend({
						"oLanguage": {
							"sSearch": ""
						},
						bPaginate: true,
						bInfo: false,
					},Obj)
			if(Obj.multiheader!=undefined){
				var headers = Obj.multipleColumns.lastHeader;
				var mainHeader = Obj.multipleColumns.mainHeader;
				var tableHTML='';
				var attr='';
				if(headers.length<=0){
					utils.scriptErrorHandling('utils.js' ,'DrawServerSideDatatable' ,"Header Is Not Defined");
					return false;
				}
				if(mainHeader.length>0){
					tableHTML+='<tr>';
					$(mainHeader).each(function(index,value){
						if(this.colspan!=undefined && this.colspan!='') attr+=' colspan="'+this.colspan+'" ';
						if(this.rowspan!=undefined && this.rowspan!='') attr+=' rowspan="'+this.rowspan+'" ';
						if(this.className!=undefined && this.className!='') attr+=' class="'+this.className+'" ';
						tableHTML+='<th '+attr+'>'+this.label+'</th>';
						attr=' ';
					})
					tableHTML+='</tr>';
				}

				//Other headers draw here if needed

				tableHTML+='<tr>';
				$(headers).each(function(index,value){
					if(this.colspan!=undefined && this.colspan!='') attr+=' colspan="'+this.colspan+'" ';
					if(this.rowspan!=undefined && this.rowspan!='') attr+=' rowspan="'+this.rowspan+'" ';
					if(this.className!=undefined && this.className!='') attr+=' class="'+this.className+'" ';
					tableHTML+='<th '+attr+'>'+this.name+'</th>';
					attr=' ';

				});
				tableHTML+='</tr>';
				$(Obj.id+' thead').html(tableHTML);
				$(Obj.id).dataTable().fnDestroy();	
			}	
			var DOMTable = $(Obj.id).DataTable(Obj);				
			$(Obj.id+'_filter label input').attr('class','f-input _DT_search');
			$(Obj.id+'_filter').append('<i class="_dataTable_search_ico fa fa-search" aria-hidden="true"></i>');
			$(Obj.id+'_filter').css('margin-top','10px');
			$('._DT_search').attr('placeholder','Search...');
			$('._DT_search').parents('.dataTables_filter').parent().removeClass('col-sm-6').addClass('col-sm-12');
			//$('.dataTables_length').parent().removeClass('col-sm-6').addClass('hidden-sm').addClass('hidden-xs');
			$('.dataTables_length').parent().removeClass('col-sm-6').addClass('hidden-sm').addClass('hidden-xs').addClass('hidden-md').addClass('hidden-lg');
			$('.dataTables_paginate').parent().addClass('dataTablePaginatePadding');
			return DOMTable;
		}catch(e){
			utils.scriptErrorHandling('utils.js' ,'DrawServerSideDatatable' ,e);
		}
	}
	
	//Funcitno for draw datepicker ranges
	function datePickerRanges(pickRanges){
		var ranges = {};
        pickRanges = _.uniq(pickRanges)
        pickRanges = _.intersection(pickRanges,AllowedFilters);
        
        if(pickRanges.length==0){
            $(AllowedFilters).each(function(index,val){
            	if(AllFilters[val.toUpperCase()].label=='DAILY'){
            		ranges[moment(menuDetails.max_comm_Date).add(0, 'days').format('MM/DD/YYYY')]= AllFilters[val.toUpperCase()].ranges;
            	}else{

            		ranges[AllFilters[val.toUpperCase()].label]= AllFilters[val.toUpperCase()].ranges;
            	}
            });
        }else{
            $(pickRanges).each(function(index,val){
            	if(AllFilters[val.toUpperCase()].label=='DAILY'){
            		ranges[moment(menuDetails.max_comm_Date).add(0, 'days').format('MM/DD/YYYY')]= AllFilters[val.toUpperCase()].ranges;
            	}else{
            		ranges[AllFilters[val.toUpperCase()].label]= AllFilters[val.toUpperCase()].ranges;
            	}
            });
		}
        return ranges;
	}
	
	//TO STORE ERROR IN SERVER
	function scriptErrorHandling(){
		var arglen = arguments.length;
		var argVals = arguments;
		var err = {};
		
		function errPush(indexName, val){
			err[indexName] = val;
		}
		switch(arglen){
			case 1:
				errPush('fileName', argVals[0]);
				break;
			case 2:
				errPush('fileName', argVals[0]);
				errPush('functionName', argVals[1]);
				break;
			case 3:
				errPush('fileName', argVals[0]);
				errPush('functionName', argVals[1]);
				errPush('error', argVals[2].toString());
				break;
			default:
				log('No Functionality for the given length of parameters');
				break;
		}

		_server.post({
			url: serviceURLJava+"framework/weberrorlog",
			data: {data:JSON.stringify(err)},
			success: function (response) {
				log(response);
			},
			error: function (jqXHR) {
				//scriptErrorHandling(jqXHR.responseText);
				log("Error inside Error Function.");
			}, 
		});
		
	}
	
	//TO DISPLAY EMPTY DIV
	function emptyDiv(msg){
		try{
			var data = '<div class="empty-data">'+msg+'</div>';
			return data;
		}catch(e){
			utils.scriptErrorHandling("utils.js", "WinMove", e);	
		}
	}
	
	/*TOASTER CODE STARTS*/
	function info_toaster(msg, title='',type){
		if(type == "s" || type=="S"){
			$.toaster({
			  message : msg,
			  title : title,
			  priority : 'success',
			  'timeout'      : 1500
			});
		}
		if(type == "w" || type=="W" ){
			$.toaster({
			  message : msg,
			  title : title,
			  priority : 'warning',
			  'timeout'      : 1500
			});	
		}
		if(type == "e" || type=="E"){
			$.toaster({
			  message : msg,
			  title : title,
			  priority : 'danger',
			  'timeout'      : 1500
			});	
		}
	}
	/*TOASTER CODE ENDS*/
	
	/*NOTIFICATION PROCESS STARTS*/
	function notification(response){
		var parentId = '#rtab-1';
		if(response.status=='1'){
			loadNotification(parentId ,response);
		}
	}
	/*NOTIFICATION PROCESS ENDS*/
	
	//TO SET THE COLUMN HEADER
	function columnSetting(ele) {
        try{
            var datatableId = $(ele).data("tableid");
            var data = $(ele).data();
			dTable = $("#"+datatableId).DataTable();
		
            var column = dTable.column(data.column);
			if(column.visible() && !$(ele).is(":checked")) {
                column.visible(false);
				return ['hide', column];
				//hide_col.push(data.column);

            }else{
                column.visible(true);
				return ['show', column];
				/*hide_col = hide_col.filter(function(elem) {
				    return elem != data.column;
                });*/
            }

        }catch(e){
            log("Error in Column Settings" + e.message);
        }
		dTable.page( 'next' ).draw( 'page' );
    }
	
	function noDataMsg(details,data){
		if($("#"+details.id+details.container).length){
			$("#"+details.id+details.container).html("<div class='bg-white text-center'><small>"+data+"</small></div>");
		}
		else if($("."+details.id+details.container).length){
			$("."+details.id+details.container).html("<div class='bg-white text-center'><small>"+data+"</small></div>");
		}
		else{
			$("#"+details.container).html("<div class='bg-white text-center'><small>"+data+"</small></div>");
		}
	}

	function showLoadingMsg(details){
		if($("#"+details.id+details.container).length){
			$("#"+details.id+details.container).html("<div class='bg-white text-center'>Loading..</div>");
		}
		else{
			$("."+details.id+details.container).html("<div class='bg-white text-center'>Loading..</div>");
		}
	}

	function headerNameLength(data){
		var name = data;
		if(data.length > 20) {
			name = name.slice(0,19) + "...";
		}
		return name;
	}
	
	function errorCallback(message, detailsObj, containerClass) {
		try {
			//Error Handling
		}
		catch(ex) {
			log("Error in utils.errorCallback: "+ex.message);
		}
	}
	
	var userProfDetails = {"fName": '', "lName": ''};
	
	function getuserDetails(cbFun){
		_server.get({
			url: serviceURLJava+'userconfig/getuserinfo',
			success: function(response){
				if(response){
					userDetails = response;
					//Variable for taking user permissions as an array
					Permission=userDetails.permissions.split(",");
					var fName = utils.getHtmlName();
					//var permission = userDetails.permissions;
					if(localStorage['searchedUser'+userDetails.used_id] ==undefined && localStorage['searchedUser'+userDetails.used_id] == null){
						//localStorage['searchedUser'+userDetails.used_id] = [];
						myarr = [];
					}else{
						if(fName == 'mailpanel'){ //IF MAIL PANEL
							myarr = JSON.parse(localStorage['mailpanelSearchedUser'+userDetails.used_id]);
						}else{ //IF DASHBOARD
							myarr = JSON.parse(localStorage['searchedUser'+userDetails.used_id]);
						}
					}
					
					//var resp_username = userDetails.uname.split(' ');
					var u_fname = response.firstname;
					var u_lname = response.lastname;
					userProfDetails.fName = u_fname;
					userProfDetails.lName = u_lname;
					var prof_pic = response.prof_pic;
					var userMapList = (typeof response.userMapList !== 'undefined')?response.userMapList:[];
					
					localStorage.setItem("user_mapped_list",JSON.stringify(userMapList));
					
					$('.mailpanel_user_fname').val(u_fname);
					$('.mailpanel_user_lname').val(u_lname);
					userRole=response.permission;
					//$(".mailpanel_usr_name").html(response.uname);
					$(".mailpanel_username_popup").html(response.uname);
					$('.usr_name').html(response.uname);
					if(prof_pic.indexOf('.png') != '-1'){
						$(".mailpanel_change_img").attr('src',"img/user.png");
						$(".mailpanel_profile_img").attr('src',"img/user.png");
						$('.img_profile').attr('src',"img/user.png");
					}else{
						$(".mailpanel_change_img").attr('src',response.prof_pic+'&auth_token='+userToken);
						$(".mailpanel_profile_img").attr('src',response.prof_pic+'&auth_token='+userToken);
						$('.img_profile').attr('src',response.prof_pic+'&auth_token='+userToken);
					}
				}
				if(typeof cbFun !== 'undefined'){
					cbFun();
				}
			}
		});
	}
	
	//TO TRIGGER TAB CLICK WHILE
	function triggerTab(textVal){
		try{
			var innHTML = '';
			$.each($('.searchHeadDiv .srchtab-container > ul >li > a'), function(){
				innHTML = $(this)[0].innerText;
				if(innHTML == textVal){
					$(this).trigger('click');
				}
			});
		}catch(e){
			utils.scriptErrorHandling('utils.js' ,'triggerTab' ,e);
		}
	}
	
	//TO UPDATE PRISM LICENSE DETAILS(THIS NEED PROXY PASS TO AVOID CROSS ORIGIN & THE VARIABLES ARE USED IN DEFINE FILE)
	function prism_license(){
		try{
			var _prism_user = userDetails.firstname;
			var _prism_email = userDetails.lasttname;
			var _license_url = '/log/'+(_prism_license_cust||'prism')+'/'+(_prism_license_prod||'-')+'/'+(_prism_license_mod||'-')+'/'+(_prism_license_status||'-')+'/'+(_prism_user||'-')+'/'+(_prism_email||_prism_user||'-')+'/'+(_prism_license_type||'-')+'/'+(_prism_license_ver||'-')+'/'+(_prism_license_details||'-')+'/hit.txt';
			_server.get({
				url: _license_url,
				cache: false,
				success: function (response) {
					alert("success1111");
				}
			});
		}catch(e){
			utils.scriptErrorHandling("utils.js", "prism_license", e);
		}
	}
	
	//TO SET PROFILE DETAILS
	function usrProfile(){
		pop_up_element_1 = 	'<div class="modal inmodal mail_profile_popup" data-toggle="modal" data-backdrop="static" id="mail_profile_popup" tabindex="-1" role="dialog" aria-hidden="true">'+
								'<div class="modal-dialog modal_sm">'+
									'<div class="modal-content animated fadeInDown">'+
										'<div class="modal-header">'+
											'<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
											'<h4 class="modal-title">User Profile</h4>'+
										'</div>'+
										'<div class="modal-body mp_usr_mdl">'+
											'<div id="img_row_1">'+
												'<div class="row mailpanel_image_edit" id="mailpanel_image_edit">'+
													'<div id="image_container">'+
														'<img class="mailpanel_change_img" id="mailpanel_change_img" src="" ></img>'+
														'<span type="button" class="mailpanel_edit_img"><i class="fa fa-pencil-square-o"></i></span>'+
													'</div>'+
												'</div>'+
												'<form style="display:none;" id="my-awesome-dropzone" class="dropzone" action="#">'+
													'<div class="dropzone-previews" id="uploadMe"></div>'+
												'</form>'+
											'</div>'+
											'<div class="fileErrMsg" style="font-size: 12px;text-align: center;color: #ff5722;margin-top: 8px;">'+
											'</div>'+
											'<div id="usr_row_1">'+
												'<div class="row mailpanel_userdetails_edit" id="mailpanel_userdetails_edit">'+
													'<h4 class="mailpanel_username_popup" id="mailpanel_username_popup"></h4><span type="button" class="mailpanel_edit_username"><i class="fa fa-pencil-square-o"></i></span>'+
												'</div>'+
												'<form role="form" class="form-inline mailpanel_userdetails_editform" id="mailpanel_userdetails_editform" style="display:none;">'+
													'<div class="txt-feild-row"><div class="label">First Name</div><div class="form-feilds"><div class="form-group"><input type="text" id="mailpanel_user_fname" maxlength="20" class="form-control mailpanel_user_fname"></div></div></div>'+
													'<div class="txt-feild-row"><div class="label">Last Name</div><div class="form-feilds"><div class="form-group"><input type="text" id="mailpanel_user_lname" maxlength="20" class="form-control mailpanel_user_lname"></div></div></div>'+
												'</form>'+
											'</div>'+
										'</div>'+
										'<div class="modal-footer">'+
											'<button type="button" class="btn btn-white" id="user_popup_close">Close</button>'+
											'<button type="button" id="mailpanel_profile_save" class="btn btn-primary mailpanel_profile_save">Save changes</button>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
							
		pop_up_element_2 = '<div class="modal inmodal change_profpswd_popup" data-toggle="modal" data-backdrop="static" id="change_profpswd_popup" tabindex="-1" role="dialog" aria-hidden="true">'+
								'<div class="modal-dialog modal_sm">'+
									'<div class="modal-content animated fadeInDown">'+
										'<div class="modal-header">'+
											'<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
											'<h4 class="modal-title">Change Password</h4>'+
										'</div>'+
										'<div class="modal-body mp_usr_mdl">'+
											'<div id="psw_row_1">'+
												'<form role="form" class="form-inline mailpanel_password_editform" id="mailpanel_password_editform">'+
													'<div class="txt-feild-row"><div class="label">Old Password</div><div class="form-feilds"><div class="form-group"><input type="password" name="old_password" class="form-control old_user_psw" id="old_user_psw"></div></div></div>'+
													'<div class="txt-feild-row"><div class="label">New Password</div><div class="form-feilds"><div class="form-group"><input type="password" name="new_password" class="form-control new_user_psw" id="new_user_psw""></div></div></div>'+
													'<div class="txt-feild-row"><div class="label">Confirm Password</div><div class="form-feilds"><div class="form-group"><input type="password" name="confirm_password" class="form-control confirm_newuser_psw" id="confirm_newuser_psw""></div></div></div>'+
												'</form>'+
											'</div>'+
										'</div>'+
										'<div class="modal-footer">'+
											'<button type="button" class="btn btn-white" id= change_profpswd_popup_close>Close</button>'+
											'<button type="button" class="btn btn-primary user_password_save" id="user_password_save" >Save changes</button>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>';
							
			var current_path = window.location.pathname.split('/').pop();
			if (current_path != 'mailpanel.html'){
				$('#user_profile').attr('data-target','#mail_profile_popup');
				$('#profile_button').attr('data-target','#mail_profile_popup');
				$('#dashboard_change_pass').attr('data-target','#change_profpswd_popup');
				$('#password_changebtn').attr('data-target','#change_profpswd_popup');
			}
			$('body').append(pop_up_element_1);
			$('body').append(pop_up_element_2);	
			
			//TO PREVENT THE SPECIAL CHARACTERS WHILE TYPING
			$("body").delegate("#mailpanel_user_fname","click",function(e){
				$('#mailpanel_user_fname').on('keypress', function (event) {
					var regex = new RegExp("^[a-zA-Z0-9]+$");
					var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
					if (!regex.test(key)) {
					   event.preventDefault();
					   return false;
					}
				});

			});
			
			//TO AVOID OVERLAPPING OF LABELS WHILE MODAL POPUPCLOSE
			$('body').delegate('#mail_profile_popup .modal-header .close, #mail_profile_popup .modal-footer #user_popup_close','click',function(e){
				if($('.mailpanel_user_fname').val() == '' || $('.mailpanel_user_lname').val() == ''){
					$('.txt-feild-row').addClass('feild-filled');
					getuserDetails();
				}
				$('.fileErrMsg').empty();
				$('#my-awesome-dropzone .dz-preview').remove();
				$('#mail_profile_popup').modal('hide');
			});
			
			//TO AVOID OVERLAPPING OF LABELS WHILE MODAL POPUPCLOSE
			$('body').delegate('#change_profpswd_popup .modal-header .close, #change_profpswd_popup .modal-footer #change_profpswd_popup_close','click',function(e){
				if($('.old_user_psw').val() != '' || $('.new_user_psw').val() != '' || $('.confirm_newuser_psw').val() != ''){
					$('.txt-feild-row').removeClass('feild-filled');
					$('.old_user_psw').val('');
					$('.new_user_psw').val('');
					$('.confirm_newuser_psw').val('');
					$('.txt-feild-row').removeClass('feild-empty');
				}
				$('#change_profpswd_popup').modal('hide');
			});
			
			$("body").delegate(".txt-feild-row [type='text-box'],.txt-feild-row  [type='text'],.txt-feild-row  [type='password']","focus",function(){
				$(this).parents('.txt-feild-row').addClass('focus-feild');
			});
	
			$("body").delegate(".txt-feild-row  [class='label']","click",function(){
				var id 		= $(this).siblings('.form-feilds').children().find('input').attr('id');
				$("#"+id).focus();
				$(this).parents('.txt-feild-row').prevAll('.txt-feild-row')
				
			});
			
			$("body").delegate(".txt-feild-row [type='text-box'],.txt-feild-row [type='text'],.txt-feild-row  [type='password']","blur",function(){
				if($(this).val() == ""){
					$(this).parents('.txt-feild-row').removeClass('focus-feild').removeClass('feild-filled').addClass('feild-empty'); 
					// $(this).parents('.txt-feild-row').children('.label').fadeIn()
				}
				else{
					$(this).parents('.txt-feild-row').removeClass('focus-feild').removeClass('feild-empty').addClass('feild-filled'); 
				}
			});
			setTimeout(function(){
				var u_fname = userDetails.firstname;
				var u_lname = userDetails.lastname;
				$('.mailpanel_user_fname').val(u_fname);
				$('.mailpanel_user_lname').val(u_lname);	
				$('.mail_profile_popup').children().find('.txt-feild-row').removeClass('focus-feild').removeClass('feild-empty').addClass('feild-filled'); 
			},200)
			
			$('.mailpanel_change_img').on('load',function(){
				
				if($('.mailpanel_change_img').prop('naturalWidth')>$('.mailpanel_change_img').prop('naturalHeight')){
					$('.mailpanel_change_img').css('height','251');
					$('.mailpanel_change_img').css('width','auto');	
				}
				else if($('.mailpanel_change_img').prop('naturalWidth')<=$('.mailpanel_change_img').prop('naturalHeight')){
					$('.mailpanel_change_img').css('width','251');	
					$('.mailpanel_change_img').css('height','auto');	
				}
			});
			
			$('body').delegate('.mailpanel_edit_img','click',function(){
				$('#my-awesome-dropzone .dz-image-preview').remove();//TO REMOVE ALREADY SELECTED IMAGE
				$('#my-awesome-dropzone').removeClass('dz-started');//TO UPDATE UPLOAD STATE
				$('.mailpanel_image_edit').css('display','none');
				$('#my-awesome-dropzone').css('display','block');	
			});
			
			$('body').delegate('.mailpanel_edit_username','click',function(){
				if(userProfDetails.fName != '' && userProfDetails.lName != ''){
					$('.mailpanel_user_fname').val(userProfDetails.fName);
					$('.mailpanel_user_lname').val(userProfDetails.lName);
				};
				$('.mailpanel_userdetails_edit').css('display','none');
				$('.mailpanel_userdetails_editform').css('display','block');
			});
			
			$('body').delegate('[data-target="#mail_profile_popup"]','click',function(){
				$('#img_row_1 .labeldanger').remove();
				$('.mail_profile_popup .modal-body').slimScroll({
					height: $(window).height() - 120,
					railOpacity: 0.9
				}); 		
			});	
			
			$('body').delegate('.user_settings_button','click',function(){
				$('#my-awesome-dropzone').css('display','none');	
				$('.mailpanel_userdetails_editform').css('display','none');
				$('.mailpanel_image_edit').css('display','block');
				$('.mailpanel_userdetails_edit').css('display','block');
			});
			
			/*Web service for mailpanel change password starts here*/
			$('body').delegate('.user_password_save','click',function(){
				var old_psw = $('.old_user_psw').val();
				var new_psw = $('.new_user_psw').val();
				var conf_psw = $('.confirm_newuser_psw').val();
				$(".mailpanel_password_editform").validate({
					rules: {
						old_password: {
							required: true,
						},
						new_password: {
							required: true,
						},
						confirm_password: {
							required: true,
							equalTo:"#confirm_newuser_psw"
						}
					}
				});
				_server.post({
					url:serviceURL+'auth/change_pass',
					dataType:'json',
					data:{
						oldpass:old_psw,
						newpass:new_psw,
						cfrmpass:conf_psw
					},
					success: function(response){
						if (response.status==1){
							$('.change_profpswd_popup').modal('hide');
							utils.info_toaster("Password has been Changed", "s");
						}
						else if(response.status==0){
							utils.info_toaster("Password is Incorrect", "e");
						}
					},error: function (jqXHR) {
						utils.info_toaster("Oops something went wrong", "e");
						utils.scriptErrorHandling("mailPanel - mailpanel.js","serverPost - auth/change_pass",jqXHR.responseText);
					}
				});	
				$('.old_user_psw').val('');
				$('.new_user_psw').val('');
				$('.confirm_newuser_psw').val('');
				$('.txt-feild-row').removeClass('feild-filled');
				$('.txt-feild-row').addClass('feild-empty');
			});
			
			getuserDetails(prism_license);
			
			Dropzone.options.myAwesomeDropzone = {
            paramName: 'image',
			url:serviceURL+"utility/upload?1=1",
            dictDefaultMessage: "Drag your images",
			acceptedFiles: 'image/x-png,image/jpeg',
            clickable: true,
            enqueueForUpload: true,
            maxFilesize: 1,
            uploadMultiple: false,
            addRemoveLinks: true,
			thumbnailWidth: 1000,
			thumbnailHeight: 1000,
			init: function() {
				var myDropzone = this;
				$('.dropzone .dz-default.dz-message').removeClass('dz-default');
				this.on('success',function(file){
					var responseText = JSON.parse(file.xhr.response);
					img_url=responseText.url;
				});
				this.on('thumbnail',function(file){
					if(file.width > file.height){
						$('.dz-details > img').css('width','auto');
						$('.dz-details > img').css('height','244px');
					}
					else if (file.width <= file.height){
						$('.dz-details > img').css('width','236px ');
						$('.dz-details > img').css('height','auto');
					}
				});	
			},
			error: function(file, err){
				$('.fileErrMsg').html(err); //TO Throw FILE SIZE BIG ERROR
				utils.info_toaster(err, "w");
			},
			accept: function(file,done){
				$('#img_row_1 .labeldanger').remove();
				if(file.type != "image/jpeg" && file.type != "image/png" && file.type != "image/jpg") {
					$('#img_row_1').append('<div class="labeldanger">Invalid file format</div>');
					this.removeFile(file);
				}
				$('.dz-size').remove();
				this.on("maxfilesexceeded", function(file) {
					utils.info_toaster("Invalid!Only one image per profile", "w");
					this.remove
				});
				
				done();
			},
			removedfile: function(file){
				$('#img_row_1 .dz-preview').remove();
				$('.fileErrMsg').html('')
				img_url="";
			}
			};
			
			$('body').delegate('.mailpanel_profile_save','click',function(){
				
				var user_fname=$('.mailpanel_user_fname').val();
				var user_lname=$('.mailpanel_user_lname').val();
				var existing_img_url = userDetails.prof_pic;
				
				if(img_url =='' && $('#mailpanel_image_edit').css('display') =='none'){
					utils.info_toaster("Please select image", "w");
					return false;
				}else if(user_fname==''){
					// alert("Please enter your first Name.");
					utils.info_toaster("Please enter your first Name", "w");
					return false;
				}
				else if(user_lname==''){
					// alert("Please enter your last Name.");
					utils.info_toaster("Please enter your last Name", "w");				
					return false;
				}
				else{
	
					_server.post({
						url:serviceURL+"utility/uploadUrlImage",
						data:{
						user_fname:user_fname,
						user_lname:user_lname,
						img_url:img_url
						},
						success:function(response){
							utils.info_toaster("Profile Has been Updated", "s");
							getuserDetails();
							$('.mail_profile_popup').modal('hide');
							$('.dz-preview').remove();
							$('.dz-message').css('opacity','1');
						},error: function (jqXHR) {
							utils.info_toaster("Oops something went wrong", "e");
							utils.scriptErrorHandling("mailPanel - mailpanel.js","utility/uploadUrlImage",jqXHR.responseText);
						},
					});
					
				}
			});
	}
	function drawTable(tableObj, dtObj) {
	  try{
		// drawTable and apply dataTable properties and serial numbers if necessary
		if(tableObj == undefined) return;
		if(dtObj == undefined) dtObj = {};
		
		var settings = $.extend({
			data	: {header:[],body:[],footer:[]},
			container	: "",
			tableStyle: "", //class Added to the table
			headerStyle: "", // class to header
			footerStyle: "", // class to footer
			alignArr: ["text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center","text-center"], 
			thalignArr: [], 
			ftalignArr: [], 
			sno		: false, 
			dataTable: true, 
			height	: 250, 
			sortObj	: [[0,"asc"]],
			checkbox : 0,
			checkboxClass : "",
			colorGrades : "",
			callback : "",
			callbackParams : ""
		},tableObj);
		
		$.fn.dataTable.ext.errMode = 'none';
		
		if(settings.data.body != undefined) {
			var theadArr = settings.data.header;
			var tbodyArr = settings.data.body;
			var dataFormat=tableObj.dataFormat;
			var dataFormatFooter=tableObj.dataFormatFooter;
			
			
			var len = theadArr.length;
			var thead = '<thead class="'+settings.headerStyle+'">';
			
			var pHeader = ''; // for header contains colspan
			if($.type(settings.data.pHeader) === "array") {
				var pHeaderData = settings.data.pHeader;
				var hLength = (settings.multipleHeader == true) ? theadArr[0].length : theadArr.length;
				pHeader += '<tr class="primary_header no-border" style="border:none;">';
				var index = 0;
				for(var x=0; x<hLength; x++) {
					if(pHeaderData[index] != undefined && x == pHeaderData[index].index) {
						pHeader += '<th class="'+ ((pHeaderData[index].colspan > 1)? 'border bd-gray ntb nlb nrb' : 'no-border') +'" colspan="'+ (pHeaderData[index].colspan || 1) + '">'+ (pHeaderData[index].title || '&nbsp;') + '</th>';
						hLength -= pHeaderData[index].colspan - 1;
						index += 1;
					}
					else {
						pHeader += '<th class="no-border">&nbsp;</th>';
					}
				}
				pHeader += '</tr>';
				thead += pHeader;
			}
			
			if(settings.multipleHeader == true) {
				len = theadArr[0].length;
				
				for(var i=0; i<theadArr.length; i++) {
					thead += '<tr>';
					for(var j=0; j<len; j++) 
						thead += '<th class="'+(settings.thalignArr[i][j] || '')+'">'+formatNumber(theadArr[i][j],dataFormat[0][j],dataFormat[1][j],dataFormat[2][j])+'</th>';
					thead += '</tr>';
				}
				
				theadArr = theadArr[0];
				
			}
			else {
				thead += '<tr>';
				for(var i=0; i<len; i++) thead += '<th class="'+(settings.thalignArr[i] || '')+'">'+theadArr[i]+'</th>';
				thead += '</tr>';
			}
			thead += '</thead>';
			
			if(tbodyArr.length>0) {
				var alignObj = [];
				
				for(var i=0; i<settings.alignArr.length; i++) {
					if(theadArr[i] == undefined)
						continue;
					
						var head_str = theadArr[i].toLowerCase();
					if( table_sortDescArr.some(function(item){return head_str.indexOf(item) > -1;}) ) {
						alignObj.push({"sClass":(settings.alignArr[i] || ''),"asSorting": [ "desc", "asc" ] });
					}
					else
						alignObj.push({"sClass":(settings.alignArr[i] || '')});
				}
				dtObj.aoColumns = alignObj;
			}
			var tbody = "";
			
			if(!settings.dataTable) {
				tbody = '<tbody>';
				if(dataFormat!= undefined){
					for(var i=0; i<tbodyArr.length; i++) {
						tbody += '<tr>';
						for(var j=0; j<len; j++){
							
							tbody += '<td class="'+(settings.alignArr[j] || '')+'">'+formatNumber(tbodyArr[i][j],dataFormat[0][j],dataFormat[1][j],dataFormat[2][j])+'</td>';
						}
						tbody += '</tr>';
					}
				}
				else{
					for(var i=0; i<tbodyArr.length; i++) {
						tbody += '<tr>';
						for(var j=0; j<len; j++){
							tbody += '<td class="'+(settings.alignArr[j] || '')+'">'+tbodyArr[i][j]+'</td>';
						}
						tbody += '</tr>';
					}
				}
				tbody += '</tbody>';
			}
			
			var tableHTML = '<table class="'+settings.tableStyle+'" width="100%">'+thead+tbody+'</table>';
			if(settings.container != "toHTML"){
				$(settings.container).html(tableHTML);
			}
			
			if(settings.sno) {
				$(settings.container).find('table thead tr th:first').addClass('no-sort');
			}
			settings.container += " table";
			
			if(settings.data.footer.length == len) {
				var tfootArr = settings.data.footer;
				var tfoot = '<tfoot class="'+settings.footerStyle+'"><tr>';
				if(dataFormatFooter!= undefined){
					for(var i=0; i<len; i++) {
						tfoot += '<th class="'+(settings.alignArr[i] || '')+'">'+utils.formatNumber(tfootArr[i],dataFormatFooter[0][i],dataFormatFooter[1][i],dataFormatFooter[2][i])+'</th>';
					}
				}else{
					for(var i=0; i<len; i++) {
						tfoot += '<th class="'+(settings.alignArr[i] || '')+'">'+tfootArr[i]+'</th>';
					}
				}
				tfoot += '</tr></tfoot>';
				$(settings.container).append(tfoot);
			}
		}
		
		if(settings.dataTable)
		{
			var dataFormat = tableObj.dataFormat;
			var dTable;
			var options = $.extend({
				data: tbodyArr,
				destroy	: true,
				dom		: 'frtiS',
				deferRender: true,
				paging	: true,
				searching: false,
				info	: false,
				autoWidth: false,
				scrollY	: true,
				scrollCollapse: false,
				bAutoWidth: false,
				sScrollX: "100%",
				sScrollXInner: "110%",
				order	: settings.sortObj,
				fnRowCallback : function(nRow, aData, iDisplayIndex){   
					//this function puts row number to tbody
					if(settings.formatNumbers){
						for(var i=0; i< aData.length; i++)
							$('td:eq('+i+')',nRow).html(formatNumber(aData[i],dataFormat[0][i],dataFormat[1][i],dataFormat[2][i]));
					}
					if(settings.colorGrades){
						var colIndex = settings.colorGrades;
						var colorCode=["#136F03","#136F03","#FD6C68","#FF4F4F","#E80000","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404"];
						
						$('td:eq('+colIndex+')',nRow).html('<span style="height:3px;font-size: x-small;width:3px;background-color:'+colorCode[aData[colIndex]]+';color:'+colorCode[aData[colIndex]]+'">'+aData[colIndex]+'</span>');
					}
					if(settings.checkbox){
						var checkedVal = ["checked","unchecked"]
						$('td:eq('+settings.checkbox+')',nRow).html('<input type="checkbox" class="editor-active '+settings.checkboxClass+'" value="'+aData[settings.checkbox]+'"/>');
					}
					if(settings.checkEmpty){
						if((settings.checkEmpty.collCheck) && (aData[settings.checkEmpty.collCheck] != "")){
							$(nRow).addClass((settings.checkEmpty.successRowClass || ""));
						}
					}
					return nRow;
					
				},
				fnDrawCallback : function(){ 
					if(settings.callback){
						settings.callback(settings);
					}
				},
			},dtObj);
			dTable = $(settings.container).DataTable(options);
			
			if(settings.sno){
				dTable.on( 'order.dt search.dt', function () {
					dTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
						cell.innerHTML = i+1;
					} );
				} ).draw();
			}
			return dTable;
		}
	  }
	  catch(ex) {
		log(ex.message);
	  }
	}

	function formatTable(tableObj, dtObj, fObj) {
	  try{
		// drawTable and apply dataTable properties and serial numbers if necessary
		if(tableObj == undefined) return;
		if(dtObj == undefined) dtObj = {};
		
		if(fObj == undefined) {
			fObj = {
				body: {
					row:[],
					col:[],
					default: ""
				},
				footer: {
					row		: [],
					default : ""
				}
			};
		}
			
		var settings = $.extend({
			data	: {header:[],body:[],footer:[]},
			container	: "",
			tableStyle: "", //class Added to the table
			headerStyle: "", // class to header
			footerStyle: "", // class to footer
			alignArr: [], 
			thalignArr: [], 
			ftalignArr: [], 
			sno		: false, 
			dataTable: true, 
			height	: 250, 
			sortObj	: [[0,"asc"]],
			checkbox : 0,
			checkboxClass : "",
			colorGrades : "",
			callback : "",
			callbackParams : ""
		},tableObj);
		
		$.fn.dataTable.ext.errMode = 'none';
		
		if(settings.data.body != undefined) {
			var theadArr = settings.data.header;
			var tbodyArr = settings.data.body;
			
			var len = theadArr.length;
			var thead = '<thead class="'+settings.headerStyle+'">';
			if(settings.multipleHeader == true) {
				len = theadArr[0].length;
				
				for(var i=0; i<theadArr.length; i++) {
					thead += '<tr>';
					for(var j=0; j<len; j++) 
						thead += '<th class="'+(settings.thalignArr[i][j] || '')+'">'+(!isNaN(Math.round(theadArr[i][j]))? doFormat(theadArr[i][j], "money") : theadArr[i][j])+'</th>';
					thead += '</tr>';
				}
				
				theadArr = theadArr[0];
			}
			else {
				thead += '<tr>';
				for(var i=0; i<len; i++) thead += '<th class="'+(settings.thalignArr[i] || '')+'">'+(theadArr[i] || '')+'</th>';
				thead += '</tr>';
			}
			thead += '</thead>';
			
			if(tbodyArr.length>0) {
				var alignObj = [];
				
				for(var i=0; i<settings.alignArr.length; i++) {
					if(theadArr[i] == undefined)
						continue;
					if(theadArr[i].toLowerCase().indexOf("ii300") > -1 
						|| theadArr[i].toLowerCase().indexOf("focus") > -1 
						|| theadArr[i].toLowerCase().indexOf("points") > -1 
						|| theadArr[i].toLowerCase().indexOf("yes votes") > -1 
						|| theadArr[i].toLowerCase().indexOf("no votes") > -1 
						|| theadArr[i].toLowerCase().indexOf("# of calls") > -1 
						|| theadArr[i].toLowerCase().indexOf("# of votes") > -1 
						|| theadArr[i].toLowerCase().indexOf("contacts") > -1 
						|| theadArr[i].toLowerCase().indexOf("heatmap") > -1 
						|| theadArr[i].toLowerCase().indexOf("vote result") > -1 
						|| theadArr[i].toLowerCase().indexOf("received") > -1 
						|| theadArr[i].toLowerCase().indexOf("read") > -1
						|| theadArr[i].toLowerCase().indexOf("readership") > -1
						|| theadArr[i].toLowerCase().indexOf("region") > -1
						|| theadArr[i].toLowerCase().indexOf("commission %") > -1
						|| theadArr[i].toLowerCase().indexOf("interaction") > -1
						|| theadArr[i].toLowerCase().indexOf("squawk") > -1	
						|| theadArr[i].toLowerCase().indexOf("am meeting") > -1
						|| theadArr[i].toLowerCase().indexOf("commissions") > -1)
					{
						alignObj.push({"sClass":(settings.alignArr[i] || ''),"asSorting": [ "desc", "asc" ] });
					}
					else
						alignObj.push({ "sClass":(settings.alignArr[i] || '') });
				}
				dtObj.aoColumns = alignObj;
			}
			var tbody = "";
			
			if(!settings.dataTable) {
				var _f;
				tbody = '<tbody>';
				for(var i=0; i<tbodyArr.length; i++) {
					tbody += '<tr>';
					for(var j=0; j<len; j++) {
						_f = (fObj.body.col[j] || fObj.body.row[i] || fObj.body.default);
						tbody += '<td class="'+(settings.alignArr[j] || '')+'">'+(!isNaN(Math.round(tbodyArr[i][j]))? doFormat(tbodyArr[i][j], _f ) : (tbodyArr[i][j] || '') )+'</td>';
					}
					tbody += '</tr>';
				}
				tbody += '</tbody>';
			}
			
			var tableHTML = '<table class="'+settings.tableStyle+'" width="100%">'+thead+tbody+'</table>';
			if(settings.container != "toHTML"){
				$(settings.container).html(tableHTML);
			}
			
			if(settings.sno) {
				$(settings.container).find('table thead tr th:first').addClass('no-sort');
			}
			settings.container += " table";
			
			if(settings.data.footer.length == len) {
				var tfootArr = settings.data.footer;
				var _f;	
				var tfoot = '<tfoot class="'+settings.footerStyle+'"><tr>';
				for(var i=0; i<len; i++) {
					_f = (fObj.footer.row[i] || fObj.footer.default);
					tfoot += '<th class="'+(settings.alignArr[i] || '')+'">'+(!isNaN(Math.round(tfootArr[i]))? doFormat(tfootArr[i], _f ) : (tfootArr[i] || '') )+'</th>';
				}
				tfoot += '</tr></tfoot>';
				$(settings.container).append(tfoot);
			}
		}
		
		if(settings.dataTable)
		{
			var dTable;
			var options = $.extend({
				data: tbodyArr,
				destroy	: true,
				dom		: 'frtiS',
				deferRender: true,
				paging	: true,
				searching: false,
				info	: false,
				autoWidth: false,
				scrollY	: true,
				scrollCollapse: true,
				order	: settings.sortObj,
				fnRowCallback : function(nRow, aData, iDisplayIndex){   
					//this function puts row number to tbody
					if(settings.formatNumbers){
						var _f;
						for(var i=0; i< aData.length; i++) {
							_f = (fObj.body.col[i] || fObj.body.default);
							$('td:eq('+i+')',nRow)
								.html(
									!isNaN(Math.round(aData[i]))? 
										doFormat(aData[i], _f) : (aData[i] || '')
								);
						}
					}
					if(settings.colorGrades){
						var colIndex = settings.colorGrades;
						var colorCode=["#136F03","#136F03","#FD6C68","#FF4F4F","#E80000","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404","#F70404"];
						
						$('td:eq('+colIndex+')',nRow).html('<span style="height:3px;font-size: x-small;width:3px;background-color:'+colorCode[aData[colIndex]]+';color:'+colorCode[aData[colIndex]]+'">'+aData[colIndex]+'</span>');
					}
					if(settings.checkbox){
						var checkedVal = ["checked","unchecked"]
						$('td:eq('+settings.checkbox+')',nRow).html('<input type="checkbox" class="editor-active '+settings.checkboxClass+'" value="'+aData[settings.checkbox]+'"/>');
					}
					return nRow;
					
				},
				fnDrawCallback : function(){ 
					if(settings.callback){
						settings.callback(settings);
					}
				},
			},dtObj);
			dTable = $(settings.container).DataTable(options);
			
			if(settings.sno){
				dTable.on( 'order.dt search.dt', function () {
					dTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
						cell.innerHTML = i+1;
					} );
				} ).draw();
			}
		}
	  }
	  catch(ex) {
		log(ex.message);
	  }
	}

	function formatNumber(num, type,addElementClass,addElementValue){
		if(addElementClass == undefined) addElementClass = "";
		if(addElementValue == undefined) addElementValue = "";
		try {
			//formatting a number
			var n = 0;
			if(type == undefined) type = "";
			var tempType=type.split(" ");
			var formatedData="";
			for(var i=0;i<tempType.length;++i)
			{
			//	if(/^\d+$/.test(num)){	//  number format data operations
				if(!isNaN(num) && num != ""){	//  number format data operations
					switch(tempType[i]) {
						case "money": 
							n = parseFloat(num);
							formatedData= (n >= 0) ? "$"+(Math.round(n).toLocaleString("en-US").split('.')[0]) : '<span class="red-clr">($'+(Math.round(n*-1).toLocaleString("en-US").split('.')[0])+')</span>';
							break;
						case "enUS":
							n = parseFloat(num);
							formatedData= (n.toLocaleString("en-US"));
							break;
						case "percentage":
							formatedData = num.indexOf(".") != -1 ? (parseFloat(num)).toFixed(2)+"%" : num+"%";
							break;
						case "percentageStyle":
							formatedData = num.indexOf(".") != -1 ? (parseFloat(num)).toFixed(2)+"%" : num+"%";
							formatedData = num == 0 ? formatedData : ((num > 0) ? '<span>'+formatedData+'</span>' : '<span class="red-clr">'+formatedData+'</span>') ;
							break;
						case "million":
						if (num >= 1000000) {
							return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
						}
						if (num >= 1000) {
							return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
						}
						return num;
							break;
					}
				}
				else{	//  String format data operations
					switch(tempType[i]) {
						case "decodeData":
							num="<xmp class='ntm nbm'>"+decodeURI(num)+"</xmp>";		
							break;
						case "money":
							num = "-";
							break;
						case "summary_dropdownS":
						case "summary_dropdownST":
							num = "<select class='place-right bd-darker' data-account_id='"+(num.account_id || "")+"' data-analyst_email='"+(num.analyst_email || "")+"' data-analyst_id='"+(num.analyst_id || "")+"' data-analyst_name='"+(num.analyst_name || "")+"' data-contact_id='"+(num.contact_id || "")+"' data-contact_phone='"+(num.contact_phone || "")+"' data-contact_email='"+(num.contact_email || "")+"' data-user_name='"+(num.user_name || "")+"' data-last_interact_days='"+(num.last_interact_days || "")+"' data-contact_name='"+(num.contact_name || "")+"' data-account_name='"+(num.account_name || "")+"' ><option value=''>-Take Action-</option><option  value='initiatecall'>Initiate Call Now</option> <option  value='initiateEmail'>Initiate Email Now</option><option  value='remindemail'>Remind analyst by email</option><option value='dissmiss'>Dismiss Alert</option></select>";
							break;
						case "anlst_dropdownA":
							if((num.anlst_action || "").trim() != "Sales Directed") {
								num = "<select class='place-right bd-darker' data-account_id='"+(num.account_id || "")+"' data-analyst_email='"+(num.analyst_email || "")+"' data-analyst_id='"+(num.analyst_id || "")+"' data-analyst_name='"+(num.analyst_name || "")+"' data-contact_id='"+(num.contact_id || "")+"' data-contact_phone='"+(num.contact_phone || "")+"' data-contact_email='"+(num.contact_email || "")+"' data-user_name='"+(num.user_name || "")+"' data-last_interact_days='"+(num.last_interact_days || "")+"' data-contact_name='"+(num.contact_name || "")+"' data-account_name='"+(num.account_name || "")+"' ><option value=''>-Take Action-</option><option  value='initiatecall'>Initiate Call Now</option> <option  value='initiateEmail'>Initiate Email Now</option><option value='dissmiss'>Dismiss Alert</option></select>";
							}	
						break;
					}
				}
				if(formatedData==""){formatedData=num}
				
				switch(tempType[i]) { //adding some detail with data
					
					case "addSpanAfter":
							formatedData=formatedData+'<span class="'+addElementClass+'" >'+(addElementValue === undefined?'&nbsp;':addElementValue)+'</span>';	
							break;
					case "addSpanBefore":
							formatedData="<span class='"+addElementClass+"'>"+(addElementValue === undefined?"&nbsp;":addElementValue)+"</span>"+formatedData;	
							break;
					case "addSVS"://SVS span value span
							formatedData="<span class='"+addElementClass+"'>"+num+"</span>";	
							break;
				}
			}
			if(formatedData!=""){
				return formatedData;
			}
			if(num === undefined){ //defult if not retrn any thing
				return "";
			}
			return num;
		}
		catch(ex) {
			if(num === undefined){
				return "";
			}
			return num;
		}
	}
	
	
	function doFormat(_num, _type, _condition) {
		try {
			if(!isNaN(_num)  && _num !="" ) {	//  number format data operations
				switch(_type) {
					case "money": 
						n = parseFloat(_num);
						if($.type(_condition) == "object" && _condition.nocolor)
							formatedData = (n >= 0) ? "$"+(Math.round(n).toLocaleString("en-US").split('.')[0]) : "($"+(Math.round(n*-1).toLocaleString("en-US").split('.')[0])+")";
						else 
							formatedData = (n >= 0) ? "$"+(Math.round(n).toLocaleString("en-US").split('.')[0]) : '<span class="red-clr">($'+(Math.round(n*-1).toLocaleString("en-US").split('.')[0])+')</span>';
						break;
					case "enUS":
						n = parseFloat(_num);
						formatedData= (n.toLocaleString("en-US")).split('.')[0];
						break;
					case "percentage":
						if(parseFloat(_num) == 0) formatedData = "0%";
						else
							formatedData = (parseFloat(_num) > 0)? '<span class="fg-green">'+_num+"%"+'</span>' : '<span class="red-clr">'+_num+"%"+'</span>';
						break;
					case "million":
						if (_num >= 1000000) 
							return (_num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
						if (_num >= 1000) 
							return (_num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
						return _num;
						break;
					default:
						n = parseFloat(_num);
						formatedData= (n.toLocaleString("en-US")).split('.')[0];
						break;
				}
				return formatedData;
			}
			else if(_num == 'null' || !_num) {
				return '';
			}
			else {
				return '';
			}
		}
		catch(ex) {
			log("Error in doFormat: " + ex.message);
		}
	}
	
	// To check whether a file exists in particular path. if not return alternate file path
	function checkFile(filePath, alternatePath) {
		try {
			var tempPath = alternatePath;
			$.ajax({
				url: filePath,
				type: 'HEAD',
				async: false,
				success: function (){
					tempPath = filePath;
				},
				error: function() {
					tempPath = alternatePath;
				}
			});
			return tempPath;
			
		}
		catch(ex) {
			log(ex);
		}
	}
	
	/*
	 * Duplicating an object/part of an object for making any changes in the object
	*/
	function clone(sourceObj) {
		try {
			if($.type(sourceObj) == "object")
				return $.extend(true, {}, sourceObj);
			else 
				return {};
		}
		catch(ex) {
			log("Error: function Clone: "+ex.message);
			return {};
		}
	}
	
	//find all VISIBLE data tables inside a pane and resize them
	function _resizeDT() {
		try {
			//$(window).resize();
			$($.fn.dataTable.fnTables(true)).each(function(i, table){
				$(table).dataTable().fnAdjustColumnSizing();
			});
		}
		catch(e){
			log("Error in resizeDT: "+e.message);
		}
	}
	//accepts two comma seperated dates in yyyymmdd/mmddyy format,returns difference
	function subtractDates(date1, date2) {
		//if(date1 != "Invalid Date" && date2 != "Invalid Date"){
		// The number of milliseconds in one day
		//var ONE_DAY = 1000 * 60 * 60 * 24
		var dd = date2.getDate();
			var mm = date2.getMonth()+1; //January is 0!

			var yyyy = date2.getFullYear();
			if(dd<10){
				dd='0'+dd
			} 
			if(mm<10){
				mm='0'+mm
			} 
		var date2 = new Date(mm+'/'+dd+'/'+yyyy);

		// Convert both dates to milliseconds
		//var date1_ms = date1;
		//var date2_ms = date2;
		
		var timeDiff = (date2.getTime() - date1.getTime());
		var diff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

		// Calculate the difference in milliseconds
		//var difference_ms = Math.abs(date1_ms - date2_ms)

		// Convert back to days and return
		//var diff = Math.round(difference_ms/ONE_DAY);
		//if(date1 != "Invalid Date" && date2 != "Invalid Date"){
		// The number of milliseconds in one day
		//var ONE_DAY = 1000 * 60 * 60 * 24
/*
		// Convert both dates to milliseconds
		var date1_ms = date1;
		var date2_ms = date2;

		// Calculate the difference in milliseconds
		var difference_ms = Math.abs(date1_ms - date2_ms)

		// Convert back to days and return
		var diff = Math.round(difference_ms/ONE_DAY);*/
		switch (diff){
			case -1:
				return "Tomorrow";
				break;
			case 0:
				return "Today ";
				break;
			case 1:
				return "Yesterday ";
				break;
			default:
				return ""+diff+" days ago ";
				break;
		}
	}

	function curDate() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [month, day, year].join('/');
	}

	//Vivian - Added - 28/10/2015
	function curDateTime() {
		
		var date = new Date();
		date = date.getUTCFullYear() + '-' +
			('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
			('00' + date.getUTCDate()).slice(-2) + ' ' + 
			('00' + date.getHours()).slice(-2) + ':' + 
			('00' + date.getMinutes()).slice(-2) + ':' + 
			('00' + date.getSeconds()).slice(-2);
		return date;
	}

	function green2Red(number) {
		try {
			var h,s,l,a=1;
			if(number > _colorLimit) {
				h=130;
				//green to gray
				l=20; //75
				s = 100; //10
				
			}
			else if(number < (_colorLimit*-1)) {
				h=0;
				//red to gray
				l=25; //75
				s = 100; //10
				
			}
			else if(number == 0) {
				
			}
			else {
				
			}
		}
		catch(ex){
			log("Error: green2Red(): "+ex.message);
		}
	}
	function chartGridPop(gObj){
		try {
			
			var dObj = $.extend({
				data: {header:[],body:[],footer:[],hintKey:[],hintVal:[]},
				skipCols: [],
				headerLabelPerc:5,
				headerClass: [],
				bodyClass: [],
                colorColumn:2,
				dataValue:0,  //For Trader Summary - 1, otherwise - 0 as default
				percentageColumn:[] //For Trader Summary - Percentage Column will be added , otherwise = -1 as default
			},gObj);
                        
			var colLength;
                        
			var hintObj = {
				key : dObj.data.Key,
				val : dObj.data.hintVal
			};
			var thead = dObj.data.header;
			var headerHtml = '',bodyHtml = '',footerHtml = '';
			var resultObj = {};
			
			var _chartWidth = 15;
			if(dObj.headerLabelPerc && dObj.headerLabelPerc <= 50) {
				_chartWidth = (100-dObj.headerLabelPerc)/(thead.length-1);
			}
			else {
				dObj.headerLabelPerc = 5
				_chartWidth = 95/(thead.length-1);
			}
			
                        if(dObj.colorColumn){
                            colLength=dObj.colorColumn;
                        }else{
                             colLength=1;
                        }
                     
                        
			headerHtml = '<thead><tr>';
			for(var i=0;i<thead.length;i++) {
				if(i==0)
					headerHtml += '<th class="'+(dObj.headerClass[i] || '')+'" style="width:'+dObj.headerLabelPerc+'%;">'+thead[i]+'</th>';
				else
					headerHtml += '<th class="'+(dObj.headerClass[i] || '')+'" style="width:'+_chartWidth+'%;">'+thead[i]+'</th>';
			}
			headerHtml += '</tr></thead>';
			
			resultObj.header = headerHtml;
			
			var tbody = dObj.data.body;
			var maxVal = [];
			var minVal = [];
			for(var i=1;i<tbody[0].length;i++) {
				var max = findMax2dArr(tbody,i);
				var min = findMin2dArr(tbody,i);
				minVal[i] = Math.round(min);
				maxVal[i] = Math.round(max);
				if(maxVal[i] == 0 || maxVal[i] < (-1*minVal[i]))
					maxVal[i] = minVal[i]*-1;
			}
			
			var colArr = [];
			var inTables = [];
			for(var i=0;i<tbody[0].length;i++) {
				colArr[i] = tbody.map(function(v) {
				  return v[i];
				});
			}
			
			var deltaArr = [];
			for(var i=0;i<colArr[0].length;i++) {                            
           		deltaArr[i] = red2green(colArr[(colArr.length-colLength)-2][i]);
				//log([colArr.length-colLength] );
			}
			
			//For Trader Summary
			var headselectionId='';	
			
			for(var i=0;i<colArr.length;i++) {
				if(dObj.skipCols.indexOf(i) >= 0) {
					//log(thead[i]);
					inTables[i] = '<table class="inTable '+(dObj.bodyClass[i] || '')+'">';
					for(var j=0;j<colArr[i].length;j++) {
						//log(hintObj)
						if(thead[i]=="ROI Rank" || thead[i]=="Comm. Rank" || thead[i]=="ROI Score" || thead[i]=="Service Level" || thead[i]=="Region"){
							var align ='class= "text-center"';
						}else{
							var align='class= "text-left"';
						}
							if(colArr[i][j]==0){
							colArr[i][j]='<span hidden>1000000</span>NA';
							}
							//For Trader Summary
							if(dObj.dataValue=="1")
							    headselectionId=' data-selectionid="'+hintObj.val[j][i]+'" style="text-align:right;"  ';										
							
						inTables[i] += '<tr><td  '+headselectionId+ align+'  >'+(colArr[i][j])+'</td></tr>';
					}
					inTables[i] += '</table>';
					continue;
				}
				inTables[i] = '<table class="inTable '+(dObj.bodyClass[i] || '')+'" >';
				var perc = '', wid = 0;
                                
                                //Old Codings
				//if(i == colArr.length-1) perc = '%';
				//By using NumberColor in extraParameter is "colorColumn"
                                //By Default = Last Column is allowed for All Chart, For Chart 2,3 = LastColumn and LastColumn-2 
                               // if((i == colArr.length-1)||(i == colArr.length-colLength)) perc = '%';
                                
				//For TraderSummary => To display % at last in the table
				if(dObj.percentageColumn.indexOf(i)>-1){
					//if(i == dObj.percentageColumn) 
						perc = '%';					 
				}
				
				var h = 1;
				for(var j=0;j<colArr[i].length;j++) {
					//For Showing the Hint Popup
					var hint_text = "", hint_class = "";
					//For TraderSummary
					var  selectionId="";
					if(hintObj.val && hintObj.val[j] && hintObj.val[j][i] != undefined && hintObj.val[j][i] != "") {
						hint_text = ' data-key1="'+encodeURIComponent(hintObj.key[j][i])+'" data-val1="'+encodeURIComponent(utils.formatNumber(hintObj.val[j][i],"money"))+'" ';
							
							//For Trader Summary
							if(dObj.dataValue=="1")
							    selectionId=' data-selectionid="'+hintObj.val[j][i]+'" ';		
					
						h++;
						hint_class = " _tooltext ";
					}
					
					if(maxVal[i] != 0) {
						wid = 100*(Math.round(colArr[i][j])/maxVal[i]);
						wid = (wid/2.25);
					}
					else
						wid = 0;
					var val = colArr[0][j];
					if(val != undefined && val.indexOf('<') > -1) {
						//if its a html content replace with empty string
						val = "";
					}
					//For checking the value
					if(minVal[i] >= 0)
						inTables[i] += '<tr class="'+hint_class+'" '+hint_text+'  ><td class="text-left"  '+selectionId+' data-region="'+val+'"><span class="comm-chart-item"   '+selectionId+' style="width:'+wid+'%;background-color:'+deltaArr[j]+';">&nbsp;</span><span  '+selectionId+' >&nbsp;'+formatNumber(Math.round(colArr[i][j]), "enUS")+perc+'</span></td></tr>';
					else {
						if(colArr[i][j] >= 0)
							inTables[i] += '<tr class="'+hint_class+'" '+hint_text+'><td  '+selectionId+' data-region="'+val+'"></td><td class="text-left"  '+selectionId+' data-region="'+val+'"><span class="comm-chart-item"  '+selectionId+' style="width:'+wid+'%;background-color:'+deltaArr[j]+';">&nbsp;</span><span  '+selectionId+' >&nbsp;'+formatNumber(Math.round(colArr[i][j]), "enUS")+perc+'</span></td></tr>';
						else
							inTables[i] += '<tr class="'+hint_class+'" '+hint_text+'><td class="text-right"  '+selectionId+' data-region="'+val+'"><span '+selectionId+' >'+formatNumber(Math.round(colArr[i][j]), "enUS")+perc+'&nbsp;</span><span  class="comm-chart-item" '+selectionId+'  style="width:'+(-1*wid)+'%;background-color:'+deltaArr[j]+';">&nbsp;</span></td><td  '+selectionId+' data-region="'+val+'"></td></tr>';
					}
				}
				inTables[i] += '</table>';
			}
			
			bodyHtml = '<tbody><tr>';
			for(var i=0;i<inTables.length;i++) {
				bodyHtml += '<td class="'+(dObj.bodyClass[i] || '')+'" rowspan="'+colArr[0].length+'">'+inTables[i]+'</td>';
			}
			bodyHtml += '</tr></tbody>';
			
			resultObj.body = bodyHtml;
			
			footerHtml = '<tfoot><tr>';
			for(var i=0;i<tbody[0].length;i++) {
				footerHtml += '<td>&nbsp;</td>';
			}
			footerHtml += '</tr></tfoot>';
			
			resultObj.footer = footerHtml;
			
			return resultObj;
		}
		catch(ex) {
			log("Error in chartGrid:"+ex.message);
			return {body:'Unable to Process Data.'};
		}
	}
	function chartGrid(gObj){
		try {
			
			var dObj = $.extend({
				data: {header:[],body:[],footer:[],hintKey:[],hintVal:[]},
				skipCols: [],
				headerLabelPerc:5,
				headerClass: [],
				bodyClass: [],
                colorColumn:1,
				dataValue:0,  //For Trader Summary - 1, otherwise - 0 as default
				percentageColumn:[] //For Trader Summary - Percentage Column will be added , otherwise = -1 as default
			},gObj);
                        
			var colLength;
                        
			var hintObj = {
				key : dObj.data.hintKey,
				val : dObj.data.hintVal
			};
			var thead = dObj.data.header;
			var headerHtml = '',bodyHtml = '',footerHtml = '';
			var resultObj = {};
			
			var _chartWidth = 15;
			if(dObj.headerLabelPerc && dObj.headerLabelPerc <= 50) {
				_chartWidth = (100-dObj.headerLabelPerc)/(thead.length-1);
			}
			else {
				dObj.headerLabelPerc = 5
				_chartWidth = 95/(thead.length-1);
			}
			
                        if(dObj.colorColumn){
                            colLength=dObj.colorColumn;
                        }else{
                             colLength=1;
                        }
                     
                        
			headerHtml = '<thead><tr>';
			for(var i=0;i<thead.length;i++) {
				if(i==0)
					headerHtml += '<th class="'+(dObj.headerClass[i] || '')+'" style="width:'+dObj.headerLabelPerc+'%;">'+thead[i]+'</th>';
				else
					headerHtml += '<th class="'+(dObj.headerClass[i] || '')+'" style="width:'+_chartWidth+'%;">'+thead[i]+'</th>';
			}
			headerHtml += '</tr></thead>';
			
			resultObj.header = headerHtml;
			
			var tbody = dObj.data.body;
			var maxVal = [];
			var minVal = [];
			for(var i=1;i<tbody[0].length;i++) {
				var max = findMax2dArr(tbody,i);
				var min = findMin2dArr(tbody,i);
				minVal[i] = Math.round(min);
				maxVal[i] = Math.round(max);
				if(maxVal[i] == 0 || maxVal[i] < (-1*minVal[i]))
					maxVal[i] = minVal[i]*-1;
			}
			
			var colArr = [];
			var inTables = [];
			for(var i=0;i<tbody[0].length;i++) {
				colArr[i] = tbody.map(function(v) {
				  return v[i];
				});
			}
			//colArr = stores all the values column wise
			var deltaArr = [];
			for(var i=0;i<colArr[0].length;i++) {                            
           		deltaArr[i] = red2green(colArr[colArr.length-colLength][i]);
			}
			
			//For Trader Summary
			var headselectionId='';	
			
			for(var i=0;i<colArr.length;i++) {
				if(dObj.skipCols.indexOf(i) >= 0) {
					if(thead[i]=="Goal YTD"){
						var align ='class= "text-center"';
					}else{
						var align='class= "text-left"';
					}
					inTables[i] = '<table class="inTable '+(dObj.bodyClass[i] || '')+'">';
					for(var j=0;j<colArr[i].length;j++) {						
							//For Trader Summary
							if(dObj.dataValue=="1")
							    headselectionId=' data-selectionid="'+hintObj.val[j][i]+'" style="text-align:left;"  ';										
						if(j%2 == 0){	
							inTables[i] += '<tr class="odd"><td   '+headselectionId+align+'  >'+(colArr[i][j])+'</td></tr>';
						}else{
								inTables[i] += '<tr class="even"><td   '+headselectionId+align+'  >'+(colArr[i][j])+'</td></tr>';
						}
					}
					inTables[i] += '</table>';
					continue;
				}
				inTables[i] = '<table class="inTable '+(dObj.bodyClass[i] || '')+'" >';
				var perc = '', wid = 0;
                                
                                //Old Codings
				//if(i == colArr.length-1) perc = '%';
				//By using NumberColor in extraParameter is "colorColumn"
                                //By Default = Last Column is allowed for All Chart, For Chart 2,3 = LastColumn and LastColumn-2 
                               // if((i == colArr.length-1)||(i == colArr.length-colLength)) perc = '%';
                                
				//For TraderSummary => To display % at last in the table
				if(dObj.percentageColumn.indexOf(i)>-1){
					//if(i == dObj.percentageColumn) 
						perc = '%';					 
				}
				
				var h = 1;
				for(var j=0;j<colArr[i].length;j++) {
					//For Showing the Hint Popup
					var hint_text = "", hint_class = "";
					//For TraderSummary
					var  selectionId="";
					if(hintObj.val && hintObj.val[j] && hintObj.val[j][i] != undefined && hintObj.val[j][i] != "") {
						hint_text = ' data-key1="'+encodeURIComponent(hintObj.key[j][i])+'" data-val1="'+encodeURIComponent(utils.formatNumber(hintObj.val[j][i],"money"))+'" ';
							
							//For Trader Summary
							if(dObj.dataValue=="1")
							    selectionId=' data-selectionid="'+hintObj.val[j][i]+'" ';		
					
						h++;
						hint_class = " _tooltext ";
					}
					
					if(maxVal[i] != 0) {
						wid = 100*(Math.round(colArr[i][j])/maxVal[i]);
						wid = (wid/2.25);
					}
					else
						wid = 0;
					var val = colArr[0][j];
					if(val != undefined && val.indexOf('<') > -1) {
						//if its a html content replace with empty string
						val = "";
					}
					//For checking the value
					if(minVal[i] >= 0)
						inTables[i] += '<tr class="'+hint_class+'" '+hint_text+'  ><td class="text-left"  '+selectionId+' data-region="'+val+'"><span class="comm-chart-item"   '+selectionId+' style="width:'+wid+'%;background-color:'+deltaArr[j]+';">&nbsp;</span><span  '+selectionId+' >&nbsp;'+formatNumber(Math.round(colArr[i][j]), "enUS")+perc+'</span></td></tr>';
					else {
						if(colArr[i][j] >= 0)
							inTables[i] += '<tr class="'+hint_class+'" '+hint_text+'><td  '+selectionId+' data-region="'+val+'"></td><td class="text-left"  '+selectionId+' data-region="'+val+'"><span class="comm-chart-item"  '+selectionId+' style="width:'+wid+'%;background-color:'+deltaArr[j]+';">&nbsp;</span><span  '+selectionId+' >&nbsp;'+formatNumber(Math.round(colArr[i][j]), "enUS")+perc+'</span></td></tr>';
						else
							inTables[i] += '<tr class="'+hint_class+'" '+hint_text+'><td class="text-right"  '+selectionId+' data-region="'+val+'"><span '+selectionId+' >'+formatNumber(Math.round(colArr[i][j]), "enUS")+perc+'&nbsp;</span><span  class="comm-chart-item" '+selectionId+'  style="width:'+(-1*wid)+'%;background-color:'+deltaArr[j]+';">&nbsp;</span></td><td  '+selectionId+' data-region="'+val+'"></td></tr>';
					}
				}
				inTables[i] += '</table>';
			}
			
			bodyHtml = '<tbody><tr>';
			for(var i=0;i<inTables.length;i++) {
				bodyHtml += '<td class="'+(dObj.bodyClass[i] || '')+'" rowspan="'+colArr[0].length+'">'+inTables[i]+'</td>';
			}
			bodyHtml += '</tr></tbody>';
			
			resultObj.body = bodyHtml;
			
			footerHtml = '<tfoot><tr>';
			for(var i=0;i<tbody[0].length;i++) {
				footerHtml += '<td>&nbsp;</td>';
			}
			footerHtml += '</tr></tfoot>';
			resultObj.footer = footerHtml;
			
			return resultObj;
		}
		catch(ex) {
			log("Error in chartGrid:"+ex.message);
			return {body:'Unable to Process Data.'};
		}
	}
	
	function findMax2dArr(_arr,index) {
		return Math.max.apply(Math, _arr.map(function(v) {
		  return v[index];
		}));
	}
	
	function findMin2dArr(_arr,index) {
		return Math.min.apply(Math, _arr.map(function(v) {
		  return v[index];
		}));
	}
	//Function to get the querystring 
	function getParameterByName(name) {
		try{
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
			if(results != null)
			return decodeURIComponent(results[1].replace(/\+/g, " "));
			else{
				return -1;
			}
		}
		catch(e){
			log("Error code:Get params"+e);
		}
	}
	
	/*
	 * Export to a File(XLS / PDF)
	*/
	function exportTable(obj) {
		try {
			if($.type(obj) == "object") {
				var url = "", type = "";
				if($.type($(obj).data("url")) == "string") {
					url = $(obj).data("url");
					type = $(obj).data("type");
				}
				else {
					alert("Sorry! Unable to process the request.");
					// log("exportTable URL:"+url);
					return;
				}
				url = url.replace(/\/$/,'') + "/";
				var getfile = false;
				switch(type.toUpperCase()) {
					case "XL": 
					case "XLS": 
					case "EXCEL": 
						url += 'xls';
						getfile = true;
						break;
					case "PDF": 
						url += 'pdf';
						getfile = true;
						break;
				}
				if(getfile) {
					window.open(url);
				}
				else {
					alert("Invalid File type!");
					log("Invalid File Type:" + type);
				}
			}
			else {
				alert("Invalid export request!");
				log("Error in exportTable(utils) - TYPE: "+type);
			}
		}
		catch(ex){
			log("Error in exportTable(utils): "+ex.message);
		}
	}
	
	
	/***************************************************************
	************ CHECK LOCAL STORAGE FOR SPECIFIC TYPE *************
	****************************************************************/
	function checkLocalStorage(_type) {
		try {
			var tempStatus;
			$.ajax({
				type : "GET",
				url : url+"communicate/fetch_cia",
				async: false,
				dataType: "JSON",
				success : function(result) {
					if(result.status == 0) {
						result = (result.data.cia_details).replace(/&#34;/g,'"');
						if(result != "") {
							result = JSON.parse(result);
							window.localStorage = result;
							localStorage["cia_uid"] = result.cia_uid;
							localStorage["cia_uname"] = result.cia_uname;
							localStorage["cia_upwd"] = result.cia_upwd;
							localStorage["cia_uphone"] = result.cia_uphone;
							localStorage["cia_mobile"] = result.cia_mobile;
							localStorage["cia_desk"] = result.cia_desk;
							
							if(!window.localStorageAlias)
								window.localStorageAlias = window.localStorage;
							
							switch(_type) {
								case "CIA":
										_cia_userId = localStorageAlias["cia_uid"];
										_cia_userName = localStorageAlias["cia_uname"];
										_cia_password = localStorageAlias["cia_upwd"];
										_default_user_phone = localStorageAlias["cia_uphone"];
										_mobile_phone = localStorageAlias["cia_mobile"];
										_desk_phone_ = localStorageAlias["cia_desk"];
										tempStatus = true;
									break;
								case "USER":
									if(localStorageAlias.user_id) tempStatus = true;
									else tempStatus = false;
									break;
							}
						}
					}
				},
				error:function(ex) {
					log("Error in fetching cia details: "+ex.message);
				}
			});
			return tempStatus;
		}
		catch(ex) {
			log("Error in checkLocalStorage('"+_type+"'): "+ex.message);
			return false;
		}
	}
	
	function _validateCharSet(ValidateType,FldObject){ 

	   if( event.keyCode == 39 || event.keyCode == 34 || event.keyCode == 126 || event.keyCode == 96  || event.keyCode == 94 )
			return false;
				
		switch(ValidateType)	//Based on Validate Type the validation case will execute
		{
			case 0:			//Allows nothing(readonly)
				return false;
		   
			case 3:			//Allows Numeric values
				if(!( event.keyCode >= 48 && event.keyCode <= 57 ))
					return false;
				break;
			case 14:			//Allows a to z A to Z
				if(!( (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || ( event.keyCode == 32 ) ))
					return false;
				break;
				
			case 15:			//Allows a to z A to Z
				if(!( (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || ( event.keyCode == 32 ) || ( event.keyCode >= 48 && event.keyCode <= 57 )))
					return false;
				break;
				
			case 100:	//email validation	Allows AlphaNumeric, Enter, !,@,#,$,%,*,(,),[,],{,},_,-,.
				if( !( event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 64 || event.keyCode == 95 || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode >= 48 && event.keyCode <= 57) ))
					return false;
					break;
				default:
				return true;
		}
		
	}
	
	function _checkValidation(){
		var status = 0;
		var content = "";
		var emailOnly = new RegExp(/^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/);
		var valid = emailOnly.test($.trim($(".input9").val()));
		
		if($.trim($(".input0").val()) == ""){
			content="Please Enter First name";
		}
		
		if($.trim($(".input1").val()) == ""){
			content="Please Enter Last name";
		}
		
		if($("#communication_frequency").length == 0 || $("#communication_frequency").val() == "")	{
			content="Please Select communication Frequency";
		}
		if($("#preferred_communication").length == 0 || $("#preferred_communication").val() == ""){
			content="Please Select Preferred Communication";
		}
		

		if($("#contactSearch1").length == 0 || $("#contactSearch1").val() == ""){
			content="Please Select Account Name.";
		}
		
		if($.trim($(".input9").val()) == ""){
		content="Please  Enter the Email Id";
		}
		else if($.trim($(".input9").val().match(/^[A-Za-z]*$ /))){
			content="<div>Please  Enter the Email Id</div>";
		}
		else if(!valid){
			content="Please  Enter the valid Email Id";
		}
		
		if(content !=""){
			alert(content);
			status=0;
		}
		else{
			status=1;
		}
		return status;

	}
	
	
	function showStatus(obj) {
		try {
			if(obj && obj != "close") {
				var show = false;
				switch($.type(obj)) {
					case "object": 
						if(obj.type == "notify") {
							$("#loading_status_block").hide();
							 var not = $.Notify({
								style: {background:"#FFC2B0"},
								content: (obj.msg || obj.message || obj.txt || obj.text || obj.content),
								timeout: (obj.time || 2000) // 2 seconds
							});
							return;
						}
						if(obj.msg || obj.message || obj.txt || obj.text || obj.content) {
							$("#loading_status_block .loading_status").html(obj.msg || obj.message || obj.txt || obj.text || obj.content);
							show = true;
						}
						break;
					case "number":
					case "string":
						$("#loading_status_block .loading_status").html(obj);
						show = true;
						break;
					default:
						$("#loading_status_block").hide();
						break;
				}
				
				if(!$("#loading_status_block").is(":visible") && show) {
					$("#loading_status_block").show().css("display","table");
				}
				else {
					$("#loading_status_block").hide();
				}
			}
			else {
				$("#loading_status_block").hide();
			}
		}
		catch(ex){
			log("Error in showStatus method(utils): "+ex.message);
		}
	}
	
	/*
		Remove an Object from an array using one of the object's attribute & value
		EXAMPLE:
			var arr = [{id:1,name:'aaa'},{id:2,name:'bbb'},{id:3,name:'ccc'}];
			removeByAttr(arr, 'id', 1);
		RESULT:
			[{id:2,name:'alfalfa'},{id:3,name:'joe'}]
	*/
	function removeByAttr(arr, attr, value){
		return arr.filter(function (el) {
				if (attr in el)	
					return el[attr] !== value;
				else 
					return false;
			});
	}
	
	function arrObjSearch(arr, key, val, type) {
		if($.type(arr) === "array") {
			var result = [];
			result = $.grep(arr, function(e){ return (e[key] === val); });
			
			if($.type(type) === "string") type = type.toLowerCase();
			
			switch(type) {
				case "check":
					return result.length;
				default:
					return result;
			}
		}
		else return 0;
	}
	
	//function to show get salesforce credentials
	function show_getCredentials(){
		return;
		var _call_set = $("#pop_up_element_1").bPopup({
			position: ["auto","auto"],
			opacity	: 0.4,
			modalClose: false,
			onOpen: function() {
				var content_html = '<div class="bpop-header"><i class="icon-cog"></i>&nbsp;Settings<span class="b-close top_1"></span></div>'+
				'<div class="bg-white padding10 text-left">'+
				'<div class="margin5 nlm nrm border brd-lightgreen ntb nrb nlb text-bold text-center">Salesforce Credentials</div>'+
				'	<fieldset>'+
				'		<label class="invalid_cred"></label>'+
				'		<label>UserID</label>'+
				'		<div class="input-control text" data-role="input-control">'+
				'			<input type="text" id="sf_user_id" class="sf_user_id" onfocus="window.external.setfocuscode(this.id)"/>'+
				'		</div>'+
				'		<label>Password</label>'+
				'		<div class="input-control text" data-role="input-control">'+
				'			<input type="password" id="sf_user_password" class="sf_user_password" onfocus="window.external.setfocuscode(this.id)"/>'+
				'		</div>'+
				'	</fieldset>'+
				'<div class="text-right"><button type="button" class="button bg-darkgreen fg-white brd-radius4 save_sf_details">SAVE</button></div>'+
				'</div>';
				$("#pop_up_element_1").html(content_html);
			},
			onClose: function() {
				//callback function
			}
		},function(){
			//callback function
		});
		
	}
	//Common Dialog to show content and respone from the webservice
	function showDialog(title,content,dialog_width,dialog_height,dialog_style){
		$.Dialog.close();
		$.Dialog({
			draggable: true,
			shadow: true,
			flat: true,
			width:dialog_width,
			height:dialog_height,
			icon: '',
			centered :true,
			style:dialog_style,
			onShow: function(_dialog){
				$.Dialog.title(title);
				$.Dialog.content(content);
			}
		});
	}
	function svg2dataURI(svgContent, callback, legend,detail) {
		$("#canvas").html("");
		
		$("#canvas").attr("height", $(svgContent).height());//($(svgContent).height()));
		$("#canvas").attr("width", $(svgContent).width());//($(svgContent).width()) + "%");
		
		style = svgContent.substr(svgContent.search("style=\"")+7);
		style = style.substr(0,style.search("\""));
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		
		svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		
		if(legend != undefined)
		{
			var curHeight = style.substr(style.search("height:"));
			var legendHeight = "height:"+legend+"px;";
			
			style = style.replace(curHeight, legendHeight);
			
			svg.setAttribute('style',style);
		}
		else{
			svg.setAttribute('style',style);
		}
	
		// Create a dummy receptacle
		var receptacle = document.createElement('div');
		receptacle.innerHTML = '' + svgContent;
		// Splice the childs of the SVG inside the receptacle to the SVG at the body
		Array.prototype.slice.call(receptacle.childNodes[0].childNodes).forEach(function (el) {    svg.appendChild(el)})
		document.getElementById("canvas").appendChild(svg);
		
		var xml = $("#canvas").html();
		
		try {
		
			canvg(document.getElementById('canvas'), xml, {
				renderCallback: function() { 
					var canvas1 = document.getElementById("canvas");
					if (canvas1.getContext) {
						var ctx = canvas1.getContext("2d");                // Get the context for the canvas.
						var myImage = canvas1.toDataURL("image/png");      // Get the data as an image.
						$("#canvas").html(" ");
						//callback(myImage,detail);
					}
				}
			});
			
		}
		catch(ex) {
			log("Util svg2dataURI Failure :"+ ex.message);
		}
	}
	function generateAddAccountPopup(cust_id){
		var procFlg = '';
		if(cust_id==""){
			button="Save"	
			procFlg = "s";
			btnProp='none'			
			region_1=''; regfield='feild-empty';
			classification_1=''; classfield='feild-empty';
			aum=''; aumfield='feild-empty';
			address=''; addressfield='feild-empty';
			city=''; cityfield='feild-empty';
			country=''; countryfield='field-empty';
			zipcode=''; zipcodefield='feild-empty';
			account_number=''; account_numberield='feild-empty';
			account_name=''; accfield='feild-empty';
			ii=0;
			focus=0;
		}
		else{
			button="Update"
			procFlg = "u";
			btnProp = 'block'
			if(cust_id[0]==null || cust_id[0]==''){region_1=''; regfield='feild-empty';} else{region_1=cust_id[0]; regfield='feild-filled';}
			if(cust_id[1]==null || cust_id[1]==''){classification_1=''; classfield='feild-empty';} else{classification_1=cust_id[1]; classfield='feild-filled';}
			if(cust_id[2]==null || cust_id[2]=='' || cust_id[2]==undefined){ii=0;} else{ii=cust_id[2];}
			if(cust_id[3]==null || cust_id[3]=='' || cust_id[3]==undefined){focus=0;} else{focus=cust_id[3];}
			if(cust_id[4]==null || cust_id[4]==''){aum=''; aumfield='feild-empty';} else{aum=cust_id[4]; aumfield='feild-filled';}
			if(cust_id[5]==null || cust_id[5]==''){address=''; addressfield='feild-empty';} else{address=cust_id[5]; addressfield='feild-filled';}
			if(cust_id[6]==null || cust_id[6]==''){city=''; cityfield='feild-empty';} else{city=cust_id[6]; cityfield='feild-filled';}
			if(cust_id[7]==null || cust_id[7]==''){country=''; countryfield='feild-empty';} else{country=cust_id[7]; countryfield='feild-filled';}
			if(cust_id[8]==null || cust_id[8]==''){zipcode=''; zipcodefield='feild-empty';} else{zipcode=cust_id[8]; zipcodefield='feild-filled';}
			if(cust_id[9]==null || cust_id[9]==''){account_number=''; account_numberield='feild-empty';} else{account_number=cust_id[9]; account_numberfield='feild-filled';}
			if(cust_id[10]==null || cust_id[10]==''){account_name=''; accfield='feild-empty';} else{account_name=cust_id[10]; accfield='feild-filled';}
		}
		$('#add_account_pop_up').on('shown.bs.modal',function(){
			temp ='<div class="modal-dialog modal_lg">'+
				'	<div class="modal-content animated fadeInDown">'+
				'		<div class="modal-header updateClose text-center">'+
				'				<span id="poptitle" style="text-align:center;" class="text-center">'+
				'				Add Account'+
				'				</span>'+
				'				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
				'		</div>'+
				'		<div class="modal-body">'+
				'			<form role="form" class="form" id="editTable" style="width:100%;float: left;" >'+
				'				<div class="txt-feild-row '+accfield+'">'+
				'					<div class="label"><span class="mandtory-fld">*</span><span class="key2">Account Name</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_name" value="'+account_name+'" class="form-control " type="text" onblur="chkMandoryFieldOnblur(this.id)" onkeypress="return ValidateCharSetAccount()" onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="txt-feild-row '+regfield+'">'+
				'					<div class="label"><span class="mandtory-fld">*</span><span class="key2">Region</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_reg" class="form-control " value="'+region_1+'" type="text" onblur="chkMandoryFieldOnblur(this.id)" onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="txt-feild-row '+classfield+'">'+
				'					<div class="label"><span class="key2">Tier</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_tier" class="form-control " type="text" value="'+classification_1+'" onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>								'+
				'				<div class="feild-row feild-empty"">'+
				'					<div class="label"><span class="key4">Is II 300</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<div class="key5 input-control select"  >'+
				'							<select id="add_acc_is_li" class="form-control " id="is_li_300" onfocus="window.external.setfocuscode(this.id)">'+
				'								<option value="0">No</option>'+
				'								<option value="1">Yes</option>'+
				'							</select>'+
				'						</div>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="feild-row feild-empty"">'+
				'					<div class="label"><span class="key4">Is Focus</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<div class="key5 input-control select"  >'+
				'							<select id="add_acc_is_focus" class="form-control " id="Is_Focus" onfocus="window.external.setfocuscode(this.id)">'+
				'								<option value="0">No</option>'+
				'								<option value="1">Yes</option>'+
				'							</select>'+
				'						</div>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="txt-feild-row '+aumfield+'">'+
				'					<div class="label"><span class="key2">AUM</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_aum" class="form-control" value="'+aum+'" type="text" onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="txt-feild-row '+addressfield+'">'+
				'					<div class="label"><span class="key2">Address</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_address" class="form-control" value="'+address+'" type="text" onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="txt-feild-row '+cityfield+'">'+
				'					<div class="label"><span class="key2">City</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_city" class="form-control"  value="'+city+'" type="text"  onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="txt-feild-row '+countryfield+'">'+
				'					<div class="label"><span class="key2">Country</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_country" class="form-control"  value="'+country+'" type="text"  onfocus="window.external.setfocuscode(this.id)"  autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+				
				'				<div class="txt-feild-row '+zipcodefield+'">'+
				'					<div class="label"><span class="key2">Zip Code</span></div>'+
				'					<div class="form-feilds">'+
				'					<div class="form-group">'+
				'						<span class="input-control text typeahead-container search-container " style="display: inline-block;">'+
				'							<input id="add_acc_zip" class="form-control" value="'+zipcode+'" type="text" onkeypress="return utils.validateCharSet(3,this)" onfocus="window.external.setfocuscode(this.id)" maxlength="6" autocomplete="off">'+
				'							<span class="fa fa-times btn-search1"></span>'+
				'						</span>'+
				'					</div>'+
				'					</div>'+
				'				</div>'+
				'			</form>'+
				'		</div>'+
				'		<div class="modal-footer">'+				
				'			<input type="button" style="float:left;display:'+btnProp+';" id="btn_acc_delete" value="Delete" class="btn btn-danger" onClick="">'+
				'			<a id="account_delete_conf" class="animated" style="display:none;"><span style="float: left;margin-top: 7px;">Delete this account? &nbsp;&nbsp;</span>'+
				'				<input type="button" style="float:left;" id="btn_acc_delete_yes" data-id="'+account_number+'" value="Yes" class="btn btn-info" onClick="">'+
				'				<input type="button" style="float:left;" id="btn_acc_delete_no" value="No" class="btn btn-info" onClick="">'+
				'			</a>'+
				'			<div class="spiner-example popuploading" style="display: none;"><div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div><div class="sk-rect2"></div><div class="sk-rect3"></div><div class="sk-rect4"></div><div class="sk-rect5"></div></div></div>'+
				'			<input type="button" style="float:right;" id="add_acc_btn_save" value="'+button+'" class="btn btn-success" onClick=SaveAccount_button("'+procFlg+'");>'+
				'		</div>	'+
				'	</div>'+
				'</div>';
			$("#add_account_pop_up").html(temp);
			$("#add_acc_is_li").val(ii)
			$("#add_acc_is_focus").val(focus)
		}).modal('show');
		// $("#add_account_pop_up").empty();
		// $("#add_account_pop_up").html('');
		// $("#add_account_pop_up").modal('show');
	}
	
	function red2green(x) {
		var baseSat = 10,
			baseLum = 60,
			greenHue = 115,
			redHue = 0;
		var satRange = 90,
			greenLumRange = 50,
			redLumRange = 35;
		var satVal = 0, lumVal = baseLum;
		var HSL = "hsl(0,0%,"+baseLum+"%)";
		if(x && x != "") {
			if(isNaN(x)) {
				x = parseFloat(x);
			}
			
			if(x >= -0.25 && x <= 0.25) {
				HSL = "hsl(0,0%,"+baseLum+"%)";
			}
			else if(x >= 0.26) {
				//gray to green variance
				if(x <= 100) {
					satVal = baseSat + satRange*(x/100);
					lumVal = baseLum - greenLumRange*(x/100);
				}
				else {
					//darker green value for values > 100
					satVal = 100;
					lumVal = 8;
				}
				return "hsl("+greenHue+","+satVal+"%,"+lumVal+"%)";	
			}
			else if(x <= -0.26) {
				//gray to red variance
				if(x >= -100) {
					satVal = baseSat + satRange*(-1*x/100);
					lumVal = baseLum - redLumRange*(-1*x/100);
				}
				else {
					//darker green value for values > 100
					satVal = 100;
					lumVal = 30;
				}
				return "hsl("+redHue+","+satVal+"%,"+lumVal+"%)";	
			}
		}
		return HSL;
	}

	/***********************************************************
		* THIS FUNCTION IS USED TO DRAW THE DATATABLE IN GIVEN TABLE ID
		* Description: ACCEPT Obj PARAMETER
			VAR oBJ = {
				id:'#id',//this is table id(table id should be unique)
				serverSide:true,//Will fetch data from server
				data:DATA,//If Server side is true, No need to mention this Data,.
				columns: [
					{'title':'Title 1' , 'Data':'column_name' , 'className':'classNames'},
					{'title':'Title 2' , 'Data':'column_name' , 'className':'classNames'},
					{'title':'Title 3' , 'Data':'column_name' , 'className':'classNames'},
					{'title':'Title 4' , 'Data':'column_name' , 'className':'classNames'},
					{'title':'Title 5' , 'Data':'column_name' , 'className':'classNames'},
					{'title':'Title 6' , 'Data':'column_name' , 'className':'classNames'},
	        	]
			}
		* Created by: SANDEEP
	*********************************************************/
	function DrawDatatable(Obj) {
	try{
		
		if(Obj.length==0 || Obj==undefined){
			utils.scriptErrorHandling('utils.js' ,'DrawDatatable' ,"Table Object Is Undefined/Empty");
			return false;
		}
		if(Obj.id == undefined){
			utils.scriptErrorHandling('utils.js' ,'DrawDatatable' ,"Table Id Is Not Defined");
			return false;	
		}
		if(Obj.serverSide==true){
			if(Obj.ajax == undefined){
				utils.scriptErrorHandling('utils.js' ,'DrawDatatable' ,"Ajax Id Is Not Defined");
				return false;	
			}
			Obj = $.extend({
					"processing": true,
		        	"serverSide": true,
				},Obj);
		}else{
			Obj = $.extend({
					"bInfo":false,
					"processing": false,
		        	"serverSide": false,
				},Obj);
		}		
		if(Obj.numeberFormatCels!=undefined && Obj.numeberFormatCels.length>0){
			Obj = $.extend({										
					aoColumnDefs: [{
						"aTargets": Obj.numeberFormatCels,
						"createdCell":function(td, cellData, rowData, row, col){
							var x = dz.numberFormat(cellData,(Obj.numberFormatType.length < col)?'string':Obj.numberFormatType[col])
							$(td).attr("data-order", cellData);
							$(td).html(x);
							
							Obj.EllipseTarget=(Obj.EllipseTarget)?Obj.EllipseTarget:[];
						
							if(Obj.EllipseTarget.length>0){
								if(Obj.EllipseTarget.indexOf(col)>=0){
									
									Obj.EllipseSize=(Obj.EllipseSize)? Obj.EllipseSize:[];
									var sizePosition = Obj.EllipseSize[col];
									sizePosition = sizePosition ? sizePosition : 10;
									$(td).html(utils.cellEllipse(x, "title", [0, sizePosition]));
									
								}
							}
						}
					}]
				},Obj);
		}
		if(Obj.footerSum!=undefined){
			var tfoot ='<tfoot>';
			$(Obj.columns).each(function(i,e){
				if(Obj.numberFormatType[i] == "money"){
				// tfoot+= '<th style="border : none !important;border-top: 1px solid #000000 !important;"></th>'
					tfoot+= '<th class="DT_footer" style="text-align:right;"></th>'
				}else{
					tfoot+= '<th class="DT_footer"></th>'
				}
			});
			tfoot+= '</tfoot>';
			$(Obj.id).append(tfoot);
			$(Obj.id).after('<span class="footnote"><span style="color:#ff5722;">*</span> The values listed above are Rounded up. Total is sum of actual values with decimals.</span>');
			Obj = $.extend({										
				footerCallback:function(){
					sum = Obj.footerSum[0];
					sum = Object.keys(sum).map(function (key) { return sum[key]; });
					
					var api = this.api(), data;
					$(sum).each(function(i,e){
						if(e.toLowerCase() == "total"){
							e = e + '<span style="color:#ff5722;"> *</span>';
						}
						if(isNaN(e) || e.trim() ==''){
			            	$( api.column(i).footer() ).html(e);
						}else{
							$( api.column(i).footer() ).html(dz.numberFormat(e, Obj.numberFormatType[i]));
						}
					})
				}
			},Obj);
		}
		extraFilter=' ';
		if(Obj.extraFilters!=undefined){
			extraFilter='<"DT_extraFilters_'+Obj.id.substring(1,Obj.id.length)+' col-md-12 col-lg-6 DT_extraFilters">';			
		}
		Obj = $.extend({
					dom: extraFilter+'<"DT_settings_'+Obj.id.substring(1,Obj.id.length)+' DT_settings pull-right">lTfgtip<"clear">',
					buttons: ['colvis'],
					oLanguage: {
						"sSearch": "",
						"sLengthMenu": "Showing: _MENU_"
					},
					bPaginate: true,
					pageLength: 20,
					deferRender:true,
					responsive: true
				},Obj);
		
		if(Obj.dynamicColumns!=undefined){
			var tableHTML='<thead>';
			var headers = Obj.dynamicColumns.mainHeader;			
			if(headers.length>0){
				tableHTML+='<tr>';
				$(headers).each(function(index,value){
					tableHTML+='<th>'+this.title+'</th>';
				});
		
				tableHTML+='</tr>';
			}
			tableHTML+='</thead>';
			$(Obj.id).html(tableHTML);
		}
		if(Obj.multipleColumns!=undefined){
			var headers = (Obj.multipleColumns.lastHeader==undefined)?[]:Obj.multipleColumns.lastHeader;
			var mainHeader = (Obj.multipleColumns.mainHeader==undefined)?[]:Obj.multipleColumns.mainHeader;
			var headerSum = (Obj.multipleColumns.headerSum==undefined)?[]:Obj.multipleColumns.headerSum;
			var filterHeader = (Obj.multipleColumns.filterHeader==undefined)?[]:Obj.multipleColumns.filterHeader;
			var tableHTML='<thead>';
			var attr='';
			if(headers.length<=0){
				utils.scriptErrorHandling('utils.js' ,'DrawDatatable' ,"Header Is Not Defined");
				return false;
			}
			if(mainHeader.length>0){
				tableHTML+='<tr>';
				//Stores list of Child IDx for expand/collapse
				childIdx = [];
				start = 0;
				i = 0;

				$(mainHeader).each(function(index,value){
					if(this.colspan!=undefined && this.colspan!='') attr+=' colspan="'+this.colspan+'" ';
					if(this.rowspan!=undefined && this.rowspan!='') attr+=' rowspan="'+this.rowspan+'" ';
					if(this.className!=undefined && this.className!='') attr+=' class="'+this.className+' header_main_'+Obj.id.substring(1,Obj.id.length)+'" ';
					start+=parseInt(this.colspan);
					while(i<start)
					{
						childIdx.push(i);
						i++;
					}

					tableHTML+='<th '+attr+' title="Click to Expand or Collapse" style="vertical-align:middle;cursor:pointer;">'+this.name;
					if(this.expand==1)
						tableHTML+='<i class="fa fa-angle-double-left datatable_collapse_'+Obj.id.substring(1,Obj.id.length)+'" style="float: right;" data-childCols="' + JSON.stringify(childIdx) + '"></i>';
					tableHTML+='</th>';
					attr=' ';

					childIdx = [];
				})
				tableHTML+='</tr>';
			}
			//this is draw the sum of header only if there is headerSum defined incide multiple columns
			if(Object.keys(filterHeader).length>0){
				Headtypes = (Obj.numberFormatType==undefined?[]:Obj.numberFormatType)
				tableHTML+='<tr>';
				$(filterHeader).each(function(index,value){
					tableHTML+='<th>'+value+'</th>';
				});
				tableHTML+='</tr>';
			}
			
			//this is draw the sum of header only if there is headerSum defined incide multiple columns
			if(Object.keys(headerSum).length>0){
				Headtypes = (Obj.numberFormatType==undefined?[]:Obj.numberFormatType)
				tableHTML+='<tr>';
				$(headerSum).each(function(index,value){
					if(headers[index].colspan!=undefined && headers[index].colspan!='') attr+=' colspan="'+headers[index].colspan+'" ';
					if(headers[index].rowspan!=undefined && headers[index].rowspan!='') attr+=' rowspan="'+headers[index].rowspan+'" ';
					if(headers[index].className!=undefined && headers[index].className!='') attr+=' class="'+headers[index].className+'" ';
					
					if(Headtypes[index].toLowerCase()=='money'){
						attr+='style="text-align:right !important"';
						tableHTML+='<th '+attr+' >'+dz.numberFormat(value,'headermoneymask')+'</th>';
					}else if(Headtypes[index].toLowerCase()=='percentage'){
						tableHTML+='<th '+attr+' >'+dz.numberFormat(value,'percentagemask')+'</th>';
					}else if(Headtypes[index].toLowerCase()=='percentagedecimal'){
						tableHTML+='<th '+attr+' ></th>';
					}else if(Headtypes[index].toLowerCase()=='percentagecont'){
						tableHTML+='<th '+attr+' ></th>';
					}else if(Headtypes[index].toLowerCase() == 'moneymask'){
						attr+='style="text-align:right !important"';
						tableHTML+='<th '+attr+'>'+dz.numberFormat(value,'headermoneymask');
					}else if(Headtypes[index].toLowerCase() == 'numbermask'){
						tableHTML+='<th '+attr+'>'+dz.numberFormat(value,'numbermask')+'</th>';
					}else if(Headtypes[index].toLowerCase()=='number' || Headtypes[index]=='noformating'){
						tableHTML+='<th '+attr+' ></th>';
					}else{
						tableHTML+='<th '+attr+' >'+value+'</th>';
					}
					attr=' ';
				});
				tableHTML+='</tr>';
			}
			
			//Other headers draw here if needemainHeaderd
			if(headers.length>0){
				tableHTML+='<tr>';
				$(headers).each(function(index,value){
					if(this.colspan!=undefined && this.colspan!='') attr+=' colspan="'+this.colspan+'" ';
					if(this.rowspan!=undefined && this.rowspan!='') attr+=' rowspan="'+this.rowspan+'" ';
					if(this.className!=undefined && this.className!='') attr+=' class="'+this.className+'" ';
					tableHTML+='<th '+attr+' >'+this.name+'</th>';
					attr=' ';

				});
		
				tableHTML+='</tr>';
			}
			tableHTML+='</thead>';
			$(Obj.id).html(tableHTML);
			$(Obj.id).addClass("compact custmultiHeaderDataTable");
		}else{
			$(Obj.id).addClass("compact custDataTable nowrap");
		}
		
		$(Obj.id).removeClass("nowrap").addClass("nowrap");
		
		var DOMTable = $(Obj.id).DataTable(Obj);
		var lbl_style='';
		var img_style='';
		if(Obj.settings==true){
			drawDatatableDrop(Obj,DOMTable)
		}
		if(Obj.excelExport==true && Obj.ExcelUrl!=undefined){
			drawDatatableExcelExport(Obj,DOMTable)	
		}
		if(Obj.extraFilters!=undefined){
			drawExtraFilters(Obj,DOMTable)			
		}
		if(Obj.sScrollY!=undefined){
			$(Obj.id).parent().slimScroll({
					height: Obj.sScrollY,
					railOpacity: 0.9,
					allowPageScroll: true
				});
		}
		$(Obj.id+'_filter label input').attr('class','f-input _DT_search');
		$(Obj.id+'_length  label select').attr('class','f-input _DT_length');
		//$(Obj.id+'_filter label').attr('style',lbl_style);
		$(Obj.id+'_filter').append('<i class="_dataTable_search_ico fa fa-search" aria-hidden="true"></i>');
		$(Obj.id+'_filter').css('margin-top','10px');
		$('._DT_search').attr('placeholder','Search...');

		if(Obj.beforePaginateAdd == true){
			$('<div class="datatablefootnote">Note:The values listed above are Rounded up. Total is sum of actual values with decimals.</div>').insertBefore(Obj.id+'_paginate');
		}
		//TO OPEN TEARSHEET
		
		setTimeout(function(){
			$(Obj.id+" tfoot th").each(function(){
				$(this).addClass('DT_footer_scroll');
			});
		}, 1000);
		/*if(Obj.sparkLineClass!=null || Obj.sparkLineClass!=undefined){
			$(Obj.id).on( 'page.dt, order.dt, search.dt', function () {
				var info = DOMTable.page.info();
				setTimeout(function(){
					if($(Obj.id+' .'+Obj.sparkLineClass+' canvas').length == 0){
						$(Obj.id+' .'+Obj.sparkLineClass).sparkline('html',{defaultPixelsPerValue:20});
					}
				},0)
			} );
		}
		$(Obj.id+' .accnt_commission_sparkLine').sparkline('html',{defaultPixelsPerValue:20});
		return DOMTable;*/
		
		$(document).ready(function() {
            $(Obj.id)
                .on( 'page.dt', function () {
                    setTimeout(function(){
                            $(Obj.id+' .accnt_commission_sparkLine').sparkline('html',{defaultPixelsPerValue:20});
                    },10)
                    //$('.dataTables_scrollBody').slimScroll({ scrollTo : '0px' });
                })
                .on( 'order.dt',  function () {
                    setTimeout(function(){
                            $(Obj.id+' .accnt_commission_sparkLine').sparkline('html',{defaultPixelsPerValue:20});
                    },10)
                    //$('.dataTables_scrollBody').slimScroll({ scrollTo : '0px' }); 
                })
                .on( 'search.dt', function () {
                    // alert('search') 
                    setTimeout(function(){
                            $(Obj.id+' .accnt_commission_sparkLine').sparkline('html',{defaultPixelsPerValue:20});
                    },10)
                    //$('.dataTables_scrollBody').slimScroll({ scrollTo : '0px' });
                })
                .DataTable();  
        });
		$(Obj.id+' .accnt_commission_sparkLine').sparkline('html',{defaultPixelsPerValue:20});
		return DOMTable;
	}catch(e){
		utils.scriptErrorHandling('utils.js' ,'DrawDatatable' ,e);
	}
}

//SLIMSCROLL TO TOP ON SORTING
function datatableScrollToTop(id){
	$(".dataTables_scrollBody").animate({ scrollTop: 0 }, "slow"); // scroll slim scroll to top on sort and filter
	$('.slimScrollBar').css("top", "0px"); // scroll slim scroll to top 
	if(id == '#trade-summary-table' || id == '#account-trade-summary-table' || id == '#sales-trade-summary-table'){
		$(id + " tr:last td").css('padding-bottom','7px'); // display last row 
	}else{
		$(id + " tr:last td").css('padding-bottom','20px'); // display last row 
	}
}

//NEGATIVE NUMBERS CHECK FOR DATATABLE
function negativeNumbersCheck(id, numberFormatType){
	// $(".dataTables_scrollBody").animate({ scrollTop: 0 }, "slow"); // scroll slim scroll to top on sort and filter
	// $('.slimScrollBar').css("top", "0px"); // scroll slim scroll to top 
	// if(id == 'trade-summary-table')
	// $(id + " tr:last td").css('padding-bottom','20px'); // display last row 
	
	$(id+" tbody tr").each(function(i,val){					
		$(val).find('td').each(function(j,value)
		{
			titlevalue = ($(value).find('span').attr("title"));
			var a = $(value).text();
			var tempa = a.replace(/\,/g, '');
			tempa = tempa.replace(/\$/g, '');
			if (a.indexOf('-') !== -1)
			{
				if(tempa < 0)
				{	
					if(numberFormatType[j].toLowerCase() == 'number'){
						$(value).css('color','#ff5722');
					}
					if(numberFormatType[j].toLowerCase() == 'money'){
						a = a.replace(/\-/g, '').replace(/\$/g, '');
						$(value).css('color','#ff5722');
						$(value).html('<span title="'+titlevalue+'">($'+a+')</span>');
					}
				}
				if(a.indexOf('%') !== -1){
					$(value).css('color','#ff5722');
				}
			}
		});
	});
	if($(".custDataTable tfoot").length > 0){
		$(".custDataTable tfoot tr").each(function(i,val){					
			$(val).find('th').each(function(j,value)
			{
				titlevalue = ($(value).find('span').attr("title"));
				var a = $(value).text();
				var tempa = a.replace(/\,/g, '');
				tempa = tempa.replace(/\$/g, '');
				if (a.indexOf('-') !== -1)
				{
					if(tempa < 0)
					{
						$(value).css('color','#ff5722');
						if(numberFormatType[j].toLowerCase() == 'money'){
							a= a.replace(/\-/g, '').replace(/\$/g, '');
							$(value).html('<span title="'+titlevalue+'">($'+a+')</span>');
						}
					}
					if(a.indexOf('%') !== -1){
						$(value).css('color','#ff5722');
					}
				}
			});
		});
	}
	if($(".dataTables_scrollHeadInner .custmultiHeaderDataTable").length > 0){
		$(".dataTables_scrollHeadInner .custmultiHeaderDataTable thead tr").each(function(i,val){					
			$(val).find('th').each(function(j,value)
			{
				titlevalue = ($(value).find('span').attr("title"));
				var a = $(value).text();
				var tempa = a.replace(/\,/g, '');
				tempa = tempa.replace(/\$/g, '');
				if (a.indexOf('-') !== -1)
				{
					if(tempa < 0 && numberFormatType[j].toLowerCase() == 'money')
					{
						$(value).css('color','#ff5722');
						a= a.replace(/\-/g, '').replace(/\$/g, '');
						$(value).html('<span title="'+titlevalue+'">($'+a+')</span>');
					}
					if(a.indexOf('%') !== -1){
						$(value).css('color','#ff5722');
					}
				}
			});
		});
	}
}

//NEGATIVE VALUE CHECK FOR SINGLE VALUES
var negativeValueCheck = function(val,type){
	val = val.toString();
	val = val.replace(/\,/g, '').replace(/\$/g, '');
	val1 = val;
	if(type.toLowerCase() == 'numberformatter'){
		if(val.indexOf('-') != -1){
			val = val.replace(/\-/g, '');
			val = dz.numberFormat(val,'suffix');
			val = '($'+val+')';
			value = [val,val1];
		}else{
			val = '$'+dz.numberFormat(val,'suffix');
			value = [val,val1];
		}
	}else if(type.toLowerCase() == "money"){
		if(val.indexOf('-') != -1){
			val = dz.numberFormat(val,type);
			// val = val.replace(/\-/g, '');
			// val = '('+val+')';
			value = [val,val1];
		}else{
			val = dz.numberFormat(val,type);
			value = [val,val1];
		}
	}else if(type.toLowerCase() == "percentage" || type.toLowerCase() == "percentagedecimal" || type.toLowerCase() == 'percentagecont'){
		if(val.indexOf('-') != -1){
			val = dz.numberFormat(val,type);
			value = [val,val1];
		}else{
			val = dz.numberFormat(val,type);
			value = [val,val1];
		}
	}else if(type.toLowerCase() == "number"){
		if(val.indexOf('-') != -1){
			value = [val,val1];
		}else{
			value = [val,val1];
		}
	}else{
		if(val.indexOf('-') != -1){
			val = val.replace(/\-/g, '');
			val = utils.CommonNumberFormatWithOutSuffix(val);
			val = '('+val+')';
			value = [val,val1];
		}else{
			val = utils.CommonNumberFormatWithOutSuffix(val);
			value = [val,val1];
		}
	}
	return value;
}
function drawExtraFilters(Obj,DOMTable){
	extraFilterVar='';
	var activClass= ' active '
	for(i=0;i<Obj.extraFilters.length;i++){
		if(i>0){
			activClass='';
		}
		extraFilterVar+="<div class='DT_extra_filters'>"+
						"<span class='DT_extra_filters_value "+activClass+"'>"+Obj.extraFilters[i].value+"</span>"+
						"<span class='DT_extra_filters_key'>"+Obj.extraFilters[i].key+"</span>"+
					"</div>";
				
	}
	//extraFilterSubmit="<button type='button' class='btn btn-primary tooltip-input' data-placement='left' style='margin-top: 1%;'>Annual Goal</button>";
	//$('.DT_extraFilters_'+Obj.id.substring(1,Obj.id.length)).append(extraFilterSubmit);
	$('.DT_extraFilters_'+Obj.id.substring(1,Obj.id.length)).append(extraFilterVar);
	$("body").delegate('.DT_extraFilters_'+Obj.id.substring(1,Obj.id.length)+' .DT_extra_filters .DT_extra_filters_value','click',function(){
		// $('.DT_extraFilters_'+Obj.id.substring(1,Obj.id.length)+' .DT_extra_filters .DT_extra_filters_value').removeClass('active');
		// $(this).addClass('active');
	})
}
function drawDatatableExcelExport(Obj,DOMTable){
	headerHTML ='';
	headerHTML+='<div style="display:inline-block;font-size: 15px;" class="pull-right datatable_excel_export"><i title="Export this table to excel" class="fa fa-file-excel-o '+Obj.id.substring(1,Obj.id.length)+'_excel_export"></i></div>';
	$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)).append(headerHTML);
	$("body").undelegate('.'+Obj.id.substring(1,Obj.id.length)+'_excel_export','click')
	$("body").delegate('.'+Obj.id.substring(1,Obj.id.length)+'_excel_export','click',function(e){
		var cookieVal = getCookieValue('auth_token');
		window.open(Obj.ExcelUrl+'&exl=true&auth_token='+cookieVal,'_blank');
	})
}
function drawDatatableDrop(Obj,DOMTable){
	$('#loading_screen').show();
	_server.get({		
		url: serviceURLJava+"tableconfig/gettblfields",
		data:{"tblid":Obj.id.substring(1,Obj.id.length)},
		success: function (response) {
			var dropHeads = Obj.columns;
			if(response.status == 1 || response.status == "1"){
				dropHeads = mergeSettings(Obj,response.settings);
				drawDomElements(Obj,DOMTable,dropHeads);				
			}else if(response.status == 0 || response.status == "0") {
				response = {
					settings: {column_def: ""}
				}
				if(Obj.table_settings == undefined){
					Obj.table_settings = [];
					for(var i=0; i<Obj.aoColumns.length; i++){
		                var chk = false;
		                if(i < 3){
		                    chk = true;
		                }
		                Obj.table_settings.push({
	                        data: Obj.aoColumns[i].data,
	                        checked: chk
		                })
		            }
		            response.settings.column_def = JSON.stringify(Obj.table_settings);
				}else{
					response.settings.column_def = JSON.stringify(Obj.table_settings);
				}
				dropHeads = mergeSettings(Obj,response.settings);
				drawDomElements(Obj,DOMTable,dropHeads);
				setTableSettings(Obj,dropHeads)
			}		
		},
		error: function (jqXHR) {
			utils.scriptErrorHandling('utils.js', 'drawDatatableDrop', jqXHR.responseText);
			$('#loading_screen').hide();
		}
	});	
}

function drawDomElements(Obj,DOMTable,dropHeads){
	var tempheader ='';
	var hideColArr = '';
	$(dropHeads).each(function(i,ele){
		title = (ele.title==undefined)?ele.tit:ele.title;
		(ele.checked==false)?checked='':checked='checked';
		if(ele.isDefault != undefined && ele.isDefault == 'yes'){
			tempheader +=	'<li class="DT_col_li DT_default" data-column='+i+' data-name='+ele.data+' data-title="'+title+'">'+
								'<input type="checkbox" disabled class="columnslichk" style="margin-left: 10px;" '+checked+'>'+
								'<span>'+title+'</span>'+
							'</li>';
		}else{
			tempheader +=	'<li class="DT_col_li DT_li_cols" data-column='+i+' data-name='+ele.data+' data-title="'+title+'">'+
								'<input type="checkbox" class="columnslichk" style="margin-left: 10px;" '+checked+'>'+
								'<span>'+title+'</span>'+
							'</li>';
		}
		if(ele.checked==false){
			hideColArr = hideColArr+','+i;
		}
	});
	
	if(hideColArr != ''){
		hideColArr = hideColArr.substring(1);
		hideColArr = '['+hideColArr+']';
		hideColArr = JSON.parse(hideColArr);
		DOMTable.columns(hideColArr).visible(false, false);
	}
	
	var headerHTML = 	'<div id="col_visb_div" style="display:inline-block;"><span data-toggle="dropdown" class="dropdown-toggle" href="#" class="list-table-btn" style="padding-right:5px;">'+
							'<i class="fa fa-columns" title="Change column visibility" aria-hidden="true"></i>'+
						'</span>'+
						'<ul class="dropdown-menu sub-menu m-t-xs DT_settings_ul" style="max-height:296px;overflow-y:auto;">'+
							'<li class="arrow_top"></li>'+
							'<i style="position: absolute;top: -21px;right:4px;width: 13px;height: 8px;display: block; border: none;" class="fa fa-2x fa-caret-up" aria-hidden="true"></i>'+
							tempheader+
						'</ul></div>';
	$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' #col_visb_div').remove();
	$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)).append(headerHTML);
	/*$(dropHeads).each(function(index,key){
		column = DOMTable.column(index);
		(key.checked==false)?column.visible(false):column.visible(true);
	});*/
	$('.header_main_'+Obj.id.substring(1,Obj.id.length)).each(function(e){
		if($(this).attr("colspan")==1){
			$(this).children().toggleClass('fa-angle-double-left fa-angle-double-right')
		}
	});
	
	//TO OPEN TEAR
	$("body").undelegate('.dataTableMultiHeaderLink','click')
	$("body").delegate('.dataTableMultiHeaderLink','click',function(e){
		var dataAttrs  = {
						"id":$(this).data('id'),
						"role":$(this).data('role'),
						"role_desc":$(this).data('role_desc'),
						"name":$(this).data('name'),
						"search_text":$(this).data('search_text'),
						"search_code":$(this).data('search_code'),
						"email": $(this).data('email'),
						"account_name":$(this).data('account_name'),
						"disp_text":$(this).data('disp_text'),
						"group":$(this).data('group'),
						"matchedKey":$(this).data('matchedKey')}
		addSearchMenu(dataAttrs);
	});
	
	//TO TRIGGER COLUMN VISIBILITY WHILE CLICK ON COLLAPSABLE HEADER
	$("body").undelegate(".dataTables_scrollHead .header_main_"+Obj.id.substring(1,Obj.id.length),"click");
    $("body").delegate(".dataTables_scrollHead .header_main_"+Obj.id.substring(1,Obj.id.length),"click",function(e){
		$('#loading_screen').show();
		var thiscls = e.target.className;
		var thisvar = $(this);
		setTimeout(function(){
            cols = thisvar.children('i').data('childcols');
            thisvar.children('i').toggleClass('fa-angle-double-right fa-angle-double-left');
            that_fa = thisvar.children('i');
            $('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' .DT_settings_ul li.DT_col_li').each(function(ind,val){
				li_column = $(this).data('column');
                c = $(this).children('input').prop('checked');
                if(_.indexOf(cols,li_column)>0){
            		if(!$(this).children('input').prop('disabled')){
	                    if($(that_fa).hasClass('fa-angle-double-left')){
	                        if(c==false){
								$(this).find('.columnslichk').prop('checked',!($(this).is(':checked')));
	                            var column = DOMTable.column( $(this).attr('data-column') );
								column.visible( ! column.visible() );
	                            setTimeout(function(){
	                                $('.DT_settings').removeClass('open');
	                            },100);
	                        }
	                    }else{
	                        if(c==true){
								var column = DOMTable.column( $(this).attr('data-column') );
								column.visible( ! column.visible() );
								$(this).find('.columnslichk').prop('checked',$(this).is(':checked'));
	                            setTimeout(function(){
	                                $('.DT_settings').removeClass('open');
	                            },100);    
	                        }
	                    }
	                }
                }
            });
			$('.header_main_'+Obj.id.substring(1,Obj.id.length)).removeClass('fa-angle-double-right').removeClass('fa-angle-double-left');
			
			setTimeout(function(){
				$('#loading_screen').hide();
				$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' div:last-child').removeClass('open');
			},0);
		},0);
    });
	
	//TO CHANGE COLUMN VISIBILITY IN DATATABLES
	$("body").undelegate('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' .DT_default',"click");
	$("body").delegate('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' .DT_default',"click",function(e){
		setTimeout(function(){
			$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' div:last-child').addClass('open');
		}, 0);
	});
	
	//TO CHANGE COLUMN VISIBILITY IN DATATABLES
	$("body").undelegate('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' .DT_li_cols',"click");
	$("body").delegate('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' .DT_li_cols',"click",function(e){
		//log($(this).children('input'));
		//if(e.target.className == "columnslichk"){
			
		//}else{
			if($(this).children('input').prop('checked') || e.target.localName == 'input'){//TO VALIDATE ATLEAST ONE CHECKBOX IS ACTIVE(COMES INSIDE THIS CONDITION ONLY IF CHECKBOX IS UNCHECKED)
				var totChkboxLen = $('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' li input').length; //TO GET TOTAL AVAILABLE CHECKBOXES
				var incChkboxLen = 0;
				var warnMsg = 'Sorry. No more columns to hide!';
				$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' li input').each(function(e){
					if($(this).prop('checked')){
						incChkboxLen++;
					}
				});
				if(e.target.localName == 'input'){
					incChkboxLen = incChkboxLen+1;
				}
				if(totChkboxLen>1 || totChkboxLen==1){
					if(totChkboxLen == 1){
						utils.info_toaster(warnMsg,"w");
						return false;
					}else{
						if((incChkboxLen-1) == 0){
							utils.info_toaster(warnMsg,"w");
							return false;
						}
					}
				}
			}
		//}
		//e.preventDefault();
		setTimeout(function(){
			//$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)).addClass('open');
			$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' div:last-child').addClass('open');
		}, 0);
		var column = DOMTable.column( $(this).attr('data-column') );
		column.visible( ! column.visible() );
		if(e.target.localName != 'input'){ //TO AVOID DOUBLE CLICK WHILE CLICK ON INPUT CHECKBOX
			$(this).children('input').prop('checked',!($(this).children('input').prop('checked')));
		}
		$('.DT_settings_'+Obj.id.substring(1,Obj.id.length)+' .DT_settings_ul li.DT_col_li').each(function(ind,val){
			var c = $(this).children('input').prop('checked')
			data = $(this).data('name');
			title = $(this).data('title');
			$(dropHeads).each(function(index,key){
				if(key.data==data){
					dropHeads[index].checked=c;
					return false;
				}
			})
		});
		
		setTableSettings(Obj,dropHeads)
	});		
	DOMTable.draw(true);//TO RE-DRAW DATATABLE
	
	$('#loading_screen').hide();	
}
//merge the col settings
function mergeSettings(actObj,set){
	try{
		set = JSON.parse(set.column_def);
		table_setting = actObj.table_settings;// checking if the desable or checked settings is changed
		actObj = actObj.columns; // checking the col label and setting label
		var settings = [];
		$(actObj).each(function(ind,ele){
			found = 0;
			$(set).each(function(i,val){//settings stored in DB
				title = (ele.title==undefined)?ele.tit:ele.title;
				isDefault = (ele.isDefault==undefined)?undefined:ele.isDefault;
				if(ele.data === val.data){
					found =1;
					
					if(actObj.length>i){
						if(val.checked==false && table_setting[i].blockchk!='yes'){
							check=false
						}else{
							check=true;
						}
					}else{
						if(val.checked==false && val.blockchk!='yes'){
							check=false
						}else{
							check=true;
						}
					}
					settings.push({"data":ele.data,"checked":check,"title":title,"isDefault":isDefault});
				}
			});
			if(found==0){
				tit = (ele.tit==undefined)?ele.title:ele.tit;
				if(table_setting[ind].blockchk=='yes'){
					check = true
				}else{
					check = false
				}
				settings.push({"data":ele.data,"checked":check,"title":tit,"isDefault":check});
			}
		});
		return settings;
	}catch(e){
		utils.scriptErrorHandling('utils.js' ,'mergeSettings' ,e);
	}
}


function phoneUSFormat(ph,sp){
	var res = ''; 
	sp = (typeof sp !== 'undefined' && sp != '')?sp:'-';
	ph=(ph) ? ph : "";
	
	if(ph.indexOf("-")>-1 || ph.indexOf("(")>-1 || ph.indexOf(")")>-1){
		sp = 'noformat';
	}
	
	if(typeof ph !== 'undefined' && ph !== ''){
		var phREX = ph.replace(/\D[^\.]/g, "");
		if(sp == '()'){
			res = "("+phREX.slice(0,3)+") "+phREX.slice(3,6)+"-"+phREX.slice(6);
		}else if(sp == 'noformat'){
			res = ph;
		}else{
			res = phREX.slice(0,3)+sp+phREX.slice(3,6)+sp+phREX.slice(6);
		}
	}	
    return res;
}



function setTableSettings(Obj,sett) {
	try{
		_server.post({
			url: serviceURLJava+"tableconfig/settblfields",
			data:{"tblid":Obj.id.substring(1,Obj.id.length),"settings":JSON.stringify(sett)},
			success: function (response) {					
			},
			error: function (jqXHR) {
				utils.scriptErrorHandling('utils.js', 'setTableSettings', jqXHR.responseText);
			}
		});	
	}catch(e){
		utils.scriptErrorHandling('utils.js' ,'setTableSettings' ,e);
	}
}
function toggleFullscreen(that){
    var button = $(that);        
    var h =    $(that).parents('.grid-stack-item').attr('data-gs-height');
    var w =    $(that).parents('.grid-stack-item').attr('data-gs-width');
    var x =    $(that).parents('.grid-stack-item').attr('data-gs-x');
    var y =    $(that).parents('.grid-stack-item').attr('data-gs-y');
    var t_h =  $(that).parents('.grid-stack-item').attr('data-t_h');
    var t_w =  $(that).parents('.grid-stack-item').attr('data-t_w');
    var t_x =  $(that).parents('.grid-stack-item').attr('data-t_x');
    var t_y =  $(that).parents('.grid-stack-item').attr('data-t_y');

    $(that).parents('.grid-stack-item').attr('data-gs-height',t_h);
    $(that).parents('.grid-stack-item').attr('data-gs-width',t_w);
    $(that).parents('.grid-stack-item').attr('data-gs-x',t_x);
    $(that).parents('.grid-stack-item').attr('data-gs-y',t_y);
    $(that).parents('.grid-stack-item').attr('data-t_h',h);
    $(that).parents('.grid-stack-item').attr('data-t_w',w);
    $(that).parents('.grid-stack-item').attr('data-t_x',x);
    $(that).parents('.grid-stack-item').attr('data-t_y',y);
    
    $(that).toggleClass('fullscreen');
    $(".grid-stack").toggleClass('ParentgridHt')
    $(that).parents(".ibox ").toggleClass('gridHt')
    $(that).parents('.grid-stack-item').siblings().hide();
    button.toggleClass('fa-expand').toggleClass('fa-compress');
    if(button.hasClass('fa-expand')){
        $(that).parents('.grid-stack-item').siblings().show();
    }else{
        $(that).parents('.grid-stack-item').siblings().hide();
    }
}

//Permission functions
//For making a tab hide when it is active
function activeTab(permission){
	if(permission=='active'){
		return 'hide';	
	}
	
}

function hideTab(permission,type,id){
	if( hideTabId != id){
		tabactive = true;
		tabDescActive = true;
		hideTabId = id;
	}
	if(Permission.indexOf(permission)>=0 ){
		return " tabHide ";
	}else{
		if(type=="tab" && tabactive){
			tabactive = false;
			return " active ";
		}else if(type=="desc" && tabDescActive){
			tabDescActive = false;
			return " active ";
		}
		return "";		
	}
	
}

function cellEllipse(data,type,pos){
		
		type=(type)?type:"title";
		type=type.toLowerCase();
		var content=data;
		var isHtmlTag = false;
		var result='<span>'+content+'</span>',temp="",start=0,end=10;
		pos= (pos) ? pos :[];
		
		if(pos.length>0){
			start=pos[0];
			end=pos[1];	
		}
		var htmlTagArr = ['<a','<div','<span','</span>','</div>','</a>']; //array used to identify the data is whether it is HTML tag or not;
		for(i=0;i<htmlTagArr.length;i++){
			if( data.indexOf(htmlTagArr[i]) >= 0){
			//log("break")
				isHtmlTag = true;
				break;
			}
		}
	    if(isHtmlTag){
			content = $(data).text(); //If HTML tag, We take the value 
			type = "hyperlink"; //If HTML tag, We take the value 
		}
		if(typeof content != 'undefined' &&  content != 'null' &&  content != null && content.length>end){		
			switch(type){
				case "title":
				 temp=content.substring(start,end);
				 result='<span title="'+content+'">'+temp+'...</span>';		
				break;
				case "tooltip":
				 temp=content.substring(start,end);
				 result='<span class="tooltipCustom ">'+temp+'...<span class="tooltiptext prewrap">'+content+'</span>';		
				break;				
				case "hyperlink":
				 temp=content.substring(start,end);
				 result=$(data).text(temp);		
				 result=$(data).attr('title', content);	
				break;
				default:
				break;
			}
		}
		
		return result;
	}

	return {
		CommonNumberFormatWithOutSuffix:CommonNumberFormatWithOutSuffix,
		DrawDatatable: DrawDatatable,
		DrawServerSideDatatable: DrawServerSideDatatable,
		NumberFormat: NumberFormat,
		NumberFormatWithOutSuffix: NumberFormatWithOutSuffix,
		NumberFormatter: NumberFormatter,
		arrObjSearch  : arrObjSearch,
		asyncCalls:asyncCalls,
		callAjax	: callAjax,
		cellEllipse:cellEllipse,
		chartGrid	: chartGrid,
		chartGridPop:chartGridPop,
		checkFile	: checkFile,
		checkLocalStorage: checkLocalStorage,
		checkValidation:_checkValidation,
		clone		: clone,
		columnSetting: columnSetting,
		commonDecimalNumberFormat: commonDecimalNumberFormat,
		curDate		:curDate,
		curDateTime: curDateTime,
		datatableHeaderNumberFormat: datatableHeaderNumberFormat,
		datatableNumberFormat:datatableNumberFormat,
		datatableScrollToTop:datatableScrollToTop,
		datePickerRanges:datePickerRanges,
		dayFormat:dayFormat,
		decimalNumberFormat: decimalNumberFormat,
		doFormat  : doFormat,
		drawTable	  :  drawTable,
		emptyDiv: emptyDiv,
		errorCallback : errorCallback,
		exportTable	:exportTable,
		fillgridPanel: fillgridPanel,
		findMax2dArr  : findMax2dArr,
		findMin2dArr  : findMin2dArr,
		formatNumber  : formatNumber,
		formatTable	  :  formatTable,
		generateAddAccountPopup:generateAddAccountPopup,
		getHtmlName: getHtmlName,
		getParameterByName:getParameterByName,
		getURLExt: getURLExt,
		headerNameLength : headerNameLength,
		info_toaster: info_toaster,
		negativeNumbersCheck: negativeNumbersCheck,
		negativeValueCheck: negativeValueCheck,
		notification: notification,
		notify:notify,
		phoneUSFormat:phoneUSFormat,
		removeByAttr  : removeByAttr,
		resizeDT	  :  _resizeDT,
		scriptErrorHandling:scriptErrorHandling,
		searchStringURL:searchStringURL,
		setReportCallbacks: setReportCallbacks,
		showDialog:showDialog,
		show_getCredentials:show_getCredentials,
		status	: showStatus,
		subtractDates:subtractDates,
		svg2dataURI: svg2dataURI,
		toggleFullscreen: toggleFullscreen,
		triggerTab: triggerTab,
		url	: url,
		usrProfile	  : usrProfile,
		validateCharSet:_validateCharSet,
		hideTab:hideTab
	}
  
})();

function log(message){
	if(window.console != undefined) console.log(message);
}
 