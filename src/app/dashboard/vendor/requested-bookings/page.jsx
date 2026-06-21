"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip,
} from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FiCheck, FiX } from "react-icons/fi";

const statusColor = { pending: "warning", accepted: "success", rejected: "danger", paid: "primary" };

export default function RequestedBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/bookings/vendor");
      setBookings(res.data);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  }, [axiosSecure]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatus = async (id, status) => {
    setActionId(id + status);
    try {
      await axiosSecure.patch(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch { toast.error("Action failed"); }
    finally { setActionId(null); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">Requested Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-24 text-default-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-semibold">No booking requests yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table aria-label="Requested bookings" className="shadow-sm">
            <TableHeader>
              <TableColumn>User</TableColumn>
              <TableColumn>Ticket</TableColumn>
              <TableColumn>Qty</TableColumn>
              <TableColumn>Total</TableColumn>
              <TableColumn>Departure</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{b.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm line-clamp-1 max-w-[140px]">{b.ticketTitle}</span>
                  </TableCell>
                  <TableCell><span className="font-semibold">{b.quantity}</span></TableCell>
                  <TableCell>
                    <span className="font-bold text-brand-500">৳{b.totalPrice?.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-default-500">
                      {format(new Date(b.departureDateTime), "dd MMM yy, hh:mm a")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip color={statusColor[b.status]} variant="flat" size="sm" className="capitalize">
                      {b.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {b.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" color="success" variant="flat"
                          startContent={<FiCheck size={14} />}
                          isLoading={actionId === b._id + "accepted"}
                          onPress={() => handleStatus(b._id, "accepted")}>
                          Accept
                        </Button>
                        <Button size="sm" color="danger" variant="flat"
                          startContent={<FiX size={14} />}
                          isLoading={actionId === b._id + "rejected"}
                          onPress={() => handleStatus(b._id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-default-400 italic">No action</span>
                    )}
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
