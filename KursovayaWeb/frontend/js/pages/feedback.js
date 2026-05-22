import { fetchCollectionData, createFeedback, getCurrentUser } from "../api.js";
import { onLanguageChange, t } from "../i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    formCard: document.getElementById("feedback-form-card"),
    noAccessCard: document.getElementById("no-access-message"),
    errorMsgText: document.getElementById("access-error-text"),

    form: document.getElementById("feedback-form"),
    productSelect: document.getElementById("feedback-product"),
    ratingSelect: document.getElementById("feedback-rating"),
    textInput: document.getElementById("feedback-text"),
    charCounter: document.getElementById("char-counter"),
    btnSubmit: document.getElementById("btn-feedback-submit"),

    errProduct: document.getElementById("err-product"),
    errText: document.getElementById("err-text"),
  };

  const activeUser = getCurrentUser();

  async function checkPermissionsAndLoad() {
    // 1. Не авторизован
    if (!activeUser) {
      showNoAccess(
        t("You must be logged in to write a review. Please sign in first."),
      );
      return;
    }

    // 2. Администратор не имеет права оставлять отзывы
    if (activeUser.role === "administrator") {
      showNoAccess(
        t("Administrators cannot leave feedback. Please sign in with a client account."),
      );
      return;
    }

    // 3. Получение истории покупок (заказов)
    try {
      const orders = await fetchCollectionData("orders", activeUser.id);

      // Вычленяем уникальные продукты из заказов
      const purchasedProductsMap = new Map();
      orders.forEach((order) => {
        order.products.forEach((p) => {
          purchasedProductsMap.set(p.productId, p);
        });
      });

      if (purchasedProductsMap.size === 0) {
        showNoAccess(
          t("You can only leave feedback on services you have purchased at least once."),
        );
        return;
      }

      // Наполнение селектора
      DOM.productSelect.replaceChildren();
      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.disabled = true;
      defaultOpt.selected = true;
      defaultOpt.textContent = t("-- Select purchased service --");
      DOM.productSelect.appendChild(defaultOpt);

      purchasedProductsMap.forEach((product, id) => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = product.title;
        opt.dataset.baseTitle = product._baseTitle || product.title;
        if (product.i18n) {
          opt.dataset.i18n = JSON.stringify(product.i18n);
        }
        DOM.productSelect.appendChild(opt);
      });
    } catch (err) {
      console.error(err);
      showNoAccess(t("Error checking order history. Please try again."));
    }
  }

  function showNoAccess(message) {
    DOM.formCard.style.display = "none";
    DOM.noAccessCard.style.display = "block";
    DOM.errorMsgText.textContent = message;
  }

  // Счётчик и верификация текста
  DOM.textInput.addEventListener("input", (e) => {
    const len = e.target.value.length;
    DOM.charCounter.textContent = t("{count} characters", { count: len });
    DOM.errText.textContent = "";

    validateForm();
  });

  DOM.productSelect.addEventListener("change", () => {
    DOM.errProduct.textContent = "";
    validateForm();
  });

  function validateForm() {
    let isValid = true;

    // Валидация выбора товара
    if (!DOM.productSelect.value) {
      isValid = false;
    }

    // Валидация текста (Минимум 20 символов)
    const textVal = DOM.textInput.value.trim();
    if (textVal.length < 20) {
      isValid = false;
      if (textVal.length > 0) {
        DOM.errText.textContent =
          t("Review text must be at least 20 characters long.");
      }
    }

    DOM.btnSubmit.disabled = !isValid;
    return isValid;
  }

  DOM.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedOpt =
      DOM.productSelect.options[DOM.productSelect.selectedIndex];

    const feedbackPayload = {
      userId: activeUser.id,
      userNickname: activeUser.nickname,
      productId: DOM.productSelect.value,
      productTitle: selectedOpt.dataset.baseTitle || selectedOpt.textContent,
      productI18n: selectedOpt.dataset.i18n
        ? JSON.parse(selectedOpt.dataset.i18n)
        : undefined,
      rating: parseInt(DOM.ratingSelect.value, 10),
      text: DOM.textInput.value.trim(),
      date: new Date().toISOString(),
    };

    try {
      DOM.btnSubmit.textContent = t("Submitting...");
      DOM.btnSubmit.disabled = true;

      await createFeedback(feedbackPayload);
      alert(`🎉 ${t("Thank you! Your review has been saved.")}`);
      window.location.href = "catalog.html";
    } catch (err) {
      alert(`❌ ${t("Failed to save review.")}`);
      DOM.btnSubmit.disabled = false;
    } finally {
      DOM.btnSubmit.textContent = t("Submit Feedback");
    }
  });

  checkPermissionsAndLoad();

  onLanguageChange(() => {
    DOM.charCounter.textContent = t("{count} characters", {
      count: DOM.textInput.value.length,
    });
    checkPermissionsAndLoad();
  });
});
