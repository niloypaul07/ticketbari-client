"use client";
import { Avatar, Card, CardBody, Chip, Divider } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { FiMail, FiUser, FiShield } from "react-icons/fi";

export default function AdminProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-black mb-6 gradient-text">Admin Profile</h1>
      <Card className="shadow-sm">
        <CardBody className="p-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Avatar src={user.image || user.photo || ""} name={user.name}
              className="w-24 h-24 text-2xl ring-4 ring-red-400" isBordered color="danger" />
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <Chip color="danger" variant="flat" size="sm" className="mt-1 capitalize">{user.role}</Chip>
            </div>
          </div>
          <Divider className="mb-4" />
          <div className="space-y-4">
            {[
              { icon: <FiUser />, label: "Full Name", val: user.name },
              { icon: <FiMail />, label: "Email", val: user.email },
              { icon: <FiShield />, label: "Role", val: user.role },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-red-400">{row.icon}</span>
                <div>
                  <p className="text-xs text-default-400">{row.label}</p>
                  <p className="font-medium capitalize">{row.val}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
