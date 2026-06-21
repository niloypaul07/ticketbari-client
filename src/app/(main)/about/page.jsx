export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black mb-4 gradient-text">About TicketBari</h1>
      <p className="text-default-600 leading-relaxed mb-6">
        TicketBari is Bangladesh&apos;s modern online ticket booking platform for bus, train, launch, and flight travel.
        We connect travelers with verified vendors so you can compare routes, check perks, and book seats with confidence.
      </p>
      <p className="text-default-600 leading-relaxed mb-6">
        Our mission is to make inter-city travel planning simple, transparent, and secure — with real-time seat availability,
        vendor-verified listings, and safe Stripe payments after booking approval.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          { title: "Verified Listings", desc: "Every ticket is reviewed by our admin team before going live." },
          { title: "Secure Payments", desc: "Pay safely through Stripe once your booking is accepted." },
          { title: "Multi-Transport", desc: "Book bus, train, launch, and plane tickets in one place." },
        ].map((item) => (
          <div key={item.title} className="p-5 rounded-2xl bg-default-50 dark:bg-default-50/5 border border-default-100">
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-default-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
