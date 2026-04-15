import { fetchCollectionData, deleteItemData, updateItemData } from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    container: document.getElementById("cart-items"),
    totalPrice: document.getElementById("total-price"),
    totalCount: document.getElementById("total-count"),
    checkoutBtn: document.getElementById("checkout-btn"),
  };

  let cartData = [];

  // Инициализация корзины
  async function loadCart() {
    try {
      cartData = await fetchCollectionData("cart");
      renderCart();
      calculateTotals();
    } catch (error) {
      console.error(error);
      DOM.container.innerHTML = `<div class="not-found">Error loading cart.</div>`;
    }
  }

  // Расчет итогов
  function calculateTotals() {
    const total = cartData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const count = cartData.reduce((sum, item) => sum + item.quantity, 0);

    DOM.totalPrice.textContent = `$${total}`;
    DOM.totalCount.textContent = count;

    // Блокируем кнопку покупки, если корзина пуста
    DOM.checkoutBtn.disabled = cartData.length === 0;
    DOM.checkoutBtn.style.opacity = cartData.length === 0 ? "0.5" : "1";
  }

  function renderCart() {
    if (cartData.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "not-found";

      const textNode = document.createTextNode("Your cart is empty. ");
      const br1 = document.createElement("br");
      const br2 = document.createElement("br");

      const link = document.createElement("a");
      link.href = "catalog.html";
      link.className = "btn-outline";
      link.style.color = "#5c6f87";
      link.textContent = "Go to Catalog";

      emptyMsg.append(textNode, br1, br2, link);
      DOM.container.replaceChildren(emptyMsg);
      return;
    }

    const fragment = document.createDocumentFragment();

    cartData.forEach((item) => {
      // Главный контейнер строки
      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.dbId = item.id;
      row.dataset.qty = item.quantity;

      // Изображение
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title;

      // Центральный блок с информацией (Название и Цена)
      const infoDiv = document.createElement("div");
      infoDiv.style.flex = "1";

      const titleH4 = document.createElement("h4");
      titleH4.style.color = "#fff";
      titleH4.style.fontFamily = "Montserrat";
      titleH4.style.fontSize = "1.1rem";
      titleH4.textContent = item.title;

      const priceSpan = document.createElement("span");
      priceSpan.style.color = "#377dff";
      priceSpan.style.fontWeight = "bold";
      priceSpan.textContent = `$${item.price}`;

      infoDiv.append(titleH4, priceSpan);

      // Блок управления количеством (+, значение, -)
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

      // Кнопка удаления (Корзина)
      const removeBtn = document.createElement("button");
      removeBtn.className = "btn-outline btn-remove";
      removeBtn.style.borderColor = "#ff4d4f";
      removeBtn.style.color = "#ff4d4f";
      removeBtn.style.padding = "0.5rem";
      removeBtn.textContent = "🗑";

      row.append(img, infoDiv, qtyDiv, removeBtn);

      fragment.appendChild(row);
    });

    DOM.container.replaceChildren(fragment);
  }
  // Event Delegation (+, -, удалить)
  DOM.container.addEventListener("click", async (e) => {
    const row = e.target.closest(".cart-item");
    if (!row) return;

    const dbId = row.dataset.dbId;
    const itemIndex = cartData.findIndex((i) => i.id === dbId);
    if (itemIndex === -1) return;

    // УДАЛЕНИЕ
    if (e.target.classList.contains("btn-remove")) {
      try {
        await deleteItemData("cart", dbId);
        cartData.splice(itemIndex, 1); // Удаляем из локального State
        renderCart();
        calculateTotals();
      } catch (err) {
        alert("Error removing item.");
      }
    }

    // УВЕЛИЧЕНИЕ КОЛИЧЕСТВА
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

    // УМЕНЬШЕНИЕ КОЛИЧЕСТВА
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

  // ОФОРМЛЕНИЕ ЗАКАЗА
  DOM.checkoutBtn.addEventListener("click", async () => {
    if (cartData.length === 0) return;

    try {
      DOM.checkoutBtn.textContent = "Processing...";

      // Удаляем каждый элемент через Promise.all для скорости
      const deletePromises = cartData.map((item) =>
        deleteItemData("cart", item.id),
      );
      await Promise.all(deletePromises);

      cartData = [];
      renderCart();
      calculateTotals();

      DOM.checkoutBtn.textContent = "Proceed to Checkout";
      alert("🎉 Purchase successful! Thank you for your order.");
    } catch (error) {
      alert("❌ Something went wrong during checkout.");
      DOM.checkoutBtn.textContent = "Proceed to Checkout";
    }
  });

  loadCart();
});
