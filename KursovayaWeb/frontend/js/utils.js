export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export function initMenuToggle(component, selectors = {}) {
  const {
    hamburger = "#hamburger-btn",
    nav = "#nav-menu",
    link = ".nav__link",
    openClass = "nav--open",
  } = selectors;

  const hamburgerBtn = component.querySelector(hamburger);
  const navMenu = component.querySelector(nav);

  if (!hamburgerBtn || !navMenu) {
    console.warn("MenuToggle: не найдены элементы меню", { hamburger, nav });
    return null;
  }

  // Обработчик переключения меню
  const toggleMenu = () => {
    const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
    hamburgerBtn.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle(openClass, !isExpanded);
  };

  hamburgerBtn.addEventListener("click", toggleMenu);

  // Закрытие при клике на ссылку
  const navLinks = navMenu.querySelectorAll(link);
  const linkHandlers = [];

  navLinks.forEach((linkEl) => {
    const handler = () => {
      hamburgerBtn.setAttribute("aria-expanded", "false");
      navMenu.classList.remove(openClass);
    };
    linkEl.addEventListener("click", handler);
    linkHandlers.push({ el: linkEl, handler });
  });

  // Закрытие по Escape
  const onEscapeKey = (e) => {
    if (e.key === "Escape" && navMenu.classList.contains(openClass)) {
      hamburgerBtn.setAttribute("aria-expanded", "false");
      navMenu.classList.remove(openClass);
      hamburgerBtn.focus();
    }
  };
  document.addEventListener("keydown", onEscapeKey);

  // Закрытие при клике вне меню
  const onOutsideClick = (e) => {
    if (
      navMenu.classList.contains(openClass) &&
      !navMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      hamburgerBtn.setAttribute("aria-expanded", "false");
      navMenu.classList.remove(openClass);
    }
  };
  document.addEventListener("click", onOutsideClick);

  // Возвращаем объект для очистки обработчиков
  return {
    destroy() {
      document.removeEventListener("keydown", onEscapeKey);
      document.removeEventListener("click", onOutsideClick);

      linkHandlers.forEach(({ el, handler }) => {
        el.removeEventListener("click", handler);
      });

      hamburgerBtn.removeEventListener("click", toggleMenu);
    },
    toggle: toggleMenu,
    close: () => {
      hamburgerBtn.setAttribute("aria-expanded", "false");
      navMenu.classList.remove(openClass);
    },
    open: () => {
      hamburgerBtn.setAttribute("aria-expanded", "true");
      navMenu.classList.add(openClass);
    },
  };
}
