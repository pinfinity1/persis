import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div
          key={idx}
          className="bg-card border border-border/40 overflow-hidden"
        >
          <div className="aspect-[4/3] bg-muted/60 w-full" />
          <div className="p-5 space-y-2">
            <div className="h-3 w-16 bg-muted/80 rounded" />
            <div className="h-5 w-32 bg-muted/80 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
