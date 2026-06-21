"use client";
import { Input, Textarea, Button } from "@heroui/react";
import { FiMail, FiPhone, FiFacebook } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-2 gradient-text">Contact Us</h1>
      <p className="text-default-500 mb-10">Have questions? We&apos;d love to hear from you.</p>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-default-50 dark:bg-default-50/5 border border-default-100">
            <FiMail className="text-brand-500" size={22} />
            <div>
              <p className="text-sm text-default-400">Email</p>
              <p className="font-medium">support@ticketbari.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-default-50 dark:bg-default-50/5 border border-default-100">
            <FiPhone className="text-brand-500" size={22} />
            <div>
              <p className="text-sm text-default-400">Phone</p>
              <p className="font-medium">+880 1700-000000</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-default-50 dark:bg-default-50/5 border border-default-100">
            <FiFacebook className="text-brand-500" size={22} />
            <div>
              <p className="text-sm text-default-400">Facebook Page</p>
              <p className="font-medium">facebook.com/ticketbari</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-2xl border border-default-100 dark:border-default-50">
          <Input label="Your Name" variant="bordered" isRequired />
          <Input label="Email" type="email" variant="bordered" isRequired />
          <Textarea label="Message" variant="bordered" minRows={4} isRequired />
          <Button type="submit" className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-bold">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
