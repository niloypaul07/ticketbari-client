import Link from "next/link";
import { MdOutlineTrain } from "react-icons/md";
import { FaFacebook, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsCreditCard2Front } from "react-icons/bs";
import { SiStripe } from "react-icons/si";
import { Divider } from "@heroui/react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <span className="bg-gradient-to-r from-brand-500 to-purple-500 p-1.5 rounded-lg text-white">
                <MdOutlineTrain size={20} />
              </span>
              TicketBari
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Book bus, train, launch &amp; flight tickets easily. Your trusted travel companion across Bangladesh.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-gray-400 hover:text-white transition-colors">
                <FaXTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/tickets", label: "All Tickets" },
                { href: "/contact", label: "Contact Us" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <FaEnvelope className="text-brand-400 shrink-0" />
                support@ticketbari.com
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaPhone className="text-brand-400 shrink-0" />
                +880 1700-000000
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <FaFacebook className="text-blue-400 shrink-0" />
                <a href="#" className="hover:text-blue-400 transition-colors">
                  facebook.com/TicketBari
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Payment Methods</h3>
            <p className="text-sm text-gray-400 mb-4">
              We use Stripe for secure and fast payments.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gray-800 rounded-lg p-2 flex items-center gap-2 text-gray-300 text-sm">
                <SiStripe className="text-[#635BFF]" size={20} />
                Stripe
              </span>
              <span className="bg-gray-800 rounded-lg p-2 flex items-center gap-2 text-gray-300 text-sm">
                <BsCreditCard2Front className="text-brand-400" size={18} />
                Credit / Debit
              </span>
            </div>
          </div>
        </div>

        <Divider className="my-8 bg-gray-800" />

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TicketBari. All rights reserved. Made with ❤️ in Bangladesh.
        </p>
      </div>
    </footer>
  );
}
