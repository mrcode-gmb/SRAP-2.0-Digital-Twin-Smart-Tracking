<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::with('department')
            ->orderBy('created_at', 'desc');

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by department
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(20)->withQueryString();
        $departments = Department::active()->get(['id', 'name']);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'departments' => $departments,
            'filters' => $request->only(['role', 'department_id', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        $departments = Department::active()->get(['id', 'name']);
        
        return Inertia::render('Admin/Users/Create', [
            'departments' => $departments
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,strategy_team,department_user,data_analyst,cybersecurity_specialist,ai_developer,hod,data_officer',
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'department_id' => $validated['department_id'],
            'email_verified_at' => now()
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        $user->load(['department', 'createdKpis', 'assignedMilestones', 'kpiProgress']);
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified user
     */
    public function edit(User $user)
    {
        $departments = Department::active()->get(['id', 'name']);
        
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'departments' => $departments
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:admin,strategy_team,department_user,data_analyst,cybersecurity_specialist,ai_developer,hod,data_officer',
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'department_id' => $validated['department_id']
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user)
    {
        // Prevent deletion of the last admin user
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return back()->with('error', 'Cannot delete the last admin user.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Bulk actions for users
     */
    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:delete,change_role,change_department',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'role' => 'nullable|in:admin,strategy_team,department_user,data_analyst,cybersecurity_specialist,ai_developer',
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $users = User::whereIn('id', $validated['user_ids']);

        switch ($validated['action']) {
            case 'delete':
                // Prevent deletion if it would remove all admin users
                $adminCount = User::where('role', 'admin')->count();
                $adminsToDelete = $users->where('role', 'admin')->count();
                
                if ($adminCount - $adminsToDelete < 1) {
                    return back()->with('error', 'Cannot delete all admin users.');
                }
                
                $users->delete();
                $message = 'Selected users deleted successfully.';
                break;
                
            case 'change_role':
                $users->update(['role' => $validated['role']]);
                $message = 'User roles updated successfully.';
                break;
                
            case 'change_department':
                $users->update(['department_id' => $validated['department_id']]);
                $message = 'User departments updated successfully.';
                break;
        }

        return back()->with('success', $message);
    }

    /**
     * Reset user password
     */
    public function resetPassword(User $user)
    {
        $temporaryPassword = 'temp_' . uniqid();
        
        $user->update([
            'password' => Hash::make($temporaryPassword),
            'email_verified_at' => null // Force email verification
        ]);

        // In a real application, you would send this password via email
        // For now, we'll return it in the response (not recommended for production)
        
        return back()->with('success', "Password reset successfully. Temporary password: {$temporaryPassword}");
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(User $user)
    {
        // Prevent deactivating the last admin user
        if ($user->role === 'admin' && User::where('role', 'admin')->where('id', '!=', $user->id)->count() < 1) {
            return back()->with('error', 'Cannot deactivate the last admin user.');
        }

        $user->update([
            'active' => !$user->active
        ]);

        $status = $user->active ? 'activated' : 'deactivated';
        return back()->with('success', "User {$status} successfully.");
    }

    /**
     * Export users to Excel
     */
    public function export(Request $request)
    {
        $query = User::with('department');

        // Apply same filters as index
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->get();
        
        // This would use a UserExport class similar to KpiReportExport
        // return Excel::download(new UserExport($users), 'users.xlsx');
        
        return back()->with('info', 'Export functionality will be implemented with UserExport class.');
    }
}
