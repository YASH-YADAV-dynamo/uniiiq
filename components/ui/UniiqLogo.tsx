import Image from "next/image";
import Link from "next/link";

interface UniiqLogoProps {
  showImage?: boolean;
  className?: string;
  href?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { fontSize: "20px", imageSize: 24 },
  md: { fontSize: "24px", imageSize: 28 },
  lg: { fontSize: "28px", imageSize: 32 },
  xl: { fontSize: "32.8px", imageSize: 36 },
};

export default function UniiqLogo({
  showImage = true,
  className = "",
  href,
  size = "md",
}: UniiqLogoProps) {
  const { fontSize, imageSize } = sizeMap[size];

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      {showImage && (
        <Image
          src="/logo.png"
          alt="Uniiq Logo"
          width={imageSize}
          height={imageSize}
          className="object-contain"
        />
      )}
      <span className="flex items-baseline">
        <span className="font-bold text-black" style={{ fontSize }}>
          uni
        </span>
        <span
          className="font-semibold bg-clip-text text-transparent"
          style={{
            fontFamily: "var(--font-plus-jakarta-sans)",
            fontWeight: 600,
            fontSize,
            lineHeight: "124%",
            letterSpacing: "-0.02em",
            backgroundImage:
              "linear-gradient(139.75deg, #9FB971 9.66%, #FFD965 42.74%, #C17C74 74.68%, #467896 102.63%)",
          }}
        >
          iq
        </span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
      </Link>
    );
  }

  return <span className="inline-block">{logoContent}</span>;
}

