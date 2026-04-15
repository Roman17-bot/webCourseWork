import { initMenuToggle } from "./utils.js";

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<header class="header" role="banner">
      <div class="header__inner">
        <!-- Logo -->
        <a href="../index.html" class="header__logo" aria-label="АкваТехноСервис — главная">
          <img
            src="../assets/images/АкваТехноСервис-лого-1.png"
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
                src="../assets/icons/viber.svg"
                alt="Viber"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="Telegram">
              <img
                src="../assets/icons/whats.svg"
                alt="Telegram"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="WhatsApp">
              <img
                src="../assets/icons/tg.svg"
                alt="WhatsApp"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="Instagram">
              <img
                src="../assets/icons/skype.svg"
                alt="Instagram"
                class="header__social-icon"
              />
            </a>
            <a href="#" class="header__social-link" aria-label="ВКонтакте">
              <img
                src="../assets/icons/msg.svg"
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
          <li class="nav__item">
            <a href="#about" class="nav__link">О нас</a>
          </li>
          <li class="nav__item">
            <a href="cart.html" class="nav__link">Корзина</a>
          </li>
          <li class="nav__item">
            <a href="catalog.html" class="nav__link">Каталог</a>
          </li>
          <li class="nav__item">
            <a href="favorites.html" class="nav__link">Избранные</a>
          </li>
          <li class="nav__item">
            <a href="#projects" class="nav__link">Проекты</a>
          </li>
          <li class="nav__item">
            <a href="#contact" class="nav__link">Контакты</a>
          </li>
        </ul>
      </nav>
    </header>
    `;

    this._menuController = initMenuToggle(this);
  }

  disconnectedCallback() {
    if (this._menuController?.destroy) {
      this._menuController.destroy();
    }
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer" role="contentinfo">
      <div class="footer__inner">
        <!-- Logo -->
        <div class="footer__logo-wrap">
          <img
            src="../assets/images/АкваТехноСервис-лого-2.png"
            alt="АкваТехноСервис"
            class="footer__logo"
          />
        </div>

        <!-- Contacts -->
        <div class="footer__contacts">
          <div class="footer__phones">
            <div class="footer__phone-row">
              <img
                src="../assets/icons/А1.svg"
                alt="А1"
                class="footer__operator-logo"
              />
              <a href="tel:+375293658070" class="footer__phone"
                >+375 29 365-80-70</a
              >
            </div>
            <div class="footer__phone-row">
              <img
                src="../assets/icons/mts.svg"
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
        </div>

        <div class="footer__divider" aria-hidden="true"></div>

        <!-- Catalog -->
        <nav class="footer__nav" aria-label="Каталог">
          <a href="#about" class="footer__pages-link">Каталог</a>
        </nav>

        <!-- Pages -->
        <nav class="footer__pages" aria-label="Страницы сайта">
          <ul class="footer__pages-list">
            <li>
              <a href="#about" class="footer__pages-link"
                >О компании ООО "Акватехносервис"</a
              >
            </li>
            <li>
              <a href="#projects" class="footer__pages-link"
                >Реализованные проекты</a
              >
            </li>
            <li><a href="#contact" class="footer__pages-link">Контакты</a></li>
          </ul>
        </nav>
      </div>
    </footer>
    `;
  }
}

// Регистрируем новые теги
customElements.define("app-header", AppHeader);
customElements.define("app-footer", AppFooter);
