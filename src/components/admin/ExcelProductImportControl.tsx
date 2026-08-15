"use client";

import React, { useState } from "react";

export const ExcelProductImportControl: React.FC = () => {
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
      const res = await fetch("/api/admin/import-products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setReport(data.summary);
      } else {
        alert(data.error || "خطا در آپلود فایل اکسل محصولات");
      }
    } catch (err) {
      alert("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        marginBottom: "20px",
        background: "#18181b",
        borderRadius: "8px",
        border: "1px solid #27272a",
        color: "#fff",
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
        <a
          href="/api/admin/download-product-template"
          download
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            background: "#27272a",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
            border: "1px solid #3f3f46",
          }}
        >
          📥 دانلود قالب اکسل محصولات (FA/EN/AR)
        </a>

        <label
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            background: "#9b0737",
            color: "#fff",
            borderRadius: "4px",
            cursor: loading ? "wait" : "pointer",
            fontWeight: "500",
          }}
        >
          {loading
            ? "در حال پردازش داده‌ها..."
            : "📤 آپلود اکسل و بروزرسانی کاتالوگ محصولات"}
          <input
            type="file"
            accept=".xlsx, .csv"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {report && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            padding: "10px",
            background: "#09090b",
            borderRadius: "4px",
          }}
        >
          <p style={{ color: "#22c55e", margin: "2px 0" }}>
            ✅ محصولات جدید: {report.createdCount} مورد
          </p>
          <p style={{ color: "#3b82f6", margin: "2px 0" }}>
            🔄 محصولات بروزرسانی‌شده: {report.updatedCount} مورد
          </p>
          {report.failedCount > 0 && (
            <div style={{ color: "#ef4444", marginTop: "6px" }}>
              <p>⚠️ موارد نادیده گرفته شده ({report.failedCount} مورد):</p>
              <ul style={{ paddingRight: "16px", margin: "4px 0" }}>
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
