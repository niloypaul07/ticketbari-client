"use client";
import { useEffect, useState, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/components/LoadingSpinner";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function TransactionHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchPayments = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/payments/my");
      setPayments(res.data);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">Transaction History</h1>
      {payments.length === 0 ? (
        <div className="text-center py-24 text-default-400">
          <p className="text-5xl mb-4">💳</p>
          <p className="text-lg font-semibold">No transactions yet</p>
        </div>
      ) : (
        <Table aria-label="Transaction history" className="shadow-sm">
          <TableHeader>
            <TableColumn>Transaction ID</TableColumn>
            <TableColumn>Ticket</TableColumn>
            <TableColumn>Amount</TableColumn>
            <TableColumn>Date</TableColumn>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  <span className="text-xs font-mono text-default-500 break-all">
                    {p.transactionId}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-sm">{p.ticketTitle}</span>
                </TableCell>
                <TableCell>
                  <Chip color="success" variant="flat" size="sm">
                    ৳{p.amount?.toLocaleString()}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-default-500">
                    {format(new Date(p.paymentDate), "dd MMM yyyy, hh:mm a")}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
