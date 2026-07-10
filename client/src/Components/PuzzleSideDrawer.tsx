import { useEffect, useMemo, useRef, useState } from "react";
import type { PuzzleSideDrawerProps } from "../utils/types";
import "../Components/stylesheets/sidedrawer.css";
import { useNavigate } from "react-router-dom";

function formatPuzzleDate(dateStr: string): { weekday: string; full: string } {
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { weekday: "", full: dateStr };
  }
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
    full: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function PuzzleSideDrawer(props: PuzzleSideDrawerProps) {
  const { data, isOpen, setSideDrawerOpen, currentDate } = props;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const today = useMemo(() => getTodayDateString(), []);

  const sortedPuzzles = useMemo(() => {
    return [...data].sort((a, b) => b.date.localeCompare(a.date));
  }, [data]);

  const filteredPuzzles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedPuzzles;
    return sortedPuzzles.filter((puzzle) => {
      const formatted = formatPuzzleDate(puzzle.date);
      return (
        puzzle.date.toLowerCase().includes(q) ||
        formatted.full.toLowerCase().includes(q) ||
        formatted.weekday.toLowerCase().includes(q)
      );
    });
  }, [sortedPuzzles, query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 180);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSideDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [isOpen, setSideDrawerOpen]);

  const handleClose = () => setSideDrawerOpen(false);

  const handleSelect = (date: string) => {
    const isToday = date === today;
    navigate(isToday ? "/" : `/${date}`);
    setSideDrawerOpen(false);
  };

  const activeDate = currentDate === "today" ? today : currentDate;

  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? "drawer-backdrop--visible" : ""}`}
        onClick={handleClose}
        aria-hidden={!isOpen}
      />
      <aside
        id="previous-puzzles-drawer"
        className={`drawer ${isOpen ? "drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Previous puzzles"
        aria-hidden={!isOpen}
      >
        <div className="drawer-glow" aria-hidden="true" />

        <header className="drawer-header">
          <div className="drawer-header-text">
            <p className="drawer-eyebrow">Archive</p>
            <h2 className="drawer-title">Previous Puzzles</h2>
            <p className="drawer-count">
              {sortedPuzzles.length} puzzle{sortedPuzzles.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={handleClose}
            aria-label="Close previous puzzles"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="drawer-search">
          <svg
            className="drawer-search-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            className="drawer-search-input"
            placeholder="Search by date…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search previous puzzles"
          />
        </div>

        <div className="drawer-list" role="list">
          {filteredPuzzles.length === 0 ? (
            <div className="drawer-empty">
              <p>{query ? "No puzzles match your search." : "No puzzles available yet."}</p>
            </div>
          ) : (
            filteredPuzzles.map((puzzle) => {
              const formatted = formatPuzzleDate(puzzle.date);
              const isActive = puzzle.date === activeDate;
              const isToday = puzzle.date === today;

              return (
                <button
                  key={puzzle.date}
                  type="button"
                  role="listitem"
                  className={`drawer-item ${isActive ? "drawer-item--active" : ""}`}
                  onClick={() => handleSelect(puzzle.date)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="drawer-item-main">
                    <span className="drawer-item-weekday">{formatted.weekday}</span>
                    <span className="drawer-item-date">{formatted.full}</span>
                  </span>
                  <span className="drawer-item-meta">
                    {isToday && <span className="drawer-badge">Today</span>}
                    {isActive && <span className="drawer-item-indicator" aria-hidden="true" />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}

export default PuzzleSideDrawer;
