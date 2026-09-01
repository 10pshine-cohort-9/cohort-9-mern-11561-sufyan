<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-brightgreen?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/React_19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge" alt="License" />
</p>

<h1 align="center">⚡ InkSpire</h1>

<p align="center">
  <b>A beautifully crafted, full-stack note-taking application with rich text editing, light/dark theming, and secure user authentication.</b>
</p>

<p align="center">
  Write boldly. Organize effortlessly. <i>Let your ideas flow.</i>
</p>

---

## 📖 Project Overview

**InkSpire** is a modern, full-stack MERN note-taking application built for speed, security, and style. It empowers users to create, organize, and manage richly-formatted notes through an intuitive dashboard powered by a **React Quill** rich text editor. Users can register, log in securely via **JWT authentication**, upload a profile avatar, and seamlessly switch between a polished **light** and **dark** theme — all within a responsive, glassmorphic UI.

The backend is a robust RESTful API built with **Express 5** and **Mongoose 9**, featuring structured logging via **Pino**, centralized error handling, and file uploads through **Multer**. The project is backed by comprehensive automated testing on both the frontend and backend, and integrates **SonarQube** for continuous code quality analysis.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📝 **Rich Text Editor** | Full WYSIWYG editing via **React Quill** — bold, italic, lists, headings, links, and more. Content is stored as sanitized HTML (DOMPurify). |
| 🌗 **Light / Dark Theme** | Seamless theme toggling with Tailwind CSS 4. Preference is persisted in `localStorage` across sessions. Dark mode features amber/gold accents; light mode uses emerald/green. |
| 🔐 **JWT Authentication** | Secure, stateless authentication using **JSON Web Tokens** (30-day expiry). Passwords are hashed with **bcryptjs** (salt rounds: 10). |
| 🖼️ **Avatar Uploads** | Profile picture uploads via **Multer** with file-type validation (JPG, JPEG, PNG, WEBP) and a 5 MB size limit. Old avatars are cleaned up on replacement. |
| 🔍 **Note Search** | Client-side search filtering on the dashboard to quickly find notes by title or content. |
| 🛡️ **XSS Protection** | User-generated HTML content is sanitized with **DOMPurify** before rendering to prevent cross-site scripting attacks. |
| 📱 **Responsive Design** | Fully responsive layout with mobile hamburger menu, optimized touch targets, and breakpoint-aware components. |
| 🪵 **Structured Logging** | Production-grade logging with **Pino** + **pino-http**. Sensitive headers (Authorization, cookies) are automatically redacted. |
| ⚙️ **Centralized Error Handling** | Unified Express error middleware catches Mongoose validation errors, cast errors, duplicate keys, and Multer file-size limits. |
| 🏥 **Health Check Endpoint** | `GET /api/health` endpoint for uptime monitoring and load balancer probes. |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
| :--- | :---: | :--- |
| [React](https://react.dev/) | 19.x | UI component library |
| [Vite](https://vitejs.dev/) | 8.x | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS framework |
| [React Router DOM](https://reactrouter.com/) | 7.x | Client-side routing |
| [React Quill (New)](https://www.npmjs.com/package/react-quill-new) | 3.x | Rich text / WYSIWYG editor |
| [Axios](https://axios-http.com/) | 1.x | HTTP client |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | 11.x | Toast notifications |
| [DOMPurify](https://github.com/cure53/DOMPurify) | 3.x | HTML sanitization (XSS prevention) |

### Backend

| Technology | Version | Purpose |
| :--- | :---: | :--- |
| [Node.js](https://nodejs.org/) | 18+ | JavaScript runtime |
| [Express](https://expressjs.com/) | 5.x | Web framework |
| [Mongoose](https://mongoosejs.com/) | 9.x | MongoDB ODM |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | 3.x | Password hashing |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | 9.x | JWT token generation & verification |
| [Multer](https://www.npmjs.com/package/multer) | 2.x | Multipart file upload handling |
| [Pino](https://getpino.io/) | 10.x | Structured JSON logger |
| [pino-http](https://www.npmjs.com/package/pino-http) | 11.x | HTTP request logging middleware |
| [dotenv](https://www.npmjs.com/package/dotenv) | 17.x | Environment variable management |

### Testing

| Tool | Scope | Purpose |
| :--- | :---: | :--- |
| [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | Frontend | Component & integration tests with jsdom |
| [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) | Backend | API integration tests |
| [Supertest](https://www.npmjs.com/package/supertest) | Backend | HTTP assertion library |
| [nyc (Istanbul)](https://istanbul.js.org/) | Backend | Code coverage instrumentation |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage) | Frontend | V8-based code coverage |

---

## 🏗️ Project Architecture

```
inkspire/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── db.js                 # MongoDB connection via Mongoose
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js     # Register, login, profile update
│   │   │   └── noteController.js     # CRUD operations for notes
│   │   ├── 📁 middlewares/
│   │   │   ├── authMiddleware.js     # JWT token verification (protect)
│   │   │   ├── errorHandler.js       # Centralized error handler
│   │   │   ├── requestLogger.js      # Pino HTTP request logging
│   │   │   └── uploadMiddleware.js   # Multer avatar upload config
│   │   ├── 📁 models/
│   │   │   ├── noteModel.js          # Note schema (title, content, user ref)
│   │   │   └── userModel.js          # User schema (name, email, password, avatar)
│   │   ├── 📁 routes/
│   │   │   ├── authRoutes.js         # /api/users endpoints
│   │   │   └── noteRoutes.js         # /api/notes endpoints
│   │   ├── 📁 utils/
│   │   │   ├── generateToken.js      # JWT signing utility
│   │   │   └── logger.js             # Pino logger instance
│   │   ├── app.js                    # Express app setup & middleware
│   │   └── server.js                 # Entry point — DB connect & listen
│   ├── 📁 tests/
│   │   ├── auth.test.js              # Auth endpoint tests
│   │   ├── notes.test.js             # Notes CRUD tests
│   │   └── server.test.js            # Health check test
│   ├── 📁 uploads/                   # Avatar file storage (gitignored)
│   └── package.json
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Navbar.jsx            # Responsive navbar with theme toggle
│   │   │   └── Navbar.test.jsx       # Navbar component tests
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx       # Auth state (user, login, logout)
│   │   │   └── ThemeContext.jsx      # Theme state (dark/light toggle)
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx         # Notes CRUD + React Quill editor
│   │   │   ├── Dashboard.test.jsx    # Dashboard component tests
│   │   │   ├── Login.jsx             # Login form
│   │   │   ├── Login.test.jsx        # Login component tests
│   │   │   ├── Profile.jsx           # Profile management & avatar upload
│   │   │   ├── Profile.test.jsx      # Profile component tests
│   │   │   ├── Register.jsx          # Registration form
│   │   │   └── Register.test.jsx     # Register component tests
│   │   ├── App.jsx                   # Root component with routing
│   │   ├── main.jsx                  # React DOM entry point
│   │   ├── index.css                 # Tailwind CSS entry
│   │   └── setupTests.js            # Test setup (jest-dom matchers)
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite + Vitest + proxy config
│   ├── eslint.config.js              # ESLint flat config
│   └── package.json
│
├── sonar-project.properties          # SonarQube scanner configuration
├── .coderabbit.yaml                  # CodeRabbit AI review config
├── .gitignore
└── package.json                      # Root workspace dependencies
```

---

## 🔧 DevOps & Code Quality

### 🔬 SonarQube

The project includes a pre-configured [`sonar-project.properties`](sonar-project.properties) file for static code analysis:

- **Project Key:** `notes-app`
- **Coverage Reports:** Configured to ingest LCOV reports from both `backend/coverage/lcov.info` and `frontend/coverage/lcov.info`
- **Exclusions:** Automatically excludes `node_modules`, `dist`, `build`, `coverage`, and test files from main analysis
- **Test Detection:** Test files (`*.test.js`, `*.test.jsx`) are included in the test analysis scope
- **Performance:** `sonar.scanner.maxCpu=4` to prevent Docker memory spikes

### 🐇 CodeRabbit

Automated AI code reviews via [`.coderabbit.yaml`](.coderabbit.yaml) are configured on `main` and `develop` branches, flagging:
- Missing TypeScript types (HIGH)
- Async/await without try-catch (MEDIUM)
- React component structure and missing prop validation

### 🧪 Testing Matrix

| Layer | Framework | Runner | Coverage Tool | Report Format |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | Mocha + Chai + Supertest | `cross-env NODE_ENV=test nyc mocha` | nyc (Istanbul) | LCOV + text |
| **Frontend** | Vitest + React Testing Library | `vitest run --coverage` | @vitest/coverage-v8 | LCOV + text |

---

## 📋 Prerequisites

Ensure the following are installed on your system before proceeding:

| Requirement | Minimum Version | Check Command |
| :--- | :---: | :--- |
| [Node.js](https://nodejs.org/) | 18.x | `node -v` |
| [npm](https://www.npmjs.com/) | 9.x | `npm -v` |
| [MongoDB](https://www.mongodb.com/try/download/community) | 6.x | `mongod --version` |
| [Git](https://git-scm.com/) | 2.x | `git --version` |

> **💡 Tip:** You can use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) instead of a local MongoDB instance. Simply update the `MONGODB_URI` in your `.env` file with your Atlas connection string.

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```bash
# backend/.env

PORT=5000                                      # Server port (default: 5000)
MONGODB_URI=mongodb://127.0.0.1:27017/notes-app  # MongoDB connection string
NODE_ENV=development                            # Environment: development | production | test
JWT_SECRET=your_super_secret_key_here           # Secret key for signing JWTs
```

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | No | `5000` | Port on which the Express server listens |
| `MONGODB_URI` | ✅ Yes | — | MongoDB connection URI (local or Atlas) |
| `NODE_ENV` | No | — | Application environment mode |
| `JWT_SECRET` | ✅ Yes | — | Secret used to sign and verify JSON Web Tokens |

> **⚠️ Important:** Never commit your `.env` file to version control. The `.gitignore` is already configured to exclude it.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/cohort-9-mern-11561-sufyan.git
cd cohort-9-mern-11561-sufyan
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment

```bash
# Create the backend .env file (see Environment Variables section above)
cp backend/.env.example backend/.env   # or create manually
```

### 4. Start MongoDB

```bash
# If using a local MongoDB instance
mongod
```

### 5. Run the Backend Server

```bash
cd backend
npm run dev
```

The backend API will start on **`http://localhost:5000`** with hot-reloading via Nodemon.

### 6. Run the Frontend Dev Server

```bash
# In a separate terminal
cd frontend
npm run dev
```

The frontend will start on **`http://localhost:3000`** with Vite's HMR. API requests to `/api/*` and `/uploads/*` are automatically proxied to the backend.

### 7. Open in Browser

Navigate to **[http://localhost:3000](http://localhost:3000)** and start creating notes! 🎉

---

## 🧪 Running Tests

### Backend Tests

Backend tests use **Mocha + Chai + Supertest** against a live MongoDB instance. Ensure MongoDB is running before executing:

```bash
cd backend
npm test
```

This runs tests with `NODE_ENV=test` and generates:
- Terminal coverage summary (text reporter)
- LCOV coverage report at `backend/coverage/lcov.info`

### Frontend Tests

Frontend tests use **Vitest + React Testing Library** with jsdom:

```bash
cd frontend
npm test
```

This runs all `*.test.jsx` files and generates:
- Terminal coverage summary (text reporter)
- LCOV coverage report at `frontend/coverage/lcov.info`

### SonarQube Analysis (Optional)

If you have a SonarQube instance running (e.g., via Docker):

```bash
# From the project root, after generating coverage reports
npx sonar-scanner
```

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### 🏥 Health

| Method | Endpoint | Auth | Description |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/health` | ❌ | Server health check |

### 👤 Authentication (`/api/users`)

| Method | Endpoint | Auth | Body | Description |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/users/register` | ❌ | `{ name, email, password }` | Register a new user |
| `POST` | `/api/users/login` | ❌ | `{ email, password }` | Login & receive JWT token |
| `PUT` | `/api/users/profile` | 🔒 | `FormData: { name?, avatar? }` | Update profile name & avatar |

### 📝 Notes (`/api/notes`)

| Method | Endpoint | Auth | Body | Description |
| :---: | :--- | :---: | :--- | :--- |
| `GET` | `/api/notes` | 🔒 | — | Get all notes for the authenticated user |
| `POST` | `/api/notes` | 🔒 | `{ title, content }` | Create a new note |
| `GET` | `/api/notes/:id` | 🔒 | — | Get a single note by ID |
| `PUT` | `/api/notes/:id` | 🔒 | `{ title, content }` | Update a note by ID |
| `DELETE` | `/api/notes/:id` | 🔒 | — | Delete a note by ID |

#### 🔑 Authentication Header

```
Authorization: Bearer <your_jwt_token>
```

#### 📤 Successful Auth Response

```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Sufyan Aslam",
  "email": "sufyan@example.com",
  "avatar": "/uploads/avatar-1719403200000.jpg",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 📜 Available Scripts

### Backend (`backend/`)

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Start with Nodemon (hot-reload) |
| `start` | `npm start` | Start in production mode |
| `test` | `npm test` | Run Mocha tests with nyc coverage |

### Frontend (`frontend/`)

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Start Vite dev server (port 3000) |
| `build` | `npm run build` | Build for production |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint |
| `test` | `npm test` | Run Vitest with V8 coverage |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ by <b>Sufyan Aslam</b>
</p>
