/**
 * UI v2 switch.
 *   ?ui=v2  → turn v2 on for this browser (remembered)
 *   ?ui=v1  → turn it off again
 *   VITE_UI_V2=true → v2 is the default for everyone (?ui=v1 still opts out)
 */
const KEY = "nehdo_ui";

export function isV2Enabled(): boolean {
  const envDefault = import.meta.env.VITE_UI_V2 === "true";
  try {
    const param = new URLSearchParams(window.location.search).get("ui");
    if (param === "v2") localStorage.setItem(KEY, "v2");
    if (param === "v1") localStorage.setItem(KEY, "v1");
    const stored = localStorage.getItem(KEY);
    if (stored === "v2") return true;
    if (stored === "v1") return false;
    return envDefault;
  } catch {
    return envDefault;
  }
}
