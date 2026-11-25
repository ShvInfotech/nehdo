/**
 * Ref-counted body lock for v2 overlays (sheets, search, age gate):
 * stops page scroll and flags <body> so global floating UI can hide.
 */
let open = 0;

export function lockOverlay(): () => void {
  open++;
  document.body.style.overflow = "hidden";
  document.body.classList.add("v2-overlay-open");
  let released = false;
  return () => {
    if (released) return;
    released = true;
    open = Math.max(0, open - 1);
    if (open === 0) {
      document.body.style.overflow = "";
      document.body.classList.remove("v2-overlay-open");
    }
  };
}
