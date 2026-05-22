import { fetchUsers, createUser } from "../api.js";
import { onLanguageChange, t } from "../i18n.js";

const BAD_PASSWORDS_2024 = [
  "123456",
  "admin",
  "12345678",
  "123456789",
  "12345",
  "password",
  "Aa123456",
  "1234567890",
  "Pass@123",
  "admin123",
  "1234567",
  "123123",
  "111111",
  "12345678910",
  "P@ssw0rd",
  "Password",
  "Aa@123456",
  "admintelecom",
  "Admin@123",
  "112233",
  "qwerty",
  "qwerty123",
  "secret",
  "guest",
  "welcome",
  "Letmein1",
  "login",
];

const TRANSLIT_MAP = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function translit(str) {
  return str
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT_MAP[char] || char)
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    tabLogin: document.getElementById("tab-login"),
    tabRegister: document.getElementById("tab-register"),
    loginContainer: document.getElementById("form-login-container"),
    registerContainer: document.getElementById("form-register-container"),

    // Вход
    loginForm: document.getElementById("login-form"),
    loginUser: document.getElementById("login-user"),
    loginPass: document.getElementById("login-password"),

    // Регистрация
    regForm: document.getElementById("register-form"),
    lastName: document.getElementById("reg-lastname"),
    firstName: document.getElementById("reg-firstname"),
    patronymic: document.getElementById("reg-patronymic"),
    phone: document.getElementById("reg-phone"),
    email: document.getElementById("reg-email"),
    birthdate: document.getElementById("reg-birthdate"),
    agreement: document.getElementById("reg-agreement"),
    nickname: document.getElementById("reg-nickname"),
    btnGenNickname: document.getElementById("btn-generate-nickname"),
    attemptsInfo: document.getElementById("nickname-attempts-info"),
    btnRegister: document.getElementById("btn-register-submit"),

    // Пароль
    secManual: document.getElementById("section-manual-password"),
    secAuto: document.getElementById("section-auto-password"),
    password: document.getElementById("reg-password"),
    confirmPassword: document.getElementById("reg-confirm-password"),
    autoPasswordField: document.getElementById("reg-auto-password-field"),

    // Соглашение
    linkAgreement: document.getElementById("link-open-agreement"),
    modalAgreement: document.getElementById("agreement-modal"),
    modalBody: document.getElementById("agreement-body"),
    btnCloseAgreement: document.getElementById("btn-close-agreement"),
  };

  let nicknameAttempts = 0;
  let allUsers = [];
  let userHasReadAgreement = false;

  // Подгружаем пользователей для верификации дубликатов
  async function loadUsers() {
    try {
      allUsers = await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }
  loadUsers();

  DOM.tabLogin.addEventListener("click", () => {
    DOM.tabLogin.classList.add("active");
    DOM.tabRegister.classList.remove("active");
    DOM.loginContainer.style.display = "block";
    DOM.registerContainer.style.display = "none";
  });

  DOM.tabRegister.addEventListener("click", () => {
    DOM.tabRegister.classList.add("active");
    DOM.tabLogin.classList.remove("active");
    DOM.loginContainer.style.display = "none";
    DOM.registerContainer.style.display = "block";
  });

  document.querySelectorAll('input[name="pass-method"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "manual") {
        DOM.secManual.style.display = "block";
        DOM.secAuto.style.display = "none";
        DOM.password.setAttribute("required", "true");
        DOM.confirmPassword.setAttribute("required", "true");
        DOM.autoPasswordField.value = "";
      } else {
        DOM.secManual.style.display = "none";
        DOM.secAuto.style.display = "block";
        DOM.password.removeAttribute("required");
        DOM.confirmPassword.removeAttribute("required");
        generateSecurePassword();
      }
      validateForm();
    });
  });

  function generateSecurePassword() {
    const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowers = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specials = "!@#$%^&*()_+~=";

    let pass = "";
    pass += uppers[Math.floor(Math.random() * uppers.length)];
    pass += lowers[Math.floor(Math.random() * lowers.length)];
    pass += digits[Math.floor(Math.random() * digits.length)];
    pass += specials[Math.floor(Math.random() * specials.length)];

    const allChars = uppers + lowers + digits + specials;
    for (let i = 0; i < 8; i++) {
      pass += allChars[Math.floor(Math.random() * allChars.length)];
    }
    DOM.autoPasswordField.value = pass;
    clearError("password");
  }

  // Запрет вставки (paste) в поле подтверждения пароля
  DOM.confirmPassword.addEventListener("paste", (e) => {
    e.preventDefault();
    alert(`⚠️ ${t("Pasting is disabled in this field!")}`);
  });

  DOM.linkAgreement.addEventListener("click", (e) => {
    e.preventDefault();
    DOM.modalAgreement.style.display = "flex";
  });

  DOM.modalBody.addEventListener("scroll", () => {
    const isScrolledToBottom =
      DOM.modalBody.scrollHeight - DOM.modalBody.scrollTop <=
      DOM.modalBody.clientHeight + 5;
    if (isScrolledToBottom) {
      DOM.btnCloseAgreement.removeAttribute("disabled");
      DOM.btnCloseAgreement.textContent = t("I Have Read the Agreement");
    }
  });

  DOM.btnCloseAgreement.addEventListener("click", () => {
    userHasReadAgreement = true;
    DOM.agreement.checked = true;
    DOM.modalAgreement.style.display = "none";
    clearError("agreement");
    validateForm();
  });

  // ГЕНЕРАЦИЯ УНИКАЛЬНОГО НИКНЕЙМА
  DOM.btnGenNickname.addEventListener("click", () => {
    const fn = DOM.firstName.value.trim();
    const ln = DOM.lastName.value.trim();

    if (!fn || !ln) {
      setError("nickname", t("Please enter First Name and Last Name first!"));
      return;
    }

    if (nicknameAttempts >= 5) {
      return;
    }

    nicknameAttempts++;
    const fnPart = translit(fn).slice(0, Math.floor(Math.random() * 3) + 1);
    const lnPart = translit(ln).slice(0, Math.floor(Math.random() * 3) + 1);
    const num = Math.floor(Math.random() * 990) + 10;

    const suffixes = ["_dev", "_pro", "_tech", "_web", "_art", ""];
    const suff = suffixes[Math.floor(Math.random() * suffixes.length)];

    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const generated = cap(fnPart) + cap(lnPart) + num + suff;

    // Проверка уникальности
    const exists = allUsers.some(
      (u) => u.nickname.toLowerCase() === generated.toLowerCase(),
    );
    if (exists) {
      DOM.btnGenNickname.click();
      return;
    }

    DOM.nickname.value = generated;
    clearError("nickname");

    if (nicknameAttempts >= 5) {
      DOM.nickname.removeAttribute("readonly");
      DOM.nickname.style.backgroundColor = "transparent";
      DOM.attemptsInfo.textContent =
        t("5 attempts used. You can now enter your nickname manually.");
    } else {
      DOM.attemptsInfo.textContent = t("Attempts used: {count} of 5", {
        count: nicknameAttempts,
      });
    }
    validateForm();
  });

  const inputs = [
    DOM.lastName,
    DOM.firstName,
    DOM.patronymic,
    DOM.phone,
    DOM.email,
    DOM.birthdate,
    DOM.password,
    DOM.confirmPassword,
    DOM.nickname,
    DOM.agreement,
  ];
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input.id.replace("reg-", ""));
      validateForm();
    });
  });

  function setError(fieldId, msg) {
    const errSpan = document.getElementById(`err-${fieldId}`);
    if (errSpan) {
      errSpan.textContent = msg;
    }
  }

  function clearError(fieldId) {
    const errSpan = document.getElementById(`err-${fieldId}`);
    if (errSpan) {
      errSpan.textContent = "";
    }
  }

  function validateForm() {
    let isValid = true;

    // 1. Имя
    if (!DOM.firstName.value.trim()) isValid = false;
    // 2. Фамилия
    if (!DOM.lastName.value.trim()) isValid = false;

    // 3. Телефон
    const phoneVal = DOM.phone.value.trim();
    const belPhoneRegex =
      /^\+375\s?\(?(25|29|33|44)\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
    if (phoneVal && !belPhoneRegex.test(phoneVal)) {
      isValid = false;
      setError(
        "phone",
        t("Only Belarus mobile numbers (+375 code 25, 29, 33, 44) are allowed"),
      );
    }

    // 4. Email
    const emailVal = DOM.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal && !emailRegex.test(emailVal)) {
      isValid = false;
      setError("email", t("Please provide a valid email format."));
    }

    // 5. Возраст
    const dobVal = DOM.birthdate.value;
    if (dobVal) {
      const diff = Date.now() - new Date(dobVal).getTime();
      const ageDate = new Date(diff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 16) {
        isValid = false;
        setError("birthdate", t("You must be at least 16 years old to register."));
      }
    } else {
      isValid = false;
    }

    // 6. Пароль
    const isManual =
      document.querySelector('input[name="pass-method"]:checked').value ===
      "manual";
    if (isManual) {
      const pass = DOM.password.value;
      const conf = DOM.confirmPassword.value;

      if (pass) {
        let passErr = "";
        if (pass.length < 8 || pass.length > 20)
          passErr = t("Password must be between 8 and 20 characters.");
        else if (!/[A-Z]/.test(pass))
          passErr = t("Must contain at least one uppercase letter.");
        else if (!/[a-z]/.test(pass))
          passErr = t("Must contain at least one lowercase letter.");
        else if (!/\d/.test(pass))
          passErr = t("Must contain at least one number.");
        else if (!/[!@#$%^&*()_+\-=\[\]{};':",./<>?~`|]/.test(pass))
          passErr = t("Must contain at least one special character.");
        else if (BAD_PASSWORDS_2024.includes(pass.toLowerCase()))
          passErr = t("This password is too common (top list of 2024).");

        if (passErr) {
          isValid = false;
          setError("password", passErr);
        }
      } else {
        isValid = false;
      }

      if (conf && pass !== conf) {
        isValid = false;
        setError("confirm-password", t("Passwords do not match."));
      }
    }

    // 7. Никнейм
    if (!DOM.nickname.value.trim()) {
      isValid = false;
    } else {
      const exists = allUsers.some(
        (u) =>
          u.nickname.toLowerCase() === DOM.nickname.value.trim().toLowerCase(),
      );
      if (exists) {
        isValid = false;
        setError("nickname", t("This nickname is already taken."));
      }
    }

    // 8. Соглашение
    if (!DOM.agreement.checked) {
      isValid = false;
    }

    DOM.btnRegister.disabled = !isValid;
    return isValid;
  }

  DOM.regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const isManual =
      document.querySelector('input[name="pass-method"]:checked').value ===
      "manual";
    const finalPassword = isManual
      ? DOM.password.value
      : DOM.autoPasswordField.value;

    const newUserPayload = {
      phone: DOM.phone.value.trim(),
      email: DOM.email.value.trim(),
      birthdate: DOM.birthdate.value,
      lastName: DOM.lastName.value.trim(),
      firstName: DOM.firstName.value.trim(),
      patronymic: DOM.patronymic.value.trim(),
      nickname: DOM.nickname.value.trim(),
      password: finalPassword,
      role: "client",
    };

    try {
      DOM.btnRegister.textContent = t("Processing...");
      await createUser(newUserPayload);
      alert(`🎉 ${t("Registration successful! You can now log in.")}`);
      location.reload();
    } catch (err) {
      alert(`❌ ${t("Registration failed. Try again.")}`);
    } finally {
      DOM.btnRegister.textContent = t("Register");
    }
  });

  DOM.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const loginVal = DOM.loginUser.value.trim().toLowerCase();
    const passVal = DOM.loginPass.value;

    const matchedUser = allUsers.find(
      (u) =>
        (u.email.toLowerCase() === loginVal ||
          u.nickname.toLowerCase() === loginVal) &&
        u.password === passVal,
    );

    if (matchedUser) {
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));
      alert(t("Welcome back, {nickname}!", { nickname: matchedUser.nickname }));
      window.location.href = "catalog.html";
    } else {
      alert(`❌ ${t("Invalid user credentials or password.")}`);
    }
  });

  onLanguageChange(() => {
    validateForm();
    if (nicknameAttempts >= 5) {
      DOM.attemptsInfo.textContent = t(
        "5 attempts used. You can now enter your nickname manually.",
      );
    } else if (nicknameAttempts > 0) {
      DOM.attemptsInfo.textContent = t("Attempts used: {count} of 5", {
        count: nicknameAttempts,
      });
    }
  });
});
