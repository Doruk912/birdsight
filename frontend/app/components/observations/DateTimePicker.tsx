"use client";

import { useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  maxDate?: Date;
}

export default function DateTimePicker({
  value,
  onChange,
  maxDate,
}: DateTimePickerProps) {
  // We format the date suitable for an input type="datetime-local" e.g., 'YYYY-MM-DDThh:mm'
  const inputValue = useMemo(() => {
    if (!value) return "";
    const offset = value.getTimezoneOffset();
    const localDate = new Date(value.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const dateStr = e.target.value;
    const newDate = new Date(dateStr);

    // Check against maxDate if necessary
    if (maxDate && newDate > maxDate) {
      return;
    }
    onChange(newDate);
  };

  const maxDateStr = useMemo(() => {
    if (!maxDate) return undefined;
    const offset = maxDate.getTimezoneOffset();
    const localMaxDate = new Date(maxDate.getTime() - offset * 60 * 1000);
    return localMaxDate.toISOString().slice(0, 16);
  }, [maxDate]);

  const handleSetNow = () => {
    const now = new Date();
    if (maxDate && now > maxDate) {
      onChange(maxDate);
      return;
    }
    onChange(now);
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <CalendarIcon
          size={18}
          className={value ? "text-emerald-600" : "text-stone-400"}
        />
      </div>
      <button
        type="button"
        onClick={handleSetNow}
        className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
      >
        Now
      </button>
      <input
        type="datetime-local"
        value={inputValue}
        max={maxDateStr}
        onChange={handleDateChange}
        className="w-full pl-11 pr-20 py-3.5 rounded-xl border border-stone-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer text-stone-900 font-medium"
      />
    </div>
  );
}
