// src/components/admin/ColorPickerField.tsx
"use client";

import React from "react";
import { useField } from "@payloadcms/ui";

export const ColorPickerField: React.FC<{ path: string }> = ({ path }) => {
  const { value = "#c5a059", setValue } = useField<string>({ path });

  const currentColor = typeof value === "string" && value ? value : "#c5a059";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "12px",
      }}
    >
      <label
        style={{
          fontSize: "12px",
          color: "var(--theme-elevation-800)",
          fontWeight: 500,
        }}
      >
        انتخاب رنگ متریال
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "44px",
            height: "36px",
            border: "1px solid var(--theme-elevation-250)",
            borderRadius: "4px",
            cursor: "pointer",
            background: "transparent",
            padding: "2px",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            fontFamily: "monospace",
            color: "var(--theme-elevation-600)",
            background: "var(--theme-elevation-100)",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid var(--theme-elevation-200)",
            direction: "ltr",
          }}
        >
          {currentColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
