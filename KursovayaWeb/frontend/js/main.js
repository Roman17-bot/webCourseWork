(function () {
  "use strict";

  /* -------------------------------------------------
     1. HAMBURGER / NAV TOGGLE
     ------------------------------------------------- */
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");

  if (hamburgerBtn && navMenu) {
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
     3. CONTACT FORM — BASIC VALIDATION
     ------------------------------------------------- */
  var contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = contactForm.querySelector('[name="name"]');
      var phone = contactForm.querySelector('[name="phone"]');
      var email = contactForm.querySelector('[name="email"]');
      var isValid = true;

      // Simple validation
      [name, phone, email].forEach(function (field) {
        if (field && field.value.trim() === "") {
          field.style.borderColor = "#ff6b6b";
          isValid = false;

          field.addEventListener("input", function clearError() {
            field.style.borderColor = "";
            field.removeEventListener("input", clearError);
          });
        }
      });

      if (isValid) {
        // Simulate form submission success
        var submitBtn = contactForm.querySelector('[type="submit"]');
        var originalText = submitBtn ? submitBtn.textContent : "Отправить";

        if (submitBtn) {
          submitBtn.textContent = "Отправлено!";
          submitBtn.disabled = true;
          submitBtn.style.opacity = "0.8";
        }

        // Reset after 3 seconds
        setTimeout(function () {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
          }
        }, 3000);
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
