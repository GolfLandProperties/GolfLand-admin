function addComercialForm(id){
var tmpHtml = ''+
	'<table>'+
		'<tr>'+
			'<td><label>Property Type</label></td>'+
			'<td>'+
				'<div class=""><select type="select" class="form-control res_form_input" data-column ="property_type" >'+
					'<option>Flat/Appartment</option>'+
					'<option>Villa</option>'+
					'<option>Studion Appartment</option>'+
					'<option>Partitioned Villa</option>'+
				'</select></div>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Property For</label></td>'+
			'<td>'+
				'<div class=""><select type="select" class="form-control res_form_input" data-column ="property_for" >'+
					'<option>Rent</option>'+
					'<option>Sale</option>'+
				'</select></div>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Property Name</label></td>'+
			'<td><input type="text" data-column ="property_name" class="form-control res_form_input"></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Contact Email</label></td>'+
			'<td><input type="text" data-column ="property_cont_name" class="form-control res_form_input"></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Contact Phone</label></td>'+
			'<td><input type="text" data-column ="property_cont_phone" class="form-control res_form_input"></td>'+
		'</tr>'+
		// '<tr>'+
			// '<td><label>Area</label></td>'+
			// '<td><input type="text"  id="'+id+'_area" data-column ="area" class="form-control res_form_input"></td>'+
		// '</tr>'+
		'<tr>'+
			'<td><label>City</label></td>'+
			'<td><input type="text"  data-column ="city"  class="form-control res_form_input"></td>'+
		'</tr>'+
		// '<tr>'+
			// '<td><label>PB No</label></td>'+
			// '<td><input type="text"  data-column ="pbNo"  class="form-control res_form_input"></td>'+
		// '</tr>'+
		'<tr>'+
			'<td><label>Select City</label></td>'+
			'<td><div class=""><select type="select" class="form-control res_form_input" data-column ="emirates" >'+
				'<option>Abu Dhabi</option>'+
				'<option>Dubai</option>'+
				'<option>Sharjah</option>'+
				'<option>Ras Al Khaima</option>'+
				'<option>Ajman</option>'+
				'<option>Umm Al Quwain</option>'+
				'<option>Fujairah</option>'+
				'<option>Al Ain</option>'+
			'</select></div></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Location</label></td>'+
			'<td><input type="text"  data-column ="location"  class="form-control res_form_input"></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Nearest City</label></td>'+
			'<td><input type="text"  data-column ="nearest_city"  class="form-control res_form_input"></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Floor No</label></td>'+
			'<td><input type="text"  data-column ="floor_no"  class="form-control res_form_input"></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Size Of Room</label></td>'+
			'<td><div class="input-group "><input type="text"  data-column ="size_of_room"  class="form-control res_form_input"><span class="input-group-addon">sqft</span><div></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>No Of Room</label></td>'+
			'<td><div class="input-group"><input type="text"  data-column ="number_of_room"  class="form-control res_form_input"><span class="input-group-addon">AED</span><div></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Deposit</label></td>'+
			'<td><div class="input-group"><input type="text" data-column ="deposit"  class="form-control res_form_input"><span class="input-group-addon">AED</span><div></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Rent</label></td>'+
			'<td><div class=""><input type="text"  data-column ="rent"  class="form-control res_form_input"></div>'+
			'<label>'+
				'<input type="checkbox" data-column ="is_negotiable" value="" class="res_form_input">Is Negotiaable'+
			'</label></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Rent Type</label></td>'+
			'<td><div class=" "><select type="select" class="form-control res_form_input" data-column ="rent_type" >'+
				'<option>Yearly</option>'+
				'<option>Quarterly</option>'+
				'<option>Monthly</option>'+
			'</select></div></td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Parking</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="parking" class="res_form_input" name="rdoParking" id="parkinYes" value="1" checked>Yes'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="parking" class="res_form_input" name="rdoParking" id="ParkingNo" value="0">No'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Nature Of Building</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="nature_of_building" class="res_form_input"  name="rdoNatOfBui" id="nature_of_building_yes" value="1" checked>New'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio"  data-column="nature_of_building" class="res_form_input"  name="rdoNatOfBui" id="nature_of_building_no" value="0">Old'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Furnished</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio"  data-column="furnished" class="res_form_input"  name="rdoFurnished" id="FurnishedYes" value="1" checked>Yes'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="furnished" class="res_form_input" name="rdoFurnished" id="furnishedNo" value="0">No'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Electricity And Water</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio" class="res_form_input" data-column="electricty_and_water_included" name="rdoEandW" id="electric_and_water_yes" value="1" checked>Include'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio" class="res_form_input" data-column="electricty_and_water_included" name="rdoEandW" id="electric_and_water_No" value="0">Not Include'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Bathroom Attached</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio" class="res_form_input" data-column="bathroom_attached" name="rdoBathroomAtt" id="bathroomAttached_yes" value="1" checked>Yes'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio" class="res_form_input" data-column="bathroom_attached" name="rdoBathroomAtt" id="bathroomAttached_No" value="0">No'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Play Area</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="play_area" class="res_form_input" name="rdoPlayAres" id="playAreaYes" value="1" checked>Yes'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="play_area" class="res_form_input"  name="rdoPlayAres" id="playAreaNo" value="0">No'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr>'+
			'<td><label>Agreement</label></td>'+
			'<td>'+
				'<label class="radio-inline">'+
					'<input type="radio"  data-column="agreement" name="rdoAgreement" class="res_form_input" id="agreementYes" value="1" checked>Yes'+
				'</label>'+
				'<label class="radio-inline">'+
					'<input type="radio" data-column="agreement" name="rdoAgreement" id="agreementNo" class="res_form_input" value="0">No'+
				'</label>'+
			'</td>'+
		'</tr>'+
		'<tr><td colspan="2" style="text-align:center;"><button class="btn btn-primary" id="res_add">Add</button>&nbsp;&nbsp;&nbsp;<button  class="btn btn-secondary">Reset</button> </td></tr>'+
	'</table>';
	
	$("#"+id).html(tmpHtml);
	$(document).delegate("#res_add","click",function(){
		var data = {};
		var pro = true;
		$(".res_form_input").each(function(ind,val){
			var type = $(this).attr("type");
			var columnKey = $(this).data("column");
			if(type == "text"){
				if($(this).val().trim()==""){
					utils.info_toaster( $(this).parents("td").siblings().children().html()+" Should Not Empty","","e" );
					pro=false;
				}
				data[ columnKey ] = $(this).val().trim();
			}else if(type == "select"){
				data[ columnKey ] = $(this).val().trim();				
			}else if(type == "radio"){
					data[ columnKey ]=$("input[name='"+$(this).attr('name')+"']:checked").val();
			}else if( type == "checkbox" ){
				if( $(this).is(':checked') ){
					data[ columnKey ]="1";
				}else{
					data[ columnKey ]="0";
				}
			}
		})
		if(pro){
			var proData = data;
			_server.post({
				url:serviceURL+"property/addResidential",
				data:{propertyData:JSON.stringify(proData)},
				success:function(response){
					if(response.status==1){
						utils.info_toaster(response.message,response.title,"s");
						clearInput("res_form_input")
					}else{
						utils.info_toaster(response.message,response.title,"e")
					}	
				}
			})
		}
	})
}