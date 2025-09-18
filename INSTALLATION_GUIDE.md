# NITDA SRAP 2.0 Smart Tracking Dashboard - Installation Guide

## System Requirements

### Server Requirements
- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **PHP**: Version 8.3 or higher
- **Database**: MySQL 8.0+ or MariaDB 10.4+
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space (20GB recommended)
- **SSL Certificate**: Required for production deployment

### PHP Extensions Required
```bash
php-cli
php-fpm
php-mysql
php-zip
php-gd
php-mbstring
php-curl
php-xml
php-bcmath
php-json
php-tokenizer
php-fileinfo
php-openssl
```

### Development Tools
- **Composer**: PHP dependency manager (latest version)
- **Node.js**: Version 18+ with NPM
- **Git**: Version control system

---

## Pre-Installation Setup

### 1. Update System Packages
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 2. Install Web Server (Apache Example)
```bash
# Ubuntu/Debian
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod ssl
sudo systemctl restart apache2
```

### 3. Install PHP 8.3
```bash
# Ubuntu/Debian
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.3 php8.3-fpm php8.3-mysql php8.3-zip php8.3-gd php8.3-mbstring php8.3-curl php8.3-xml php8.3-bcmath php8.3-json php8.3-tokenizer php8.3-fileinfo php8.3-openssl -y
```

### 4. Install MySQL
```bash
# Ubuntu/Debian
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql

# Secure installation
sudo mysql_secure_installation
```

### 5. Install Composer
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
```

### 6. Install Node.js and NPM
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node --version
npm --version
```

---

## Database Setup

### 1. Create Database and User
```sql
-- Login to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE nitda_srap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER 'nitda_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON nitda_srap_db.* TO 'nitda_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2. Verify Database Connection
```bash
mysql -u nitda_user -p nitda_srap_db
```

---

## Application Installation

### 1. Clone Repository
```bash
# Navigate to web directory
cd /var/www/html

# Clone the project (replace with actual repository URL)
sudo git clone https://github.com/your-org/kpi-nitda-project.git
sudo mv kpi-nitda-project nitda-srap

# Set ownership
sudo chown -R www-data:www-data nitda-srap
cd nitda-srap
```

### 2. Install PHP Dependencies
```bash
# Install Composer dependencies
composer install --optimize-autoloader --no-dev

# Generate application key
php artisan key:generate
```

### 3. Install Node.js Dependencies
```bash
# Install NPM packages
npm install

# Build assets for production
npm run build
```

### 4. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### 5. Configure Environment Variables
Edit the `.env` file with your specific settings:

```env
APP_NAME="NITDA SRAP 2.0 Dashboard"
APP_ENV=production
APP_KEY=base64:your_generated_key_here
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nitda_srap_db
DB_USERNAME=nitda_user
DB_PASSWORD=secure_password_here

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 6. Database Migration and Seeding
```bash
# Run database migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Web Server Configuration

### Apache Virtual Host Configuration
Create `/etc/apache2/sites-available/nitda-srap.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/nitda-srap/public
    
    <Directory /var/www/html/nitda-srap/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/nitda-srap-error.log
    CustomLog ${APACHE_LOG_DIR}/nitda-srap-access.log combined
    
    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/nitda-srap/public
    
    <Directory /var/www/html/nitda-srap/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    SSLCertificateChainFile /path/to/your/ca-bundle.crt
    
    # Security Headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    ErrorLog ${APACHE_LOG_DIR}/nitda-srap-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/nitda-srap-ssl-access.log combined
</VirtualHost>
```

### Enable Site and Restart Apache
```bash
# Enable the site
sudo a2ensite nitda-srap.conf

# Disable default site
sudo a2dissite 000-default.conf

# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

---

## File Permissions and Security

### 1. Set Proper Permissions
```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/html/nitda-srap

# Set directory permissions
sudo find /var/www/html/nitda-srap -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/html/nitda-srap -type f -exec chmod 644 {} \;

# Set executable permissions for artisan
sudo chmod +x /var/www/html/nitda-srap/artisan

# Set writable permissions for storage and cache
sudo chmod -R 775 /var/www/html/nitda-srap/storage
sudo chmod -R 775 /var/www/html/nitda-srap/bootstrap/cache
```

### 2. Secure Sensitive Files
```bash
# Protect .env file
sudo chmod 600 /var/www/html/nitda-srap/.env

# Protect composer files
sudo chmod 644 /var/www/html/nitda-srap/composer.json
sudo chmod 644 /var/www/html/nitda-srap/composer.lock
```

---

## SSL Certificate Setup

### Using Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Obtain SSL certificate
sudo certbot --apache -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### Manual Certificate Installation
If you have purchased SSL certificates:

1. Upload certificate files to `/etc/ssl/certs/`
2. Upload private key to `/etc/ssl/private/`
3. Update Apache configuration with correct paths
4. Restart Apache

---

## Performance Optimization

### 1. Enable PHP OPcache
Edit `/etc/php/8.3/apache2/php.ini`:

```ini
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### 2. Configure MySQL for Performance
Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
query_cache_type = 1
query_cache_size = 64M
```

### 3. Enable Gzip Compression
Add to Apache configuration:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

---

## Backup Configuration

### 1. Database Backup Script
Create `/usr/local/bin/backup-nitda-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/nitda-srap"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="nitda_srap_db"
DB_USER="nitda_user"
DB_PASS="secure_password_here"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Database backup completed: $BACKUP_DIR/db_backup_$DATE.sql.gz"
```

### 2. File Backup Script
Create `/usr/local/bin/backup-nitda-files.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/nitda-srap"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/var/www/html/nitda-srap"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create file backup (excluding vendor and node_modules)
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz \
    --exclude='vendor' \
    --exclude='node_modules' \
    --exclude='storage/logs/*' \
    --exclude='storage/framework/cache/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/views/*' \
    -C /var/www/html nitda-srap

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "File backup completed: $BACKUP_DIR/files_backup_$DATE.tar.gz"
```

### 3. Schedule Backups with Cron
```bash
# Edit crontab
sudo crontab -e

# Add backup jobs
0 2 * * * /usr/local/bin/backup-nitda-db.sh
0 3 * * * /usr/local/bin/backup-nitda-files.sh
```

---

## Monitoring and Logging

### 1. Log Rotation Configuration
Create `/etc/logrotate.d/nitda-srap`:

```
/var/www/html/nitda-srap/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 2. System Monitoring
Install monitoring tools:

```bash
# Install htop for system monitoring
sudo apt install htop -y

# Install MySQL monitoring
sudo apt install mytop -y

# Install Apache monitoring tools
sudo apt install apache2-utils -y
```

---

## Testing Installation

### 1. Basic Functionality Test
```bash
# Test artisan commands
php artisan --version
php artisan route:list
php artisan config:show

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

### 2. Web Interface Test
1. Open browser and navigate to your domain
2. Verify SSL certificate is working
3. Test login with default admin credentials:
   - Email: admin@nitda.gov.ng
   - Password: password123
4. Navigate through different sections
5. Test KPI creation and editing
6. Verify reports generation
7. Test chatbot functionality

### 3. Performance Test
```bash
# Test Apache configuration
sudo apache2ctl configtest

# Check PHP configuration
php -m | grep -E "(mysql|gd|curl|zip)"

# Test database performance
mysql -u nitda_user -p nitda_srap_db -e "SHOW PROCESSLIST;"
```

---

## Post-Installation Tasks

### 1. Create Admin User
```bash
# Create admin user via artisan command
php artisan tinker

>>> $user = new App\Models\User();
>>> $user->name = 'System Administrator';
>>> $user->email = 'admin@nitda.gov.ng';
>>> $user->password = Hash::make('secure_admin_password');
>>> $user->role = 'admin';
>>> $user->department_id = 1;
>>> $user->save();
>>> exit
```

### 2. Configure Email Settings
Test email functionality:

```bash
php artisan tinker

>>> Mail::raw('Test email from NITDA SRAP Dashboard', function($message) {
>>>     $message->to('test@example.com')->subject('Test Email');
>>> });
>>> exit
```

### 3. Set Up Scheduled Tasks
Add to crontab:

```bash
# Edit crontab for www-data user
sudo crontab -u www-data -e

# Add Laravel scheduler
* * * * * cd /var/www/html/nitda-srap && php artisan schedule:run >> /dev/null 2>&1
```

---

## Troubleshooting Common Issues

### Permission Issues
```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/

# Fix bootstrap cache permissions
sudo chown -R www-data:www-data bootstrap/cache/
sudo chmod -R 775 bootstrap/cache/
```

### Database Connection Issues
```bash
# Test database connection
mysql -u nitda_user -p nitda_srap_db

# Check Laravel database configuration
php artisan config:show database
```

### Apache Issues
```bash
# Check Apache error logs
sudo tail -f /var/log/apache2/error.log

# Test Apache configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

### PHP Issues
```bash
# Check PHP error logs
sudo tail -f /var/log/apache2/error.log

# Verify PHP modules
php -m

# Check PHP configuration
php --ini
```

---

## Security Checklist

- [ ] SSL certificate installed and configured
- [ ] Database user has minimal required privileges
- [ ] .env file has restricted permissions (600)
- [ ] Storage directories have proper permissions
- [ ] Apache security headers configured
- [ ] PHP security settings configured
- [ ] Regular backups scheduled
- [ ] Log rotation configured
- [ ] Firewall configured (if applicable)
- [ ] Default passwords changed
- [ ] Error reporting disabled in production
- [ ] Debug mode disabled in production

---

## Maintenance Tasks

### Daily
- Monitor system logs for errors
- Check disk space usage
- Verify backup completion

### Weekly
- Review application logs
- Check database performance
- Update system packages
- Test backup restoration

### Monthly
- Review user accounts and permissions
- Update SSL certificates if needed
- Performance optimization review
- Security audit

---

## Support and Documentation

### Getting Help
- Check application logs: `/var/www/html/nitda-srap/storage/logs/`
- Review Apache logs: `/var/log/apache2/`
- Check MySQL logs: `/var/log/mysql/`
- Consult Laravel documentation: https://laravel.com/docs

### Additional Resources
- PROJECT_DOCUMENTATION.md: Complete project overview
- USER_GUIDE.md: End-user instructions
- TECHNICAL_REPORT.md: Technical implementation details
- Laravel Documentation: Framework-specific help

---

*Installation Guide Version 1.0*
*Last Updated: September 2025*
