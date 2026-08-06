# 🐾 Voice of Stray

Voice of Stray is a unified community rescue and welfare platform designed to help stray animals. The project bridges the gap between concerned citizens, local volunteers, and NGO animal shelters. It enables real-time stray reporting, coordinates rescue operations via interactive mapping, manages volunteer programs, handles adoptions, facilitates donations, and provides a space for community discussion.

---

## 🚀 Project Overview

The project is currently transitioning from a legacy static HTML/JS prototype to a modern, responsive **React + Vite** single-page application. 

### Core Features
*   **🚨 Real-Time Stray Reporting**: Quick reporting form to notify local shelters about stray animals in distress.
*   **📍 Live Rescue Tracking**: Premium interactive Leaflet.js maps displaying rescue lifecycles, team dispatches, and hospital transport flows.
*   **🤝 NGO & Volunteer Coordination**: Dashboards for NGOs to manage incoming reports, volunteers, pet adoptions, and donations.
*   **🐕 Pet Adoptions**: Portals for browsing pets, filling out adoption applications, and reviewing requests.
*   **💳 Crowdfunding & Donations**: Campaigns to support shelter animals and transparent donation management.
*   **💬 Community Forum**: A social feed where animal lovers and volunteers share updates, ask questions, and celebrate success stories.

---

## 🏗️ Architecture & Tech Stack

### Frontend
*   **Framework**: [React 18](https://react.dev/) powered by [Vite](https://vitejs.dev/) (located in `/frontend`)
*   **Maps**: [Leaflet.js](https://leafletjs.com/) for map canvas rendering, custom SVG bezier curves, and radar pulsing markers.
*   **Icons**: [Phosphor Icons](https://phosphoricons.com/)
*   **Legacy Pages**: Pure HTML, Vanilla CSS, and custom JavaScript scripts (located at the root directory).

### Backend
*   **Runtime**: Node.js
*   **Framework**: [Express](https://expressjs.com/)
*   **Configuration**: CORS, dotenv environment handling, stubbed endpoints for future database persistence.

---

## 📊 React Conversion Progress

We are in the middle of converting the static HTML application to React. Below is the current migration status:

| Page / Component | Original File | React Component / File | Status |
| :--- | :--- | :--- | :--- |
| **Landing Page** | `index.html` | [Home.jsx](file:///c:/Users/hp/.gemini/antigravity/scratch/voice-of-stray-feed/frontend/src/pages/Home.jsx) |  Completed |
| **Navbar / Header** | `navbar.js` / HTML block | [Navbar.jsx](file:///c:/Users/hp/.gemini/antigravity/scratch/voice-of-stray-feed/frontend/src/components/Navbar.jsx) |  Completed (synced with storage) |
| **Footer** | HTML Block | [Footer.jsx](file:///c:/Users/hp/.gemini/antigravity/scratch/voice-of-stray-feed/frontend/src/components/Footer.jsx) |  Completed |
| **Sign Up** | `signup.html` | - | ⏳ Pending Conversion |
| **Log In** | `login.html` | - | ⏳ Pending Conversion |
| **User Dashboard** | `user-dashboard.html` | - | ⏳ Pending Conversion |
| **NGO Dashboard** | `ngo-dashboard.html` | - | ⏳ Pending Conversion |
| **Report Stray** | `report.html` | - | ⏳ Pending Conversion |
| **Rescue Tracker** | `rescue.html` | - | ⏳ Pending Conversion |
| **Adoptions Portal** | `adopt.html` / `adopt-apply.html` | - | ⏳ Pending Conversion |
| **Donations & Fundraisers** | `donate.html` | - | ⏳ Pending Conversion |
| **Community Feed** | `community.html` | - | ⏳ Pending Conversion |
| **Volunteer Activities** | `volunteer.html` / `volunteer-activities.html` | - | ⏳ Pending Conversion |

---

## 📂 Project Structure

```
voice-of-stray-feed/
├── backend/                  # Node.js Express Backend API
│   ├── src/
│   │   ├── routes/
│   │   │   └── api.js        # Stubbed API modules (auth, rescues, etc.)
│   │   ├── app.js            # Express middlewares and routing config
│   │   └── index.js          # Entry point for backend server
│   ├── package.json
│   └── .env
│
├── frontend/                 # Vite + React Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── assets/           # Stylesheets (landing.css, styles.css)
│   │   ├── components/       # Global Navbar, Footer, and UI blocks
│   │   ├── pages/            # Home / Landing page
│   │   ├── App.jsx           # Base App structure
│   │   └── main.jsx          # React renderer entry
│   ├── package.json
│   └── vite.config.js
│
├── *.html                    # Legacy static HTML pages (e.g. adopt.html, rescue.html)
└── Readme.md                 # Project documentation
```

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

### 1. Set Up the Backend
1. Navigate to the backend directory (do not `cd`, use package scripts or workspace directories).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000` with hot-reloading (via nodemon).*

### 2. Set Up the Frontend (React)
1. Navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will boot on `http://localhost:5173`.*

---

## 🗺️ Roadmap & Next Steps

1. **Routing Setup**: Install `react-router-dom` in the React frontend and map `/`, `/report`, `/rescue`, `/adopt`, `/donate`, `/volunteer`, `/community`, and dashboards.
2. **Component Porting**: Systematically convert static pages (like `rescue.html` and `volunteer.html`) to React page components inside `frontend/src/pages/`.
3. **API Integration**: Connect React components to the Express backend APIs, replacing mock LocalStorage mechanisms with network requests.
4. **Database Persistence**: Implement database storage (e.g., MongoDB/PostgreSQL) in the Express backend to replace stubbed endpoints.
