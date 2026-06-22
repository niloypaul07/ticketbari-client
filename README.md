# 🎫 TicketBari — Client

> A modern, full-featured transport ticket booking platform built with **Next.js 16** and **React 19**.

**Live Demo:** [https://ticketbari-client-ivory.vercel.app](https://ticketbari-client-ivory.vercel.app)  
**Backend API:** [https://ticketbari-server-mauve.vercel.app](https://ticketbari-server-mauve.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Email/password & Google OAuth via [Better Auth](https://better-auth.com)
- 🎟️ **Browse Tickets** — Search, filter by transport type, sort by price, paginated results
- 🛒 **Book Tickets** — Seat selection with real-time availability check
- 💳 **Stripe Payments** — Secure online payment via Stripe Checkout
- 🌙 **Dark / Light Mode** — System-aware theme switching
- 📊 **Role-based Dashboards** — Separate dashboards for Users, Vendors, and Admins
- ⏱️ **Countdown Timer** — Live countdown to departure on each ticket
- 📱 **Fully Responsive** — Mobile-first layout

### Dashboards

| Role | Features |
|------|----------|
| **User** | My Bookings, Transaction History, Profile |
| **Vendor** | Add / Edit / Delete Tickets, Manage Booking Requests, Revenue Analytics |
| **Admin** | Manage All Tickets (approve/reject/advertise), Manage All Users (roles, fraud detection) |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | JavaScript (React 19) |
| Styling | Tailwind CSS v3 |
| UI Components | [HeroUI](https://heroui.com) |
| Auth | [Better Auth](https://better-auth.com) |
| HTTP Client | Axios |
| Payments | Stripe (`@stripe/react-stripe-js`) |
| Animations | Framer Motion |
| Charts | Recharts |
| Carousel | Swiper |
| Toasts | react-hot-toast |
| Date Utils | date-fns |
| Icons | react-icons |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page (email + Google)
│   │   └── register/       # Registration page
│   ├── (main)/
│   │   ├── page.jsx        # Homepage (hero, advertised & latest tickets)
│   │   ├── tickets/        # All tickets browse page
│   │   │   └── [id]/       # Ticket detail + Book Now
│   │   ├── about/
│   │   └── contact/
│   ├── dashboard/
│   │   ├── user/           # My Bookings, Transactions, Profile
│   │   ├── vendor/         # Add Ticket, My Tickets, Bookings, Revenue
│   │   └── admin/          # Manage Tickets, Users, Advertise
│   └── api/auth/           # Better Auth catch-all handler
├── components/
│   ├── Navbar.jsx
│   ├── CountdownTimer.jsx
│   ├── LoadingSpinner.jsx
│   └── auth/AuthShell.jsx
├── context/
│   └── AuthContext.jsx     # Global auth state + Express JWT sync
├── hooks/
│   └── useAxiosSecure.js   # Axios instance with JWT interceptor
└── lib/
    └── auth-client.js      # Better Auth client config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A running instance of [ticketbari-server](https://github.com/niloypaul07/ticketbari-server)

### 1. Clone the repository

```bash
git clone https://github.com/niloypaul07/ticketbari-client.git
cd ticketbari-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (via Better Auth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# MongoDB (for Better Auth session storage)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ticketbari

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Base URL of the Express backend API |
| `BETTER_AUTH_SECRET` | ✅ | Secret key for Better Auth session signing |
| `BETTER_AUTH_URL` | ✅ | Public URL of this Next.js app |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `MONGODB_URI` | ✅ | MongoDB connection string (Better Auth sessions) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |

---

## 🌐 Deployment (Vercel)

1. Push your repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from the table above in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

> **Google OAuth:** Remember to add your Vercel domain to the **Authorized JavaScript origins** and **Authorized redirect URIs** in your [Google Cloud Console](https://console.cloud.google.com).
>
> Redirect URI format: `https://your-app.vercel.app/api/auth/callback/google`

---

## 🔐 Auth Flow

TicketBari uses a **dual-auth architecture**:

1. **Better Auth** handles the user-facing session (email/password + Google OAuth)
2. After login, the client calls `POST /api/auth/sync` on the Express backend to exchange the Better Auth session for an **Express JWT**
3. All protected API calls use this JWT in the `Authorization: Bearer <token>` header

```
User logs in (Better Auth)
  → POST /api/auth/sync → Express issues JWT
  → JWT stored in sessionStorage
  → All API calls use JWT via useAxiosSecure hook
```

---

## 📄 License

MIT © [Niloy Paul](https://github.com/niloypaul07)
