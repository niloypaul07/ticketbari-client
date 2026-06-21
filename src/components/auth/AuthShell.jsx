"use client";
import Link from "next/link";
import { MdOutlineTrain } from "react-icons/md";
import { MdDirectionsBus, MdTrain, MdFlight } from "react-icons/md";
import { GiSpeedBoat } from "react-icons/gi";

const highlights = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to manage bookings, track journeys, and discover routes across Bangladesh.",
    gradient: "from-brand-600 via-brand-800 to-zinc-950",
    accent: "text-brand-300",
  },
  register: {
    title: "Join TicketBari",
    subtitle: "Create an account and book bus, train, launch, and flight tickets in seconds.",
    gradient: "from-purple-700 via-purple-900 to-zinc-950",
    accent: "text-purple-300",
  },
};

export default function AuthShell({ variant = "login", heading, subheading, linkHref, linkLabel, linkText, children }) {
  const panel = highlights[variant];

  return (
    <div className="min-h-[calc(100vh-4.5rem)] grid lg:grid-cols-[1fr_1.05fr]">
      {/* Branding panel */}
      <div className={`hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br ${panel.gradient} text-white p-10 xl:p-14`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-xl text-white">
            <span className="bg-white/15 p-2 rounded-xl backdrop-blur-sm">
              <MdOutlineTrain size={22} />
            </span>
            TicketBari
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-4">{panel.title}</h1>
          <p className="text-white/75 text-lg leading-relaxed">{panel.subtitle}</p>

          <div className="flex flex-wrap gap-3 mt-10">
            {[
              { icon: <MdDirectionsBus size={18} />, label: "Bus" },
              { icon: <MdTrain size={18} />, label: "Train" },
              { icon: <GiSpeedBoat size={18} />, label: "Launch" },
              { icon: <MdFlight size={18} />, label: "Flight" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm font-medium"
              >
                <span className={panel.accent}>{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/50">
          Trusted ticket booking across Bangladesh
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 sm:px-8 py-10 sm:py-14 bg-default-50/50 dark:bg-zinc-950">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
              <span className="bg-gradient-to-r from-brand-500 to-purple-500 p-1.5 rounded-lg text-white">
                <MdOutlineTrain size={20} />
              </span>
              <span className="gradient-text">TicketBari</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-default-200 dark:border-default-100 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-foreground mb-1.5">{heading}</h2>
              <p className="text-default-500 text-sm">
                {subheading}{" "}
                <Link href={linkHref} className="text-brand-500 font-semibold hover:underline">
                  {linkLabel}
                </Link>
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export const authInputClassNames = {
  label: "text-default-700 font-medium text-sm",
  mainWrapper: "gap-1.5",
  inputWrapper:
    "h-12 min-h-12 px-3 border border-default-200 bg-white dark:bg-zinc-900 shadow-none rounded-xl hover:border-default-400 group-data-[focus=true]:border-brand-500",
  innerWrapper: "gap-2 items-center",
  input: "text-sm outline-none",
};

export const authGoogleButtonClass =
  "h-12 font-semibold border-default-200 bg-white dark:bg-zinc-900 hover:bg-default-50 dark:hover:bg-zinc-800 rounded-xl";

export const authSubmitButtonClass =
  "h-12 bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold shadow-md rounded-xl";
