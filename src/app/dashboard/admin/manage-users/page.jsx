"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Avatar,
} from "@heroui/react";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";
import { FiShield, FiAlertTriangle } from "react-icons/fi";
import { MdStore } from "react-icons/md";

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

const roleColor = { user: "default", vendor: "secondary", admin: "danger" };

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  }, [axiosSecure]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRole = async (id, role) => {
    setActionId(id + role);
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role });
      toast.success(`Role updated to ${role}`);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
    } catch { toast.error("Failed to update role"); }
    finally { setActionId(null); }
  };

  const handleFraud = async (id) => {
    const confirmed = await confirmAction("Mark this vendor as fraud? Their tickets will be hidden and they can no longer add tickets.");
    if (!confirmed) return;
    setActionId(id + "fraud");
    try {
      await axiosSecure.patch(`/users/${id}/fraud`);
      toast.success("Vendor marked as fraud");
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isFraud: true } : u));
    } catch { toast.error("Failed to mark as fraud"); }
    finally { setActionId(null); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 gradient-text">Manage Users</h1>
      <p className="text-default-500 text-sm mb-6">{users.length} total registered users</p>
      <div className="overflow-x-auto">
        <Table aria-label="Manage users" className="shadow-sm">
          <TableHeader>
            <TableColumn>User</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar src={u.photo || u.image || ""} name={u.name} size="sm" />
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-default-500">{u.email}</span>
                </TableCell>
                <TableCell>
                  <Chip color={roleColor[u.role] || "default"} variant="flat" size="sm" className="capitalize">
                    {u.role}
                  </Chip>
                </TableCell>
                <TableCell>
                  {u.isFraud ? (
                    <Chip color="danger" variant="flat" size="sm">Fraud</Chip>
                  ) : (
                    <Chip color="success" variant="flat" size="sm">Active</Chip>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="flat" color="danger"
                      isDisabled={u.role === "admin"}
                      isLoading={actionId === u._id + "admin"}
                      startContent={<FiShield size={13} />}
                      onPress={() => handleRole(u._id, "admin")}>
                      Make Admin
                    </Button>
                    <Button size="sm" variant="flat" color="secondary"
                      isDisabled={u.role === "vendor"}
                      isLoading={actionId === u._id + "vendor"}
                      startContent={<MdStore size={13} />}
                      onPress={() => handleRole(u._id, "vendor")}>
                      Make Vendor
                    </Button>
                    {u.role === "vendor" && !u.isFraud && (
                      <Button size="sm" variant="flat" color="warning"
                        isLoading={actionId === u._id + "fraud"}
                        startContent={<FiAlertTriangle size={13} />}
                        onPress={() => handleFraud(u._id)}>
                        Mark Fraud
                      </Button>
                    )}
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
