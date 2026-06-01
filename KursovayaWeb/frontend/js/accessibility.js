import { applyTranslations, t } from "./i18n.js";

const VISION_KEY = "siteVisionSettings";
const FONT_OPTIONS = ["normal", "large", "extra"];
const SCHEME_OPTIONS = [
  "black-white",
  "black-green",
  "white-black",
  "beige-brown",
  "blue-navy",
];

const DEFAULT_SETTINGS = {
  enabled: false,
  font: "normal",
  scheme: "black-white",
  hideImages: false,
};

const IMAGE_CONTAINER_SELECTOR = [
  ".hero__bg",
  ".hero__right",
  ".about__photos",
  ".cities__map",
  ".project-card__image",
  ".manufacturer-card__logo-wrap",
  ".wash-card",
  ".not-found-hero__media",
].join(", ");

let modal = null;
let previousFocus = null;
let isInitialized = false;
let imageObserver = null;
let imageSyncTimer = null;

function normalizeSettings(settings = {}) {
  return {
    enabled: Boolean(settings.enabled),
    font: FONT_OPTIONS.includes(settings.font) ? settings.font : DEFAULT_SETTINGS.font,
    scheme: SCHEME_OPTIONS.includes(settings.scheme)
      ? settings.scheme
      : DEFAULT_SETTINGS.scheme,
    hideImages: Boolean(settings.hideImages),
  };
}

function readSettings() {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(VISION_KEY)) || {});
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(VISION_KEY, JSON.stringify(normalizeSettings(settings)));
}

function applyVisionSettings(settings) {
  const normalized = normalizeSettings(settings);
  const root = document.documentElement;

  if (!normalized.enabled) {
    root.dataset.vision = "off";
    root.removeAttribute("data-vision-font");
    root.removeAttribute("data-vision-scheme");
    root.removeAttribute("data-vision-images");
    return;
  }

  root.dataset.vision = "on";
  root.dataset.visionFont = normalized.font;
  root.dataset.visionScheme = normalized.scheme;
  root.dataset.visionImages = normalized.hideImages ? "hidden" : "visible";
}

function getImageLabel(element) {
  const nestedImage = element.matches?.("img") ? element : element.querySelector?.("img");
  const label =
    nestedImage?.getAttribute("alt") ||
    element.getAttribute?.("aria-label") ||
    element.getAttribute?.("title") ||
    nestedImage?.getAttribute("title") ||
    "";

  return label.trim();
}

function isCompactPlaceholder(element) {
  return Boolean(element.closest?.(".header__social-link, .footer__phone-row"));
}

function placeholderText(element, compact = false) {
  const label = getImageLabel(element);
  if (compact && label) return label;
  return label ? `${t("Изображение отключено")}: ${label}` : t("Изображение отключено");
}

function createImagePlaceholder(element) {
  const placeholder = document.createElement("span");
  const compact = isCompactPlaceholder(element);

  placeholder.className = `vision-image-placeholder${
    compact ? " vision-image-placeholder--compact" : ""
  }`;
  placeholder.setAttribute("role", "note");
  placeholder.textContent = placeholderText(element, compact);
  return placeholder;
}

function shouldSkipMediaPlaceholder(media) {
  return Boolean(
    media.matches?.("img") &&
      !getImageLabel(media) &&
      media.closest?.("button, .btn-outline, .method-btn, .qty-btn"),
  );
}

function isInsideGeneratedUi(element) {
  return Boolean(
    element.closest?.(
      ".vision-modal, .site-preloader, .vision-image-placeholder, script, style, template",
    ),
  );
}

function ensureContainerPlaceholder(container) {
  if (isInsideGeneratedUi(container)) return;

  const existing = Array.from(container.children).find((child) =>
    child.classList?.contains("vision-image-placeholder"),
  );

  if (existing) {
    existing.textContent = placeholderText(container);
    return;
  }

  container.append(createImagePlaceholder(container));
}

function ensureMediaPlaceholder(media) {
  if (isInsideGeneratedUi(media)) return;
  if (media.closest?.(IMAGE_CONTAINER_SELECTOR)) return;

  const next = media.nextElementSibling;
  if (shouldSkipMediaPlaceholder(media)) {
    if (next?.classList?.contains("vision-image-placeholder")) {
      next.remove();
    }
    return;
  }

  if (next?.classList?.contains("vision-image-placeholder")) {
    next.textContent = placeholderText(media, isCompactPlaceholder(media));
    return;
  }

  media.insertAdjacentElement("afterend", createImagePlaceholder(media));
}

function removeImagePlaceholders() {
  document
    .querySelectorAll(".vision-image-placeholder")
    .forEach((placeholder) => placeholder.remove());
}

function syncImagePlaceholders(settings = getVisionSettings()) {
  const normalized = normalizeSettings(settings);

  if (!normalized.enabled || !normalized.hideImages || !document.body) {
    removeImagePlaceholders();
    return;
  }

  document
    .querySelectorAll(IMAGE_CONTAINER_SELECTOR)
    .forEach((container) => ensureContainerPlaceholder(container));

  document
    .querySelectorAll("img, picture, video, canvas, iframe, object, embed")
    .forEach((media) => ensureMediaPlaceholder(media));

  applyTranslations(document);
}

function scheduleImagePlaceholderSync() {
  if (imageSyncTimer) {
    window.clearTimeout(imageSyncTimer);
  }

  imageSyncTimer = window.setTimeout(() => {
    imageSyncTimer = null;
    syncImagePlaceholders();
  }, 80);
}

function fontChoice(value, label) {
  return `
    <label class="vision-choice vision-choice--font">
      <input
        type="radio"
        name="vision-font"
        value="${value}"
        data-vision-control="font"
      />
      <span class="vision-choice__sample" aria-hidden="true">Aa</span>
      <span class="vision-choice__label">${label}</span>
    </label>
  `;
}

function schemeChoice(value, label, background, color) {
  return `
    <label class="vision-choice vision-choice--scheme">
      <input
        type="radio"
        name="vision-scheme"
        value="${value}"
        data-vision-control="scheme"
      />
      <span
        class="vision-choice__swatch"
        style="--swatch-bg: ${background}; --swatch-color: ${color}"
        aria-hidden="true"
      >A</span>
      <span class="vision-choice__label">${label}</span>
    </label>
  `;
}

function modalMarkup() {
  return `
    <div class="vision-modal__backdrop" data-vision-close aria-hidden="true"></div>
    <section
      class="vision-modal__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vision-settings-title"
    >
      <header class="vision-modal__header">
        <div>
          <p class="vision-modal__eyebrow">${t("Настройки сайта")}</p>
          <h2 class="vision-modal__title" id="vision-settings-title">
            ${t("Версия для слабовидящих")}
          </h2>
        </div>
        <button
          type="button"
          class="vision-modal__close"
          data-vision-close
          aria-label="${t("Закрыть настройки версии для слабовидящих")}"
        >
          ${t("Закрыть")}
        </button>
      </header>

      <div class="vision-modal__body">
        <label class="vision-switch">
          <input type="checkbox" data-vision-control="enabled" />
          <span class="vision-switch__control" aria-hidden="true"></span>
          <span class="vision-switch__text">
            ${t("Включить версию для слабовидящих")}
          </span>
        </label>

        <fieldset class="vision-fieldset">
          <legend class="vision-fieldset__legend">${t("Размер шрифта")}</legend>
          <div class="vision-options vision-options--font">
            ${fontChoice("normal", t("Обычный"))}
            ${fontChoice("large", t("Крупный"))}
            ${fontChoice("extra", t("Очень крупный"))}
          </div>
        </fieldset>

        <fieldset class="vision-fieldset">
          <legend class="vision-fieldset__legend">${t("Цветовая схема")}</legend>
          <div class="vision-options vision-options--scheme">
            ${schemeChoice("black-white", t("Черный фон, белый текст"), "#000000", "#ffffff")}
            ${schemeChoice("black-green", t("Черный фон, зеленый текст"), "#000000", "#00ff66")}
            ${schemeChoice("white-black", t("Белый фон, черный текст"), "#ffffff", "#000000")}
            ${schemeChoice("beige-brown", t("Бежевый фон, коричневый текст"), "#f4ead2", "#4b2f14")}
            ${schemeChoice("blue-navy", t("Голубой фон, темно-синий текст"), "#dff3ff", "#002b5c")}
          </div>
        </fieldset>

        <label class="vision-checkbox">
          <input type="checkbox" data-vision-control="hideImages" />
          <span>${t("Отключить изображения")}</span>
        </label>
      </div>

      <footer class="vision-modal__actions">
        <button type="button" class="vision-modal__secondary" data-vision-reset>
          ${t("Сбросить настройки")}
        </button>
        <button type="button" class="vision-modal__primary" data-vision-close>
          ${t("Готово")}
        </button>
      </footer>
    </section>
  `;
}

function getFocusableElements() {
  if (!modal) return [];

  return Array.from(
    modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.disabled && element.offsetParent !== null);
}

function handleKeydown(event) {
  if (!modal || modal.hidden) return;

  if (event.key === "Escape") {
    closeVisionSettings();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getFocusableElements();
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function handleClick(event) {
  const openButton = event.target.closest("[data-vision-open]");
  if (openButton) {
    event.preventDefault();
    openVisionSettings();
    return;
  }

  if (!modal) return;

  if (event.target.closest("[data-vision-reset]")) {
    event.preventDefault();
    setVisionSettings({ ...DEFAULT_SETTINGS });
    return;
  }

  if (event.target.closest("[data-vision-close]")) {
    event.preventDefault();
    closeVisionSettings();
  }
}

function handleChange(event) {
  const control = event.target.closest("[data-vision-control]");
  if (!control) return;

  const controlType = control.dataset.visionControl;

  if (controlType === "enabled") {
    setVisionSettings({ enabled: control.checked });
    return;
  }

  if (controlType === "font" && control.checked) {
    setVisionSettings({ enabled: true, font: control.value });
    return;
  }

  if (controlType === "scheme" && control.checked) {
    setVisionSettings({ enabled: true, scheme: control.value });
    return;
  }

  if (controlType === "hideImages") {
    setVisionSettings({ enabled: true, hideImages: control.checked });
  }
}

function syncModalState(settings = getVisionSettings()) {
  if (!modal) return;

  const normalized = normalizeSettings(settings);
  const enabledControl = modal.querySelector('[data-vision-control="enabled"]');
  const imageControl = modal.querySelector('[data-vision-control="hideImages"]');

  if (enabledControl) enabledControl.checked = normalized.enabled;
  if (imageControl) imageControl.checked = normalized.hideImages;

  modal.querySelectorAll('[data-vision-control="font"]').forEach((input) => {
    input.checked = input.value === normalized.font;
  });

  modal.querySelectorAll('[data-vision-control="scheme"]').forEach((input) => {
    input.checked = input.value === normalized.scheme;
  });

  modal.querySelectorAll(".vision-choice").forEach((choice) => {
    const input = choice.querySelector("input");
    choice.classList.toggle("vision-choice--active", Boolean(input?.checked));
  });
}

export function getVisionSettings() {
  return readSettings();
}

export function setVisionSettings(settings) {
  const previousSettings = getVisionSettings();
  const nextSettings = normalizeSettings({ ...previousSettings, ...settings });

  saveSettings(nextSettings);
  applyVisionSettings(nextSettings);
  syncVisionControls(nextSettings);
  syncModalState(nextSettings);
  syncImagePlaceholders(nextSettings);

  window.dispatchEvent(
    new CustomEvent("vision:change", {
      detail: { settings: nextSettings, previousSettings },
    }),
  );
}

export function syncVisionControls(settings = getVisionSettings()) {
  const normalized = normalizeSettings(settings);

  document.querySelectorAll("[data-vision-open]").forEach((button) => {
    button.setAttribute("aria-pressed", String(normalized.enabled));
    button.classList.toggle("footer__accessibility-btn--active", normalized.enabled);
  });
}

function ensureModal() {
  if (modal) return modal;

  if (!document.body) {
    document.addEventListener("DOMContentLoaded", ensureModal, { once: true });
    return null;
  }

  modal = document.createElement("div");
  modal.id = "vision-settings-modal";
  modal.className = "vision-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.hidden = true;
  modal.innerHTML = modalMarkup();
  document.body.append(modal);

  applyTranslations(modal);
  syncModalState();

  return modal;
}

export function openVisionSettings() {
  const currentModal = ensureModal();
  if (!currentModal) return;

  previousFocus = document.activeElement;
  currentModal.hidden = false;
  currentModal.classList.add("vision-modal--open");
  currentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("vision-modal-open");
  syncModalState();

  window.setTimeout(() => {
    const firstFocusable = getFocusableElements()[0];
    firstFocusable?.focus();
  }, 0);
}

export function closeVisionSettings() {
  if (!modal) return;

  modal.classList.remove("vision-modal--open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("vision-modal-open");
  modal.hidden = true;

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

export function initAccessibility() {
  applyVisionSettings(getVisionSettings());

  if (isInitialized) return;
  isInitialized = true;

  document.addEventListener("click", handleClick);
  document.addEventListener("change", handleChange);
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("i18n:languagechange", () => {
    if (modal) {
      applyTranslations(modal);
      syncModalState();
    }
    syncImagePlaceholders();
  });

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        ensureModal();
        syncVisionControls();
        syncImagePlaceholders();
      },
      { once: true },
    );
  } else {
    ensureModal();
    syncVisionControls();
    syncImagePlaceholders();
  }

  if (!imageObserver && "MutationObserver" in window) {
    imageObserver = new MutationObserver(scheduleImagePlaceholderSync);
    const startObserver = () => {
      if (document.body) {
        imageObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["alt", "aria-label", "title"],
        });
      }
    };

    if (document.body) {
      startObserver();
    } else {
      document.addEventListener("DOMContentLoaded", startObserver, { once: true });
    }
  }
}
