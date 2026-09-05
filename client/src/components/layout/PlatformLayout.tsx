import React from "react";
import { PlatformNavbar, BrandMark } from "./PlatformNavbar";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface PlatformLayoutProps {
  children: React.ReactNode;
  moduleNumber?: string;
  moduleName: string;
  subTitle?: string;
  actions?: React.ReactNode;
}

export function PlatformLayout({
  children,
  moduleNumber,
  moduleName,
  subTitle,
  actions
}: PlatformLayoutProps) {
  return (
    <div className="platform-shell">
      <PlatformNavbar />

      {/* Sub-Header / Breadcrumb Toolbar */}
      <div className="platform-subbar">
        <div className="container platform-subbar-inner">
          <div className="platform-breadcrumb">
            <Link href="/overview" className="crumb-root">Platform</Link>
            <ChevronRight size={12} className="crumb-sep" />
            {moduleNumber && <span className="crumb-num">{moduleNumber}</span>}
            <span className="crumb-current">{moduleName}</span>
            {subTitle && (
              <>
                <span className="crumb-dash">—</span>
                <span className="crumb-sub">{subTitle}</span>
              </>
            )}
          </div>
          {actions && <div className="platform-subbar-actions">{actions}</div>}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="platform-main">
        <div className="container">{children}</div>
      </main>

      {/* Production-Grade Grounded Platform Footer */}
      <footer className="platform-footer">
        <div className="container">
          <div className="platform-footer-main">
            <div className="platform-footer-brand">
              <Link href="/" className="brand-lockup" style={{ color: "var(--paper)" }}>
                <BrandMark />
                <span className="brand-wordmark">
                  <strong>AARAMBHA</strong>
                  <small>MPLADS intelligence</small>
                </span>
              </Link>
              <p>
                Evidence-led monitoring architecture for public procurement, parliamentary fund allocations,
                and execution integrity. Grounded in inspectable statutory registers.
              </p>
            </div>

            <div className="platform-footer-links-grid">
              <div className="platform-footer-col">
                <span className="platform-footer-col-title">Oversight Modules</span>
                <Link href="/overview">Overview & Telemetry</Link>
                <Link href="/mps">Parliament MPs Registry</Link>
                <Link href="/projects">Works & Projects</Link>
                <Link href="/tenders">Tenders & NITs</Link>
              </div>

              <div className="platform-footer-col">
                <span className="platform-footer-col-title">Contract & Risk</span>
                <Link href="/contracts">Contract Registers</Link>
                <Link href="/contractors">Contractor Entities</Link>
                <Link href="/risk">Anomaly Signals</Link>
                <Link href="/investigations">Investigation Cases</Link>
              </div>

              <div className="platform-footer-col">
                <span className="platform-footer-col-title">Intelligence & Trust</span>
                <Link href="/ai-investigator">AI Investigator</Link>
                <Link href="/verify">Document Verification</Link>
                <Link href="/reports">Reports & Dossiers</Link>
                <Link href="/methodology">Data Methodology</Link>
              </div>
            </div>
          </div>

          <div className="platform-footer-bottom">
            <div className="platform-footer-disclaimer">
              Analytical risk indicators require human verification. Not a judicial finding.
            </div>
            <div>
              © 2026 AARAMBHA / Concept product for civic intelligence. No government affiliation claimed.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
