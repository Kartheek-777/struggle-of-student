# Struggle of Student (SS)

A full-stack web platform built with **Django REST Framework** and **React (Vite)**.

## Project Structure

```text
SS/
├── backend/            # Django REST API backend
│   ├── api/            # API endpoints, serializers, models
│   ├── backend/        # Django project settings & configuration
│   ├── manage.py       # Django CLI
│   └── requirements.txt# Python dependencies
├── frontend/           # React + Vite frontend application
│   ├── src/            # Components, pages, styles, assets
│   ├── package.json    # Frontend dependencies and scripts
│   └── vite.config.js  # Vite build configuration
└── .gitignore          # Root gitignore rules
```

---

## Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- MySQL server (or compatible database)

---

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

5. **Apply Database Migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Start the Django Development Server:**
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://127.0.0.1:8000/`.

---

### 3. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173/`.

