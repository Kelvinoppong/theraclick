import Image from "next/image";

export function Logo({ className, size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const dimensions = {
    small: { width: 100, height: 32 },
    default: { width: 120, height: 38 },
    large: { width: 160, height: 52 },
  };
  
  const { width, height } = dimensions[size];
  
  return (
    <div className={`flex items-center ${className || ""}`}>
      <Image
        src="/images/logo.png"
        alt="Theraklick"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
