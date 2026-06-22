"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import {
  Button, Chip, Input, Divider
} from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import CountdownTimer from "@/components/CountdownTimer";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { MdDirectionsBus, MdTrain, MdFlight, MdLocationOn, MdAccessTime } from "react-icons/md";
import { GiSpeedBoat } from "react-icons/gi";
import { FaTag, FaCheckCircle } from "react-icons/fa";
import { format } from "date-fns";

const transportIcons = {
  Bus: <MdDirectionsBus size={20} className="text-green-500" />,
  Train: <MdTrain size={20} className="text-blue-500" />,
  Launch: <GiSpeedBoat size={20} className="text-cyan-500" />,
  Plane: <MdFlight size={20} className="text-purple-500" />,
};

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params.id;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();

  useEffect(() => {
    if (!ticketId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}`)
      .then((r) => setTicket(r.data))
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return <div className="pt-20"><LoadingSpinner /></div>;
  if (!ticket) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">🎫</p>
      <h2 className="text-2xl font-bold">Ticket not found</h2>
    </div>
  );

  const departed = new Date(ticket.departureDateTime) < new Date();
  const soldOut = ticket.quantity === 0;
  const bookDisabled = departed || soldOut;

  const handleBookNow = () => {
    if (!user) {
      router.push(`/login?callbackUrl=/tickets/${ticketId}`);
      return;
    }
    setIsOpen(true);
  };

  const handleSubmitBooking = async (onClose) => {
    if (quantity < 1 || quantity > ticket.quantity) {
      toast.error(`Quantity must be between 1 and ${ticket.quantity}`);
      return;
    }
    setBooking(true);
    try {
      await axiosSecure.post("/bookings", { ticketId: ticket._id, quantity });
      toast.success("Booking successful!");
      setIsOpen(false);
      setQuantity(1);
      router.push("/dashboard/user/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative h-72 lg:h-full min-h-[320px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={ticket.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800"}
            alt={ticket.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <Chip startContent={transportIcons[ticket.transportType]} color="default" variant="flat" className="bg-black/60 text-white border-white/20">
              {ticket.transportType}
            </Chip>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-2">{ticket.title}</h1>
            <div className="flex items-center gap-2 text-default-500">
              <MdLocationOn className="text-brand-400" />
              <span>{ticket.from} → {ticket.to}</span>
            </div>
          </div>

          <Divider />

          {/* Price & Quantity */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Price per seat</p>
              <p className="text-3xl font-black text-brand-500">৳{ticket.price?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-default-500">Seats Available</p>
              <p className={`text-2xl font-bold ${soldOut ? "text-danger" : "text-success"}`}>
                {soldOut ? "Sold Out" : ticket.quantity}
              </p>
            </div>
          </div>

          {/* Departure */}
          <div className="bg-default-50 dark:bg-default-50/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-default-500 mb-1">
              <MdAccessTime className="text-brand-400" />
              <span>Departure</span>
            </div>
            <p className="font-semibold text-lg">
              {format(new Date(ticket.departureDateTime), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>

          {/* Countdown */}
          {!departed && (
            <div>
              <p className="text-sm text-default-500 mb-2 text-center">Departing in</p>
              <CountdownTimer departureDateTime={ticket.departureDateTime} />
            </div>
          )}

          {/* Perks */}
          {ticket.perks?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 text-default-500">Perks</p>
              <div className="flex flex-wrap gap-2">
                {ticket.perks.map((p) => (
                  <Chip key={p} startContent={<FaCheckCircle className="text-success" size={12} />} variant="flat" color="success" size="sm">{p}</Chip>
                ))}
              </div>
            </div>
          )}

          {/* Vendor */}
          <div className="text-sm text-default-500">
            <span className="font-medium">Vendor: </span>{ticket.vendorName} ({ticket.vendorEmail})
          </div>

          <Button
            size="lg"
            isDisabled={bookDisabled}
            onPress={handleBookNow}
            className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold shadow-lg"
          >
            {soldOut ? "Sold Out" : departed ? "Booking Closed" : "Book Now"}
          </Button>
          {bookDisabled && (
            <p className="text-danger text-sm text-center -mt-2">
              {soldOut ? "This ticket is sold out." : "Departure time has passed."}
            </p>
          )}
        </div>
      </div>

      {/* Custom Book Now Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up flex flex-col border border-gray-100 dark:border-zinc-800">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Booking</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{ticket.title}</p>
            </div>
            
            {/* Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl border border-brand-100 dark:border-brand-900/30">
                <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">Price per seat</p>
                <strong className="text-brand-600 dark:text-brand-400">৳{ticket.price.toLocaleString()}</strong>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Available seats: <strong className="text-gray-900 dark:text-white">{ticket.quantity}</strong>
              </p>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Number of Seats
                </label>
                <Input
                  type="number"
                  min={1}
                  max={ticket.quantity}
                  value={String(quantity)}
                  onValueChange={(v) => setQuantity(Number(v))}
                  variant="bordered"
                  className="w-full"
                  classNames={{ inputWrapper: "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850" }}
                />
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 mt-2 border border-gray-100 dark:border-zinc-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount</span>
                  <span className="font-black text-2xl text-brand-500">
                    ৳{(ticket.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-850/50">
              <Button 
                variant="flat" 
                color="default" 
                onPress={() => setIsOpen(false)}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700 text-white font-bold shadow-md"
                isLoading={booking}
                onPress={() => handleSubmitBooking()}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
