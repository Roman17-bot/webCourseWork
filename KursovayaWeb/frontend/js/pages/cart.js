import {
  fetchCollectionData,
  deleteItemData,
  updateItemData,
  createOrder,
  getCurrentUser,
} from "../api.js";
import { formatCurrency, onLanguageChange, t } from "../i18n.js";

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    container: document.getElementById("cart-items"),
    totalPrice: document.getElementById("total-price"),
    totalCount: document.getElementById("total-count"),
    checkoutBtn: document.getElementById("checkout-btn"),
  };

  let cartData = [];
  const activeUser = getCurrentUser();

  async function loadCart() {
    if (!activeUser) {
      DOM.container.innerHTML = `
        <div class="not-found">
          ${t("Please log in to see your cart.")}<br><br>
          <a href="auth.html" class="btn-outline">${t("Log In")}</a>
        </div>`;
      return;
    }

    try {
      cartData = await fetchCollectionData("cart", activeUser.id);
      renderCart();
      calculateTotals();
    } catch (error) {
      console.error(error);
      DOM.container.innerHTML = `<div class="not-found">${t("Error loading cart.")}</div>`;
    }
  }

  function calculateTotals() {
    const total = cartData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const count = cartData.reduce((sum, item) => sum + item.quantity, 0);

    DOM.totalPrice.textContent = formatCurrency(total);
    DOM.totalCount.textContent = count;
    DOM.checkoutBtn.disabled = cartData.length === 0;
    DOM.checkoutBtn.style.opacity = cartData.length === 0 ? "0.5" : "1";
  }

  function renderCart() {
    if (cartData.length === 0) {
      DOM.container.innerHTML = `
        <div class="not-found">
          ${t("Your cart is empty.")} <br><br>
          <a href="catalog.html" class="btn-outline">${t("Go to Catalog")}</a>
        </div>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    cartData.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.dbId = item.id;

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;

      const infoDiv = document.createElement("div");
      infoDiv.style.flex = "1";

      const titleH4 = document.createElement("h4");
      titleH4.style.color = "#fff";
      titleH4.style.fontFamily = "Montserrat";
      titleH4.textContent = item.title;

      const priceSpan = document.createElement("span");
      priceSpan.style.color = "#377dff";
      priceSpan.style.fontWeight = "bold";
      priceSpan.textContent = formatCurrency(item.price);

      infoDiv.append(titleH4, priceSpan);

      const qtyDiv = document.createElement("div");
      qtyDiv.className = "qty-controls";

      const minusBtn = document.createElement("button");
      minusBtn.className = "qty-btn btn-minus";
      minusBtn.textContent = "-";

      const qtySpan = document.createElement("span");
      qtySpan.style.color = "#fff";
      qtySpan.style.width = "20px";
      qtySpan.style.textAlign = "center";
      qtySpan.textContent = item.quantity;

      const plusBtn = document.createElement("button");
      plusBtn.className = "qty-btn btn-plus";
      plusBtn.textContent = "+";

      qtyDiv.append(minusBtn, qtySpan, plusBtn);

      const removeBtn = document.createElement("button");
      removeBtn.className = "btn-outline btn-remove";
      removeBtn.style.borderColor = "#ff4d4f";
      removeBtn.style.color = "#ff4d4f";
      removeBtn.textContent = "🗑";

      row.append(img, infoDiv, qtyDiv, removeBtn);
      fragment.appendChild(row);
    });

    DOM.container.replaceChildren(fragment);
  }

  DOM.container.addEventListener("click", async (e) => {
    const row = e.target.closest(".cart-item");
    if (!row) return;

    const dbId = row.dataset.dbId;
    const itemIndex = cartData.findIndex((i) => i.id === dbId);
    if (itemIndex === -1) return;

    if (e.target.classList.contains("btn-remove")) {
      try {
        await deleteItemData("cart", dbId);
        cartData.splice(itemIndex, 1);
        renderCart();
        calculateTotals();
      } catch (err) {
        alert(t("Error removing item."));
      }
    }

    if (e.target.classList.contains("btn-plus")) {
      const newQty = cartData[itemIndex].quantity + 1;
      try {
        await updateItemData("cart", dbId, { quantity: newQty });
        cartData[itemIndex].quantity = newQty;
        renderCart();
        calculateTotals();
      } catch (err) {
        console.error(err);
      }
    }

    if (e.target.classList.contains("btn-minus")) {
      const newQty = cartData[itemIndex].quantity - 1;
      if (newQty < 1) return;

      try {
        await updateItemData("cart", dbId, { quantity: newQty });
        cartData[itemIndex].quantity = newQty;
        renderCart();
        calculateTotals();
      } catch (err) {
        console.error(err);
      }
    }
  });

  DOM.checkoutBtn.addEventListener("click", async () => {
    if (cartData.length === 0 || !activeUser) return;

    try {
      DOM.checkoutBtn.textContent = t("Processing...");
      DOM.checkoutBtn.disabled = true;

      const orderPayload = {
        userId: activeUser.id,
        userNickname: activeUser.nickname,
        products: cartData.map((item) => ({
          productId: item.productId,
          title: item.title,
          category: item.category,
          i18n: item.i18n,
          _baseTitle: item._baseTitle,
          _baseCategory: item._baseCategory,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartData.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        date: new Date().toISOString(),
      };

      await createOrder(orderPayload);

      const deletePromises = cartData.map((item) =>
        deleteItemData("cart", item.id),
      );
      await Promise.all(deletePromises);

      cartData = [];
      renderCart();
      calculateTotals();

      alert(`🎉 ${t("Purchase successful! The order was added to history.")}`);
    } catch (error) {
      console.error(error);
      alert(`❌ ${t("Something went wrong during checkout.")}`);
    } finally {
      DOM.checkoutBtn.textContent = t("Proceed to Checkout");
      DOM.checkoutBtn.disabled = false;
    }
  });

  loadCart();

  onLanguageChange(() => {
    loadCart();
  });
});
