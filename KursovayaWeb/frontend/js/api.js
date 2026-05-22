import { localizeRecord, localizeRecords, translatePlainText } from "./i18n.js";

const API_URL = "http://localhost:3000";

export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  if (!user || user === "null" || user === "undefined") {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
}

export async function fetchProductsData(state) {
  const url = new URL(`${API_URL}/products`);
  const response = await fetch(url);

  console.log("🛠 [API CALL]:", url.toString());

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const rawData = await response.json();
  const products = localizeRecords(rawData);

  const search = state.searchQuery.trim().toLowerCase();
  const minPrice = Number(state.minPrice);
  const maxPrice = Number(state.maxPrice);

  let filtered = products.filter((product) => {
    const matchesCategory =
      state.category === "All" ||
      product._baseCategory === state.category ||
      product.category === state.category ||
      translatePlainText(product._baseCategory, "en") === state.category;

    const matchesSearch =
      !search ||
      [product.title, product.description, product.category].some((value) =>
        String(value ?? "").toLowerCase().includes(search),
      );

    const matchesMin = !state.minPrice || product.price >= minPrice;
    const matchesMax = !state.maxPrice || product.price <= maxPrice;

    return matchesCategory && matchesSearch && matchesMin && matchesMax;
  });

  if (state.sortField) {
    filtered = [...filtered].sort((a, b) => {
      const first = a[state.sortField];
      const second = b[state.sortField];
      const direction = state.sortOrder === "desc" ? -1 : 1;

      if (typeof first === "string") {
        return first.localeCompare(second) * direction;
      }

      return (Number(first) - Number(second)) * direction;
    });
  }

  const totalItems = filtered.length;
  const start = (state.page - 1) * state.limit;
  const data = filtered.slice(start, start + state.limit);

  return { data, totalItems };
}

export async function fetchAllProducts(options = {}) {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error("Failed to fetch all products");
  const products = await response.json();
  return options.raw ? products : localizeRecords(products);
}

export async function postActionData(endpoint, productData, userId) {
  const payload = {
    productId: productData.id,
    title: productData._baseTitle || productData.title,
    price: productData.price,
    image: productData.image,
    category: productData._baseCategory || productData.category,
    i18n: productData.i18n,
    userId: userId,
    addedAt: new Date().toISOString(),
  };

  if (endpoint === "cart") {
    payload.quantity = 1;
  }
  console.log(`[API POST] Sending to /${endpoint}:`, payload);

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);
  return response.json();
}

export async function fetchCollectionData(endpoint, userId = null, options = {}) {
  let url = `${API_URL}/${endpoint}`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  const data = await response.json();
  return options.raw ? data : localizeRecords(data);
}

export async function deleteItemData(endpoint, id) {
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete from ${endpoint}`);
}

export async function updateItemData(endpoint, id, updates) {
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(`Failed to update item in ${endpoint}`);
  return response.json();
}

export async function checkItemExists(endpoint, productId, userId) {
  const filterQuery = JSON.stringify({
    userId: { eq: userId },
    productId: { eq: productId },
  });

  const response = await fetch(
    `${API_URL}/${endpoint}?_where=${encodeURIComponent(filterQuery)}`,
  );

  if (!response.ok) throw new Error(`Failed to check item in ${endpoint}`);
  const data = await response.json();

  return data.length > 0 ? data[0] : null;
}

export async function fetchUsers() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function fetchUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
}

export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to update user");
  return response.json();
}

export async function createOrder(orderData) {
  const payload = {
    ...orderData,
    products: orderData.products.map((product) => ({
      ...product,
      title: product._baseTitle || product.title,
      category: product._baseCategory || product.category,
      i18n: product.i18n,
    })),
  };

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
}

export async function createFeedback(feedbackData) {
  const response = await fetch(`${API_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackData),
  });
  if (!response.ok) throw new Error("Failed to create feedback");
  return response.json();
}

export async function addProduct(productData) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json();
}

export async function editProduct(id, productData) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to edit product");
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete product");
}
