import { fetchCollectionData, deleteItemData, getCurrentUser } from "../api.js";
import { formatCurrency, onLanguageChange, t } from "../i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    grid: document.getElementById("favorites-grid"),
  };
  const activeUser = getCurrentUser();

  async function loadFavorites() {
    if (!activeUser) {
      DOM.grid.innerHTML = `
        <div class="not-found" style="grid-column: 1/-1;">
          ${t("Please log in to see your favorites.")}<br><br>
          <a href="auth.html" class="btn-outline">${t("Log In")}</a>
        </div>`;
      return;
    }

    DOM.grid.replaceChildren();

    try {
      const favorites = await fetchCollectionData("favorites", activeUser.id);
      renderFavorites(favorites);
    } catch (error) {
      console.error(error);
      const err = document.createElement("div");
      err.className = "not-found";
      err.textContent = t("Error loading favorites.");
      DOM.grid.replaceChildren(err);
    }
  }

  function renderFavorites(items) {
    if (items.length === 0) {
      DOM.grid.innerHTML = `
        <div class="not-found" style="grid-column: 1/-1;">
          ${t("Your favorites list is empty.")} <br><br>
          <a href="catalog.html" class="btn-outline">${t("Go to Catalog")}</a>
        </div>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.dbId = item.id;

      const img = document.createElement("img");
      img.src = item.image;
      img.className = "product-img";

      const content = document.createElement("div");
      content.className = "product-content";

      const title = document.createElement("h3");
      title.className = "product-title";
      title.textContent = item.title;

      const price = document.createElement("div");
      price.className = "product-price";
      price.textContent = formatCurrency(item.price);

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn-outline method-btn btn-remove";
      removeBtn.style.marginTop = "15px";
      removeBtn.style.borderColor = "#ff4d4f";
      removeBtn.style.color = "#ff4d4f";
      removeBtn.textContent = `❌ ${t("Remove")}`;

      content.append(title, price, removeBtn);
      card.append(img, content);
      fragment.appendChild(card);
    });

    DOM.grid.replaceChildren(fragment);
  }

  DOM.grid.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-remove")) {
      const card = e.target.closest(".product-card");
      const dbId = card.dataset.dbId;

      try {
        await deleteItemData("favorites", dbId);
        card.remove();
        if (DOM.grid.children.length === 0) loadFavorites();
      } catch (error) {
        alert(t("Failed to remove item."));
      }
    }
  });

  loadFavorites();

  onLanguageChange(() => {
    loadFavorites();
  });
});
