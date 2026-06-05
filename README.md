<div align="center">

<img src="https://img.shields.io/badge/ViMatrix-Full%20Stack%20Video%20Platform-6366f1?style=for-the-badge" alt="ViMatrix" />

# ViMatrix

### A modern full-stack creator platform for video publishing, engagement, playlists, and community interaction

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vimatrix.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://vimatrix.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-prabhatyadav4%2Fvimatrix-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/prabhatyadav4/vimatrix)

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Frontend Pages & Components](#-frontend-pages--components)
- [Custom Hooks](#-custom-hooks)
- [CI/CD & Deployment](#-cicd--deployment)
- [Postman Collection](#-postman-collection)

---

## 🌐 Overview

**ViMatrix** is a production-ready, full-stack video hosting and creator platform inspired by YouTube. It supports end-to-end creator workflows — from uploading and managing videos, to building a community through subscriptions, playlists, tweets, and comments.

The backend is a RESTful API built with Node.js and Express, persisting data in MongoDB Atlas with aggregation-heavy queries and JWT-based auth. The frontend is a fully reactive SPA built with React, Redux Toolkit, and TailwindCSS — deployed on Vercel with CI/CD via GitHub Actions.

---

## ✨ Features

### 🔐 Authentication
- Secure registration & login with **JWT access + refresh token** rotation
- HTTP-only cookies for token storage
- Protected routes on both frontend and backend
- Optional auth middleware for public-but-enriched endpoints

### 🎥 Videos
- Upload videos and thumbnails directly to **Cloudinary**
- Multi-step upload form with real-time progress bar
- Publish / unpublish toggle
- Edit title, description, thumbnail
- Delete with Cloudinary asset cleanup
- Paginated video feed with search and sorting
- Infinite scroll on home and search pages

### 👤 Users & Channels
- Avatar and cover image upload
- Public channel profiles with subscriber count
- Watch history tracking
- Edit profile modal (name, email, bio, avatar, cover)
- Dedicated channel tabs: **Videos, Playlists, Tweets, About, Subscribers, Subscriptions**

### 💬 Comments
- Add, edit, delete comments on videos
- Nested comment support
- Like comments

### ❤️ Likes
- Like / unlike videos, comments, and tweets
- Dedicated **Liked Videos** page

### 🐦 Tweets
- Create, edit, delete short community posts
- Like tweets
- Dedicated Tweets feed page

### 📋 Playlists
- Create and manage playlists
- Add / remove videos from playlists
- Public playlist detail view

### 🔔 Subscriptions
- Subscribe / unsubscribe to channels
- **Subscriptions feed** — aggregated videos from subscribed channels
- Subscriber list on channel profile

### 📊 Dashboard
- Channel stats: total views, subscribers, videos, likes
- Animated count-up numbers
- Full video manager table with edit & delete per video
- Publish toggle inline

### 🛡️ Reliability
- `ErrorBoundary` component for graceful React error handling
- Centralized `ApiError` class for consistent backend errors
- `validateEnv.js` — validates all required env variables at startup
- `logger.js` — structured server-side logging
- `asyncHandler` — eliminates repetitive try/catch in controllers

---

## 🛠️ Tech Stack

### Backend

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT (access + refresh tokens) |
| Password Hashing | Bcrypt |
| File Uploads | Multer (local) → Cloudinary (cloud) |
| Pagination | mongoose-aggregate-paginate-v2 |
| Environment Validation | Custom `validateEnv.js` |
| Logging | Custom `logger.js` |
| Code Style | Prettier |

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| HTTP Client | Axios (with interceptors) |
| Styling | TailwindCSS + shadcn/ui |
| Form Validation | Custom schema validation |
| Icons | Lucide React |

### DevOps

| Layer | Technology |
|-------|------------|
| Frontend Hosting | Vercel |
| CI/CD | GitHub Actions |
| Asset Storage | Cloudinary |
| Version Control | Git + GitHub |

---

## 🗂️ Project Structure

```
vimatrix/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline
├── backend/
│   ├── public/temp/                # Temporary local storage before Cloudinary upload
│   └── src/
│       ├── app.js                  # Express app — CORS, middleware, route mounting
│       ├── constants.js            # App-wide constants (DB name, enums)
│       ├── index.js                # Entry point — DB connect + server start
│       ├── controllers/            # Request handlers & business logic
│       │   ├── user.controller.js
│       │   ├── video.controller.js
│       │   ├── comment.controller.js
│       │   ├── like.controller.js
│       │   ├── tweet.controller.js
│       │   ├── playlist.controller.js
│       │   ├── subscription.controller.js
│       │   ├── dashboard.controller.js
│       │   └── healthcheck.controller.js
│       ├── db/
│       │   └── index.js            # MongoDB Atlas connection
│       ├── middlewares/
│       │   ├── auth.middleware.js        # JWT verification — blocks unauthenticated requests
│       │   ├── multer.middleware.js      # Multipart file handling
│       │   └── optionalAuth.middleware.js # Enriches public routes if token present
│       ├── models/                 # Mongoose schemas with relationships
│       │   ├── user.model.js
│       │   ├── video.model.js
│       │   ├── comment.model.js
│       │   ├── like.model.js
│       │   ├── tweet.model.js
│       │   ├── playlist.model.js
│       │   └── subscription.model.js
│       ├── routes/                 # Express route definitions
│       │   ├── user.routes.js
│       │   ├── video.routes.js
│       │   ├── comment.routes.js
│       │   ├── like.routes.js
│       │   ├── tweet.routes.js
│       │   ├── playlist.routes.js
│       │   ├── subscription.routes.js
│       │   ├── dashboard.routes.js
│       │   └── healthcheck.routes.js
│       └── utils/
│           ├── asyncHandler.js     # Wraps async controllers to avoid try/catch repetition
│           ├── ApiError.js         # Custom error class with statusCode & message
│           ├── ApiResponse.js      # Standardized success response wrapper
│           ├── cloudinary.js       # Upload & delete assets on Cloudinary
│           ├── logger.js           # Structured server-side logging
│           └── validateEnv.js      # Validates required env variables at startup
├── frontend/
│   └── src/
│       ├── api/                    # Axios functions — one file per resource
│       │   ├── axiosInstance.js    # Base URL, interceptors, token refresh logic
│       │   ├── auth.api.js
│       │   ├── video.api.js
│       │   ├── comment.api.js
│       │   ├── like.api.js
│       │   ├── tweet.api.js
│       │   ├── playlist.api.js
│       │   ├── subscription.api.js
│       │   └── dashboard.api.js
│       ├── app/
│       │   ├── store.js            # Redux store configuration
│       │   └── slices/
│       │       └── authSlice.js    # Auth state: user, loading, isAuthenticated
│       ├── components/             # Reusable UI components
│       │   ├── channel/            # Channel header, tabs, edit modal
│       │   ├── comment/            # CommentCard, CommentForm, CommentSection
│       │   ├── common/             # Navbar, Sidebar, Modal, Loader, ProtectedRoute, ErrorBoundary
│       │   ├── dashboard/          # StatCard, VideoManager, VideoRow, modals
│       │   ├── playlist/           # PlaylistCard, AddToPlaylistModal
│       │   ├── tweet/              # TweetCard, TweetForm
│       │   ├── ui/                 # shadcn/ui primitives
│       │   └── video/              # VideoCard, VideoGrid, VideoPlayer, upload components
│       ├── context/
│       │   └── SidebarContext.jsx  # Global sidebar open/close state
│       ├── hooks/                  # Custom React hooks (see section below)
│       ├── pages/                  # Route-level page components
│       ├── schemas/                # Form validation schemas
│       └── utils/                  # Formatters: date, duration, views, error handler
└── postman/
    ├── ViMatrix.postman_collection.json    # All API endpoints
    └── ViMatrix.postman_environment.json   # Environment variables for Postman
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/prabhatyadav4/vimatrix.git
cd vimatrix
```

### 2. Setup & run the backend

```bash
cd backend
npm install
cp .env.example .env    # fill in your values (see Environment Variables below)
npm run dev             # starts on http://localhost:8000
```

### 3. Setup & run the frontend

```bash
cd frontend
npm install
# create a .env file with:
# VITE_API_BASE_URL=http://localhost:8000/api/v1
npm run dev             # starts on http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` directory. Refer to `.env.example` for all keys:

```env
# Server
PORT=8000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`. Only `.env.example` is committed.

---

## 📡 API Reference

All routes are prefixed with `/api/v1`.

| Resource | Base Route | Auth |
|----------|------------|:----:|
| Users | `/users` | Partial |
| Videos | `/videos` | Partial |
| Comments | `/comments` | ✅ |
| Likes | `/likes` | ✅ |
| Tweets | `/tweets` | ✅ |
| Playlists | `/playlists` | ✅ |
| Subscriptions | `/subscriptions` | ✅ |
| Dashboard | `/dashboard` | ✅ |
| Healthcheck | `/healthcheck` | ❌ |

<details>
<summary><strong>👤 User Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/users/register` | ❌ | Register with avatar & cover image |
| `POST` | `/users/login` | ❌ | Login — returns access + refresh tokens |
| `POST` | `/users/logout` | ✅ | Logout — clears cookies |
| `POST` | `/users/refresh-token` | ❌ | Rotate access token using refresh token |
| `GET` | `/users/current-user` | ✅ | Get currently logged-in user |
| `PATCH` | `/users/update-account` | ✅ | Update full name & email |
| `PATCH` | `/users/change-password` | ✅ | Change password |
| `PATCH` | `/users/avatar` | ✅ | Update avatar image |
| `PATCH` | `/users/cover-image` | ✅ | Update cover image |
| `GET` | `/users/c/:username` | ❌ | Get public channel profile with subscription info |
| `GET` | `/users/history` | ✅ | Get watch history |

</details>

<details>
<summary><strong>🎥 Video Endpoints</strong></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/videos` | Optional | Get all videos with search, sort & pagination |
| `POST` | `/videos` | ✅ | Upload a new video |
| `GET` | `/videos/:videoId` | Optional | Get video by ID (increments view count) |
| `PATCH` | `/videos/:videoId` | ✅ | Update video title, description, thumbnail |
| `DELETE` | `/videos/:videoId` | ✅ | Delete video + Cloudinary assets |
| `PATCH` | `/videos/toggle/publish/:videoId` | ✅ | Toggle publish status |

</details>

<details>
<summary><strong>💬 Comment · ❤️ Like · 🐦 Tweet · 📋 Playlist · 🔔 Subscription · 📊 Dashboard</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments/:videoId` | Get all comments for a video |
| `POST` | `/comments/:videoId` | Add a comment |
| `PATCH` | `/comments/c/:commentId` | Update a comment |
| `DELETE` | `/comments/c/:commentId` | Delete a comment |
| `POST` | `/likes/toggle/v/:videoId` | Toggle like on a video |
| `POST` | `/likes/toggle/c/:commentId` | Toggle like on a comment |
| `POST` | `/likes/toggle/t/:tweetId` | Toggle like on a tweet |
| `GET` | `/likes/videos` | Get all liked videos |
| `GET` | `/tweets/user/:userId` | Get all tweets by a user |
| `POST` | `/tweets` | Create a tweet |
| `PATCH` | `/tweets/:tweetId` | Update a tweet |
| `DELETE` | `/tweets/:tweetId` | Delete a tweet |
| `GET` | `/playlists/:playlistId` | Get playlist by ID |
| `POST` | `/playlists` | Create a playlist |
| `PATCH` | `/playlists/:playlistId` | Update playlist details |
| `DELETE` | `/playlists/:playlistId` | Delete a playlist |
| `PATCH` | `/playlists/add/:videoId/:playlistId` | Add video to playlist |
| `PATCH` | `/playlists/remove/:videoId/:playlistId` | Remove video from playlist |
| `GET` | `/playlists/user/:userId` | Get all playlists of a user |
| `POST` | `/subscriptions/c/:channelId` | Toggle subscription |
| `GET` | `/subscriptions/c/:channelId` | Get channel's subscriber list |
| `GET` | `/subscriptions/u/:subscriberId` | Get channels a user subscribed to |
| `GET` | `/dashboard/stats` | Get channel stats |
| `GET` | `/dashboard/videos` | Get all videos for the dashboard |

</details>

---

## 🖥️ Frontend Pages & Components

### Pages

| Page | Route | Description |
|------|-------|-------------|
| `Home` | `/` | Infinite scroll video feed |
| `VideoWatch` | `/watch/:videoId` | Player, comments, likes, related info |
| `Channel` | `/channel/:username` | Public channel profile with 6 tabs |
| `Dashboard` | `/dashboard` | Creator stats + video manager |
| `VideoUpload` | `/upload` | Multi-step upload form with progress |
| `SearchResults` | `/search` | Query-based results with infinite scroll |
| `Playlists` | `/playlists` | All playlists of current user |
| `PlaylistDetail` | `/playlist/:playlistId` | Videos inside a playlist |
| `LikedVideos` | `/liked` | All videos liked by the user |
| `Subscriptions` | `/subscriptions` | Feed from subscribed channels |
| `Tweets` | `/tweets` | Community post feed |
| `Login` | `/login` | Login form |
| `Register` | `/register` | Registration form |
| `NotFound` | `*` | 404 page |

### Key Components

| Component | Description |
|-----------|-------------|
| `ProtectedRoute` | Redirects unauthenticated users to login |
| `ErrorBoundary` | Catches React runtime errors gracefully |
| `axiosInstance` | Pre-configured Axios with base URL + auto token refresh interceptor |
| `VideoPlayer` | Native HTML5 video player with controls |
| `UploadProgressBar` | Real-time upload progress indicator |
| `InfiniteScroll` | Intersection Observer-based scroll trigger via `useInfiniteScroll` |
| `SkeletonCard` | Loading placeholder for video cards |
| `SidebarContext` | Global context for sidebar open/close state |

---

## 🪝 Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Access and manage auth state from Redux |
| `useVideos` | Fetch, paginate, and manage videos |
| `useChannel` | Fetch channel profile, stats, and content |
| `useComments` | CRUD operations on video comments |
| `useLike` | Toggle and track likes on any entity |
| `usePlaylists` | Manage playlists and playlist videos |
| `useSubscription` | Toggle and check subscription status |
| `useTweets` | CRUD operations on tweets |
| `useDashboard` | Fetch creator stats and managed videos |
| `useInfiniteScroll` | Intersection Observer-based pagination trigger |
| `useDebounce` | Delay search input API calls |
| `useCountUp` | Animated number count-up for stat cards |

---

## 🚀 CI/CD & Deployment

ViMatrix uses **GitHub Actions** for automated deployment.

```
.github/workflows/deploy.yml
```

**Pipeline flow:**
1. Push to `main` branch triggers the workflow
2. Build step runs for the frontend
3. Vercel CLI deploys the frontend automatically
4. Backend is deployed separately to its hosting provider

**Frontend:** Deployed on [Vercel](https://vercel.app) — [vimatrix.vercel.app](https://vimatrix.vercel.app)

---

## 📬 Postman Collection

A complete Postman collection is included in the `postman/` directory for testing all API endpoints locally.

```
postman/
├── ViMatrix.postman_collection.json     # All endpoints with request bodies & params
└── ViMatrix.postman_environment.json    # Pre-configured environment variables
```

**To use:**
1. Open Postman
2. Import `ViMatrix.postman_collection.json`
3. Import `ViMatrix.postman_environment.json`
4. Set your `baseURL` and `accessToken` in the environment
5. Start testing!

---

<div align="center">

Made with ☕ by [prabhatyadav4](https://github.com/prabhatyadav4)

</div>
