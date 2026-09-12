// src/components/admin/ExcelCategoryImportControl.tsx
"use client";

import React, { useState } from "react";

export const ExcelCategoryImportControl: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import-categories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setReport(data.summary);
      } else {
        alert(data.error || "خطا در آپلود فایل اکسل دسته‌بندی‌ها");
      }
    } catch {
      alert("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      style={{
        padding: "14px 18px",
        marginBottom: "24px",
        background: "var(--theme-elevation-50)",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "var(--style-radius-m, 6px)",
        color: "var(--theme-elevation-800)",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* دکمه دانلود قالب دسته‌بندی */}
        <a
          href="/api/admin/download-category-template"
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            fontSize: "12px",
            fontWeight: 500,
            background: "var(--theme-elevation-100)",
            color: "var(--theme-elevation-800)",
            borderRadius: "var(--style-radius-s, 4px)",
            textDecoration: "none",
            border: "1px solid var(--theme-elevation-200)",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        >
          <span>📥</span>
          <span>دانلود قالب اکسل دسته‌بندی‌ها (FA/EN/AR)</span>
        </a>

        {/* دکمه آپلود اکسل با رنگ برند */}
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: 600,
            background: "#9b0737",
            color: "#ffffff",
            borderRadius: "var(--style-radius-s, 4px)",
            cursor: loading ? "wait" : "pointer",
            border: "1px solid #7d062c",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            transition: "all 0.2s ease",
          }}
        >
          <span>{loading ? "⏳" : "📤"}</span>
          <span>
            {loading
              ? "در حال پردازش داده‌ها..."
              : "آپلود اکسل و بروزرسانی دسته‌بندی‌ها"}
          </span>
          <input
            type="file"
            accept=".xlsx, .csv"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* پنل گزارش عملیات */}
      {report && (
        <div
          style={{
            marginTop: "14px",
            fontSize: "12px",
            padding: "12px 16px",
            background: "var(--theme-elevation-100)",
            border: "1px solid var(--theme-elevation-200)",
            borderRadius: "var(--style-radius-s, 4px)",
            lineHeight: 1.6,
          }}
        >
          <div
            style={{
              color: "var(--theme-success-500, #22c55e)",
              margin: "3px 0",
              fontWeight: 500,
            }}
          >
            ✅ دسته‌بندی‌های جدید: {report.createdCount} مورد
          </div>
          <div
            style={{
              color: "var(--theme-elevation-600, #3b82f6)",
              margin: "3px 0",
              fontWeight: 500,
            }}
          >
            🔄 دسته‌بندی‌های بروزرسانی‌شده: {report.updatedCount} مورد
          </div>
          {report.failedCount > 0 && (
            <div
              style={{
                color: "var(--theme-error-500, #ef4444)",
                marginTop: "8px",
              }}
            >
              <p style={{ margin: "4px 0", fontWeight: 600 }}>
                ⚠️ موارد ناموفق ({report.failedCount} مورد):
              </p>
              <ul style={{ paddingRight: "18px", margin: "4px 0" }}>
                {report.errors.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
