import Image from "next/image";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

/**
 * AuthCard
 *
 * Shared shell for login and register pages.
 * Renders the dark background, gradient blobs, logo, and card frame.
 */
export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="min-h-dvh bg-stone-950 flex items-start md:items-center justify-center px-4 pt-20 md:pt-24 pb-10 relative overflow-y-auto overflow-x-hidden">
      {/* Background gradient blobs — matches Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-900/40 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-900/30 blur-[120px]" />
      </div>

      {/* Subtle grid overlay — matches Hero */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 font-semibold text-white mb-8"
        >
          <Image
            src="/logo-white.svg"
            alt="BirdSight"
            width={389}
            height={326}
            className="h-20 w-auto"
            priority
          />
        </Link>

        {/* Card */}
        <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="mt-1 text-sm text-stone-400">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-sm text-stone-500">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
