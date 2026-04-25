import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS } from "@/app/constants/footer";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 px-6 pt-16 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-white font-semibold">
              <Image
                src="/logo-white.svg"
                alt="BirdSight"
                width={389}
                height={326}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-stone-500">
              A community platform for birdwatchers everywhere. Log, explore,
              and connect.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-300">
                {section}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-emerald-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <span>© {new Date().getFullYear()} BirdSight. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-stone-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
