import { t } from "./i18n.js";

(function () {
  "use strict";

  /* -------------------------------------------------
     1. HAMBURGER / NAV TOGGLE
     ------------------------------------------------- */
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");
  const isComponentHeader = hamburgerBtn?.closest("app-header");

  if (hamburgerBtn && navMenu && !isComponentHeader) {
    hamburgerBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";

      // Toggle aria-expanded
      this.setAttribute("aria-expanded", String(!isExpanded));

      // Toggle nav visibility
      navMenu.classList.toggle("nav--open", !isExpanded);
    });

    // Close nav when a link is clicked
    const navLinks = navMenu.querySelectorAll(".nav__link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        hamburgerBtn.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("nav--open");
      });
    });

    // Close nav on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("nav--open")) {
        hamburgerBtn.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("nav--open");
        hamburgerBtn.focus();
      }
    });

    // Close nav when clicking outside
    document.addEventListener("click", function (e) {
      if (
        navMenu.classList.contains("nav--open") &&
        !navMenu.contains(e.target) &&
        !hamburgerBtn.contains(e.target)
      ) {
        hamburgerBtn.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("nav--open");
      }
    });
  }

  /* -------------------------------------------------
     2. CAROUSEL — WASH TYPES
     ------------------------------------------------- */
  var carouselTrack = document.getElementById("carousel-track");
  var prevBtn = document.getElementById("carousel-prev");
  var nextBtn = document.getElementById("carousel-next");

  if (carouselTrack && prevBtn && nextBtn) {
    var cards = carouselTrack.querySelectorAll(".wash-card");
    var currentIndex = 0;
    var totalCards = cards.length;

    function getCardWidth() {
      if (cards.length === 0) return 598; // 594px + 4px gap
      var rect = cards[0].getBoundingClientRect();
      return rect.width + 4; // card width + gap
    }

    function getVisibleCount() {
      var trackWrap = carouselTrack.parentElement;
      if (!trackWrap) return 2;
      var wrapWidth = trackWrap.clientWidth;
      var cardW = getCardWidth();
      return Math.max(1, Math.floor(wrapWidth / cardW));
    }

    function getMaxIndex() {
      return Math.max(0, totalCards - getVisibleCount());
    }

    function updateCarousel() {
      var cardW = getCardWidth();
      var offset = currentIndex * cardW;
      carouselTrack.style.transform = "translateX(-" + offset + "px)";

      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= getMaxIndex();
      prevBtn.style.opacity = currentIndex === 0 ? "0.4" : "1";
      nextBtn.style.opacity = currentIndex >= getMaxIndex() ? "0.4" : "1";
    }

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", function () {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Handle resize
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        // Clamp currentIndex to valid range
        currentIndex = Math.min(currentIndex, getMaxIndex());
        updateCarousel();
      }, 150);
    });

    // Touch / swipe support for carousel
    var touchStartX = 0;
    var touchStartY = 0;
    var isDragging = false;

    carouselTrack.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isDragging = true;
      },
      { passive: true },
    );

    carouselTrack.addEventListener(
      "touchend",
      function (e) {
        if (!isDragging) return;
        isDragging = false;
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;

        // Only swipe if horizontal movement dominates
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0 && currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
          } else if (dx > 0 && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
          }
        }
      },
      { passive: true },
    );

    // Initial render
    updateCarousel();
  }

  /* -------------------------------------------------
     3. CONTACT FORM — VALIDATION AND REQUESTS
     ------------------------------------------------- */
  var contactForm = document.getElementById("contact-form");
  var CONTACT_REQUESTS_API = "http://localhost:3000/contactRequests";

  if (contactForm) {
    var contactFields = {
      name: contactForm.querySelector('[name="name"]'),
      phone: contactForm.querySelector('[name="phone"]'),
      email: contactForm.querySelector('[name="email"]'),
      city: contactForm.querySelector('[name="city"]'),
      message: contactForm.querySelector('[name="message"]'),
    };
    var contactStatus = document.getElementById("contact-form-status");
    var submitBtn = contactForm.querySelector('[type="submit"]');
    var originalSubmitText = "Отправить";
    var PHONE_PREFIX = "+375 ";

    function getCurrentContactUser() {
      var userJson = localStorage.getItem("currentUser");
      if (!userJson || userJson === "null" || userJson === "undefined") {
        return null;
      }

      try {
        return JSON.parse(userJson);
      } catch (error) {
        return null;
      }
    }

    function getPhoneDigits(value) {
      var digits = value.replace(/\D/g, "");

      if (digits.indexOf("375") === 0) {
        digits = digits.slice(3);
      }

      return digits.slice(0, 9);
    }

    function formatPhoneValue(value) {
      var digits = getPhoneDigits(value);
      var operatorCode = digits.slice(0, 2);
      var number = digits.slice(2);
      var formatted = "+375";

      if (operatorCode.length > 0) {
        formatted += " (" + operatorCode;
      } else {
        return PHONE_PREFIX;
      }

      if (operatorCode.length === 2) {
        formatted += ")";
      }

      if (number.length > 0) {
        formatted += " " + number.slice(0, 3);
      }

      if (number.length > 3) {
        formatted += "-" + number.slice(3, 5);
      }

      if (number.length > 5) {
        formatted += "-" + number.slice(5, 7);
      }

      return formatted;
    }

    function hasContactFieldValue(fieldName) {
      var field = contactFields[fieldName];
      if (!field) return false;

      if (fieldName === "phone") {
        return getPhoneDigits(field.value).length > 0;
      }

      return field.value.trim().length > 0;
    }

    function updateContactFieldState(fieldName) {
      var field = contactFields[fieldName];
      if (!field) return;

      field.classList.toggle(
        "contact__input--filled",
        hasContactFieldValue(fieldName),
      );
    }

    function updateAllContactFieldStates() {
      Object.keys(contactFields).forEach(updateContactFieldState);
    }

    function getContactError(fieldName, value) {
      var trimmed = value.trim();
      var nameRegex = /^[A-Za-zА-Яа-яЁёІіЎў\s.'-]+$/;
      var phoneRegex =
        /^\+375\s?\(?(25|29|33|44)\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!trimmed) {
        return t("Заполните поле.");
      }

      if (fieldName === "name") {
        if (trimmed.length < 2) return t("Введите имя не короче 2 символов.");
        if (!nameRegex.test(trimmed)) return t("Используйте только буквы.");
      }

      if (fieldName === "phone" && !phoneRegex.test(trimmed)) {
        return t("Введите белорусский номер: +375 (29) 123-45-67.");
      }

      if (fieldName === "email" && !emailRegex.test(trimmed)) {
        return t("Введите корректный e-mail.");
      }

      if (fieldName === "city") {
        if (trimmed.length < 2) return t("Введите город не короче 2 символов.");
        if (!nameRegex.test(trimmed)) return t("Используйте только буквы.");
      }

      if (fieldName === "message") {
        if (trimmed.length < 10) {
          return t("Сообщение должно быть не короче 10 символов.");
        }
        if (trimmed.length > 1000) {
          return t("Сократите сообщение до 1000 символов.");
        }
      }

      return "";
    }

    function setContactFieldError(fieldName, message) {
      var field = contactFields[fieldName];
      var errorEl = document.getElementById("field-" + fieldName + "-error");
      if (!field || !errorEl) return;

      field.classList.toggle("contact__input--error", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
      errorEl.textContent = message;
    }

    function setContactStatus(message, isError) {
      if (!contactStatus) return;
      contactStatus.textContent = message;
      contactStatus.classList.toggle("contact__form-status--error", Boolean(isError));
    }

    function validateContactForm() {
      var isValid = true;

      Object.keys(contactFields).forEach(function (fieldName) {
        var field = contactFields[fieldName];
        var error = field ? getContactError(fieldName, field.value) : "";

        setContactFieldError(fieldName, error);
        if (error) isValid = false;
      });

      return isValid;
    }

    function buildContactPayload() {
      var currentUser = getCurrentContactUser();

      return {
        name: contactFields.name.value.trim(),
        phone: contactFields.phone.value.trim(),
        email: contactFields.email.value.trim(),
        city: contactFields.city.value.trim(),
        message: contactFields.message.value.trim(),
        status: "new",
        source: "main-contact-form",
        createdAt: new Date().toISOString(),
        userId: currentUser ? currentUser.id : null,
        userNickname: currentUser ? currentUser.nickname : null,
      };
    }

    Object.keys(contactFields).forEach(function (fieldName) {
      var field = contactFields[fieldName];
      if (!field) return;

      field.addEventListener("input", function () {
        if (fieldName === "phone") {
          field.value = formatPhoneValue(field.value);
          field.setSelectionRange(field.value.length, field.value.length);
        }

        setContactFieldError(fieldName, "");
        setContactStatus("", false);
        updateContactFieldState(fieldName);
      });

      field.addEventListener("blur", function () {
        if (fieldName === "phone" && !getPhoneDigits(field.value).length) {
          field.value = PHONE_PREFIX;
        }

        updateContactFieldState(fieldName);
      });
    });

    if (contactFields.phone) {
      contactFields.phone.value = PHONE_PREFIX;
      contactFields.phone.addEventListener("focus", function () {
        if (!contactFields.phone.value.trim()) {
          contactFields.phone.value = PHONE_PREFIX;
        }
      });
    }

    updateAllContactFieldStates();

    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      setContactStatus("", false);

      if (!validateContactForm()) {
        setContactStatus(t("Проверьте поля формы."), true);
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = t("Отправляем...");
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.8";
      }

      try {
        var response = await fetch(CONTACT_REQUESTS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildContactPayload()),
        });

        if (!response.ok) {
          throw new Error("Failed to send contact request");
        }

        contactForm.reset();
        if (contactFields.phone) {
          contactFields.phone.value = PHONE_PREFIX;
        }
        Object.keys(contactFields).forEach(function (fieldName) {
          setContactFieldError(fieldName, "");
        });
        updateAllContactFieldStates();
        setContactStatus(
          t("Заявка отправлена. Специалист компании свяжется с вами."),
          false,
        );
      } catch (error) {
        console.error(error);
        setContactStatus(
          t("Не удалось отправить заявку. Проверьте, что json-server запущен."),
          true,
        );
      } finally {
        if (submitBtn) {
          submitBtn.textContent = t(originalSubmitText);
          submitBtn.disabled = false;
          submitBtn.style.opacity = "";
        }
      }
    });
  }

  /* -------------------------------------------------
     4. SMOOTH SCROLL for anchors
     ------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector(".header")
          ? document.querySelector(".header").offsetHeight
          : 0;
        var targetTop =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    });
  });

  /* -------------------------------------------------
     5. HEADER — sticky shadow on scroll
     ------------------------------------------------- */
  var header = document.querySelector(".header");

  if (header) {
    var lastScrollY = window.scrollY;

    window.addEventListener(
      "scroll",
      function () {
        var currentScrollY = window.scrollY;

        if (currentScrollY > 10) {
          header.style.boxShadow = "0 2px 12px rgba(0,0,0,0.12)";
        } else {
          header.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        }

        lastScrollY = currentScrollY;
      },
      { passive: true },
    );
  }
})();
