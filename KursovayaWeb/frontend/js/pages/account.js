import {
  fetchCollectionData,
  fetchUserById,
  fetchUsers,
  getCurrentUser,
  updateUser,
} from "../api.js";
import {
  formatCurrency as formatLocalizedCurrency,
  formatDate as formatLocalizedDate,
  getLanguage,
  onLanguageChange,
  t,
} from "../i18n.js";

const COMMON_PASSWORDS = new Set([
  "123456",
  "12345678",
  "password",
  "qwerty",
  "admin",
  "admin123",
  "password123",
  "pass@123",
]);

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    authMessage: document.getElementById("account-auth-message"),
    content: document.getElementById("account-content"),
    form: document.getElementById("account-form"),
    saveBtn: document.getElementById("account-save"),
    status: document.getElementById("account-status"),
    role: document.getElementById("account-role"),
    ordersCount: document.getElementById("orders-count"),
    ordersList: document.getElementById("orders-list"),

    lastName: document.getElementById("account-lastname"),
    firstName: document.getElementById("account-firstname"),
    patronymic: document.getElementById("account-patronymic"),
    phone: document.getElementById("account-phone"),
    email: document.getElementById("account-email"),
    birthdate: document.getElementById("account-birthdate"),
    nickname: document.getElementById("account-nickname"),
    password: document.getElementById("account-password"),
    confirmPassword: document.getElementById("account-confirm-password"),
  };

  const sessionUser = getCurrentUser();
  let activeUser = null;
  let users = [];

  async function initAccount() {
    if (!sessionUser?.id) {
      showAuthMessage();
      return;
    }

    try {
      DOM.saveBtn.disabled = true;
      setStatus(t("Загружаем данные аккаунта..."));

      const [freshUser, allUsers] = await Promise.all([
        fetchUserById(sessionUser.id),
        fetchUsers(),
      ]);

      activeUser = freshUser;
      users = allUsers;
      localStorage.setItem("currentUser", JSON.stringify(activeUser));

      fillProfileForm();
      await loadOrders();
      setStatus("");
    } catch (error) {
      console.error(error);
      showAuthMessage(
        t("Не удалось загрузить данные аккаунта. Войдите заново или проверьте сервер."),
      );
    } finally {
      DOM.saveBtn.disabled = false;
    }
  }

  function showAuthMessage(
    message = t("Войдите в аккаунт, чтобы открыть личный кабинет."),
  ) {
    DOM.content.hidden = true;
    DOM.authMessage.hidden = false;
    DOM.authMessage.innerHTML = `
      ${message}<br><br>
      <a href="auth.html" class="btn-outline">${t("Войти / зарегистрироваться")}</a>
    `;
  }

  function fillProfileForm() {
    DOM.lastName.value = activeUser.lastName || "";
    DOM.firstName.value = activeUser.firstName || "";
    DOM.patronymic.value = activeUser.patronymic || "";
    DOM.phone.value = activeUser.phone || "";
    DOM.email.value = activeUser.email || "";
    DOM.birthdate.value = activeUser.birthdate || "";
    DOM.nickname.value = activeUser.nickname || "";
    DOM.role.textContent =
      activeUser.role === "administrator" ? t("Администратор") : t("Клиент");
  }

  async function loadOrders() {
    try {
      const orders = await fetchCollectionData("orders", activeUser.id);
      orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      DOM.ordersCount.textContent = `${orders.length} ${pluralizeOrders(orders.length)}`;
      renderOrders(orders);
    } catch (error) {
      console.error(error);
      DOM.ordersCount.textContent = "";
      DOM.ordersList.innerHTML = `
        <div class="account-empty">
          <h3>${t("История временно недоступна")}</h3>
          <p>${t("Проверьте, что json-server запущен на порту 3000.")}</p>
        </div>
      `;
    }
  }

  function renderOrders(orders) {
    if (orders.length === 0) {
      DOM.ordersList.innerHTML = `
        <div class="account-empty">
          <h3>${t("История заказов пуста")}</h3>
          <p>${t("После оформления покупки в корзине заказ появится здесь.")}</p>
          <a href="catalog.html" class="btn-outline">${t("Перейти в каталог")}</a>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    orders.forEach((order) => {
      const item = document.createElement("article");
      item.className = "order-item";

      const header = document.createElement("header");
      header.className = "order-item__header";

      const titleWrap = document.createElement("div");

      const title = document.createElement("h3");
      title.className = "order-item__title";
      title.textContent = t("Заказ {id}", { id: order.id });

      const date = document.createElement("p");
      date.className = "order-item__date";
      date.textContent = formatDate(order.date);

      titleWrap.append(title, date);

      const total = document.createElement("p");
      total.className = "order-total";
      total.textContent = formatCurrency(order.total);

      header.append(titleWrap, total);

      const products = document.createElement("div");
      products.className = "order-products";

      order.products.forEach((product) => {
        const row = document.createElement("div");
        row.className = "order-product";

        const productTitle = document.createElement("p");
        productTitle.className = "order-product__title";
        productTitle.textContent = product.title;

        const meta = document.createElement("p");
        meta.className = "order-product__meta";
        meta.textContent = t("{count} шт. x {price}", {
          count: product.quantity,
          price: formatCurrency(product.price),
        });

        row.append(productTitle, meta);
        products.appendChild(row);
      });

      item.append(header, products);
      fragment.appendChild(item);
    });

    DOM.ordersList.replaceChildren(fragment);
  }

  function validateProfile() {
    let isValid = true;
    clearErrors();

    if (!DOM.lastName.value.trim()) {
      setError("lastname", t("Введите фамилию."));
      isValid = false;
    }

    if (!DOM.firstName.value.trim()) {
      setError("firstname", t("Введите имя."));
      isValid = false;
    }

    const phoneRegex =
      /^\+375\s?\(?(25|29|33|44)\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
    if (!phoneRegex.test(DOM.phone.value.trim())) {
      setError("phone", t("Введите белорусский мобильный номер +375."));
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(DOM.email.value.trim())) {
      setError("email", t("Введите корректный email."));
      isValid = false;
    }

    if (!isAtLeast16(DOM.birthdate.value)) {
      setError("birthdate", t("Возраст пользователя должен быть не меньше 16 лет."));
      isValid = false;
    }

    const nickname = DOM.nickname.value.trim();
    if (!nickname) {
      setError("nickname", t("Введите никнейм."));
      isValid = false;
    } else {
      const duplicate = users.some(
        (user) =>
          user.id !== activeUser.id &&
          user.nickname.toLowerCase() === nickname.toLowerCase(),
      );
      if (duplicate) {
        setError("nickname", t("Такой никнейм уже занят."));
        isValid = false;
      }
    }

    const newPassword = DOM.password.value;
    const confirmPassword = DOM.confirmPassword.value;
    if (newPassword || confirmPassword) {
      const passwordError = getPasswordError(newPassword);
      if (passwordError) {
        setError("password", passwordError);
        isValid = false;
      }

      if (newPassword !== confirmPassword) {
        setError("confirm-password", t("Пароли не совпадают."));
        isValid = false;
      }
    }

    return isValid;
  }

  function getPasswordError(password) {
    if (password.length < 8 || password.length > 20) {
      return t("Пароль должен содержать от 8 до 20 символов.");
    }
    if (!/[A-ZА-Я]/.test(password)) {
      return t("Добавьте хотя бы одну заглавную букву.");
    }
    if (!/[a-zа-я]/.test(password)) {
      return t("Добавьте хотя бы одну строчную букву.");
    }
    if (!/\d/.test(password)) {
      return t("Добавьте хотя бы одну цифру.");
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':",./<>?~`|]/.test(password)) {
      return t("Добавьте хотя бы один специальный символ.");
    }
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      return t("Этот пароль слишком распространен.");
    }
    return "";
  }

  function buildProfilePayload() {
    const payload = {
      lastName: DOM.lastName.value.trim(),
      firstName: DOM.firstName.value.trim(),
      patronymic: DOM.patronymic.value.trim(),
      phone: DOM.phone.value.trim(),
      email: DOM.email.value.trim(),
      birthdate: DOM.birthdate.value,
      nickname: DOM.nickname.value.trim(),
    };

    if (DOM.password.value) {
      payload.password = DOM.password.value;
    }

    return payload;
  }

  DOM.form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateProfile()) {
      setStatus(t("Проверьте поля формы."), "error");
      return;
    }

    try {
      DOM.saveBtn.disabled = true;
      DOM.saveBtn.textContent = t("Сохраняем...");
      setStatus("");

      const updatedUser = await updateUser(activeUser.id, buildProfilePayload());
      activeUser = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(activeUser));
      users = await fetchUsers();

      DOM.password.value = "";
      DOM.confirmPassword.value = "";
      DOM.role.textContent =
        activeUser.role === "administrator" ? t("Администратор") : t("Клиент");
      const headerUser = document.querySelector(".nav__user");
      if (headerUser) {
        headerUser.textContent = activeUser.nickname;
      }
      setStatus(t("Данные аккаунта сохранены."), "success");
    } catch (error) {
      console.error(error);
      setStatus(t("Не удалось сохранить данные. Проверьте сервер."), "error");
    } finally {
      DOM.saveBtn.disabled = false;
      DOM.saveBtn.textContent = t("Сохранить изменения");
    }
  });

  [
    DOM.lastName,
    DOM.firstName,
    DOM.patronymic,
    DOM.phone,
    DOM.email,
    DOM.birthdate,
    DOM.nickname,
    DOM.password,
    DOM.confirmPassword,
  ].forEach((field) => {
    field.addEventListener("input", () => {
      clearErrors();
      setStatus("");
    });
  });

  function setError(fieldId, message) {
    const error = document.getElementById(`err-${fieldId}`);
    if (error) {
      error.textContent = message;
    }
  }

  function clearErrors() {
    document.querySelectorAll(".error-msg").forEach((error) => {
      error.textContent = "";
    });
  }

  function setStatus(message, type = "") {
    DOM.status.textContent = message;
    DOM.status.className = `account-status${type ? ` account-status--${type}` : ""}`;
  }

  function isAtLeast16(value) {
    if (!value) return false;

    const birthdate = new Date(value);
    if (Number.isNaN(birthdate.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDelta = today.getMonth() - birthdate.getMonth();
    const hasBirthdayPassed =
      monthDelta > 0 ||
      (monthDelta === 0 && today.getDate() >= birthdate.getDate());

    if (!hasBirthdayPassed) {
      age -= 1;
    }

    return age >= 16;
  }

  function formatDate(value) {
    return formatLocalizedDate(value);
  }

  function formatCurrency(value) {
    return formatLocalizedCurrency(value);
  }

  function pluralizeOrders(count) {
    if (getLanguage() === "en") {
      return count === 1 ? t("заказ") : t("заказов");
    }

    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) return "заказ";
    if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
      return "заказа";
    }
    return "заказов";
  }

  initAccount();

  onLanguageChange(() => {
    if (activeUser) {
      fillProfileForm();
      loadOrders();
    } else {
      showAuthMessage();
    }
    DOM.saveBtn.textContent = t("Сохранить изменения");
  });
});
