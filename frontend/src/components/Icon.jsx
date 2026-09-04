const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const paths = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  printer: "M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  wave: "M3 12c3-6 6 6 9 0s6 6 9 0",
  up: "M12 16V4m0 0l-4 4m4-4l4 4M4 20h16",
  down: "M12 4v12m0 0l-4-4m4 4l4-4M4 20h16",
  x: "M18 6L6 18M6 6l12 12",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  back: "M15 18l-6-6 6-6",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20zm0-14v.01M12 12v5",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z",
  exit: "M16 17l5-5-5-5M21 12H9M13 21H5a2 2 0 01-2-2V5a2 2 0 012-2h8",
  file: "M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6zM14 3v6h6",
  mesh: "M3 9h18M3 15h18M9 3v18M15 3v18",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20zm0-14v4l3 2",
  ruler: "M3 17l14-14 4 4L7 21l-4-4zM7 13l2 2M10 10l2 2M13 7l2 2",
  check: "M5 13l4 4L19 7",
  weight: "M12 3a3 3 0 100 6 3 3 0 000-6zM6 9l-2 12h16L18 9",
};
export default function Icon({ name, size = 20, className = "" }) {
  const d = paths[name];
  if (!d) return null;
  return <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}><path d={d} /></svg>;
}
