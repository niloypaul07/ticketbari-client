"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  Input, Select, SelectItem, Button, Pagination, Chip
} from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import TicketCard from "@/components/TicketCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const TRANSPORT_TYPES = ["All", "Bus", "Train", "Launch", "Plane"];
const SORT_OPTIONS = [
  { key: "latest", label: "Latest First" },
  { key: "price_asc", label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
];

const LIMIT = 9; // tickets per page

export default function AllTicketsPageWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading tickets..." />}>
      <AllTicketsPage />
    </Suspense>
  );
}

function AllTicketsPage() {
  const searchParams = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [transportType, setTransportType] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, sortBy };
      if (from.trim()) params.from = from.trim();
      if (to.trim()) params.to = to.trim();
      if (transportType !== "All") params.transportType = transportType;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, { params });
      setTickets(res.data.tickets);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, transportType, sortBy, page]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchTickets(); };

  const handlePageChange = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterLabel = "block text-sm font-medium text-default-700 mb-1.5";

  const inputClassNames = {
    base: "w-full",
    mainWrapper: "w-full",
    inputWrapper:
      "h-11 min-h-11 px-3 border border-default-200 bg-white dark:bg-default-100 shadow-none rounded-medium hover:border-default-400 group-data-[focus=true]:border-primary",
    innerWrapper: "gap-2 items-center",
    input: "text-sm outline-none",
  };

  const selectClassNames = {
    base: "w-full",
    trigger:
      "h-11 min-h-11 w-full px-3 pe-9 relative border border-default-200 bg-white dark:bg-default-100 shadow-none rounded-medium hover:border-default-400 data-[focus=true]:border-primary data-[open=true]:border-primary",
    innerWrapper: "flex items-center w-full",
    value: "text-sm truncate",
    selectorIcon: "absolute end-3 top-1/2 -translate-y-1/2 text-default-400 pointer-events-none w-4 h-4",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-1">
          <span className="gradient-text">All Tickets</span>
        </h1>
        <p className="text-default-500">{total} tickets available</p>
      </div>

      {/* ── Filter Bar ── */}
      <form
        onSubmit={handleSearch}
        className="bg-default-50 dark:bg-default-50/5 border border-default-100 rounded-2xl p-5 md:p-6 mb-8"
      >
        <div className="flex flex-col xl:flex-row xl:items-end gap-4">

          <div className="flex-1 min-w-0">
            <label htmlFor="filter-from" className={filterLabel}>From</label>
            <Input
              id="filter-from"
              aria-label="From"
              placeholder="e.g. Dhaka"
              value={from}
              onValueChange={(v) => { setFrom(v); setPage(1); }}
              startContent={<MdLocationOn className="text-default-400 shrink-0" size={18} />}
              variant="bordered"
              classNames={inputClassNames}
            />
          </div>

          <div className="flex-1 min-w-0">
            <label htmlFor="filter-to" className={filterLabel}>To</label>
            <Input
              id="filter-to"
              aria-label="To"
              placeholder="e.g. Chittagong"
              value={to}
              onValueChange={(v) => { setTo(v); setPage(1); }}
              startContent={<MdLocationOn className="text-default-400 shrink-0" size={18} />}
              variant="bordered"
              classNames={inputClassNames}
            />
          </div>

          <div className="w-full sm:w-auto sm:min-w-[150px]">
            <span className={filterLabel}>Transport</span>
            <Select
              aria-label="Transport"
              placeholder="Select type"
              selectedKeys={new Set([transportType])}
              onSelectionChange={(keys) => { setTransportType([...keys][0] || "All"); setPage(1); }}
              variant="bordered"
              classNames={selectClassNames}
            >
              {TRANSPORT_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
            </Select>
          </div>

          <div className="w-full sm:w-auto sm:min-w-[170px]">
            <span className={filterLabel}>Sort By</span>
            <Select
              aria-label="Sort by"
              placeholder="Sort order"
              selectedKeys={new Set([sortBy])}
              onSelectionChange={(keys) => { setSortBy([...keys][0] || "latest"); setPage(1); }}
              variant="bordered"
              classNames={selectClassNames}
            >
              {SORT_OPTIONS.map((s) => <SelectItem key={s.key}>{s.label}</SelectItem>)}
            </Select>
          </div>

          <div className="w-full xl:w-auto xl:shrink-0">
            <span className={`${filterLabel} hidden xl:block invisible select-none`} aria-hidden="true">&nbsp;</span>
            <Button
              type="submit"
              className="bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold h-11 min-h-11 text-sm rounded-xl w-full xl:min-w-[130px]"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <FiSearch size={16} className="shrink-0" />
                Search
              </span>
            </Button>
          </div>

        </div>
      </form>

      {/* ── Active Filters ── */}
      {(from || to || transportType !== "All") && (
        <div className="flex flex-wrap gap-2 mb-6">
          {from && <Chip onClose={() => { setFrom(""); setPage(1); }} variant="flat" color="primary">From: {from}</Chip>}
          {to && <Chip onClose={() => { setTo(""); setPage(1); }} variant="flat" color="primary">To: {to}</Chip>}
          {transportType !== "All" && <Chip onClose={() => { setTransportType("All"); setPage(1); }} variant="flat" color="secondary">{transportType}</Chip>}
        </div>
      )}

      {/* ── Tickets Grid ── */}
      {loading ? (
        <LoadingSpinner label="Fetching tickets..." />
      ) : tickets.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🎫</p>
          <h3 className="text-xl font-bold mb-2">No tickets found</h3>
          <p className="text-default-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((t) => <TicketCard key={t._id} ticket={t} />)}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2 mt-10">
              <Pagination
                total={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showControls
                showShadow
              />
              <p className="text-default-400 text-sm">
                Page {page} of {totalPages} · {total} tickets total
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}