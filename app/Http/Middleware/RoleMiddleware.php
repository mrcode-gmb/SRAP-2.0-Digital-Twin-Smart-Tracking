<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Admin bypass only if route allows admin or no roles specified
        if ($user->role === 'admin') {
            if (empty($roles) || in_array('admin', $roles)) {
                return $next($request);
            }
            // else fall through to normal role check (admin will be rejected if not listed)
        }

        if (!$user->hasAnyRole($roles)) {
            abort(403, 'Unauthorized access. You do not have permission to access this resource.');
        }
        return $next($request);
    }
}
