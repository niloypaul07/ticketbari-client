"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardBody, CardFooter, Chip, Button,
} from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import { uploadToImgBB } from "@/lib/imgbb";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const confirmAction = (msg) =>
  new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm">{msg}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="px-3 py-1 rounded-lg text-sm border border-default-300"
            >Cancel</button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="px-3 py-1 rounded-lg text-sm bg-red-500 text-white"
            >Confirm</button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });

const statusColor = { pending: "warning", approved: "success", rejected: "danger" };
const TRANSPORT_TYPES = ["Bus", "Train", "Launch", "Plane"];
const PERKS_OPTIONS = ["AC", "Breakfast", "WiFi", "Recliner Seat", "Charging Point", "Blanket & Pillow", "Snacks"];

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const axiosSecure = useAxiosSecure();
  const router = useRouter();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/tickets/vendor");
      setTickets(res.data);
    } catch { toast.error("Failed to load tickets"); }
    finally { setLoading(false); }
  }, [axiosSecure]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleDelete = async (id) => {
    const confirmed = await confirmAction("Delete this ticket? This cannot be undone.");
    if (!confirmed) return;
    setDeleting(id);
    try {
      await axiosSecure.delete(`/tickets/${id}`);
      toast.success("Ticket deleted");
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">My Added Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-24 text-default-400">
          <p className="text-5xl mb-4">🎟️</p>
          <p className="text-lg font-semibold">No tickets added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => {
            const isRejected = t.verificationStatus === "rejected";
            return (
              <Card key={t._id} className="border border-default-100 dark:border-default-50">
                <div className="relative h-40 w-full">
                  <img src={t.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"}
                    alt={t.title} className="w-full h-full object-cover rounded-t-xl"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"; }} />
                  <div className="absolute top-2 right-2">
                    <Chip color={statusColor[t.verificationStatus]} variant="flat" size="sm" className="capitalize">
                      {t.verificationStatus}
                    </Chip>
                  </div>
                </div>
                <CardBody className="px-4 py-3 gap-1.5">
                  <h3 className="font-bold text-sm line-clamp-1">{t.title}</h3>
                  <p className="text-xs text-default-500">{t.from} → {t.to}</p>
                  <p className="text-xs text-default-500">{t.transportType} • ৳{t.price} • {t.quantity} seats</p>
                  <p className="text-xs text-default-400">
                    {format(new Date(t.departureDateTime), "dd MMM yyyy, hh:mm a")}
                  </p>
                </CardBody>
                <CardFooter className="px-4 pb-4 pt-0 gap-2">
                  <Button size="sm" variant="flat" color="primary" isDisabled={isRejected}
                    onPress={() => router.push(`/dashboard/vendor/update-ticket/${t._id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5">
                    <FiEdit2 size={14} /> Update
                  </Button>
                  <Button size="sm" variant="flat" color="danger" isDisabled={isRejected}
                    isLoading={deleting === t._id}
                    onPress={() => handleDelete(t._id)} className="flex-1 flex items-center justify-center gap-1.5">
                    <FiTrash2 size={14} /> Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
