import { fetchCollectionData, deleteItemData } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    grid: document.getElementById("favorites-grid"),
  };

  async function loadFavorites() {
    DOM.grid.replaceChildren();

    try {
      const favorites = await fetchCollectionData("favorites");
      renderFavorites(favorites);
    } catch (error) {
      console.error(error);
      const err = document.createElement("div");
      err.className = "not-found";
      err.textContent = "Error loading favorites.";
      DOM.grid.replaceChildren(err);
    }
  }

  function renderFavorites(items) {
    if (items.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "not-found";
      emptyMsg.innerHTML =
        "Your favorites list is empty. <br><br> <a href='catalog.html' style='color:#5c6f87' class='btn-outline'>Go to Catalog</a>";
      DOM.grid.replaceChildren(emptyMsg);
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.dbId = item.id; // ВАЖНО: ID записи в БД json-server, а не ID продукта!

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
      price.textContent = `$${item.price}`;

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn-outline method-btn btn-remove";
      removeBtn.style.marginTop = "15px";
      removeBtn.style.borderColor = "#ff4d4f";
      removeBtn.style.color = "#ff4d4f";
      removeBtn.textContent = "❌ Remove";

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

        // Если удалили последний элемент, перезагрузим стейт
        if (DOM.grid.children.length === 0) loadFavorites();
      } catch (error) {
        alert("Failed to remove item.");
      }
    }
  });

  loadFavorites();
});
