import { InputHTMLAttributes, forwardRef } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * FormField
 *
 * Reusable labelled input for auth forms.
 * Uses forwardRef so react-hook-form (or similar) can attach refs.
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-stone-300"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={`
            w-full bg-white/8 border rounded-xl px-4 py-2.5 text-sm text-white
            placeholder:text-stone-500 outline-none transition-colors
            focus:border-emerald-500/70 focus:bg-white/10
            ${error ? "border-rose-500/70" : "border-white/15"}
            ${props.className ?? ""}
          `}
        />
        {error && (
          <p className="text-xs text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export default FormField;

