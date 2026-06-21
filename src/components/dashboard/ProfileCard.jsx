"use client";
import { Avatar, Card, CardBody, Chip, Divider } from "@heroui/react";
import { FiMail, FiUser, FiShield } from "react-icons/fi";

export default function ProfileCard({ user, title = "My Profile" }) {
  if (!user) return null;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-black mb-6 gradient-text">{title}</h1>
      <Card className="shadow-sm border border-default-100 dark:border-default-50">
        <CardBody className="p-8">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Avatar
              src={user.image || user.photo || ""}
              name={user.name}
              className="w-24 h-24 text-2xl ring-4 ring-brand-400"
              isBordered
              color="primary"
            />
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <Chip color="primary" variant="flat" size="sm" className="mt-1 capitalize">
                {user.role}
              </Chip>
            </div>
          </div>
          <Divider className="mb-4" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiUser className="text-brand-400" size={18} />
              <div>
                <p className="text-xs text-default-400">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-brand-400" size={18} />
              <div>
                <p className="text-xs text-default-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiShield className="text-brand-400" size={18} />
              <div>
                <p className="text-xs text-default-400">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
