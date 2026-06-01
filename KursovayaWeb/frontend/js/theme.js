const THEME_KEY = "siteTheme";
const SUPPORTED_THEMES = ["light", "dark"];

function getPreferredTheme() {
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme) {
  const nextTheme = SUPPORTED_THEMES.includes(theme) ? theme : "light";
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
}

export function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return SUPPORTED_THEMES.includes(stored) ? stored : getPreferredTheme();
}

export function setTheme(theme) {
  const nextTheme = SUPPORTED_THEMES.includes(theme) ? theme : "light";
  const previousTheme = getTheme();

  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);

  if (previousTheme !== nextTheme) {
    window.dispatchEvent(
      new CustomEvent("theme:change", {
        detail: { theme: nextTheme, previousTheme },
      }),
    );
  }
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function initTheme() {
  applyTheme(getTheme());
}

export function onThemeChange(callback) {
  window.addEventListener("theme:change", callback);
}
