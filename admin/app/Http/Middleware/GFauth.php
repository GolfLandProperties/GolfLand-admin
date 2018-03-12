<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use DB;
class GFauth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        
		$ip = $request->ip();
		$auth_token = $request["auth_token"];
		$result = DB::table("gf_auth_token")
					->select("user_id")
					->where(["auth_token"=>$auth_token,"ip_address"=>$ip])
					->first();
		if($result){
			return $next($request);
		}else{
			abort(403, 'Access denied');
		}
    }
}
