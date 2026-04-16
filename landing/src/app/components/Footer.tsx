import Image from "next/image";

const groups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Download", href: "/download" },
      { label: "Compare", href: "/#comparison" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Discord", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Gridex"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="font-semibold text-foreground text-sm">Gridex</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-Native Database IDE for macOS.
              <br />
              Built in Vietnam.
            </p>
          </div>

          {/* Link groups */}
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                {g.title}
              </h4>
              <ul className="space-y-2.5">
                {g.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Gridex. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
