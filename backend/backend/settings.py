import os
import ssl
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file (primarily for local development)
load_dotenv(BASE_DIR / '.env')


def parse_bool(val, default=False):
    """Safely parse boolean values from environment variables."""
    if val is None:
        return default
    return str(val).strip().lower() in ('true', '1', 't', 'yes', 'y', 'on')


# DEBUG setting: defaults to False in production
DEBUG = parse_bool(os.getenv('DEBUG'), default=False)

# SECRET_KEY: must be provided and secure when DEBUG is False
INSECURE_SECRET_KEYS = {
    'django-insecure-default-key-change-me',
    'your-django-secret-key-here',
    'django-insecure-',
    '',
}

SECRET_KEY = os.getenv('SECRET_KEY')
if not DEBUG:
    if not SECRET_KEY or SECRET_KEY in INSECURE_SECRET_KEYS or len(SECRET_KEY) < 32 or SECRET_KEY.startswith('django-insecure-'):
        raise ImproperlyConfigured(
            "Production security error: A secure, high-entropy SECRET_KEY environment variable "
            "must be configured when DEBUG is False."
        )
else:
    if not SECRET_KEY:
        SECRET_KEY = 'django-insecure-default-key-change-me'

# ALLOWED_HOSTS configuration
allowed_hosts_env = os.getenv('ALLOWED_HOSTS', '')
if allowed_hosts_env.strip():
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_env.split(',') if host.strip()]
elif DEBUG:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']
else:
    ALLOWED_HOSTS = []

# Support Render external hostname automatically if present
render_external_hostname = os.getenv('RENDER_EXTERNAL_HOSTNAME')
if render_external_hostname and render_external_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_external_hostname)

# Support loopback for local health checks and container probes
for loopback in ['localhost', '127.0.0.1', '[::1]', 'testserver']:
    if loopback not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(loopback)


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    
    # Internal apps
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database Configuration - Strictly MySQL engine
DB_NAME = os.getenv('DB_NAME', 'struggle_of_student')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_SSL_CA = os.getenv('DB_SSL_CA')

DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    import dj_database_url
    db_config = dj_database_url.parse(DATABASE_URL)
    # Ensure MySQL engine is strictly retained
    db_config['ENGINE'] = 'django.db.backends.mysql'
    db_config.setdefault('OPTIONS', {
        'charset': 'utf8mb4',
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
    })
    DATABASES = {'default': db_config}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': DB_NAME,
            'USER': DB_USER,
            'PASSWORD': DB_PASSWORD,
            'HOST': DB_HOST,
            'PORT': str(DB_PORT),
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

# SSL CA configuration for managed cloud MySQL (e.g., Aiven)
if DB_SSL_CA and DB_SSL_CA.strip():
    ca_path = DB_SSL_CA.strip()
    if os.path.exists(ca_path):
        ca_path = os.path.abspath(ca_path)
    elif (BASE_DIR / ca_path).exists():
        ca_path = str(BASE_DIR / ca_path)

    ssl_options = DATABASES['default']['OPTIONS'].setdefault('ssl', {})
    ssl_options.update({
        'ca': ca_path,
        'check_hostname': True,
        'verify_mode': ssl.CERT_REQUIRED,
    })

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files handling (WhiteNoise for production static serving)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}

# Media files handling
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = parse_bool(os.getenv('CORS_ALLOW_ALL_ORIGINS'), default=False)

DEFAULT_CORS_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

cors_env = os.getenv('CORS_ALLOWED_ORIGINS', '')
if cors_env.strip():
    configured_cors = [origin.strip() for origin in cors_env.split(',') if origin.strip()]
else:
    configured_cors = []

CORS_ALLOWED_ORIGINS = list(dict.fromkeys(DEFAULT_CORS_ORIGINS + configured_cors))
CORS_ALLOW_CREDENTIALS = True

cors_regexes_env = os.getenv('CORS_ALLOWED_ORIGIN_REGEXES', '')
if cors_regexes_env.strip():
    CORS_ALLOWED_ORIGIN_REGEXES = [r.strip() for r in cors_regexes_env.split(',') if r.strip()]

# CSRF Trusted Origins (required for Django cross-origin POST/PUT/DELETE requests)
csrf_trusted_env = os.getenv('CSRF_TRUSTED_ORIGINS', '')
if csrf_trusted_env.strip():
    CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_trusted_env.split(',') if origin.strip()]
else:
    CSRF_TRUSTED_ORIGINS = []

# Merge CORS allowed origins and Render external host into CSRF_TRUSTED_ORIGINS
for origin in CORS_ALLOWED_ORIGINS:
    if (origin.startswith('http://') or origin.startswith('https://')) and origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(origin)

if render_external_hostname:
    render_origin = f"https://{render_external_hostname}"
    if render_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(render_origin)

# Production reverse-proxy security settings
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = parse_bool(os.getenv('SESSION_COOKIE_SECURE'), default=True)
    CSRF_COOKIE_SECURE = parse_bool(os.getenv('CSRF_COOKIE_SECURE'), default=True)
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    
    if parse_bool(os.getenv('SECURE_HSTS_ENABLE'), default=False):
        SECURE_HSTS_SECONDS = int(os.getenv('SECURE_HSTS_SECONDS', '31536000'))
        SECURE_HSTS_INCLUDE_SUBDOMAINS = True
        SECURE_HSTS_PRELOAD = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Production Logging Configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}


