"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAxiosSecure } from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";

const TRANSPORT_TYPES = ["Bus", "Train", "Launch", "Plane"];
const PERKS_OPTIONS = ["AC", "Breakfast", "WiFi", "Recliner Seat", "Charging Point", "Blanket & Pillow", "Snacks"];

export default function AddTicketPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [form, setForm] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "Bus",
    price: "",
    quantity: "",
    departureDateTime: "",
    perks: [],
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error("Please provide an image URL");
      return;
    }
    setLoading(true);
    try {
      await axiosSecure.post("/tickets", { ...form });
      toast.success("Ticket submitted for admin approval! 🎉");
      setForm({
        title: "",
        from: "",
        to: "",
        transportType: "Bus",
        price: "",
        quantity: "",
        departureDateTime: "",
        perks: [],
        image: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-4 px-2">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-600 dark:text-brand-400 mb-2 flex items-center justify-center gap-2">
            ✏️ Add New Ticket
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Submitted tickets will be reviewed by the admin before going live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Ticket Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhaka Express Night Coach"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                From (Location)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhaka"
                value={form.from}
                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                To (Location)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chittagong"
                value={form.to}
                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Transport Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Transport Type
            </label>
            <div className="relative">
              <select
                required
                value={form.transportType}
                onChange={(e) => setForm((f) => ({ ...f, transportType: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 appearance-none cursor-pointer"
              >
                {TRANSPORT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Price (per unit)
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 500"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Ticket quantity
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 40"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Departure Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Departure Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={form.departureDateTime}
              onChange={(e) => setForm((f) => ({ ...f, departureDateTime: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 text-gray-700 dark:text-gray-300"
            />
          </div>

          {/* Perks / Amenities */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Perks (checkboxes)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PERKS_OPTIONS.map((perk) => {
                const isChecked = form.perks.includes(perk);
                return (
                  <label
                    key={perk}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-250 ${
                      isChecked
                        ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300"
                        : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setForm((f) => {
                          const perks = f.perks.includes(perk)
                            ? f.perks.filter((p) => p !== perk)
                            : [...f.perks, perk];
                          return { ...f, perks };
                        });
                      }}
                      className="h-4 w-4 rounded border-gray-350 text-brand-600 focus:ring-brand-500 accent-brand-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium">{perk}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              ImageBB Link (Direct Link)
            </label>
            <input
              type="url"
              required
              placeholder="e.g. https://i.ibb.co/abcde/image.jpg"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-all duration-200 placeholder-gray-400"
            />
            <span className="text-[11px] text-brand-500 font-medium mt-1.5 block">
              ⚠️ Important: In ImgBB, you must change "Embed codes" from "Viewer links" to <b>"Direct links"</b>. Your link must end in .jpg or .png!
            </span>
          </div>

          {/* Readonly Vendor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                Vendor name (Readonly)
              </label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                Vendor email (Readonly)
              </label>
              <input
                type="text"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Add Ticket"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
