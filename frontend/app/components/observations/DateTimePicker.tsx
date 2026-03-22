"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  maxDate?: Date;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DateTimePicker({ value, onChange, maxDate }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const getInitialHours = () => (value ? value.getHours() : 12);
  const getInitialMinutes = () => (value ? value.getMinutes() : 0);

  const [hours, setHours] = useState<string>(() => pad2(getInitialHours()));
  const [minutes, setMinutes] = useState<string>(() => pad2(getInitialMinutes()));

  // NOTE: We intentionally don't "sync" hours/minutes from `value` via an effect.
  // This keeps the component lint-clean and avoids cascading renders.

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedValue = useMemo(() => {
    if (!value) return "Select date & time";
    return value.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [value]);

  const selectedDay = value ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : undefined;

  const disabled = useMemo(() => {
    if (!maxDate) return undefined;
    const endOfMaxDay = new Date(maxDate);
    endOfMaxDay.setHours(23, 59, 59, 999);
    return [{ after: endOfMaxDay }];
  }, [maxDate]);

  const setTimeOnDate = (date: Date) => {
    const h = clamp(Number.parseInt(hours, 10) || 0, 0, 23);
    const m = clamp(Number.parseInt(minutes, 10) || 0, 0, 59);
    date.setHours(h, m, 0, 0);
    return date;
  };

  const isAfterMax = (d: Date) => {
    if (!maxDate) return false;
    return d.getTime() > maxDate.getTime();
  };

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;

    const next = setTimeOnDate(new Date(day));
    if (isAfterMax(next)) return;

    onChange(next);
    setIsOpen(false);
  };

  const handleTimeChange = (type: "hours" | "minutes", val: string) => {
    const raw = Number.parseInt(val, 10);
    const safeNum = Number.isFinite(raw) ? raw : 0;

    if (type === "hours") {
      const next = clamp(safeNum, 0, 23);
      setHours(pad2(next));
    } else {
      const next = clamp(safeNum, 0, 59);
      setMinutes(pad2(next));
    }

    // If no day is selected yet, we only store the time; the next day selection
    // will incorporate it.
    if (!value) return;

    const updated = new Date(value);
    if (type === "hours") updated.setHours(clamp(safeNum, 0, 23));
    else updated.setMinutes(clamp(safeNum, 0, 59));

    if (isAfterMax(updated)) return;
    onChange(updated);
  };

  // If maxDate is today, prevent choosing a time in the future when selecting today.
  const timeDisabledHint = useMemo(() => {
    if (!value || !maxDate) return false;
    if (!sameDay(value, maxDate)) return false;

    const h = clamp(Number.parseInt(hours, 10) || 0, 0, 23);
    const m = clamp(Number.parseInt(minutes, 10) || 0, 0, 59);
    const tmp = new Date(value);
    tmp.setHours(h, m, 0, 0);
    return tmp.getTime() > maxDate.getTime();
  }, [hours, minutes, value, maxDate]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border bg-white transition-all outline-none cursor-pointer
          ${isOpen ? "border-emerald-500 ring-1 ring-emerald-500" : "border-stone-200 hover:border-emerald-300"}
        `}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon size={18} className={value ? "text-emerald-600" : "text-stone-400"} />
          <span className={`text-sm font-medium ${value ? "text-stone-900" : "text-stone-500"}`}>{formattedValue}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-2 p-4 bg-white border border-stone-200 rounded-2xl shadow-xl w-[340px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bs-daypicker rounded-xl overflow-hidden">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleSelect}
              disabled={disabled}
              captionLayout="dropdown"
              startMonth={new Date(2000, 0)}
              endMonth={new Date((maxDate ?? new Date()).getFullYear(), 11)}
            />
          </div>

          <hr className="border-stone-100 my-4" />

          <div className="flex items-center justify-center gap-3 pb-1">
            <Clock size={16} className="text-emerald-600 shrink-0" />
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={hours}
                onChange={(e) => handleTimeChange("hours", e.target.value)}
                className="w-12 text-center py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-300"
                aria-label="Hours"
              />
              <span className="font-bold text-stone-400 pb-0.5">:</span>
              <input
                type="text"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => handleTimeChange("minutes", e.target.value)}
                className="w-12 text-center py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-300"
                aria-label="Minutes"
              />
            </div>
            <span className="text-xs font-semibold text-stone-500 ml-1 uppercase">{Number(hours) >= 12 ? "PM" : "AM"}</span>
          </div>

          {timeDisabledHint && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Selected time can’t be in the future.
            </p>
          )}
        </div>
      )}
    </div>
  );
}