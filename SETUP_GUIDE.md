# NITDA SRAP 2.0 Dashboard - Setup Guide

## Overview
This is a complete role-based smart tracking dashboard built with Laravel 12, Laravel Breeze, Inertia.js, React, and TailwindCSS. The application features role-based access control, modern UI with dark/light mode, and specialized dashboards for different user roles.

## Prerequisites
- PHP 8.2 or higher
- Node.js 18 or higher
- Composer
- SQLite or MySQL database

## Installation Steps

### 1. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2. Database Setup
```bash
# Create SQLite database (if using SQLite)
touch database/database.sqlite

# Run migrations to create tables
php artisan migrate

# (Optional) Seed the database
php artisan db:seed
```

### 3. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 4. Build Assets
```bash
# Build assets for development
npm run dev

# Or build for production
npm run build
```

### 5. Start Development Servers
```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server (if using npm run dev)
npm run dev
```

## User Roles & Access

The application supports 5 different user roles:

### 1. **Admin**
- **Access**: User Management, System Settings
- **Routes**: `/dashboard/admin/users`, `/dashboard/admin/settings`
- **Features**: User list with role management, system configuration

### 2. **Researcher**
- **Access**: Data Upload, Research Reports
- **Routes**: `/dashboard/researcher/upload`, `/dashboard/researcher/reports`
- **Features**: File upload interface, upload history, data validation

### 3. **Data Analyst**
- **Access**: Analytics Dashboard, KPI Reports
- **Routes**: `/dashboard/analyst/analytics`, `/dashboard/analyst/kpi`
- **Features**: Performance metrics, data insights, exportable reports

### 4. **Cybersecurity Specialist**
- **Access**: Security Overview, API Monitoring
- **Routes**: `/dashboard/security/overview`, `/dashboard/security/api`
- **Features**: Security alerts, threat detection, API status monitoring

### 5. **AI Developer**
- **Access**: AI Chatbot Testing, AI Models
- **Routes**: `/dashboard/ai/chatbot`, `/dashboard/ai/models`
- **Features**: Interactive chatbot interface, performance analytics

## Key Features

### Authentication
- **Login/Register**: Modern UI with role selection
- **Password Reset**: Secure password recovery flow
- **Role-based Access**: Middleware protection for all routes

### UI/UX
- **Dark/Light Mode**: System-wide theme toggle
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion throughout
- **Modern Components**: TailwindCSS + shadcn/ui styling

### Security
- **Role Middleware**: Protects routes based on user roles
- **403 Error Page**: Professional unauthorized access handling
- **CSRF Protection**: Laravel's built-in security features

## Database Schema

### Users Table
```sql
- id (primary key)
- name (string)
- email (string, unique)
- email_verified_at (timestamp)
- password (string)
- role (enum: admin, researcher, data_analyst, cybersecurity_specialist, ai_developer)
- remember_token (string)
- created_at (timestamp)
- updated_at (timestamp)
```

## File Structure

```
resources/js/
├── Components/
│   ├── ui/                 # Reusable UI components
│   └── ThemeProvider.jsx   # Dark/light mode context
├── Layouts/
│   └── AuthenticatedLayout.jsx  # Main app layout
├── Pages/
│   ├── Auth/              # Authentication pages
│   ├── Admin/             # Admin dashboard pages
│   ├── Researcher/        # Researcher dashboard pages
│   ├── Analyst/           # Data analyst dashboard pages
│   ├── Security/          # Cybersecurity dashboard pages
│   ├── AI/                # AI developer dashboard pages
│   ├── Error/             # Error pages (403, etc.)
│   └── Dashboard.jsx      # Main welcome dashboard
└── lib/
    └── utils.js           # Utility functions
```

## Configuration Files

### TailwindCSS (`tailwind.config.js`)
- Dark mode enabled with 'class' strategy
- Custom color palette and animations
- Extended theme configuration

### Vite (`vite.config.js`)
- Laravel plugin configuration
- React support
- Hot module replacement

## Testing User Accounts

To test different roles, create users with the following roles:
- `admin`
- `researcher`
- `data_analyst`
- `cybersecurity_specialist`
- `ai_developer`

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite file exists: `touch database/database.sqlite`
   - Or configure MySQL in `.env` file

2. **Assets Not Loading**
   - Run `npm run build` for production
   - Or `npm run dev` for development with hot reload

3. **Permission Errors**
   - Ensure storage and bootstrap/cache directories are writable
   - Run `php artisan storage:link` if needed

4. **Role Access Issues**
   - Verify user has correct role in database
   - Check middleware configuration in `routes/web.php`

## Development Commands

```bash
# Clear application cache
php artisan cache:clear

# Clear configuration cache
php artisan config:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Run tests
php artisan test

# Check code style
npm run lint
```

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Run `php artisan view:cache`
6. Run `npm run build`
7. Configure web server (Apache/Nginx)

## Support

For issues or questions:
1. Check the Laravel documentation: https://laravel.com/docs
2. Check the Inertia.js documentation: https://inertiajs.com
3. Review the application logs in `storage/logs/`

---

**Built with ❤️ for NITDA SRAP 2.0**
