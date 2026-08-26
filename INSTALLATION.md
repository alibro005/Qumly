<p align="left">
  <img src="frontend/public/favicon.svg" alt="Qumly logo" width="100" height="100">
</p>

# _Installation Guide_

This guide walks you through setting up **Qumly** locally, including the FastAPI backend and React (Vite) frontend.

Qumly lets you ask questions about a MySQL/PostgresSQL database using natural language. It generates SQL, executes the query, and explains the results in a simple, human-readable way.

## _Prerequisites_

Before getting started, make sure you have:

* **Python 3.13+**
* **Node.js 18+** and npm
* **[uv](https://docs.astral.sh/uv/getting-started/installation/)** recommended for managing the backend
* A **MySQL database** that Qumly can connect to
* A **[Groq](https://console.groq.com)** API key

> **Note:** When running Qumly locally, you can connect it to a local MySQL/Postgres database. If you're using a deployed Qumly backend, the MySQL/PostgresSQL database must be reachable from the internet.

---

## _1. Clone the Repository_

Clone the repository and move into the project directory:

```bash
git clone https://github.com/alibro005/Qumly.git
cd Qumly
```

---

## _2. Set Up the Backend_

Move into the backend directory:

```bash
cd backend
```

### _Install Dependencies_

Qumly includes a `uv.lock` file, so using `uv` is recommended:

```bash
uv sync
```

If you prefer `pip`, create a virtual environment:

```bash
python -m venv .venv
```

Activate the environment:

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Then install the dependencies:

```bash
pip install -r requirements.txt
```

### _Configure Environment Variables_

Create a `.env` file inside the `backend/` directory:

```env
# Required for SQL generation, correction, and explanations
GROQ_API_KEY=your_groq_api_key

# Optional — used only for the Try Demo feature
DEMO_DB_HOST=your_demo_db_host
DEMO_DB_PORT=3306
DEMO_DB_NAME=your_demo_db_name
DEMO_DB_USERNAME=your_demo_db_username
DEMO_DB_PASSWORD=your_demo_db_password
```

`GROQ_API_KEY` is required for Qumly's AI features.

The `DEMO_DB_*` variables are optional and are only required if you want to use Qumly's built-in **Try Demo** flow.

> **Important:** Never commit your `.env` file, database credentials, or Groq API key to GitHub.

### _Start the Backend_

Using `uv`:

```bash
uv run fastapi dev app/main.py
```

Or using Uvicorn:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

You can verify that the API is running by opening:

```text
http://127.0.0.1:8000/health
```

---

## _3. Set Up the Frontend_

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

### _Configure the API URL_

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

> Make sure there is no trailing slash at the end of the URL.

### _Start the Frontend_

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## _4. Connect a Database_

Open Qumly in your browser:

```text
http://localhost:5173
```

Qumly provides two ways to connect to a database.

### _Try Demo_

If you configured the `DEMO_DB_*` variables in the backend `.env` file, select **Try Demo** to connect to the configured demo database.

This allows you to start using Qumly without configuring your own database connection.

### _Connect Your Own MySQL/Postgres Database_

Alternatively, select **Add Database** and provide your MySQL/PostgresSQL connection details:

```text
Host
Port
Database
Username
Password
```

For a local MySQL/Postgres server, a typical configuration is:

```text
Host: localhost
Port: 3306
Username: root
Database: your_database
Password: your_password
```

Make sure your MySQL/PostgresSQL server is running before connecting it to Qumly.

> **Note for deployed users:** When Qumly is deployed, `localhost` refers to the machine running the Qumly backend, not the user's computer. Therefore, a MySQL/PostgresSQL database used with the deployed backend must be remotely accessible.

---

## _5. Ask Questions_

Once a database is connected, you can ask questions using natural language.

For example:

> What were the top 5 best-selling products last month?

Qumly will:

1. Understand your question.
2. Generate the appropriate SQL query.
3. Execute the query against the connected database.
4. Display the results.
5. Explain the SQL and results in plain language.

---

## _Useful Commands_

### _Backend_

Run these commands from the `backend/` directory:

```bash
# Install dependencies
uv sync

# Start the development server
uv run fastapi dev app/main.py

# Run tests
uv run pytest
```

### _Frontend_

Run these commands from the `frontend/` directory:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run linting
npm run lint
```

---

## _Troubleshooting_

### _Demo Database Environment Variables Are Incomplete_

If you see:

```text
Demo database environment variables are incomplete
```

make sure all five demo database variables are present in `backend/.env`:

```env
DEMO_DB_HOST=your_host
DEMO_DB_PORT=3306
DEMO_DB_NAME=your_database
DEMO_DB_USERNAME=your_username
DEMO_DB_PASSWORD=your_password
```

---

### _CORS Error_

By default, the backend allows requests from the local Vite development URLs and the deployed Qumly frontend.

If you're running the frontend on a different host or port, update the `allow_origins` configuration in:

```text
backend/app/main.py
```

---

### _Groq API Error_

If Qumly cannot connect to Groq:

1. Make sure `GROQ_API_KEY` exists in `backend/.env`.
2. Verify that the API key is valid and active.
3. Restart the backend after modifying the `.env` file.

---

### _Connection Error_

Check the following:

* MySQL/PostgresSQL is running.
* The host is correct.
* The port is correct.
* The database name is correct.
* The username and password are correct.
* The MySQL server accepts connections from the Qumly backend.
* For remote databases, verify that firewall and network rules allow the connection.

For a local MySQL database, the usual configuration is:

```text
Host: localhost
Port: 3306
```

---

## _Environment Variables_

### _Backend_

```env
# Required
GROQ_API_KEY=your_groq_api_key

# Optional — Try Demo
DEMO_DB_HOST=your_demo_db_host
DEMO_DB_PORT=3306
DEMO_DB_NAME=your_demo_db_name
DEMO_DB_USERNAME=your_demo_db_username
DEMO_DB_PASSWORD=your_demo_db_password
```

### _Frontend_

```env
VITE_API_URL=http://127.0.0.1:8000
```

Keep your environment files local and make sure they are included in `.gitignore`.

---
