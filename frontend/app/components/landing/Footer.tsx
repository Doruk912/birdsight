import Link from "next/link";
import Image from "next/image";

const FOOTER_SECTIONS = [
  {
    title: "Platform",
    links: [
      { label: "Observations", href: "/observations" },
      { label: "Live Map", href: "/map" },
      { label: "Species Guide", href: "/taxonomy" },
      { label: "Identify", href: "/identify" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 px-6 pt-16 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-white font-semibold"
            >
              <Image
                src="/logo-white.svg"
                alt="BirdSight"
                width={389}
                height={326}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
              A community platform for birdwatchers everywhere. Log, explore,
              and contribute to real citizen science.
            </p>
          </div>

          {/* Links */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-300">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <span>
            © {new Date().getFullYear()} BirdSight. All rights reserved.
          </span>
          <span className="text-stone-700">
            Built by birdwatchers, for birdwatchers.
          </span>
        </div>
      </div>
    </footer>
  );
}
