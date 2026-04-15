import { debounce } from "../utils.js";
import {
  fetchProductsData,
  postActionData,
  checkItemExists,
  updateItemData,
} from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    page: 1,
    limit: 4,
    totalPages: 1,
    searchQuery: "",
    sortField: "",
    sortOrder: "",
    category: "All",
    minPrice: "",
    maxPrice: "",
  };

  const DOM = {
    grid: document.getElementById("catalog-grid"),
    categoryContainer: document.getElementById("categoryContainer"),
    pageInfo: document.getElementById("pageInfo"),
    prevBtn: document.getElementById("prevPage"),
    nextBtn: document.getElementById("nextPage"),
    searchInput: document.getElementById("searchInput"),
    minPrice: document.getElementById("minPrice"),
    maxPrice: document.getElementById("maxPrice"),
    sortSelect: document.getElementById("sortSelect"),
  };

  async function loadProducts() {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.textContent = "Loading products...";
    DOM.grid.replaceChildren(loader);

    try {
      const { data, totalItems } = await fetchProductsData(state);
      state.totalPages = Math.ceil(totalItems / state.limit) || 1;

      renderCatalog(data);
      updatePaginationUI();
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMsg = document.createElement("div");
      errorMsg.className = "not-found";
      errorMsg.textContent = "Error loading data. Server might be down.";
      DOM.grid.replaceChildren(errorMsg);
    }
  }

  async function handleUserAction(endpoint, productData) {
    try {
      // 1. Проверяем базу данных: есть ли уже этот товар?
      const existingItem = await checkItemExists(endpoint, productData.id);

      if (endpoint === "favorites") {
        if (existingItem) {
          // Блокируем дубль в избранном
          alert("⚠️ This item is already in your favorites!");
          return;
        }
      } else if (endpoint === "cart") {
        if (existingItem) {
          const newQty = existingItem.quantity + 1;
          await updateItemData("cart", existingItem.id, { quantity: newQty });
          alert(`✅ Increased quantity to ${newQty} in cart!`);
          return;
        }
      }

      await postActionData(endpoint, productData);
      alert(`✅ Successfully added to ${endpoint}!`);
    } catch (error) {
      console.error(error);
      alert(`❌ Failed to process action for ${endpoint}`);
    }
  }

  // Программное создание карточки
  function createProductCard(item) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = item.id;
    card.dataset.productData = JSON.stringify(item);

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.className = "product-img";
    img.loading = "lazy";

    const contentDiv = document.createElement("div");
    contentDiv.className = "product-content";

    const categorySpan = document.createElement("span");
    categorySpan.className = "product-category";
    categorySpan.textContent = item.category;

    const titleH3 = document.createElement("h3");
    titleH3.className = "product-title";
    titleH3.textContent = item.title;

    const descP = document.createElement("p");
    descP.className = "product-desc";
    descP.textContent = item.description;

    const footerDiv = document.createElement("div");
    footerDiv.className = "product-footer";

    const priceSpan = document.createElement("span");
    priceSpan.className = "product-price";
    priceSpan.textContent = `$${item.price}`;

    const ratingSpan = document.createElement("span");
    ratingSpan.className = "product-rating";
    ratingSpan.textContent = `★ ${item.rating}`;

    footerDiv.append(priceSpan, ratingSpan);

    // Блок кнопок
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "product-actions";
    actionsDiv.style.display = "flex";
    actionsDiv.style.gap = "10px";
    actionsDiv.style.marginTop = "15px";

    const btnFav = document.createElement("button");
    btnFav.className = "btn-outline method-btn btn-fav";
    btnFav.style.flex = "1";
    btnFav.textContent = "❤️ Fav";

    const btnCart = document.createElement("button");
    btnCart.className = "btn-outline method-btn btn-cart";
    btnCart.style.flex = "1";
    btnCart.style.backgroundColor = "#377dff";
    btnCart.style.color = "#fff";
    btnCart.textContent = "🛒 Cart";

    actionsDiv.append(btnFav, btnCart);
    contentDiv.append(categorySpan, titleH3, descP, footerDiv, actionsDiv);
    card.append(img, contentDiv);

    return card;
  }

  function renderCatalog(products) {
    if (products.length === 0) {
      const notFound = document.createElement("div");
      notFound.className = "not-found";
      notFound.textContent = "No services found matching your criteria.";
      DOM.grid.replaceChildren(notFound);
      return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach((item) => {
      fragment.appendChild(createProductCard(item));
    });

    DOM.grid.replaceChildren(fragment);
  }

  function initCategories() {
    const defaultCategories = [
      "All",
      "Автоматические мойки",
      "Комплектующие",
      "Доп. оборудование",
    ];
    const categorySet = new Set(defaultCategories);
    const fragment = document.createDocumentFragment();

    categorySet.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = `category-btn ${cat === state.category ? "active" : ""}`;
      btn.textContent = cat;
      btn.dataset.category = cat;

      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".category-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        state.category = cat;
        state.page = 1;
        loadProducts();
      });

      fragment.appendChild(btn);
    });

    DOM.categoryContainer.replaceChildren(fragment);
  }

  function updatePaginationUI() {
    DOM.pageInfo.textContent = `Page ${state.page} of ${state.totalPages}`;
    DOM.prevBtn.disabled = state.page <= 1;
    DOM.nextBtn.disabled = state.page >= state.totalPages;
  }

  function bindEvents() {
    DOM.searchInput.addEventListener(
      "input",
      debounce((e) => {
        state.searchQuery = e.target.value.trim();
        state.page = 1;
        loadProducts();
      }, 400),
    );

    const priceHandler = debounce(() => {
      state.minPrice = DOM.minPrice.value;
      state.maxPrice = DOM.maxPrice.value;
      state.page = 1;
      loadProducts();
    }, 500);

    DOM.minPrice.addEventListener("input", priceHandler);
    DOM.maxPrice.addEventListener("input", priceHandler);

    DOM.sortSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "default") {
        state.sortField = "";
        state.sortOrder = "";
      } else {
        const [field, order] = val.split("_");
        state.sortField = field;
        state.sortOrder = order;
      }
      state.page = 1;
      loadProducts();
    });

    DOM.prevBtn.addEventListener("click", () => {
      if (state.page > 1) {
        state.page--;
        loadProducts();
      }
    });

    DOM.nextBtn.addEventListener("click", () => {
      if (state.page < state.totalPages) {
        state.page++;
        loadProducts();
      }
    });

    // Делегирование событий: вешаем один слушатель на весь грид
    DOM.grid.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;

      const productData = JSON.parse(card.dataset.productData);

      if (e.target.closest(".btn-cart")) {
        handleUserAction("cart", productData);
      } else if (e.target.closest(".btn-fav")) {
        handleUserAction("favorites", productData);
      }
    });
  }

  initCategories();
  bindEvents();
  loadProducts();
});
