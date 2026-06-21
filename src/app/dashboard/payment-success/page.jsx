"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Missing payment session.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await axiosSecure.get(`/payments/verify-session?session_id=${sessionId}`);
        setTransactionId(res.data.transactionId || "");
      } catch (err) {
        const message = err.response?.data?.error || "Could not verify payment";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, axiosSecure]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
          <span className="text-4xl">✕</span>
        </div>
        <h1 className="text-2xl font-black mb-2">Payment Verification Failed</h1>
        <p className="text-default-500 mb-8">{error}</p>
        <Button
          className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold"
          onPress={() => router.push("/dashboard/user/my-bookings")}
        >
          Back to My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-16 px-6">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
        <span className="text-4xl text-success-600">✓</span>
      </div>
      <h1 className="text-3xl font-black mb-3 gradient-text">Payment Successful</h1>
      <p className="text-default-500 mb-6">Thank you! Your payment was successfully processed.</p>
      {transactionId && (
        <p className="text-sm text-default-400 mb-8 break-all">
          Transaction ID: <span className="font-mono text-default-600 dark:text-default-300">{transactionId}</span>
        </p>
      )}
      <Button
        className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold"
        onPress={() => router.push("/dashboard/user/transactions")}
      >
        Go to Transaction History
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
