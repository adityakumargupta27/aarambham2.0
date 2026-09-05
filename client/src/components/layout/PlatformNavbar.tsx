import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  ArrowLeft,
  Bot,
  Building2,
  FileCheck2,
  FileSpreadsheet,
  FolderKanban,
  Landmark,
  Layers,
  Menu,
  Scale,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  X
} from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark-compact" : ""}`} aria-hidden="true">
      <span className="brand-mark-line mark-line-a" />
      <span className="brand-mark-line mark-line-b" />
      <span className="brand-mark-line mark-line-c" />
      <span className="brand-mark-notch" />
    </span>
  );
}

interface NavLinkItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const PRIMARY_LINKS: NavLinkItem[] = [
  { label: "Overview", href: "/overview", icon: Layers },
  { label: "Parliament MPs", href: "/mps", icon: Landmark },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Tenders", href: "/tenders", icon: Scale },
  { label: "Contracts", href: "/contracts", icon: FileCheck2 },
  { label: "Contractors", href: "/contractors", icon: Building2 },
  { label: "Risk Explorer", href: "/risk", icon: ShieldAlert },
  { label: "Investigation", href: "/investigations", icon: Activity },
  { label: "AI Investigator", href: "/ai-investigator", icon: Bot },
  { label: "Reconciliation", href: "/verify", icon: SlidersHorizontal },
  { label: "Reports", href: "/reports", icon: FileSpreadsheet },
  { label: "Methodology", href: "/methodology", icon: Search },
];

export function PlatformNavbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="platform-header">
      <div className="platform-header-inner">
        {/* Brand & Landing Back */}
        <div className="platform-header-brand">
          <Link href="/" className="brand-lockup" aria-label="AARAMBHA home">
            <BrandMark />
            <span className="brand-wordmark">
              <strong>AARAMBHA</strong>
              <small>Civic Intelligence</small>
            </span>
          </Link>
          <div className="header-divider" />
          <Link href="/" className="back-home-link">
            <ArrowLeft size={13} />
            <span>Landing</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="platform-desktop-nav" aria-label="Platform main navigation">
          {PRIMARY_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/overview" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`platform-nav-link ${isActive ? "is-active" : ""}`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Badge & Mobile Toggle */}
        <div className="platform-header-actions">
          <span className="platform-mode-badge" title="Data engine active">
            <span className="mode-dot" />
            <span className="mode-text">Audit Layer Active</span>
          </span>
          <button
            className="platform-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="platform-mobile-menu">
          <div className="mobile-menu-grid">
            {PRIMARY_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/overview" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link ${isActive ? "is-active" : ""}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-nav-link mobile-return-link"
            >
              <ArrowLeft size={16} />
              <span>Return to Public Landing Page</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
