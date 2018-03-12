<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use DB;
use Hash;
class residential extends BaseController
{
	public function addResidential(Request $request){
		// return response()->json(json_decode($request["propertyData"]));
		$result = DB::table("df_residential_prop")->insert((array)json_decode($request["propertyData"]));
		if($result){
			return response()->json(["message"=>"Property Added","status"=>1]);
		}else{
			return response()->json(["message"=>"Property Not Added","status"=>0]);
		}
	}
}
