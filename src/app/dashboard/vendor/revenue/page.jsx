"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardBody } from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#2c7ef8", "#9333ea", "#10b981"];

export default function RevenueOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchStats = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/tickets/vendor/revenue");
      setStats(res.data);
    } catch { toast.error("Failed to load revenue data"); }
    finally { setLoading(false); }
  }, [axiosSecure]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <LoadingSpinner />;

  const barData = [
    { name: "Total Tickets", value: stats?.totalTickets || 0 },
    { name: "Tickets Sold", value: stats?.totalSold || 0 },
  ];

  const pieData = [
    { name: "Total Tickets", value: stats?.totalTickets || 0 },
    { name: "Sold", value: stats?.totalSold || 0 },
    { name: "Unsold", value: Math.max(0, (stats?.totalTickets || 0) - (stats?.totalSold || 0)) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">Revenue Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Total Tickets Added", value: stats?.totalTickets || 0, color: "from-brand-500 to-brand-700", emoji: "🎟️" },
          { label: "Total Tickets Sold", value: stats?.totalSold || 0, color: "from-purple-500 to-purple-700", emoji: "✅" },
          { label: "Total Revenue", value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, color: "from-emerald-500 to-emerald-700", emoji: "💰" },
        ].map((s) => (
          <Card key={s.label} className={`bg-gradient-to-br ${s.color} text-white shadow-lg`}>
            <CardBody className="p-6">
              <p className="text-3xl mb-1">{s.emoji}</p>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-bold mb-4">Ticket Overview</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#2c7ef8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardBody className="p-6">
            <h3 className="font-bold mb-4">Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90}
                  dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
