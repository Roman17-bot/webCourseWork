const API_URL = "http://localhost:3000";

export async function fetchProductsData(state) {
  const url = new URL(`${API_URL}/products`);
  const params = new URLSearchParams();

  // 1. Пагинация
  params.append("_page", state.page);
  params.append("_per_page", state.limit);

  // 2. Категория
  if (state.category !== "All") {
    params.append("category", state.category);
  }

  // 3. Поиск по нескольким полям (title и description)
  if (state.searchQuery) {
    const searchFilter = {
      or: [
        { title: { contains: state.searchQuery } },
        { description: { contains: state.searchQuery } },
      ],
    };
    params.append("_where", JSON.stringify(searchFilter));
  }

  // 4. Расширенная фильтрация по цене
  if (state.minPrice) {
    params.append("price:gte", state.minPrice);
  }
  if (state.maxPrice) {
    params.append("price:lte", state.maxPrice);
  }

  // 5. Сортировка
  if (state.sortField) {
    const sortPrefix = state.sortOrder === "desc" ? "-" : "";
    params.append("_sort", `${sortPrefix}${state.sortField}`);
  }

  url.search = params.toString();
  console.log("🛠 [API CALL]:", url.toString());

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonResponse = await response.json();

  const isPaginated = !Array.isArray(jsonResponse) && jsonResponse.data;

  const data = isPaginated ? jsonResponse.data : jsonResponse;
  const totalItems = isPaginated ? jsonResponse.items : data.length;

  return { data, totalItems };
}

/**
 * Универсальная функция для отправки POST-запросов (Корзина/Избранное)
 */
export async function postActionData(endpoint, productData) {
  const payload = {
    productId: productData.id,
    title: productData.title,
    price: productData.price,
    image: productData.image,
    category: productData.category,
    addedAt: new Date().toISOString(),
  };

  if (endpoint === "cart") {
    payload.quantity = 1;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);
  return response.json();
}

/**
 * Получение всех товаров из конкретного эндпоинта (cart или favorites)
 */
export async function fetchCollectionData(endpoint) {
  const response = await fetch(`${API_URL}/${endpoint}`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
}

/**
 * Удаление элемента по ID из базы (DELETE)
 */
export async function deleteItemData(endpoint, id) {
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete from ${endpoint}`);
}

/**
 * Обновление данных элемента (PATCH - например, изменение quantity в корзине)
 */
export async function updateItemData(endpoint, id, updates) {
  const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(`Failed to update item in ${endpoint}`);
  return response.json();
}

export async function checkItemExists(endpoint, productId) {
  const response = await fetch(
    `${API_URL}/${endpoint}?_where={productId:${productId}}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to check item in ${endpoint}`);
  }

  const jsonResponse = await response.json();

  // Безопасное извлечение массива
  const data =
    !Array.isArray(jsonResponse) && jsonResponse.data
      ? jsonResponse.data
      : jsonResponse;

  // Если массив не пустой, возвращаем найденный объект, иначе null
  return data.length > 0 ? data[0] : null;
}
