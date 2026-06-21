"use client";
import { useState, useEffect } from "react";
import { formatDistanceToNow, isPast, differenceInSeconds } from "date-fns";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ departureDateTime, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const target = new Date(departureDateTime);

    const calc = () => {
      const totalSeconds = differenceInSeconds(target, new Date());
      if (totalSeconds <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      const d = Math.floor(totalSeconds / 86400);
      const h = Math.floor((totalSeconds % 86400) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setTimeLeft({ d, h, m, s });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [departureDateTime]);

  if (expired) {
    return (
      <span className="text-danger font-semibold text-sm">
        ⏰ Departed
      </span>
    );
  }

  if (!timeLeft) return null;

  if (compact) {
    return (
      <span className="text-warning font-semibold text-sm tabular-nums">
        {timeLeft.d}d {pad(timeLeft.h)}h {pad(timeLeft.m)}m {pad(timeLeft.s)}s
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      {[
        { label: "Days", val: timeLeft.d },
        { label: "Hrs", val: pad(timeLeft.h) },
        { label: "Min", val: pad(timeLeft.m) },
        { label: "Sec", val: pad(timeLeft.s) },
      ].map(({ label, val }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-default-100 dark:bg-default-50 rounded-xl px-3 py-2 min-w-[56px]"
        >
          <span className="text-xl font-bold tabular-nums text-brand-500">{val}</span>
          <span className="text-xs text-default-500 uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  );
}
