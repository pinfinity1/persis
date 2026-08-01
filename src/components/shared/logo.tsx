import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "icon-white-bg";
  size?: number; // برای اندازه آیکون
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = "full",
  size = 40,
}) => {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        className,
      )}
    >
      {/* لوگوی کامل (همراه با نوشتار Persis Quartz) */}
      {variant === "full" && (
        <Image
          src="/PersisQuartz-Red.png"
          alt="Persis Quartz Logo"
          width={150}
          height={40}
          priority
          className="h-auto w-auto max-h-10 object-contain"
        />
      )}

      {/* فقط آیکون P (زمینه قرمز) */}
      {variant === "icon" && (
        <Image
          src="/logo-Red.svg"
          alt="Persis Quartz Icon"
          width={size}
          height={size}
          priority
          className="rounded-md object-contain"
        />
      )}

      {/* فقط آیکون P (زمینه سفید) */}
      {variant === "icon-white-bg" && (
        <Image
          src="/logo-Red-bgwhite.svg"
          alt="Persis Quartz Icon"
          width={size}
          height={size}
          priority
          className="rounded-md object-contain"
        />
      )}
    </Link>
  );
};
