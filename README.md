A full-stack budget management web application built using React (Vite) for the frontend and Django REST Framework for the backend. The app includes user authentication using token-based cookies, and allows users to manage budgets, incomes, expenses, and categories securely.

🔧 Technologies Used

🔹 Frontend

React.js (with Vite)

React Router

Bootstrap

Fetch API

🔹 Backend

Django

Django REST Framework

Token Authentication

CORS Headers

🚀 Setup Instructions

🔹 Backend (Django)

python -m venv venv

source venv/bin/activate  

Install dependencies:

pip install -r requirements.txt

Run migrations:

python manage.py makemigrations

python manage.py migrate

Start the server:

python manage.py runserver

.env example:

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://example.com


🔹 Frontend (React)

Install dependencies:

npm install

.env file: (Note: don't forget to add /api at the end of your URL, as it is the endpoint connected with Backend)

VITE_API_BASE_URL=http://localhost:8000/api  

Run the development server:

npm run dev


Credit: ChatGPT
A big thanks to ChatGPT by OpenAI for providing guidance and suggestions throughout the development of this project — from architectural decisions to implementation of tricky authentication flows.

🛡️ Note

This is a development project. In production, consider:

Using HTTPS

Setting secure=True for cookies

Using PostgreSQL or MySQL instead of SQLite

Using a production WSGI server (like Gunicorn)
