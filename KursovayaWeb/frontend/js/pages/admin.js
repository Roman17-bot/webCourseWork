import {
  fetchAllProducts,
  fetchUsers,
  fetchCollectionData,
  deleteItemData,
  addProduct,
  editProduct,
  deleteProduct,
  getCurrentUser,
} from "../api.js";
import { onLanguageChange, t } from "../i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    mainView: document.getElementById("admin-main-view"),
    noAdminView: document.getElementById("no-admin-view"),

    crudMode: document.getElementById("crud-mode"),
    editSelectContainer: document.getElementById(
      "select-product-to-edit-container",
    ),
    editSelect: document.getElementById("edit-select"),
    productForm: document.getElementById("product-form"),
    pTitle: document.getElementById("p-title"),
    pCategory: document.getElementById("p-category"),
    pPrice: document.getElementById("p-price"),
    pImg: document.getElementById("p-image"),
    pDesc: document.getElementById("p-desc"),
    btnSubmit: document.getElementById("btn-submit-product"),
    btnDelete: document.getElementById("btn-delete-product"),

    errTitle: document.getElementById("err-title"),
    errCategory: document.getElementById("err-category"),
    errPrice: document.getElementById("err-price"),
    errImage: document.getElementById("err-image"),
    errDesc: document.getElementById("err-desc"),

    // Отзывы
    reviewFilterProduct: document.getElementById("review-filter-product"),
    reviewFilterUser: document.getElementById("review-filter-user"),
    reviewsList: document.getElementById("admin-reviews-list"),
  };

  const activeUser = getCurrentUser();
  let productsCache = [];
  let usersCache = [];
  let feedbackCache = [];

  // Проверка прав администратора
  if (!activeUser || activeUser.role !== "administrator") {
    DOM.mainView.style.display = "none";
    DOM.noAdminView.style.display = "block";
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
    return;
  }

  // ЗАГРУЗКА ИСТОЧНИКОВ
  async function loadData() {
    try {
      productsCache = await fetchAllProducts();
      usersCache = await fetchUsers();
      feedbackCache = await fetchCollectionData("feedback");

      populateSelectors();
      renderFilteredReviews();
    } catch (err) {
      console.error(err);
      alert(t("Error accessing database records."));
    }
  }

  function populateSelectors() {
    DOM.editSelect.replaceChildren();
    DOM.reviewFilterProduct.replaceChildren();

    const editDefault = document.createElement("option");
    editDefault.value = "";
    editDefault.disabled = true;
    editDefault.selected = true;
    editDefault.textContent = t("-- Choose product --");
    DOM.editSelect.appendChild(editDefault);

    const filterProdAll = document.createElement("option");
    filterProdAll.value = "all";
    filterProdAll.textContent = t("All Services");
    DOM.reviewFilterProduct.appendChild(filterProdAll);

    productsCache.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `[${p.category}] ${p.title}`;
      DOM.editSelect.appendChild(opt.cloneNode(true));
      DOM.reviewFilterProduct.appendChild(opt);
    });

    // Наполнение фильтра клиентов
    DOM.reviewFilterUser.replaceChildren();
    const filterUserAll = document.createElement("option");
    filterUserAll.value = "all";
    filterUserAll.textContent = t("All Clients");
    DOM.reviewFilterUser.appendChild(filterUserAll);

    usersCache.forEach((u) => {
      if (u.role === "client") {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = `${u.lastName} ${u.firstName} (${u.nickname})`;
        DOM.reviewFilterUser.appendChild(opt);
      }
    });
  }

  DOM.crudMode.addEventListener("change", (e) => {
    DOM.productForm.reset();
    clearAllErrors();

    if (e.target.value === "add") {
      DOM.editSelectContainer.style.display = "none";
      DOM.btnSubmit.textContent = t("Add Product");
      DOM.btnDelete.style.display = "none";
    } else {
      DOM.editSelectContainer.style.display = "block";
      DOM.btnSubmit.textContent = t("Save Changes");
      DOM.btnDelete.style.display = "block";
    }
    validateProductForm();
  });

  DOM.editSelect.addEventListener("change", () => {
    const selectedId = DOM.editSelect.value;
    const prod = productsCache.find((p) => p.id === selectedId);
    if (prod) {
      DOM.pTitle.value = prod.title;
      DOM.pCategory.value = prod.category;
      DOM.pPrice.value = prod.price;
      DOM.pImg.value = prod.image;
      DOM.pDesc.value = prod.description;
      clearAllErrors();
      validateProductForm();
    }
  });

  // ДИНАМИЧЕСКИЙ СБРОС ОШИБОК И ВАЛИДАЦИЯ
  const formInputs = [
    DOM.pTitle,
    DOM.pCategory,
    DOM.pPrice,
    DOM.pImg,
    DOM.pDesc,
  ];
  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearError(input.id.replace("p-", ""));
      validateProductForm();
    });
    input.addEventListener("change", () => {
      clearError(input.id.replace("p-", ""));
      validateProductForm();
    });
  });

  function clearError(id) {
    const el = document.getElementById(`err-${id}`);
    if (el) el.textContent = "";
  }

  function clearAllErrors() {
    ["title", "category", "price", "image", "desc"].forEach(clearError);
  }

  function validateProductForm() {
    let isValid = true;

    if (!DOM.pTitle.value.trim()) isValid = false;
    if (!DOM.pCategory.value) isValid = false;

    const priceVal = parseFloat(DOM.pPrice.value);
    if (isNaN(priceVal) || priceVal <= 0) {
      isValid = false;
      if (DOM.pPrice.value) {
        document.getElementById("err-price").textContent =
          t("Price must be greater than 0.");
      }
    }

    const imgVal = DOM.pImg.value.trim();
    if (!imgVal) {
      isValid = false;
    } else {
      try {
        new URL(imgVal);
      } catch (e) {
        isValid = false;
        document.getElementById("err-image").textContent =
          t("Please enter a valid Image URL.");
      }
    }

    if (!DOM.pDesc.value.trim()) isValid = false;

    DOM.btnSubmit.disabled = !isValid;
    return isValid;
  }

  // ОТПРАВКА CRUD ФОРМЫ (ADD / EDIT)
  DOM.productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    const isEdit = DOM.crudMode.value === "edit";

    const productPayload = {
      title: DOM.pTitle.value.trim(),
      category: DOM.pCategory.value,
      price: parseInt(DOM.pPrice.value, 10),
      image: DOM.pImg.value.trim(),
      description: DOM.pDesc.value.trim(),
      rating: isEdit
        ? productsCache.find((p) => p.id === DOM.editSelect.value).rating
        : 5.0,
    };

    try {
      DOM.btnSubmit.disabled = true;
      if (isEdit) {
        const id = DOM.editSelect.value;
        productPayload.id = id;
        await editProduct(id, productPayload);
        alert(`✅ ${t("Product modified successfully.")}`);
      } else {
        productPayload.id = String(Date.now());
        await addProduct(productPayload);
        alert(`✅ ${t("Product added to catalog.")}`);
      }
      DOM.productForm.reset();
      loadData();
    } catch (err) {
      alert(`❌ ${t("Failed to process database operation.")}`);
    } finally {
      DOM.btnSubmit.disabled = false;
    }
  });

  // УДАЛЕНИЕ ТОВАРОВ
  DOM.btnDelete.addEventListener("click", async () => {
    const id = DOM.editSelect.value;
    if (!id) return;

    if (confirm(`⚠️ ${t("Are you sure you want to delete this product?")}`)) {
      try {
        await deleteProduct(id);
        alert(`🗑 ${t("Product deleted.")}`);
        DOM.productForm.reset();
        loadData();
      } catch (err) {
        alert(`❌ ${t("Failed to delete product.")}`);
      }
    }
  });

  // ВЫВОД И ФИЛЬТРАЦИЯ ОТЗЫВОВ
  DOM.reviewFilterProduct.addEventListener("change", renderFilteredReviews);
  DOM.reviewFilterUser.addEventListener("change", renderFilteredReviews);

  function renderFilteredReviews() {
    const pFilter = DOM.reviewFilterProduct.value;
    const uFilter = DOM.reviewFilterUser.value;

    let filtered = [...feedbackCache];

    if (pFilter !== "all") {
      filtered = filtered.filter((f) => f.productId === pFilter);
    }
    if (uFilter !== "all") {
      filtered = filtered.filter((f) => f.userId === uFilter);
    }

    if (filtered.length === 0) {
      DOM.reviewsList.innerHTML = `<p style="color: #5c6f87; text-align: center;">${t("No reviews match this criteria.")}</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach((rev) => {
      const card = document.createElement("div");
      card.style.background = "#0c1117";
      card.style.padding = "1rem";
      card.style.borderRadius = "4px";
      card.style.borderLeft = "4px solid #377dff";

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.marginBottom = "5px";

      const author = document.createElement("strong");
      author.style.color = "#377dff";
      author.textContent = `@${rev.userNickname}`;

      const stars = document.createElement("span");
      stars.style.color = "#ffd700";
      stars.textContent = "★".repeat(rev.rating);

      header.append(author, stars);

      const prodInfo = document.createElement("span");
      prodInfo.style.fontSize = "0.8rem";
      prodInfo.style.color = "#5c6f87";
      prodInfo.style.display = "block";
      prodInfo.style.marginBottom = "8px";
      prodInfo.textContent = t("Service: {title}", { title: rev.productTitle });

      const text = document.createElement("p");
      text.style.color = "#fff";
      text.style.fontSize = "0.9rem";
      text.textContent = rev.text;

      const delBtn = document.createElement("button");
      delBtn.className = "btn-outline";
      delBtn.style.padding = "0.25rem 0.5rem";
      delBtn.style.fontSize = "0.8rem";
      delBtn.style.marginTop = "10px";
      delBtn.style.borderColor = "#ff4d4f";
      delBtn.style.color = "#ff4d4f";
      delBtn.textContent = t("Delete Review");

      delBtn.addEventListener("click", async () => {
        if (confirm(t("Delete this review?"))) {
          try {
            await deleteItemData("feedback", rev.id);
            alert(`🗑 ${t("Review removed.")}`);
            loadData();
          } catch (e) {
            alert(t("Failed to delete review."));
          }
        }
      });

      card.append(header, prodInfo, text, delBtn);
      fragment.appendChild(card);
    });

    DOM.reviewsList.replaceChildren(fragment);
  }

  loadData();

  onLanguageChange(() => {
    loadData();
  });
});
