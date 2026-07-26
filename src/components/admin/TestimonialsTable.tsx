"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Testimonial } from "@/types";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Toast, { useToast } from "@/components/admin/Toast";
import { supabase } from "@/lib/supabase/client";
import { deleteTestimonial } from "@/lib/supabase/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-brass">
      {"★".repeat(rating)}
      <span className="text-hairline">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

type FeaturedFilter = "all" | "featured" | "not-featured";
type SortDirection = "asc" | "desc";

export default function TestimonialsTable({ initial }: { initial: Testimonial[] }) {
  const [items, setItems] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const { message, showToast } = useToast();

  const visibleItems = useMemo(() => {
    let list = [...items];

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          (t.company ?? "").toLowerCase().includes(query) ||
          (t.role ?? "").toLowerCase().includes(query) ||
          t.quote.toLowerCase().includes(query)
      );
    }

    if (featuredFilter !== "all") {
      list = list.filter((t) => (featuredFilter === "featured" ? t.featured : !t.featured));
    }

    list.sort((a, b) =>
      sortDir === "asc" ? a.displayOrder - b.displayOrder : b.displayOrder - a.displayOrder
    );

    return list;
  }, [items, search, featuredFilter, sortDir]);

  async function handleDelete(item: Testimonial) {
    const confirmed = window.confirm(`Delete the testimonial from "${item.name}"?`);
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      await deleteTestimonial(supabase, item.id);
      setItems((prev) => prev.filter((t) => t.id !== item.id));
      showToast(`Testimonial from "${item.name}" was deleted.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      showToast(`Couldn't delete this testimonial — ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar: search, featured filter, sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, or quote…"
          className="w-full max-w-sm border-b border-hairline bg-transparent py-2.5 text-sm text-ink outline-none transition-colors duration-300 focus:border-ink placeholder:text-stone/60"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-hairline">
            {(["all", "featured", "not-featured"] as FeaturedFilter[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFeaturedFilter(option)}
                className={`px-3.5 py-2 text-xs tracking-wide transition-colors duration-300 ${
                  featuredFilter === option
                    ? "bg-ink text-paper"
                    : "text-charcoal/70 hover:text-ink"
                }`}
              >
                {option === "all" ? "All" : option === "featured" ? "Featured" : "Not Featured"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="flex items-center gap-1.5 border border-hairline px-3.5 py-2 text-xs tracking-wide text-charcoal/70 transition-colors duration-300 hover:text-ink"
          >
            Display Order {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <p className="font-mono text-xs text-stone">
        {visibleItems.length} of {items.length} testimonial{items.length === 1 ? "" : "s"}
      </p>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto border border-hairline md:block">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-charcoal/[0.03]">
              {["Photo", "Client", "Designation / Company", "Rating", "Testimonial", "Order", "Featured", "Actions"].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 font-mono text-[11px] uppercase tracking-widest2 text-stone">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr key={item.id} className="border-b border-hairline last:border-b-0 hover:bg-charcoal/[0.02]">
                <td className="px-4 py-3">
                  <Avatar name={item.name} src={item.avatar} size={40} />
                </td>
                <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                <td className="px-4 py-3 text-charcoal/80">
                  <p>{item.role ?? "—"}</p>
                  <p className="text-xs text-charcoal/50">{item.company ?? "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <Stars rating={item.rating} />
                </td>
                <td className="max-w-xs px-4 py-3 text-charcoal/70">
                  <p className="line-clamp-2">{item.quote}</p>
                </td>
                <td className="px-4 py-3 text-charcoal/80">{item.displayOrder}</td>
                <td className="px-4 py-3">{item.featured ? "★" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <Link
                      href={`/admin/testimonials/${item.id}/edit`}
                      className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {visibleItems.map((item) => (
          <div key={item.id} className="flex gap-4 border border-hairline p-4">
            <Avatar name={item.name} src={item.avatar} size={48} />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-ink">{item.name}</p>
                <Stars rating={item.rating} />
              </div>
              <p className="text-xs text-charcoal/60">
                {item.role}
                {item.role && item.company ? " — " : ""}
                {item.company}
              </p>
              <p className="line-clamp-2 text-xs text-charcoal/60">{item.quote}</p>
              <p className="text-xs text-charcoal/50">
                Order {item.displayOrder} · {item.featured ? "Featured" : "Not Featured"}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <Link
                  href={`/admin/testimonials/${item.id}/edit`}
                  className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  className="text-xs text-charcoal/70 underline decoration-hairline underline-offset-4 disabled:opacity-50"
                >
                  {deletingId === item.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-4 border border-dashed border-hairline py-16 text-center">
          <p className="text-sm text-charcoal/60">No testimonials yet.</p>
          <Button href="/admin/testimonials/new" variant="secondary">
            Add Testimonial
          </Button>
        </div>
      )}

      {items.length > 0 && visibleItems.length === 0 && (
        <p className="py-10 text-center font-mono text-sm text-stone">
          No testimonials match your search or filter.
        </p>
      )}

      <Toast message={message} />
    </div>
  );
}
