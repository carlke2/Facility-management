# OpsHub — Workplace Operations Platform

![Status](https://img.shields.io/badge/status-active_development-orange)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2F%20Express-green)
![Database](https://img.shields.io/badge/database-MongoDB-brightgreen)
![Auth](https://img.shields.io/badge/auth-JWT-purple)
![Calendar](https://img.shields.io/badge/integration-Google%20Calendar-red)

OpsHub is a workplace operations platform designed to unify **Facility Booking**, **Human Resource**, and **Support Ticketing** into one clean enterprise system.

The current version focuses on a fully working **Facility Booking / Boardroom Booking** workflow, while **Human Resource** and **Support Ticketing** are presented as planned modules for upcoming versions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Module Status](#module-status)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Frontend Page Flow](#frontend-page-flow)
- [Authentication Flow](#authentication-flow)
- [Facility Booking Flow](#facility-booking-flow)
- [Admin Flow](#admin-flow)
- [Data Model Overview](#data-model-overview)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Recommended Folder Structure](#recommended-folder-structure)
- [Role-Based Access](#role-based-access)
- [Current Scope vs Planned Scope](#current-scope-vs-planned-scope)
- [Development Notes](#development-notes)

---

## Project Overview

OpsHub is built as a scrollable product website with live system functionality embedded into the **Facility Booking** section.

The landing page is not just a static dashboard. It works as a proper product website with anchored navigation sections:

- Home
- Human Resource
- Facility Booking
- Support Ticketing
- About
- Insights
- Contact

The **Facility Booking** section connects to the existing backend workflow for checking availability, viewing rooms, creating bookings, viewing user bookings, cancelling bookings, and accessing admin reports.

---

## Module Status

| Module | Status | Description |
|---|---|---|
| Facility Booking | Available Now | Live boardroom/resource booking workflow connected to backend APIs |
| Human Resource | Planned Module | Advertised as an upcoming HR operations module |
| Support Ticketing | Planned Module | Advertised as an upcoming support/ticketing module |

---

## Core Features

### Available Now — Facility Booking

- User authentication with JWT
- Boardroom / resource availability checking
- Free slot detection
- Room listing
- Booking creation
- User booking history
- Booking cancellation
- Google Calendar sync through backend
- Email and SMS notifications through backend
- Admin room management
- Admin activity logs
- Admin PDF / Excel report exports

### Planned — Human Resource

- Employee records
- Onboarding workflows
- Leave and attendance
- Policy and document management
- Performance tracking
- HR analytics

### Planned — Support Ticketing

- Ticket intake
- Ticket assignment
- SLA tracking
- Escalation rules
- Knowledge base
- Reports and analytics

---

## System Architecture

```mermaid
flowchart LR
    User[Website Visitor / User] --> Frontend[React Frontend]

    Frontend --> Landing[Scrollable Website Sections]
    Frontend --> AuthUI[Auth Modal / Auth Pages]
    Frontend --> FacilityUI[Facility Booking UI]
    Frontend --> AdminUI[Admin Console]

    AuthUI --> API[Node.js / Express API]
    FacilityUI --> API
    AdminUI --> API

    API --> Mongo[(MongoDB)]
    API --> Calendar[Google Calendar API]
    API --> Email[Email Service]
    API --> SMS[SMS Service]

    Landing --> HR[HR Marketing Section]
    Landing --> FacilityMarketing[Facility Booking Section]
    Landing --> Support[Support Ticketing Marketing Section]

    HR -. planned .-> FutureHR[Future HR Module]
    Support -. planned .-> FutureSupport[Future Support Module]

    classDef live fill:#e8f7ef,stroke:#1d9e75,color:#0d1b2e;
    classDef planned fill:#fff4e6,stroke:#e07b2a,color:#0d1b2e;
    classDef core fill:#ece9ff,stroke:#5b4cbe,color:#0d1b2e;

    class FacilityUI,API,Mongo,Calendar live;
    class HR,Support,FutureHR,FutureSupport planned;
    class Frontend,Landing,AuthUI,AdminUI core;
```

---

## Frontend Page Flow

The frontend uses a scrollable single-page website structure. Navigation links scroll to page sections instead of opening empty routes for unfinished modules.

```mermaid
flowchart TD
    A[User lands on Home] --> B{Navbar Action}

    B -->|Click Human Resource| C[Scroll to HR Section]
    B -->|Click Facility Booking| D[Scroll to Facility Booking Section]
    B -->|Click Support Ticketing| E[Scroll to Support Ticketing Section]
    B -->|Click About| F[Scroll to About Section]
    B -->|Click Insights| G[Scroll to Insights Section]
    B -->|Click Contact| H[Scroll to Contact Section]

    C --> C1[Show planned HR features only]
    D --> D1[Show live booking workflow]
    E --> E1[Show planned Support Ticketing features only]

    D1 --> I{User Signed In?}
    I -->|No| J[Show Sign In Prompt]
    I -->|Yes| K[Allow Booking Actions]

    K --> L[Check Availability]
    K --> M[View Rooms]
    K --> N[Create Booking]
    K --> O[My Bookings]

    K --> P{Is Admin?}
    P -->|Yes| Q[Show Admin Console]
    P -->|No| R[Hide Admin Tools]
```

---

## Authentication Flow

Authentication uses JWT tokens stored on the frontend and sent in the `Authorization` header for protected API requests.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Storage as LocalStorage

    User->>Frontend: Opens website
    Frontend->>Storage: Check token

    alt Token exists
        Frontend->>API: GET /auth/me
        API-->>Frontend: Current user
        Frontend-->>User: Show authenticated experience
    else No token
        Frontend-->>User: Show public website
    end

    User->>Frontend: Login with email and password
    Frontend->>API: POST /auth/login
    API-->>Frontend: JWT token
    Frontend->>Storage: Save token
    Frontend->>API: GET /auth/me
    API-->>Frontend: User profile and role
    Frontend-->>User: Show user actions
```

---

## Facility Booking Flow

This is the main live workflow in the current version.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB as MongoDB
    participant Calendar as Google Calendar
    participant Notify as Email / SMS

    User->>Frontend: Select booking date
    Frontend->>API: GET /api/day?date=YYYY-MM-DD
    API->>Calendar: Fetch booked calendar slots
    API->>DB: Fetch internal bookings
    API-->>Frontend: bookedSlots + freeSlots
    Frontend-->>User: Display available and booked slots

    User->>Frontend: Select room
    Frontend->>API: GET /api/rooms
    API->>DB: Fetch rooms
    API-->>Frontend: Room list
    Frontend-->>User: Display available rooms

    User->>Frontend: Submit booking form
    Frontend->>API: POST /api/bookings
    API->>DB: Validate room and overlaps
    API->>Calendar: Create calendar event
    API->>Notify: Send confirmation and reminders
    API->>DB: Save booking
    API-->>Frontend: Booking confirmed
    Frontend-->>User: Show success message
```

---

## Admin Flow

Admins can manage rooms, view activity logs, export reports, and connect Google Calendar.

```mermaid
flowchart TD
    A[Admin signs in] --> B[Frontend calls /auth/me]
    B --> C{user.role === ADMIN?}

    C -->|No| D[Hide Admin Console]
    C -->|Yes| E[Show Admin Console]

    E --> F[Room Management]
    E --> G[Activity Logs]
    E --> H[Booking Reports]
    E --> I[Google Calendar Connect]

    F --> F1[GET /api/rooms]
    F --> F2[POST /api/rooms]
    F --> F3[PATCH /api/rooms/:id]
    F --> F4[DELETE /api/rooms/:id]

    G --> G1[GET /api/admin/activity]

    H --> H1[GET /api/admin/bookings]
    H --> H2[Download PDF Report]
    H --> H3[Download Excel Report]

    I --> I1[GET /auth/google/connect]
```

---

## Data Model Overview

```mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    ROOM ||--o{ BOOKING : contains
    USER {
        string id
        string name
        string email
        string phone
        string role
    }

    ROOM {
        string id
        string name
        number capacity
        string location
        string notes
        boolean isActive
    }

    BOOKING {
        string id
        string roomId
        string userId
        number attendeeCount
        string teamName
        datetime startAt
        number durationMinutes
        string status
        string[] attendees
    }

    ACTIVITY_LOG {
        string id
        string type
        string userId
        string description
        datetime createdAt
    }
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current authenticated user |
| GET | `/auth/google/connect` | Start Google Calendar OAuth flow |

Example login payload:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

### Facility Booking

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/day?date=YYYY-MM-DD` | Get booked and free slots for a date |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/mine` | List current user bookings |
| DELETE | `/api/bookings/:id` | Cancel a booking |

Example booking payload:

```json
{
  "roomId": "room_id_here",
  "attendeeCount": 4,
  "teamName": "Engineering Team",
  "startAt": "2026-05-21T10:00:00.000Z",
  "durationMinutes": 60,
  "attendees": [
    "person1@example.com",
    "person2@example.com"
  ]
}
```

---

### Rooms

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rooms` | List rooms |
| POST | `/api/rooms` | Create room |
| PATCH | `/api/rooms/:id` | Update room |
| DELETE | `/api/rooms/:id` | Delete room |

Example room payload:

```json
{
  "name": "Boardroom A",
  "capacity": 12,
  "location": "Head Office",
  "notes": "Main executive meeting room"
}
```

---

### Admin & Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/bookings?from=ISO&to=ISO` | List all bookings in date range |
| GET | `/api/admin/activity?limit=50&skip=0` | View system activity logs |
| GET | `/api/admin/reports/bookings.pdf?from=ISO&to=ISO` | Download PDF report |
| GET | `/api/admin/reports/bookings.xlsx?from=ISO&to=ISO` | Download Excel report |

---

## Environment Variables

Create a `.env` file in the frontend root.

```env
VITE_API_URL=http://localhost:5000
```

If your backend runs on another port or domain, update `VITE_API_URL`.

Example:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the frontend

```txt
http://localhost:5173
```

---

## Recommended Folder Structure

```txt
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
│
├── sections/
│   ├── HomeSection.tsx
│   ├── HumanResourceSection.tsx
│   ├── FacilityBookingSection.tsx
│   ├── SupportTicketingSection.tsx
│   ├── AboutSection.tsx
│   ├── InsightsSection.tsx
│   └── ContactSection.tsx
│
├── features/
│   ├── auth/
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── facility/
│   │   ├── AvailabilityChecker.tsx
│   │   ├── RoomList.tsx
│   │   ├── BookingForm.tsx
│   │   └── MyBookings.tsx
│   │
│   └── admin/
│       ├── AdminConsole.tsx
│       ├── RoomManagement.tsx
│       ├── ActivityLogs.tsx
│       └── BookingReports.tsx
│
├── services/
│   ├── api.ts
│   ├── authApi.ts
│   ├── bookingApi.ts
│   ├── roomApi.ts
│   └── adminApi.ts
│
├── App.tsx
└── main.tsx
```

---

## Role-Based Access

```mermaid
flowchart LR
    Visitor[Unauthenticated Visitor] --> Public[View Public Website]
    Public --> HR[View HR Planned Section]
    Public --> Support[View Support Planned Section]
    Public --> FacilityPreview[View Facility Booking Marketing]

    Visitor --> Login[Sign In]

    Login --> User[Authenticated USER]
    Login --> Admin[Authenticated ADMIN]

    User --> CheckAvailability[Check Availability]
    User --> ViewRooms[View Rooms]
    User --> CreateBooking[Create Booking]
    User --> MyBookings[View / Cancel Own Bookings]

    Admin --> CheckAvailability
    Admin --> ViewRooms
    Admin --> CreateBooking
    Admin --> MyBookings
    Admin --> ManageRooms[Manage Rooms]
    Admin --> ActivityLogs[View Activity Logs]
    Admin --> Reports[Export PDF / Excel Reports]
    Admin --> CalendarConnect[Connect Google Calendar]
```

---

## Current Scope vs Planned Scope

### Current Version

The current version is focused on delivering a strong frontend foundation and connecting the Facility Booking workflow.

Available now:

- Scrollable website layout
- Navigation anchors
- Facility Booking section
- Auth modal
- JWT session handling
- API client with bearer token support
- Availability checking
- Room listing
- Booking form
- My bookings
- Admin console visibility
- Admin room/report/log workflows

### Planned Versions

Upcoming modules:

- Human Resource
- Support Ticketing

These sections currently exist as marketing sections only and should not pretend to be fully functional until backend modules are implemented.

---

## Development Notes

### Token Handling

The frontend stores the JWT token in local storage using:

```js
localStorage.getItem("token")
```

All protected API requests should include:

```js
Authorization: Bearer <token>
```

---

### Date Handling

Availability checks use:

```txt
YYYY-MM-DD
```

Booking submissions use ISO 8601:

```txt
2026-05-21T10:00:00.000Z
```

---

### Error Handling

Backend errors should be displayed clearly to the user.

Expected backend error shape:

```json
{
  "ok": false,
  "message": "Reason for failure"
}
```

Examples of user-facing errors:

```txt
Unable to load availability. Try again.
This room is already booked for the selected time.
Please sign in to continue.
Booking cancelled successfully.
Report downloaded successfully.
```

---

## UI / Design Direction

The frontend should feel like a polished enterprise SaaS website.

Design principles:

- Clean landing page structure
- Sticky navigation
- Smooth scrolling
- Light website sections where appropriate
- Deep navy / charcoal product surfaces
- Plum / purple brand accent
- Warm orange / red used carefully for Facility Booking actions
- No excessive neon gradients
- No fake AI-style glow
- No bulky cards
- Clear typography
- Responsive on mobile, tablet, and desktop

---

## Responsive Behavior

The frontend should support:

- Desktop
- Tablet
- Mobile

Expected mobile behavior:

- Navigation collapses or simplifies
- Sections stack vertically
- Cards fit screen width
- Booking forms remain usable
- Tables either scroll horizontally or transform into card layouts
- CTAs remain visible and easy to tap

---

## Future Roadmap

```mermaid
timeline
    title OpsHub Product Roadmap

    Current Version : Scrollable website foundation
                    : Facility Booking live workflow
                    : Auth and role-based access
                    : Admin room management
                    : Admin reports and exports

    Next Version : Improve Facility Booking UX
                 : Better room filtering
                 : Calendar-first booking experience
                 : Stronger report dashboards

    HR Module : Employee records
              : Onboarding
              : Leave and attendance
              : Policy documents
              : Performance tracking

    Support Ticketing Module : Ticket intake
                              : Assignment workflow
                              : SLA tracking
                              : Knowledge base
                              : Reports and analytics

    Platform Expansion : Unified admin dashboard
                       : Cross-module insights
                       : Notifications center
                       : Integrations layer
```

---

## Final Product Flow

```mermaid
flowchart TD
    A[Visitor opens OpsHub] --> B[Home Section]
    B --> C[Understands platform promise]
    C --> D[Sees Facility Booking is available now]

    D --> E{Navigation Choice}

    E -->|Human Resource| F[HR Planned Module Section]
    E -->|Facility Booking| G[Live Facility Booking Workflow]
    E -->|Support Ticketing| H[Support Planned Module Section]
    E -->|Insights| I[Reports and Analytics Preview]
    E -->|Contact| J[Request Demo / Contact]

    G --> K{Signed In?}
    K -->|No| L[Prompt Sign In]
    K -->|Yes| M[Check Availability]

    M --> N[View Free Slots]
    N --> O[Select Room]
    O --> P[Submit Booking]
    P --> Q[Google Calendar Sync]
    Q --> R[Email / SMS Notifications]
    R --> S[Booking Confirmed]

    M --> T{Admin?}
    T -->|Yes| U[Manage Rooms / Logs / Reports]
    T -->|No| V[User Booking Actions Only]
```

---

## License

This project is currently private/internal.  
Update this section when a formal license is selected.

---

## Author

Built and maintained by the project team.

```txt
OpsHub / Workplace Operations Platform
Facility Booking available now.
Human Resource and Support Ticketing planned.
```
