import Image from "next/image";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: number;
  ring?: string;
  className?: string;
}

const PALETTE = ["#8b5cff", "#ffd91f", "#22c98c", "#ff5470", "#4dabff", "#ffb547"];

function hashName(name: string): number {
  return name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

export function Avatar({ name = "", src, size = 36, ring, className = "" }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const bg = PALETTE[hashName(name) % PALETTE.length];

  const ringStyle = ring
    ? { border: "2px solid var(--ink-1)", boxShadow: `0 0 0 2px ${ring}` }
    : {};

  return (
    <div
      className={["relative shrink-0 overflow-hidden rounded-full", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...ringStyle }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-semibold text-white"
          style={{
            background: `linear-gradient(135deg, ${bg}, ${bg}cc)`,
            fontSize: size * 0.38,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
