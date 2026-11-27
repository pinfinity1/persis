import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?:
    | "full"
    | "full-white"
    | "icon"
    | "icon-white-bg"
    | "icon-circle"
    | "icon-transparent";
  tone?: "default" | "white";
  size?: number; // برای اندازه آیکون
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = "full",
  tone = "default",
  size = 40,
}) => {
  const isFullWhite =
    variant === "full-white" || (variant === "full" && tone === "white");
  const isFullRed = variant === "full" && tone !== "white";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        className,
      )}
    >
      {/* لوگوی کامل نسخه روشن (زمینه روشن) */}
      {isFullRed && (
        <Image
          src="/PersisQuartz-Red.svg"
          alt="Persis Quartz Logo"
          width={150}
          height={53}
          priority
          className="h-auto w-auto max-h-10 object-contain"
        />
      )}

      {/* لوگوی کامل نسخه تیره (زمینه تیره / هدر شفاف هیرو) */}
      {isFullWhite && (
        <Image
          src="/PersisQuartz-White.svg"
          alt="Persis Quartz Logo"
          width={150}
          height={53}
          priority
          className="h-auto w-auto max-h-10 object-contain"
        />
      )}

      {/* فقط آیکون P (زمینه زرشکی) */}
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

      {/* فقط آیکون P (دایره‌ای) */}
      {variant === "icon-circle" && (
        <Image
          src="/logo-Circle.svg"
          alt="Persis Quartz Icon"
          width={size}
          height={size}
          priority
          className="object-contain"
        />
      )}

      {/* فقط آیکون P (بدون پس‌زمینه) */}
      {variant === "icon-transparent" && (
        <Image
          src="/logo-Mark.svg"
          alt="Persis Quartz Icon"
          width={size}
          height={size}
          priority
          className="object-contain"
        />
      )}
    </Link>
  );
};
