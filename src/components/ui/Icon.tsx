import { SVGProps } from "react";

type IconName =
  | "search" | "calendar" | "pin" | "ticket" | "plus" | "user" | "bell" | "qr"
  | "chevronRight" | "chevronDown" | "chevronLeft" | "chevronUp"
  | "arrowRight" | "arrowLeft" | "arrowUp" | "arrowDown"
  | "check" | "close" | "heart" | "share" | "music" | "settings"
  | "home" | "chart" | "list" | "flash" | "sparkle" | "eye"
  | "download" | "upload" | "filter" | "mp" | "flame" | "star"
  | "edit" | "trash" | "grid" | "menu" | "play"
  | "instagram" | "twitter" | "info" | "refresh" | "copy" | "external" | "clock";

const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
  pin: <><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></>,
  ticket: <><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9Z"/><path d="M13 7v10" strokeDasharray="2 2"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M17 17h4v4"/></>,
  chevronRight: <path d="m9 6 6 6-6 6"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  chevronLeft: <path d="m15 6-6 6 6 6"/>,
  chevronUp: <path d="m18 15-6-6-6 6"/>,
  arrowRight: <><path d="M5 12h14M13 5l7 7-7 7"/></>,
  arrowLeft: <><path d="M19 12H5M11 5l-7 7 7 7"/></>,
  arrowUp: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
  arrowDown: <><path d="M12 5v14M5 12l7 7 7-7"/></>,
  check: <path d="m5 13 4 4L19 7"/>,
  close: <path d="M6 6l12 12M18 6 6 18"/>,
  heart: <path d="M12 21s-7-4.35-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.65-7 11-7 11Z"/>,
  share: <><circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m9 11 6-3M9 13l6 3"/></>,
  music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>,
  home: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-8.5Z"/>,
  chart: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>,
  flash: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  download: <><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></>,
  upload: <><path d="M12 20V8M6 14l6-6 6 6M4 4h16"/></>,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>,
  mp: <><circle cx="12" cy="12" r="9"/><path d="M8 12c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5-1.5 3.5-4 3.5-4-1.5-4-3.5Z"/></>,
  flame: <path d="M12 22s-7-3-7-10c0-4 3-6 4-9 1 3 3 4 3 6 1-1 1.5-2 1.5-4 3 2 5 5 5 9 0 5-3.5 8-6.5 8Z"/>,
  star: <path d="m12 3 2.6 6 6.4.5-5 4.5 1.6 6.5L12 17l-5.6 3.5L8 14l-5-4.5 6.4-.5L12 3Z"/>,
  edit: <path d="m4 20 4-1L20 7l-3-3L5 16l-1 4Z"/>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  play: <path d="M7 4v16l13-8L7 4Z"/>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></>,
  twitter: <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1A4 4 0 0 0 12 8.7c-3.3-.2-6.3-1.7-8.3-4.1a4 4 0 0 0 1.3 5.4c-.7 0-1.3-.2-1.8-.5 0 2 1.4 3.6 3.3 4-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.7 2.8a8 8 0 0 1-5 1.7 11.3 11.3 0 0 0 6 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2.1-2.2Z"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
  refresh: <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>,
  copy: <><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
  external: <><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, strokeWidth = 1.6, color, style, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      className={className}
      aria-hidden
      {...rest}
    >
      {paths[name] ?? null}
    </svg>
  );
}

export type { IconName };
