import { getCurrentUser } from "./api.js";
import { initAccessibility, syncVisionControls } from "./accessibility.js";
import {
  applyTranslations,
  getLanguage,
  initI18n,
  t,
  toggleLanguage,
} from "./i18n.js";
import {
  getTheme,
  initTheme,
  onThemeChange,
  toggleTheme,
} from "./theme.js";
import { initMenuToggle } from "./utils.js";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function initPreloader() {
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", initPreloader, { once: true });
    return;
  }

  if (document.querySelector(".site-preloader")) return;

  const isNestedPage = window.location.pathname.includes("/pages/");
  const rootPath = isNestedPage ? ".." : ".";
  const preloader = document.createElement("div");
  let isHidden = false;

  document.documentElement.classList.add("is-loading");
  preloader.className = "site-preloader";
  preloader.setAttribute("role", "status");
  preloader.setAttribute("aria-live", "polite");
  preloader.innerHTML = `
    <div class="site-preloader__panel">
      <img
        src="${rootPath}/assets/images/АкваТехноСервис-лого-1.png"
        alt="АкваТехноСервис"
        class="site-preloader__logo"
      />
      <div class="site-preloader__mark" aria-hidden="true">
        <span class="site-preloader__ring"></span>
        <span class="site-preloader__drop site-preloader__drop--one"></span>
        <span class="site-preloader__drop site-preloader__drop--two"></span>
        <span class="site-preloader__drop site-preloader__drop--three"></span>
      </div>
      <p class="site-preloader__text">${t("Загружаем сайт")}</p>
      <div class="site-preloader__bar" aria-hidden="true">
        <span class="site-preloader__bar-line"></span>
      </div>
    </div>
  `;

  document.body.prepend(preloader);

  const hidePreloader = () => {
    if (isHidden) return;
    isHidden = true;
    preloader.classList.add("site-preloader--hidden");
    document.documentElement.classList.remove("is-loading");
    window.setTimeout(() => preloader.remove(), 650);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hidePreloader, 450);
  } else {
    window.addEventListener("load", () => window.setTimeout(hidePreloader, 450), {
      once: true,
    });
  }

  window.setTimeout(hidePreloader, 3500);
}

class AppHeader extends HTMLElement {
  connectedCallback() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isNestedPage = window.location.pathname.includes("/pages/");
    const rootPath = isNestedPage ? ".." : ".";
    const pagesPath = isNestedPage ? "" : "pages/";

    const navItem = (href, label, modifier = "") => {
      const pageName = href.split("#")[0].split("/").pop();
      const isAnchorLink = href.includes("#");
      const isCurrent = pageName && currentPage === pageName && !isAnchorLink;
      const className = `nav__link${modifier ? ` ${modifier}` : ""}`;
      const currentAttr = isCurrent ? ' aria-current="page"' : "";

      return `
        <li class="nav__item">
          <a href="${href}" class="${className}"${currentAttr}>${label}</a>
        </li>`;
    };

    let authSection = "";
    if (user) {
      const adminLink =
        user.role === "administrator"
          ? navItem(`${pagesPath}admin.html`, "Админ-панель", "nav__link--accent")
          : "";
      const feedbackLink =
        user.role === "client"
          ? navItem(`${pagesPath}feedback.html`, "Оставить отзыв")
          : "";

      authSection = `
        <li class="nav__item nav__user" aria-label="Текущий пользователь">${escapeHtml(user.nickname)}</li>
        ${navItem(`${pagesPath}account.html`, "Личный кабинет", "nav__link--accent")}
        ${feedbackLink}
        ${adminLink}
        <li class="nav__item"><a href="#" id="logout-btn" class="nav__link nav__link--danger">Выйти</a></li>
      `;
    } else {
      authSection = `
        ${navItem(`${pagesPath}auth.html`, "Вход / регистрация", "nav__link--accent")}
      `;
    }

    this.innerHTML = `
<header class="header" role="banner">
      <div class="header__inner">
        <!-- Logo -->
        <a href="${rootPath}/index.html" class="header__logo" aria-label="АкваТехноСервис — главная">
          <img
            src="${rootPath}/assets/images/АкваТехноСервис-лого-1.png"
            alt="АкваТехноСервис логотип"
            class="header__logo-img"
          />
        </a>

        <!-- Info block -->
        <div class="header__info">
          <p class="header__info-line-small">
            Официальный дилер немецкой компании <strong>WashTec</strong> в
            Беларуси
          </p>
          <p class="header__info-line">
            Официальный представитель российских компаний:
            <strong
              >"Мой-ка! DS-Business", "Cleanol", "Агроснабтехсервис"</strong
            >
          </p>
        </div>

        <!-- Contacts -->
        <div class="header__contacts">
          <span class="header__hours">пн-пт с 9:00 до 18:00</span>
          <div class="header__phone-row">
            <a href="tel:+375293658070" class="header__phone"
              >+375 29 365 80 70</a
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
            >
              <path
                d="M1.41406 1.41422L6.41406 6.41421L11.4141 1.41421"
                stroke="#A0A3BC"
                stroke-width="2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="header__socials">
            <a href="#" class="header__social-link" aria-label="Viber">
              <img
                src="${rootPath}/assets/icons/viber.svg"
                alt="Viber"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="Telegram">
              <img
                src="${rootPath}/assets/icons/whats.svg"
                alt="Telegram"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="WhatsApp">
              <img
                src="${rootPath}/assets/icons/tg.svg"
                alt="WhatsApp"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="Instagram">
              <img
                src="${rootPath}/assets/icons/skype.svg"
                alt="Instagram"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="ВКонтакте">
              <img
                src="${rootPath}/assets/icons/msg.svg"
                alt="ВКонтакте"
                class="header__social-icon"
              />
            </a>
          </div>
          <div class="header__meta-row">
            <a href="mailto:sales@aqts.by" class="header__email"
              >sales@aqts.by</a
            >
          </div>
        </div>

        <!-- Hamburger -->
        <button
          class="header__hamburger"
          id="hamburger-btn"
          aria-label="Открыть меню навигации"
          aria-expanded="false"
          aria-controls="nav-menu"
        >
          <span class="header__hamburger-line"></span>
          <span
            class="header__hamburger-line header__hamburger-line--mid"
          ></span>
          <span
            class="header__hamburger-line header__hamburger-line--short"
          ></span>
        </button>
      </div>

      <!-- Nav menu -->
      <nav
        class="nav"
        id="nav-menu"
        role="navigation"
        aria-label="Основная навигация"
      >
        <ul class="nav__list">
          <li class="nav__item nav__controls" aria-label="Настройки сайта">
            <button
              type="button"
              class="nav__control-btn nav__lang-btn"
              id="language-toggle"
              aria-label="${t("Сменить язык сайта")}"
            >
              ${getLanguage() === "ru" ? "EN" : "RU"}
            </button>
            <button
              type="button"
              class="theme-toggle"
              id="theme-toggle"
              aria-label="${t("Включить тёмную тему")}"
              aria-pressed="false"
            >
              <span class="theme-toggle__track" aria-hidden="true">
                <span class="theme-toggle__glyph theme-toggle__glyph--sun"></span>
                <span class="theme-toggle__knob"></span>
                <span class="theme-toggle__glyph theme-toggle__glyph--moon"></span>
              </span>
              <span class="theme-toggle__text">Светлая</span>
            </button>
          </li>
          ${navItem(`${rootPath}/index.html#about`, "О нас")}
          ${navItem(`${pagesPath}cart.html`, "Корзина")}
          ${navItem(`${pagesPath}catalog.html`, "Каталог")}
          ${navItem(`${pagesPath}favorites.html`, "Избранное")}
          ${navItem(`${rootPath}/index.html#projects`, "Проекты")}
          ${navItem(`${rootPath}/index.html#contact`, "Контакты")}
          ${authSection}
        </ul>
      </nav>
    </header>
    `;

    this._menuController = initMenuToggle(this);

    const languageToggle = this.querySelector("#language-toggle");
    if (languageToggle) {
      languageToggle.addEventListener("click", () => {
        toggleLanguage();
      });
    }

    const themeToggle = this.querySelector("#theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        toggleTheme();
      });
    }

    this._onLanguageChange = () => {
      this.updateLanguageButton();
      this.updateThemeButton();
    };
    window.addEventListener("i18n:languagechange", this._onLanguageChange);

    this._onThemeChange = () => {
      this.updateThemeButton();
    };
    onThemeChange(this._onThemeChange);

    this.updateLanguageButton();
    this.updateThemeButton();
    applyTranslations(this);

    const logoutBtn = this.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        alert("Вы вышли из аккаунта.");
        window.location.href = `${rootPath}/index.html`;
      });
    }
  }

  disconnectedCallback() {
    if (this._menuController?.destroy) {
      this._menuController.destroy();
    }
    if (this._onLanguageChange) {
      window.removeEventListener("i18n:languagechange", this._onLanguageChange);
    }
    if (this._onThemeChange) {
      window.removeEventListener("theme:change", this._onThemeChange);
    }
  }

  updateLanguageButton() {
    const languageToggle = this.querySelector("#language-toggle");
    if (!languageToggle) return;

    languageToggle.textContent = getLanguage() === "ru" ? "EN" : "RU";
    languageToggle.setAttribute("aria-label", t("Сменить язык сайта"));
  }

  updateThemeButton() {
    const themeToggle = this.querySelector("#theme-toggle");
    if (!themeToggle) return;

    const isDark = getTheme() === "dark";
    const text = themeToggle.querySelector(".theme-toggle__text");

    themeToggle.classList.toggle("theme-toggle--dark", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      t(isDark ? "Включить светлую тему" : "Включить тёмную тему"),
    );

    if (text) {
      text.textContent = t(isDark ? "Тёмная" : "Светлая");
    }
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    const isNestedPage = window.location.pathname.includes("/pages/");
    const rootPath = isNestedPage ? ".." : ".";
    const pagesPath = isNestedPage ? "" : "pages/";

    this.innerHTML = `
      <footer class="footer" role="contentinfo">
      <div class="footer__inner">
        <!-- Logo -->
        <div class="footer__logo-wrap">
          <img
            src="${rootPath}/assets/images/АкваТехноСервис-лого-2.png"
            alt="АкваТехноСервис"
            class="footer__logo"
          />
        </div>

        <!-- Contacts -->
        <div class="footer__contacts">
          <div class="footer__phones">
            <div class="footer__phone-row">
              <img
                src="${rootPath}/assets/icons/А1.svg"
                alt="А1"
                class="footer__operator-logo"
              />
              <a href="tel:+375293658070" class="footer__phone"
                >+375 29 365-80-70</a
              >
            </div>
            <div class="footer__phone-row">
              <img
                src="${rootPath}/assets/icons/mts.svg"
                alt="МТС"
                class="footer__operator-logo"
              />
              <a href="tel:+375333658070" class="footer__phone"
                >+375 33 365-80-70</a
              >
            </div>
          </div>
          <div class="footer__hours-address">
            <p class="footer__meta">
              220012, Республика Беларусь, г. Минск, ул. Толбухина 2а, к. 320
            </p>
          </div>
        </div>
        <div class="footer__mail-hours">
          <a href="mailto:sales@aqts.by" class="footer__phone">sales@aqts.by</a>
          <p class="footer__meta">Пн-Пт с 9:00 до 18:00</p>
          <button
            type="button"
            class="footer__accessibility-btn"
            data-vision-open
            aria-controls="vision-settings-modal"
            aria-haspopup="dialog"
            aria-label="${t("Открыть настройки версии для слабовидящих")}"
            aria-pressed="false"
          >
            Версия для слабовидящих
          </button>
        </div>

        <div class="footer__divider" aria-hidden="true"></div>

        <!-- Catalog -->
        <nav class="footer__nav" aria-label="Каталог">
          <a href="${pagesPath}catalog.html" class="footer__pages-link">Каталог</a>
        </nav>

        <!-- Pages -->
        <nav class="footer__pages" aria-label="Страницы сайта">
          <ul class="footer__pages-list">
            <li>
              <a href="${rootPath}/index.html#about" class="footer__pages-link"
                >О компании ООО "Акватехносервис"</a
              >
            </li>
            <li>
              <a href="${rootPath}/index.html#projects" class="footer__pages-link"
                >Реализованные проекты</a
              >
            </li>
            <li><a href="${rootPath}/index.html#contact" class="footer__pages-link">Контакты</a></li>
          </ul>
        </nav>
      </div>
    </footer>
    `;
    applyTranslations(this);
    syncVisionControls();
  }
}

initTheme();
initAccessibility();
initPreloader();

// Регистрируем новые теги
customElements.define("app-header", AppHeader);
customElements.define("app-footer", AppFooter);

initI18n();
