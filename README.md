# TicketBari — Online Ticket Booking Platform

## 🎟️ Project Overview

**TicketBari** is a full-stack Online Ticket Booking Platform built with the **MERN stack** where users can discover and book travel tickets (Bus, Train, Launch, Plane) across Bangladesh. The platform supports three roles: **User**, **Vendor**, and **Admin**.

## 🔗 Live URL

> https://ticketbari.vercel.app *(update after deployment)*

## 🚀 Key Features

### User Features
- Register & login with email/password or Google OAuth (BetterAuth)
- Browse all approved tickets with search, filter, sort, and pagination
- Book tickets with quantity validation and departure countdown
- Pay via Stripe after vendor approval
- View booking history with real-time status
- Transaction history dashboard

### Vendor Features
- Add tickets with ImgBB image upload
- Manage own tickets (update/delete)
- Accept or reject user booking requests
- Revenue overview with charts (Recharts)

### Admin Features
- Approve or reject vendor-submitted tickets
- Manage all users (assign Admin/Vendor roles, mark fraud)
- Toggle advertisement for up to 6 tickets on the homepage
- Full platform oversight

### Extra Features
- 🌙 Dark / Light mode toggle
- 🔍 Search by From → To location
- 🔽 Filter by transport type
- 💲 Sort by price (low→high / high→low)
- 📄 Pagination (9 per page)
- ⏰ Live countdown timer to departure
- 🔐 JWT-protected API routes

## 🛠️ Tech Stack

### Client
| Package | Purpose |
|---|---|
| `next` | React Framework (App Router) |
| `@heroui/react` | UI Component Library |
| `react-icons` | Icon library |
| `better-auth` | Authentication (email/password + Google OAuth) |
| `axios` | HTTP client |
| `@stripe/stripe-js` + `@stripe/react-stripe-js` | Payment processing |
| `recharts` | Revenue charts |
| `swiper` | Hero banner slider |
| `framer-motion` | Animations |
| `react-hot-toast` | Notifications |
| `date-fns` | Date formatting |
| `tailwindcss` | Styling |
| `next-themes` | Dark/Light mode |

### Server
| Package | Purpose |
|---|---|
| `express` | HTTP framework |
| `mongodb` | Native MongoDB driver |
| `jsonwebtoken` | JWT auth |
| `bcryptjs` | Password hashing |
| `stripe` | Payment processing |
| `cors` | CORS middleware |
| `dotenv` | Environment variables |

## ⚙️ Environment Variables

### Client (`.env.local`)
```
NEXT_PUBLIC_API_URL=https://your-server.vercel.app/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_IMGBB_API_KEY=xxx
NEXT_PUBLIC_APP_URL=https://ticketbari.vercel.app
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://ticketbari.vercel.app
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Server (`.env`)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=xxx
STRIPE_SECRET_KEY=sk_test_xxx
CLIENT_URL=https://ticketbari.vercel.app
PORT=5000
```

## 📁 Project Structure

```
ticketbari-client/     ← Next.js (JSX) + HeroUI + Tailwind
ticketbari-server/     ← Express.js + MongoDB native driver
```

## 🔑 Test Credentials

- **Admin**: admin@ticketbari.com / Admin@123
- **Vendor**: vendor@ticketbari.com / Vendor@123

## 📜 GitHub Repositories

- Client: https://github.com/your-username/ticketbari-client
- Server: https://github.com/your-username/ticketbari-server
