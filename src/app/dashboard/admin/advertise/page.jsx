"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip,
} from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { format } from "date-fns";

function AdvertiseToggle({ isOn, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!isOn)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
        isOn ? "bg-green-500" : "bg-default-300 dark:bg-default-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AdvertiseTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/tickets/admin/all");
      setTickets(
        res.data
          .filter((t) => t.verificationStatus === "approved")
          .map((t) => ({ ...t, isAdvertised: Boolean(t.isAdvertised) }))
      );
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

  const handleToggle = async (ticketId, newVal) => {
    if (newVal && advertisedCount >= 6) {
      toast.error("Cannot advertise more than 6 tickets at a time");
      return;
    }

    const id = String(ticketId);
    const previous = tickets.find((t) => String(t._id) === id);
    if (!previous) return;

    setToggling(id);
    setTickets((prev) =>
      prev.map((t) => (String(t._id) === id ? { ...t, isAdvertised: newVal } : t))
    );

    try {
      await axiosSecure.patch(`/tickets/${id}/advertise`, { isAdvertised: newVal });
      toast.success(newVal ? "Ticket advertised on homepage!" : "Advertisement removed");
    } catch (err) {
      setTickets((prev) =>
        prev.map((t) =>
          String(t._id) === id ? { ...t, isAdvertised: previous.isAdvertised } : t
        )
      );
      toast.error(err.response?.data?.error || "Toggle failed");
    } finally {
      setToggling(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black gradient-text">Advertise Tickets</h1>
        <Chip color={advertisedCount >= 6 ? "danger" : "success"} variant="flat">
          {advertisedCount}/6 advertised
        </Chip>
      </div>
      <p className="text-default-500 text-sm mb-6">
        Toggle to feature tickets on the homepage advertisement section. Maximum 6 at a time.
      </p>

      {tickets.length === 0 ? (
        <div className="text-center py-24 text-default-400">
          <p className="text-5xl mb-4">📢</p>
          <p className="text-lg font-semibold">No approved tickets yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table aria-label="Advertise tickets" className="shadow-sm">
            <TableHeader>
              <TableColumn>Ticket</TableColumn>
              <TableColumn>Route</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Seats</TableColumn>
              <TableColumn>Departure</TableColumn>
              <TableColumn>Advertise</TableColumn>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100"}
                          alt={t.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-sm max-w-[130px] line-clamp-2">{t.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-default-500">{t.from} → {t.to}</span>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="default">{t.transportType}</Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-brand-500 text-sm">৳{t.price}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{t.quantity}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-default-500">
                      {format(new Date(t.departureDateTime), "dd MMM yy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <AdvertiseToggle
                      isOn={Boolean(t.isAdvertised)}
                      disabled={
                        toggling === String(t._id) ||
                        (!t.isAdvertised && advertisedCount >= 6)
                      }
                      label={`Advertise ${t.title}`}
                      onChange={(checked) => handleToggle(t._id, checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
