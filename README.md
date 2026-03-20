# Pushups — Gym Management System (Frontend)

The frontend for **Pushups**, a full-stack gym management application. Built with **Nuxt 3**, **Pinia**, and **Tailwind CSS**. Communicates with a Spring Boot/Kotlin backend via REST API with session-based Google OAuth2 authentication.

**Live demo:** [pushupsfrontend.up.railway.app](https://pushupsfrontend.up.railway.app)
**Backend repo:** [github.com/IliasIosifidis/PushUpsBackend](https://github.com/IliasIosifidis/PushUpsBackend)

---

## Screenshots

| Admin View | Member View | Member Stats |
|:---:|:---:|:---:|
| ![Admin dashboard](docs/admin-view.jpeg) | ![Member dashboard](docs/member-view.jpeg) | ![Attendance chart](docs/stats-modal.jpeg) |

> Admin view includes full member management and booking controls. Member view is read-only with self-booking. Clicking a member name opens an attendance chart with monthly visit history.

---

## Tech Stack

- **Nuxt 3** — file-based routing, auto-imports, SSR-ready
- **Pinia** — state management (4 stores: auth, members, bookings, classes)
- **Tailwind CSS v3** — utility-first styling with custom color palette
- **Axios** — API calls with `withCredentials: true` for session cookies
- **Chart.js + vue-chartjs** — monthly attendance bar chart in the member stats modal
- **Google Fonts** — Playpen Sans / Roboto via `@nuxtjs/google-fonts`

---

## Features

### Authentication
- Google OAuth2 login via the Spring Boot backend
- Session-based auth with cookies (`withCredentials: true`)
- Role-aware UI — admin features are conditionally rendered based on `/api/auth/me` response
- Demo role toggle button to switch between ADMIN and MEMBER views

### Weekly Booking Calendar
- Grid layout: days (rows) × class time slots (columns)
- Displays enrolled members per class with current/max capacity
- Week navigation (previous/next) recalculates Monday–Friday and re-fetches
- **Admin**: can add bookings for any member via search modal, and remove bookings
- **Member**: can self-book into a class with one click
- Toast notifications for booking errors (class full, already booked)

### Member Management (Admin only)
- Paginated member list with search (debounced, 300ms)
- Add, edit, and deactivate members via modals
- Click a member name to view their attendance stats as a bar chart
- Soft-delete (deactivate) preserves booking history

### Class Schedule
- Sidebar showing today's classes with name and time range
- Fetches by current day of the week

---

## Project Structure

```
app/
├── app.vue                        # Root component: NuxtLayout + NuxtPage
├── assets/
│   └── css/main.css               # Tailwind base + global styles
├── components/
│   ├── BookingModal.vue            # Admin: search + book member into a class
│   ├── ClassList.vue               # Sidebar: today's class schedule
│   ├── MemberList.vue              # Admin: paginated member list + search
│   ├── MemberModal.vue             # Create/edit member form
│   ├── MemberStatsModal.vue        # Attendance bar chart (Chart.js)
│   └── WeeklyCalendar.vue          # Main booking grid with week navigation
├── layouts/
│   └── default.vue                 # Purple-to-dark gradient background
├── pages/
│   ├── index.vue                   # Dashboard: 3-column grid layout
│   └── members.vue                 # Standalone members page
├── composables/
│   └── useApi.js                   # Axios instance with base URL + credentials
├── stores/
│   ├── authStore.js                # User session, login state, role toggle
│   ├── bookingStore.js             # Weekly data, add/delete bookings
│   ├── classStore.js               # Daily class schedule
│   └── memberStore.js              # Member CRUD, pagination, search
└── tailwind.config.ts              # Custom colors + font family
```

---

## Dashboard Layout

The main page uses a CSS grid with a 1:4:1 column ratio:

```
┌──────────┬────────────────────────────────┬──────────┐
│ Classes  │           Booking              │ Members  │
├──────────┼────────────────────────────────┼──────────┤
│          │                                │          │
│  Today's │     Weekly Calendar Grid       │ Member   │
│  class   │  (days × time slots × members) │ list +   │
│  list    │                                │ search   │
│          │                                │          │
└──────────┴────────────────────────────────┴──────────┘
```

The Members panel is only visible to admins (`v-if="authStore.user?.role === 'ADMIN'"`).

---

## Pinia Stores

**authStore** — manages the current user session. Calls `/api/auth/me` on page load to check login state and role. Handles logout by redirecting to the backend's `/logout` endpoint and toggling roles via the demo endpoint.

**bookingStore** — fetches the weekly booking grid from `/api/booking/weekly?date=`. Handles week navigation by calculating Monday from the current date and shifting ±7 days. Manages add and delete booking actions with automatic re-fetch.

**memberStore** — paginated member CRUD. Fetches active members, supports search with debounce, and handles create/update/deactivate. Pagination state (`currentPage`, `totalPages`) is tracked in the store.

**classStore** — fetches the class schedule for the current day of the week from `/api/class/daily`.

---

## Role-Based UI

The frontend reads the user's role from `authStore.user.role` and conditionally renders:

| Feature | ADMIN | MEMBER | Not logged in |
|---------|:-----:|:------:|:-------------:|
| Weekly calendar (view) | ✅ | ✅ | ✅ |
| Self-book into class | ✅ | ✅ | ❌ |
| Add booking for others | ✅ | ❌ | ❌ |
| Remove bookings | ✅ | ❌ | ❌ |
| Member list + search | ✅ | ❌ | ❌ |
| Add/edit/deactivate members | ✅ | ❌ | ❌ |
| View member stats | ✅ | ❌ | ❌ |

---

## Running Locally

### Prerequisites
- Node.js 18+
- The backend running locally or deployed (for API calls)

### Setup

```bash
git clone https://github.com/IliasIosifidis/PushUpsFrontend.git
cd PushUpsFrontend
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

To point at a local backend, edit `app/pagescomposables/useApi.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // switch from Railway URL
  withCredentials: true,
})
```

Make sure your backend's CORS config allows `http://localhost:3000`.

---

## Deployment

Deployed on **Railway** with automatic builds from GitHub. No environment variables needed on the frontend — the API base URL is hardcoded in `useApi.js` pointing to the Railway backend.

---

## Key Design Decisions

- **Pinia over composables for shared state** — stores manage data that multiple components consume (members, bookings, auth). Props handle parent-child communication for modals.
- **`onMounted` over top-level `await`** — avoids needing `<Suspense>` wrappers; all API calls happen in `onMounted` hooks.
- **Debounced search** — 300ms timeout on member search input prevents excessive API calls while typing.
- **Session cookies over JWT storage** — the backend manages sessions; the frontend just sends `withCredentials: true` with every request. No token management needed.
- **Soft-delete in the UI** — the "Deactivate" button calls PATCH (toggle active), not DELETE. Deactivated members disappear from the list but their booking history remains intact.
- **Admin-only rendering via `v-if`** — the member panel and booking controls are conditionally rendered based on the auth store, keeping the member experience clean.
