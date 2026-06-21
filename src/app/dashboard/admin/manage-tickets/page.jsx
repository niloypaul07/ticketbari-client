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

const statusColor = { pending: "warning", approved: "success", rejected: "danger" };

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/tickets/admin/all");
      setTickets(res.data);
    } catch { toast.error("Failed to load tickets"); }
    finally { setLoading(false); }
  }, [axiosSecure]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleVerify = async (id, status) => {
    setActionId(id + status);
    try {
      await axiosSecure.patch(`/tickets/${id}/verify`, { status });
      toast.success(`Ticket ${status}`);
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, verificationStatus: status } : t));
    } catch { toast.error("Action failed"); }
    finally { setActionId(null); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">Manage Tickets</h1>
      <p className="text-default-500 text-sm mb-6">{tickets.length} total tickets submitted by vendors</p>
      <div className="overflow-x-auto">
        <Table aria-label="Manage tickets" className="shadow-sm">
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Route</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Vendor</TableColumn>
            <TableColumn>Departure</TableColumn>
            <TableColumn>Price</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t._id}>
                <TableCell>
                  <span className="font-medium text-sm max-w-[130px] line-clamp-1 block">{t.title}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-default-500">{t.from} → {t.to}</span>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="default">{t.transportType}</Chip>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-default-500 max-w-[120px] block truncate">{t.vendorEmail}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-default-500">
                    {format(new Date(t.departureDateTime), "dd MMM yy")}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-brand-500 text-sm">৳{t.price}</span>
                </TableCell>
                <TableCell>
                  <Chip color={statusColor[t.verificationStatus]} variant="flat" size="sm" className="capitalize">
                    {t.verificationStatus}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" color="success" variant="flat"
                      isDisabled={t.verificationStatus === "approved"}
                      isLoading={actionId === t._id + "approved"}
                      startContent={<FiCheck size={13} />}
                      onPress={() => handleVerify(t._id, "approved")}>
                      Approve
                    </Button>
                    <Button size="sm" color="danger" variant="flat"
                      isDisabled={t.verificationStatus === "rejected"}
                      isLoading={actionId === t._id + "rejected"}
                      startContent={<FiX size={13} />}
                      onPress={() => handleVerify(t._id, "rejected")}>
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
