const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const paths = {
  files: "M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7zM13 2v7h7",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  printer: "M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1l2-1.5-2-3.5-2.4 1a7.4 7.4 0 00-1.7-1l-.4-2.6h-4l-.4 2.6a7.4 7.4 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7.4 7.4 0 000 2l-2 1.5 2 3.5 2.4-1a7.4 7.4 0 001.7 1l.4 2.6h4l.4-2.6a7.4 7.4 0 001.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z",
  ruler: "M3 17l14-14 4 4L7 21l-4-4zM7 13l2 2M10 10l2 2M13 7l2 2",
  search: "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z",
  up: "M12 16V4m0 0l-4 4m4-4l4 4M4 20h16",
  down: "M12 4v12m0 0l-4-4m4 4l4-4M4 20h16",
  x: "M18 6L6 18M6 6l12 12",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  plus: "M12 5v14M5 12h14",
  exit: "M16 17l5-5-5-5M21 12H9M13 21H5a2 2 0 01-2-2V5a2 2 0 012-2h8",
  chevron: "M9 18l6-6-6-6",
  fileicon: "M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6zM14 3v6h6",
  play: "M5 3l14 9-14 9V3z",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20zm0-14v.01M12 12v5",
  mesh: "M3 9h18M3 15h18M9 3v18M15 3v18",
  check: "M5 13l4 4L19 7",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z",
};
export default function Icon({ name, size = 18, className = "" }) {
  const d = paths[name]; if (!d) return null;
  return <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}><path d={d} /></svg>;
}
