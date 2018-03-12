<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use DB;
use Hash;
class userController extends BaseController
{
	public function login(Request $request){
		$result = DB::table("gf_user")
				->select("user_id","name","user_code","password")
				->where(["user_code"=>$request["uname"]])
				->first();
		if($result){
			if( Hash::check($request["pass"],$result->password)){
				$ip = $request->ip();
				$hash = Hash::make($result->user_id.$result->user_code.$result->password.$ip);
				DB::table("gf_auth_token")->where(["user_id"=>$result->user_id,"ip_address"=>$ip])->delete();
				DB::table("gf_auth_token")->insert(["user_id"=>$result->user_id,"auth_token"=>$hash,"ip_address"=>$ip]);
				
				return response()->json(["auth_token"=>$hash,"name"=>$result->name,"status"=>1]);
			}
			return response()->json(["status"=>0]);
		}
			return response()->json(["status"=>0]);
	}
}
