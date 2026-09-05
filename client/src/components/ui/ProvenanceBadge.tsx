import React from "react";
import { CheckCircle2, Calculator, FlaskConical, HelpCircle } from "lucide-react";

export type ProvenanceType =
  | "official_verified"
  | "derived_calculation"
  | "demo_illustrative"
  | "missing_data";

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
  label?: string;
  fieldLabel?: string;
  className?: string;
}

const PROVENANCE_CONFIG: Record<
  ProvenanceType,
  {
    label: string;
    description: string;
    bg: string;
    border: string;
    color: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  official_verified: {
    label: "Official Verified",
    description: "Statutory government record from MoSPI official register or CPPP portal",
    bg: "rgba(112, 139, 120, 0.15)",
    border: "rgba(112, 139, 120, 0.35)",
    color: "#2e5239",
    icon: CheckCircle2
  },
  derived_calculation: {
    label: "Derived Calculation",
    description: "Mathematically computed deterministic value (e.g. variance, normalized score, roll-over)",
    bg: "rgba(39, 59, 115, 0.10)",
    border: "rgba(39, 59, 115, 0.25)",
    color: "#1e3160",
    icon: Calculator
  },
  demo_illustrative: {
    label: "Demo / Illustrative",
    description: "Illustrative operational data for jury workflow demonstration. Not an official finding.",
    bg: "rgba(216, 138, 53, 0.14)",
    border: "rgba(216, 138, 53, 0.35)",
    color: "#8c4e10",
    icon: FlaskConical
  },
  missing_data: {
    label: "Not Assessed / Missing",
    description: "Field data not currently recorded or verified in available registers",
    bg: "rgba(100, 112, 132, 0.12)",
    border: "rgba(100, 112, 132, 0.25)",
    color: "#525e70",
    icon: HelpCircle
  }
};

export function ProvenanceBadge({
  type,
  size = "sm",
  showIcon = true,
  label,
  fieldLabel,
  className = ""
}: ProvenanceBadgeProps) {
  const cfg = PROVENANCE_CONFIG[type] || PROVENANCE_CONFIG.demo_illustrative;
  const Icon = cfg.icon;

  const fontSizes = {
    xs: "8.5px",
    sm: "10px",
    md: "11px"
  };

  const paddings = {
    xs: "1px 5px",
    sm: "2px 7px",
    md: "4px 9px"
  };

  const iconSizes = {
    xs: 9,
    sm: 11,
    md: 13
  };

  return (
    <span
      className={`provenance-badge ${className}`}
      title={`${fieldLabel ? `${fieldLabel}: ` : ""}${cfg.description}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "xs" ? "3px" : "5px",
        padding: paddings[size],
        fontSize: fontSizes[size],
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        borderRadius: "3px",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        lineHeight: 1.2,
        userSelect: "none",
        whiteSpace: "nowrap"
      }}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{label || cfg.label}</span>
    </span>
  );
}

/**
 * Field-level Provenance Wrapper
 * Wraps any individual data field (e.g. MP Name, Allocation Amount) with a micro provenance tag.
 */
export function ProvenanceField({
  label,
  value,
  type,
  annotation
}: {
  label: string;
  value: React.ReactNode;
  type: ProvenanceType;
  annotation?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-muted)", fontWeight: 600 }}>
          {label}
        </span>
        <ProvenanceBadge type={type} size="xs" showIcon={false} />
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
        {value}
      </div>
      {annotation && (
        <span style={{ fontSize: "10px", color: "var(--ink-muted)" }}>{annotation}</span>
      )}
    </div>
  );
}
