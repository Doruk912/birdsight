interface PasswordStrength {
  score: number; // 0–4
  label: string;
  color: string;
  barColor: string;
}

function getStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "text-stone-500",
      barColor: "bg-stone-700",
    };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Cap at 4
  score = Math.min(score, 4);

  const levels: Omit<PasswordStrength, "score">[] = [
    { label: "Too weak", color: "text-rose-400", barColor: "bg-rose-500" },
    { label: "Weak", color: "text-orange-400", barColor: "bg-orange-500" },
    { label: "Fair", color: "text-amber-400", barColor: "bg-amber-500" },
    { label: "Strong", color: "text-emerald-400", barColor: "bg-emerald-500" },
    { label: "Very strong", color: "text-teal-400", barColor: "bg-teal-400" },
  ];

  return { score, ...levels[score] };
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * PasswordStrengthIndicator
 *
 * Shows a 4-segment bar and a label below the password field.
 * Only visible once the user starts typing.
 */
export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, label, color, barColor } = getStrength(password);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Segmented bar */}
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-colors duration-300 ${
              i < score ? barColor : "bg-white/10"
            }`}
          />
        ))}
      </div>
      {/* Label */}
      <p
        className={`text-xs font-medium ${color} transition-colors duration-300`}
      >
        {label}
      </p>
    </div>
  );
}
