# AI Travel Planner (MERN + AI) ✈️

AI Travel Planner is a modern, production-ready MERN stack web application that allows users to upload travel booking documents (flight tickets, hotel reservations, train tickets, bus tickets, etc.), automatically extracts relevant information using OCR and AI, and generates a structured day-by-day travel itinerary.

## 🚀 Key Features
- **JWT-Based Authentication**: Registration, Login, Logout, Profile updates.
- **OCR Ingestion Pipeline**: Tesseract.js for image recognition and pdf-parse for PDF documents.
- **AI Processing Layer**: Uses OpenRouter (pointing to `google/gemini-2.0-flash-001`) to parse unstructured text into clean JSON schema and generate day-by-day travel timelines.
- **Premium SaaS UI/UX**: Built with React, Vite, Framer Motion (for smooth transitions), Tailwind-inspired CSS variables, glassmorphism cards, and dynamic skeletons.
- **Itinerary Timeline**: Day-by-day morning/afternoon/evening activity timeline with transport, meals, and estimated expenses.
- **Sharing & QR System**: Generates unique shareable codes (`/share/6FD72X`) permitting public view, downloadable/printable PDF layout, social share hooks, and QR codes.
- **AI Travel Assistant**: Interactive chat widget to ask questions or customize the generated itinerary.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Routing**: React Router DOM v6
- **State Management & Server Cache**: Axios + TanStack Query (React Query)
- **Forms & Validation**: React Hook Form + Zod Schema Validation
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather Icons)
- **Utilities**: Date-fns (date management), QRCode (QR generation)

### Backend
- **Platform**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs (12 rounds)
- **OCR Engine**: Tesseract.js (images) + pdf-parse (PDF files)
- **AI client**: OpenAI SDK (configured for OpenRouter API base)
- **Upload handler**: Multer middleware
- **Security**: Helmet headers, Express rate limits, CORS config, MongoDB input sanitization

---

## 📁 Project Structure

```
ai-travel-planner/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── api/            # Axios instance and API call modules
│   │   ├── components/     # Reusable components
│   │   │   ├── ui/         # Button, Card, Badge, Modal, Skeleton, Avatar
│   │   │   ├── layout/     # Navbar, Sidebar, PageWrapper
│   │   │   ├── upload/     # DropZone, FilePreview, UploadProgress
│   │   │   ├── itinerary/  # ItineraryCard, DayTimeline, FlightCard, HotelCard
│   │   │   └── shared/     # ShareModal, ExportButton
│   │   ├── contexts/       # AuthContext, ThemeContext
│   │   ├── hooks/          # useAuth, useToast
│   │   ├── pages/          # All 11 views (Landing, Dashboard, Details, Shared, etc.)
│   │   ├── router/         # Protected routes and routing index
│   │   ├── styles/         # global.css, variables.css
│   │   └── main.jsx        # App entry point
│   ├── index.html
│   └── vite.config.js
│
├── server/                 # Backend Node.js Express API
│   ├── src/
│   │   ├── config/          # Database & Multer configuration
│   │   ├── controllers/     # Auth, Upload, AI, Itinerary, User controllers
│   │   ├── middleware/      # Auth protect, rate limiters, validations, error handlers
│   │   ├── models/          # User, UploadedFile, Itinerary Mongoose models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # aiService, ocrService, storageService
│   │   └── utils/           # ApiError, ApiResponse, asyncHandler, shareCode
│   ├── uploads/             # Temporary folder for local uploads
│   ├── server.js            # Bootstrapping script
│   └── app.js               # Express application initialization
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB Atlas** or local MongoDB instance

### Step 1: Clone and Configure the Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and fill in the configuration details:
   - **`MONGO_URI`**: Your MongoDB connection string.
   - **`OPENROUTER_API_KEY`**: Your OpenRouter API Key.
   - **`JWT_SECRET`**: A long, secure random string for JWT hashing.

### Step 2: Configure the Client
1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Verify `vite.config.js` target proxy points to the server (default `http://localhost:5000`).

---

## 🏃 Running the Application

### Start Backend Server
From the `server` directory:
```bash
# Start in development mode (with nodemon)
npm run dev

# Start in production mode
npm start
```
The server will run on `http://localhost:5000`.

### Start Frontend Server
From the `client` directory:
```bash
npm run dev
```
The Vite development server will open at `http://localhost:5173`.

---

## 📡 API Documentation

### Auth Module
- `POST /api/auth/register` — Register a new user. Expects `fullName`, `email`, `password`.
- `POST /api/auth/login` — Login user. Returns JWT and user object.
- `GET /api/auth/profile` — Get authenticated user details. (Protected)
- `PUT /api/auth/profile` — Update name or profile image URL. (Protected)
- `POST /api/auth/logout` — Blacklists/invalidates session. (Protected)

### Upload Module
- `POST /api/upload` — Upload up to 10 files (PDF or Images). Triggers OCR extraction automatically. Returns file records. (Protected)
- `GET /api/upload/history` — Get paginated upload records for the user. (Protected)
- `DELETE /api/upload/:id` — Delete uploaded file and purge from local disk. (Protected)

### AI Module
- `POST /api/ai/extract` — Trigger structural data parse from OCR text. (Protected)
- `POST /api/ai/generate` — Compile documents and generate day-by-day itinerary. Expects `{ fileIds: [...], title: "Trip Title" }`. (Protected)
- `POST /api/ai/chat` — Chat with your trip itinerary. Expects `{ itineraryId: "id", message: "text" }`. (Protected)

### Itinerary Module
- `GET /api/itinerary` — Get user itineraries (paginated, search by title/destination, filter by status). (Protected)
- `GET /api/itinerary/:id` — Get detailed itinerary. (Protected)
- `PUT /api/itinerary/:id` — Update itinerary details. (Protected)
- `DELETE /api/itinerary/:id` — Delete itinerary. (Protected)
- `POST /api/itinerary/:id/share` — Generates unique share code and sets `isPublic = true`. (Protected)
- `POST /api/itinerary/:id/duplicate` — Clones existing itinerary with "Copy of" title prefix. (Protected)
- **`GET /api/itinerary/share/:code`** — Fetch detailed itinerary by share code. **(Public, No auth required)**

### User Module
- `GET /api/user/dashboard` — Fetch dashboard aggregates (trips, docs, shared, upcoming) and activity list. (Protected)
- `PUT /api/user/password` — Change account password. (Protected)
