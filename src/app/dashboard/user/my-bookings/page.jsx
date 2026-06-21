"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardBody, CardFooter, Chip, Button } from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import CountdownTimer from "@/components/CountdownTimer";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import Image from "next/image";
import { format } from "date-fns";

const statusColor = { pending: "warning", accepted: "success", rejected: "danger", paid: "primary" };

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/bookings/my");
      setBookings(res.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handlePayNow = async (booking) => {
    const departed = new Date(booking.departureDateTime) < new Date();
    if (departed) {
      toast.error("Departure time has passed");
      return;
    }

    setPayingId(booking._id);
    try {
      const res = await axiosSecure.post("/payments/create-checkout-session", {
        bookingId: booking._id,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }
      toast.error("Could not start checkout");
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment init failed");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">My Booked Tickets</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-24 text-default-400">
          <p className="text-5xl mb-4">🎫</p>
          <p className="text-lg font-semibold">No bookings yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const departed = new Date(b.departureDateTime) < new Date();
            return (
              <Card key={b._id} className="card-hover border border-default-100 dark:border-default-50">
                <div className="relative h-40 w-full">
                  <Image
                    src={b.ticketImage || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"}
                    alt={b.ticketTitle}
                    fill
                    className="object-cover rounded-t-xl"
                    sizes="33vw"
                  />
                </div>
                <CardBody className="px-4 py-3 gap-2">
                  <h3 className="font-bold text-sm line-clamp-1">{b.ticketTitle}</h3>
                  <p className="text-xs text-default-500">
                    {b.from} → {b.to}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">Qty: {b.quantity}</span>
                    <span className="font-bold text-brand-500">৳{b.totalPrice?.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-default-400">
                    {format(new Date(b.departureDateTime), "dd MMM yyyy, hh:mm a")}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <Chip color={statusColor[b.status]} variant="flat" size="sm" className="capitalize">
                      {b.status}
                    </Chip>
                    {b.status !== "rejected" && !departed && (
                      <CountdownTimer departureDateTime={b.departureDateTime} compact />
                    )}
                  </div>
                </CardBody>
                {b.status === "accepted" && (
                  <CardFooter className="px-4 pt-0 pb-4">
                    <Button
                      fullWidth
                      size="sm"
                      isDisabled={departed}
                      isLoading={payingId === b._id}
                      className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold"
                      onPress={() => handlePayNow(b)}
                    >
                      {departed ? "Expired" : "Pay Now"}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
