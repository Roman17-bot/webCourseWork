const LANGUAGE_KEY = "siteLanguage";
const SUPPORTED_LANGUAGES = ["ru", "en"];

const TRANSLATION_ENTRIES = [
  ["АкваТехноСервис — Моечное оборудование WashTec в Беларуси", "AquaTechnoService — WashTec car wash equipment in Belarus"],
  ["404 — Страница не найдена | АкваТехноСервис", "404 — Page not found | AquaTechnoService"],
  ["О нас", "About us"],
  ["Корзина", "Cart"],
  ["Каталог", "Catalog"],
  ["Избранное", "Favorites"],
  ["Избранные", "Favorites"],
  ["Проекты", "Projects"],
  ["Контакты", "Contacts"],
  ["Админ-панель", "Admin panel"],
  ["Оставить отзыв", "Leave feedback"],
  ["Личный кабинет", "Account"],
  ["Выйти", "Log out"],
  ["Вход / регистрация", "Sign in / sign up"],
  ["RU", "RU"],
  ["EN", "EN"],
  ["Сменить язык сайта", "Switch site language"],
  ["Настройки сайта", "Site settings"],
  ["Включить тёмную тему", "Enable dark theme"],
  ["Включить светлую тему", "Enable light theme"],
  ["Светлая", "Light"],
  ["Тёмная", "Dark"],
  ["Загружаем сайт", "Loading the site"],
  ["Открыть настройки версии для слабовидящих", "Open low-vision version settings"],
  ["Версия для слабовидящих", "Low-vision version"],
  ["Закрыть настройки версии для слабовидящих", "Close low-vision version settings"],
  ["Закрыть", "Close"],
  ["Включить версию для слабовидящих", "Enable low-vision version"],
  ["Размер шрифта", "Font size"],
  ["Обычный", "Regular"],
  ["Крупный", "Large"],
  ["Очень крупный", "Extra large"],
  ["Цветовая схема", "Color scheme"],
  ["Черный фон, белый текст", "Black background, white text"],
  ["Черный фон, зеленый текст", "Black background, green text"],
  ["Белый фон, черный текст", "White background, black text"],
  ["Бежевый фон, коричневый текст", "Beige background, brown text"],
  ["Голубой фон, темно-синий текст", "Light blue background, dark blue text"],
  ["Отключить изображения", "Disable images"],
  ["Изображение отключено", "Image disabled"],
  ["Сбросить настройки", "Reset settings"],
  ["Готово", "Done"],
  ["Официальный дилер немецкой компании", "Official dealer of the German company"],
  ["в Беларуси", "in Belarus"],
  ["Официальный представитель российских компаний:", "Official representative of Russian companies:"],
  ["пн-пт с 9:00 до 18:00", "Mon-Fri from 9:00 to 18:00"],
  ["Пн-Пт с 9:00 до 18:00", "Mon-Fri from 9:00 to 18:00"],
  ['О компании ООО "Акватехносервис"', 'About AquaTechnoService LLC'],
  ["Реализованные проекты", "Completed projects"],
  ["Главный экран", "Hero section"],
  ["Наши знания —", "Our knowledge is"],
  ["Ваши знания", "your knowledge"],
  ["Наш опыт —", "Our experience is"],
  ["Ваш опыт", "your experience"],
  ["Наша работа —", "Our work is"],
  ["Ваш стабильно", "your steadily"],
  ["растущий бизнес", "growing business"],
  ["Ваш стабильно растущий бизнес", "your steadily growing business"],
  ["Туннельная мойка WashTec", "WashTec tunnel car wash"],
  ["Моечное оборудование", "Car wash equipment"],
  ["Автомойка", "Car wash"],
  ["Портальная мойка", "Gantry car wash"],
  ["Мойка самообслуживания", "Self-service car wash"],
  ["Грузовая мойка", "Truck wash"],
  ["Запустите бизнес без рисков", "Launch your business without risks"],
  ["Запустите свой бизнес без рисков!", "Launch your business without risks!"],
  [
    "Мы пройдем путь вместе, начиная от проектирования мойки и заканчивая благоустройством прилегающей территории. Наши знания и 15-летний опыт позволяет открыть моечный комплекс с минимальным числом ошибок",
    "We will go through the full journey together, from car wash design to landscaping the surrounding area. Our knowledge and 15 years of experience help you open a wash complex with minimal mistakes",
  ],
  [
    "ООО «Акватехносервис» — официальный представитель немецкого концерна WashTec в Республике Беларусь и Российской Федерации и официальный представитель российской компании \"Мой-ка! DS-Business\"",
    "AquaTechnoService LLC is the official representative of the German WashTec group in the Republic of Belarus and the Russian Federation, and the official representative of the Russian company Moy-ka! DS-Business",
  ],
  ["ООО «Акватехносервис»", "AquaTechnoService LLC"],
  [
    "— официальный представитель немецкого концерна WashTec в Республике Беларусь и Российской Федерации и официальный представитель российской компании \"Мой-ка! DS-Business\"",
    "is the official representative of the German WashTec group in the Republic of Belarus and the Russian Federation, and the official representative of the Russian company \"Moy-ka! DS-Business\"",
  ],
  [
    "Также мы являемся официальным представителем российской компании \"Cleanol\" и российской компании \"Агроснабтехсервис\"",
    "We are also the official representative of the Russian companies Cleanol and Agrosnabtekhnoservis",
  ],
  ["Наша миссия", "Our mission"],
  [
    "Обеспечение компании-партнера высококлассным оборудованием. Экономия времени и денег клиента во время постройки бизнеса и при его дальнейшем функционировании за счет наших возможностей, знаний и опыта",
    "Providing partner companies with high-class equipment. Saving clients time and money during business construction and further operation through our capabilities, knowledge, and experience",
  ],
  ["3 направления нашей деятельности:", "Three areas of our work:"],
  ["продажа моечного оборудования для легкового и грузового транспорта", "sale of washing equipment for passenger and commercial vehicles"],
  ["профессиональный монтаж моечных комплексов", "professional installation of car wash complexes"],
  ["техническое обслуживание автомобильных моек", "technical maintenance of car washes"],
  [
    "Команда ООО «Акватехносервис» работает только с теми производителями, чьё оборудование было протестировано специалистами компании. Мы выбираем тех, кто может гарантировать стабильную работу оборудования в течение всего эксплуатационного периода",
    "The AquaTechnoService team works only with manufacturers whose equipment has been tested by our specialists. We choose partners who can guarantee stable operation throughout the entire service life",
  ],
  ["Узнать больше", "Learn more"],
  ["Автомойка объект 1", "Car wash facility 1"],
  ["Автомойка объект 2", "Car wash facility 2"],
  ["Автомойка объект 3", "Car wash facility 3"],
  ["Производители моечного оборудования, с которыми мы работаем", "Car wash equipment manufacturers we work with"],
  ["WashTec логотип", "WashTec logo"],
  [
    "Мировой лидер по производству автомобильных моек. Именно WashTec задает стандарты для автомоек всех типов – портальные и конвейерные автомойки для легковых и грузовых автомобилей, а также для моек самообслуживания",
    "A global leader in car wash manufacturing. WashTec sets standards for all wash types: gantry and conveyor washes for cars and trucks, as well as self-service washes",
  ],
  ["WashTec — это:", "WashTec means:"],
  ["новые победы и самые высокие стандарты мытья автомобилей на мировом рынке", "new achievements and the highest car washing standards on the global market"],
  ["научный подход и техническая реализация в каждой единице оборудования", "a scientific approach and technical precision in every piece of equipment"],
  ["постоянное движение и поиск лучших решений для идеального исполнения", "constant progress and a search for better solutions for flawless execution"],
  ["анализ потребностей клиента и предоставление выгодных вариантов сотрудничества", "analysis of client needs and profitable cooperation options"],
  ["Мой-ка! DS-Business логотип", "Moy-ka! DS-Business logo"],
  [
    "Компания специализируется на производстве оборудования для моек самообслуживания и робот-моек уже 11 лет. Основной рынок поставок — Россия, Латвия, Эстония, Грузия, Казахстан, Узбекистан. Установлено более 200 моечных комплексов",
    "The company has specialized in manufacturing equipment for self-service and robotic washes for 11 years. Key markets include Russia, Latvia, Estonia, Georgia, Kazakhstan, and Uzbekistan. More than 200 wash complexes have been installed",
  ],
  ["Мой-ка! DS-Business — это:", "Moy-ka! DS-Business means:"],
  ["инновации в сфере производства моек самообслуживания", "innovation in self-service car wash production"],
  ["технологии будущего. Производство моек нового поколения из высококачественных комплектующих немецких и итальянских производителей", "future-ready technology and next-generation washes built from high-quality German and Italian components"],
  ["упор на высокую рентабельность. Клиент окупает свои затраты быстрее за счет грамотно организованного моечного комплекса", "focus on strong profitability: clients recover costs faster thanks to a well-organized wash complex"],
  ["Навигация по типам моек", "Wash type navigation"],
  ["Предыдущий слайд", "Previous slide"],
  ["Следующий слайд", "Next slide"],
  ["Типы автомоек", "Car wash types"],
  ["Автомойка самообслуживания WashTec", "WashTec self-service car wash"],
  ["Продуманные решения для разных площадей земельного участка:", "Thought-out solutions for different land plot sizes:"],
  ["от 1-го до 8-ми постов", "from 1 to 8 bays"],
  ["в контейнере, в рамном исполнении, в виде теплоизолированного шкафа", "containerized, frame-based, or in an insulated cabinet"],
  ["контактные, бесконтактные и комбинированные", "contact, touchless, and combined systems"],
  ["Подробнее", "More details"],
  ["Туннельные мойки WashTec для легковых автомобилей", "WashTec tunnel washes for passenger cars"],
  ["Все компоненты подбираются индивидуально, используя модульный принцип. Это позволяет спроектировать автомойку, которая хорошо подойдет под любой размер помещения, будет оснащена нужным оборудованием и обладать необходимой пропускной способностью", "All components are selected individually using a modular principle. This allows a wash to be designed for any facility size, with the right equipment and required throughput"],
  ["Портальные мойки WashTec для легковых автомобилей", "WashTec gantry washes for passenger cars"],
  ["Нужна портальная мойка для транспортной компании, автосервиса или АЗС? Подберем вариант с учетом потребностей вашего сегмента бизнеса. Дополнительные опции, различные варианты комплектации позволят сформировать оптимальный набор услуг.", "Need a gantry wash for a transport company, service station, or fuel station? We will select a solution for your business segment. Extra options and configurations let you create the optimal service set."],
  ["Портальные мойки WashTec для грузовых автомобилей", "WashTec gantry washes for trucks"],
  ["Мойка грузовых автомобилей, автобусов, троллейбусов и спецтехники имеет свои особенности, поэтому обычные автомойки не подходят. Решение WashTec рассчитано на крупногабаритный транспорт и интенсивную эксплуатацию.", "Washing trucks, buses, trolleybuses, and special vehicles has specific requirements, so standard car washes are not enough. WashTec solutions are designed for large vehicles and intensive use."],
  [
    "Мойка грузовых автомобилей, автобусов, троллейбусов и спецтехники имеет свои особенности. Моечные машины WashTec позволяют достигнуть максимума эффективности как по качеству, так и по скорости мойки.",
    "Washing trucks, buses, trolleybuses, and special vehicles has its own requirements. WashTec washing systems deliver maximum efficiency in both wash quality and speed.",
  ],
  ["Мойка самообслуживания DS-Business", "DS-Business self-service wash"],
  ["Решения для автомоек самообслуживания с высокой надежностью, удобным управлением и продуманной комплектацией для быстрого запуска бизнеса.", "Reliable self-service wash solutions with convenient controls and well-designed packages for a fast business launch."],
  ["Робот-мойка", "Robotic wash"],
  ["Робот-мойка - это бесконтактная автоматическая мойка легкового автомобиля нового поколения. Мытье осуществляется круглосуточно, без персонала. То есть прибыль вы получаете постоянно, при этом экономите деньги.", "A robotic wash is a next-generation touchless automatic wash for passenger cars. It operates around the clock without staff, so revenue continues while operating costs stay lower."],
  ["Системы оборотного водоснабжения WashTec", "WashTec water recycling systems"],
  [
    "Технологии очистки воды от WashTec позволяют снизить ее расход до минимума. Благодаря этому вы сокращаете затраты, ведь до 85% очищенной воды можно использовать повторно.",
    "WashTec water treatment technologies reduce water consumption to a minimum. This helps you cut costs, because up to 85% of treated water can be reused.",
  ],
  ["Купить моечное оборудование производителей WashTec, Мой-ка! DS-Business и Агроснабтехсервис в городах Беларуси", "Buy WashTec, Moy-ka! DS-Business, and Agrosnabtekhnoservis car wash equipment in Belarusian cities"],
  ["Купить моечное оборудование производителей", "Buy car wash equipment from"],
  ["Мой-ка! DS-Business и Агроснабтехсервис", "Moy-ka! DS-Business and Agrosnabtekhnoservis"],
  ["в городах Беларуси", "in Belarusian cities"],
  ["Портальные и туннельные мойки, мойки самообслуживания, робот-мойки для легковых и грузовых автомобилей. Также комплектующие, запчасти и аксессуары для любого моечного комплекса", "Gantry and tunnel washes, self-service washes, and robotic washes for passenger cars and trucks. Components, spare parts, and accessories for any wash complex are also available"],
  ["Брест", "Brest"],
  ["Минск", "Minsk"],
  ["Витебск", "Vitebsk"],
  ["Гродно", "Grodno"],
  ["Гомель", "Gomel"],
  ["Могилев", "Mogilev"],
  ["Интерактивная карта городов Беларуси", "Interactive map of Belarusian cities"],
  ["Интерактивная Яндекс.Карта городов Беларуси", "Interactive Yandex Map of Belarusian cities"],
  ["Открыть карту Беларуси в Яндекс.Картах", "Open the map of Belarus in Yandex Maps"],
  ["Наши проекты", "Our projects"],
  ["Все проекты", "All projects"],
  ["ОАО «Газпром трансгаз Беларусь»", "Gazprom Transgaz Belarus OJSC"],
  ["(Республика Беларусь, Крупки)", "(Republic of Belarus, Krupki)"],
  ["Портальная мойка для грузового транспорта WashTec MaxiWash Vario", "WashTec MaxiWash Vario gantry wash for trucks"],
  ["Система оборотного водоснабжения MFА-20", "MFA-20 water recycling system"],
  ["ПЧУП «БелИстоТех»", "BelIstoTech private company"],
  ["(Республика Беларусь, Минск)", "(Republic of Belarus, Minsk)"],
  ["Мойка самообслуживания WashTec на 5 постов", "WashTec five-bay self-service wash"],
  ["ООО «Бугинком»", "Bugincom LLC"],
  ["(Республика Беларусь, Брест)", "(Republic of Belarus, Brest)"],
  ["Туннельная мойка SL-50", "SL-50 tunnel wash"],
  ["Система оборотного водоснабжения WashTec MFM-30", "WashTec MFM-30 water recycling system"],
  ["РУП «Белоруснефть-Брестоблнефтепродукт»", "Belorusneft-Brestoblnefteprodukt"],
  ["Проездная мойка для грузового транспорта WashTec MaxiWash Express", "WashTec MaxiWash Express drive-through truck wash"],
  ["Оставьте заявку на бесплатную консультацию специалиста компании \"Акватехносервис\"", "Request a free consultation with an AquaTechnoService specialist"],
  ["Наш специалист поможет подобрать моечное оборудование исходя из ваших предпочтений и бюджета. Ответит на все ваши вопросы и проконсультирует по нюансам эксплуатации моечного комплекса", "Our specialist will help you choose washing equipment based on your preferences and budget, answer your questions, and explain operation details"],
  ["Имя", "Name"],
  ["Телефон", "Phone"],
  ["e-mail", "Email"],
  ["Город", "City"],
  ["Сообщение", "Message"],
  ["Отправить", "Send"],
  ["Заполните поле.", "Please fill in this field."],
  ["Введите имя не короче 2 символов.", "Enter a name of at least 2 characters."],
  ["Используйте только буквы.", "Use letters only."],
  ["Введите белорусский номер: +375 (29) 123-45-67.", "Enter a Belarusian number: +375 (29) 123-45-67."],
  ["Введите корректный e-mail.", "Enter a valid email."],
  ["Введите город не короче 2 символов.", "Enter a city of at least 2 characters."],
  ["Сообщение должно быть не короче 10 символов.", "Message must be at least 10 characters long."],
  ["Сократите сообщение до 1000 символов.", "Shorten the message to 1000 characters."],
  ["Проверьте поля формы.", "Check the form fields."],
  ["Отправляем...", "Sending..."],
  ["Заявка отправлена. Специалист компании свяжется с вами.", "Request sent. A company specialist will contact you."],
  ["Не удалось отправить заявку. Проверьте, что json-server запущен.", "Could not send the request. Check that json-server is running."],
  ["Страница не найдена", "Page not found"],
  ["Возможно, адрес изменился или раздел был удален. Вернитесь на главную страницу или перейдите в каталог моечного оборудования.", "The address may have changed or the section may have been removed. Return to the home page or go to the equipment catalog."],
  ["На главную", "Home"],
  ["В каталог", "To catalog"],
  ["Наши", "Our"],
  ["товары и услуги", "services and products"],
  ["Our", "Наши"],
  ["Services & Products", "товары и услуги"],
  ["Search by name or description...", "Поиск по названию или описанию..."],
  ["Min Price ($)", "Мин. цена ($)"],
  ["Max Price ($)", "Макс. цена ($)"],
  ["Default sorting", "Сортировка по умолчанию"],
  ["Price: Low to High", "Цена: по возрастанию"],
  ["Price: High to Low", "Цена: по убыванию"],
  ["Name: A to Z", "Название: А-Я"],
  ["Rating: High to Low", "Рейтинг: по убыванию"],
  ["All", "Все"],
  ["Previous", "Назад"],
  ["Next", "Вперед"],
  ["Page", "Страница"],
  ["of", "из"],
  ["Loading products...", "Загружаем товары..."],
  ["Error loading data. Server might be down.", "Ошибка загрузки данных. Возможно, сервер не запущен."],
  ["Please log in to add items to your cart or favorites.", "Войдите в аккаунт, чтобы добавлять товары в корзину или избранное."],
  ["This item is already in your favorites!", "Этот товар уже в избранном!"],
  ["Increased quantity to {count} in cart!", "Количество в корзине увеличено до {count}!"],
  ["Successfully added to {target}!", "Успешно добавлено в {target}!"],
  ["Failed to process action for {target}", "Не удалось выполнить действие для {target}"],
  ["No services found matching your criteria.", "По вашему запросу ничего не найдено."],
  ["Fav", "Избранное"],
  ["Cart", "Корзина"],
  ["Shopping", "Корзина"],
  ["Order Summary", "Сводка заказа"],
  ["Total Items:", "Всего товаров:"],
  ["Total Price:", "Итоговая цена:"],
  ["Proceed to Checkout", "Оформить заказ"],
  ["Please log in to see your cart.", "Войдите в аккаунт, чтобы увидеть корзину."],
  ["Log In", "Войти"],
  ["Error loading cart.", "Ошибка загрузки корзины."],
  ["Your cart is empty.", "Ваша корзина пуста."],
  ["Go to Catalog", "Перейти в каталог"],
  ["Error removing item.", "Ошибка удаления товара."],
  ["Processing...", "Обрабатываем..."],
  ["Purchase successful! The order was added to history.", "Покупка успешно оформлена! Заказ добавлен в историю."],
  ["Something went wrong during checkout.", "Во время оформления заказа что-то пошло не так."],
  ["Your", "Ваше"],
  ["Favorites", "Избранное"],
  ["Please log in to see your favorites.", "Войдите в аккаунт, чтобы увидеть избранное."],
  ["Error loading favorites.", "Ошибка загрузки избранного."],
  ["Your favorites list is empty.", "Ваш список избранного пуст."],
  ["Remove", "Удалить"],
  ["Failed to remove item.", "Не удалось удалить товар."],
  ["Личный кабинет — АкваТехноСервис", "Account — AquaTechnoService"],
  ["Профиль и история заказов", "Profile and order history"],
  ["Управляйте контактными данными аккаунта и просматривайте оформленные заказы в одном месте.", "Manage your account contact details and view completed orders in one place."],
  ["Данные аккаунта", "Account details"],
  ["Контактная информация", "Contact information"],
  ["Фамилия", "Last name"],
  ["Отчество", "Patronymic"],
  ["Дата рождения", "Birth date"],
  ["Никнейм", "Nickname"],
  ["Смена пароля", "Change password"],
  ["Оставьте поля пустыми, если не хотите менять пароль.", "Leave these fields empty if you do not want to change the password."],
  ["Новый пароль", "New password"],
  ["8-20 символов", "8-20 characters"],
  ["Повторите пароль", "Repeat password"],
  ["Сохранить изменения", "Save changes"],
  ["Заказы", "Orders"],
  ["История заказов", "Order history"],
  ["Загружаем данные аккаунта...", "Loading account data..."],
  ["Не удалось загрузить данные аккаунта. Войдите заново или проверьте сервер.", "Could not load account data. Sign in again or check the server."],
  ["Войдите в аккаунт, чтобы открыть личный кабинет.", "Sign in to open your account."],
  ["Войти / зарегистрироваться", "Sign in / sign up"],
  ["Администратор", "Administrator"],
  ["Клиент", "Client"],
  ["История временно недоступна", "History is temporarily unavailable"],
  ["Проверьте, что json-server запущен на порту 3000.", "Check that json-server is running on port 3000."],
  ["История заказов пуста", "Order history is empty"],
  ["После оформления покупки в корзине заказ появится здесь.", "After checkout, the order will appear here."],
  ["Перейти в каталог", "Go to catalog"],
  ["Заказ {id}", "Order {id}"],
  ["{count} шт. x {price}", "{count} pcs. x {price}"],
  ["Введите фамилию.", "Enter your last name."],
  ["Введите имя.", "Enter your first name."],
  ["Введите белорусский мобильный номер +375.", "Enter a Belarusian mobile number starting with +375."],
  ["Введите корректный email.", "Enter a valid email."],
  ["Возраст пользователя должен быть не меньше 16 лет.", "The user must be at least 16 years old."],
  ["Введите никнейм.", "Enter a nickname."],
  ["Такой никнейм уже занят.", "This nickname is already taken."],
  ["Пароли не совпадают.", "Passwords do not match."],
  ["Пароль должен содержать от 8 до 20 символов.", "Password must contain 8 to 20 characters."],
  ["Добавьте хотя бы одну заглавную букву.", "Add at least one uppercase letter."],
  ["Добавьте хотя бы одну строчную букву.", "Add at least one lowercase letter."],
  ["Добавьте хотя бы одну цифру.", "Add at least one digit."],
  ["Добавьте хотя бы один специальный символ.", "Add at least one special character."],
  ["Этот пароль слишком распространен.", "This password is too common."],
  ["Сохраняем...", "Saving..."],
  ["Данные аккаунта сохранены.", "Account data saved."],
  ["Не удалось сохранить данные. Проверьте сервер.", "Could not save data. Check the server."],
  ["Дата не указана", "Date not specified"],
  ["заказ", "order"],
  ["заказа", "orders"],
  ["заказов", "orders"],
  ["WebTech - Catalog", "АкваТехноСервис — Каталог"],
  ["WebTech - Cart", "АкваТехноСервис — Корзина"],
  ["WebTech - Favorites", "АкваТехноСервис — Избранное"],
  ["WebTech - Admin Panel", "АкваТехноСервис — Админ-панель"],
  ["WebTech - Authentication", "АкваТехноСервис — Авторизация"],
  ["WebTech - Leave Feedback", "АкваТехноСервис — Оставить отзыв"],
  ["WebTech - Auth", "АкваТехноСервис — Авторизация"],
  ["WebTech - Feedback", "АкваТехноСервис — Отзыв"],
  ["Log In", "Войти"],
  ["Welcome Back", "С возвращением"],
  ["Enter Email or Nickname", "Введите email или никнейм"],
  ["Create Account", "Создать аккаунт"],
  ["Ivanov", "Иванов"],
  ["Ivan", "Иван"],
  ["Ivanovich", "Иванович"],
  ["Phone (Belarus +375)", "Телефон (Беларусь +375)"],
  ["Birthdate (Minimum age: 16)", "Дата рождения (минимальный возраст: 16)"],
  ["Set Password Manually", "Задать пароль вручную"],
  ["Auto-Generate", "Сгенерировать автоматически"],
  ["Min. 8 chars, 1 Upper, 1 Special", "Мин. 8 символов, 1 заглавная, 1 спецсимвол"],
  ["Confirm Password (Copy/Paste disabled)", "Подтвердите пароль (вставка запрещена)"],
  ["Repeat your password", "Повторите пароль"],
  ["Generate first...", "Сначала сгенерируйте..."],
  ["Generate", "Сгенерировать"],
  ["Please read this User Agreement carefully. You must scroll to the bottom to close this agreement.", "Внимательно прочитайте пользовательское соглашение. Чтобы закрыть его, прокрутите текст до конца."],
  ["You agree to safeguard your password and use our services for lawful purposes. WebTech reserve the right to ban accounts acting maliciously against the database or catalog.", "Вы соглашаетесь беречь пароль и использовать сервисы в законных целях. АкваТехноСервис оставляет за собой право блокировать аккаунты, которые вредят базе данных или каталогу."],
  ["Please read down to end...", "Прочитайте до конца..."],
  ["Admin Panel", "Админ-панель"],
  ["Admin", "Админ"],
  ["Console", "Консоль"],
  ["Admin Console", "Админ-консоль"],
  ["Manage Products", "Управление товарами"],
  ["Operation", "Операция"],
  ["Add New Product", "Добавить новый товар"],
  ["Edit Existing Product", "Редактировать товар"],
  ["Select Product to Edit", "Выберите товар для редактирования"],
  ["-- Loading products --", "-- Загружаем товары --"],
  ["Product Title", "Название товара"],
  ["-- Select category --", "-- Выберите категорию --"],
  ["Price ($)", "Цена ($)"],
  ["Review Moderation", "Модерация отзывов"],
  ["Filter by Service", "Фильтр по услуге"],
  ["Filter by Client", "Фильтр по клиенту"],
  ["Access Forbidden", "Доступ запрещен"],
  ["This console is restricted to administrators only. You will be redirected to home page.", "Эта консоль доступна только администраторам. Вы будете перенаправлены на главную страницу."],
  ["Product Management", "Управление товарами"],
  ["Mode:", "Режим:"],
  ["Add New", "Добавить"],
  ["Edit Existing", "Редактировать"],
  ["Select Product to Edit:", "Выберите товар для редактирования:"],
  ["Title", "Название"],
  ["Category", "Категория"],
  ["Automatic Washes", "Автоматические мойки"],
  ["Accessories", "Комплектующие"],
  ["Extra Equipment", "Доп. оборудование"],
  ["Price", "Цена"],
  ["Image URL", "URL изображения"],
  ["Description", "Описание"],
  ["Add Product", "Добавить товар"],
  ["Delete Product", "Удалить товар"],
  ["Feedback Management", "Управление отзывами"],
  ["Filter by Product:", "Фильтр по товару:"],
  ["All Products", "Все товары"],
  ["Filter by User:", "Фильтр по пользователю:"],
  ["All Users", "Все пользователи"],
  ["Access Denied: You are not an administrator.", "Доступ запрещен: вы не администратор."],
  ["Redirecting...", "Выполняется перенаправление..."],
  ["-- Choose product --", "-- Выберите товар --"],
  ["All Services", "Все услуги"],
  ["All Clients", "Все клиенты"],
  ["Save Changes", "Сохранить изменения"],
  ["Price must be greater than 0.", "Цена должна быть больше 0."],
  ["Please enter a valid Image URL.", "Введите корректный URL изображения."],
  ["Product modified successfully.", "Товар успешно изменен."],
  ["Product added to catalog.", "Товар добавлен в каталог."],
  ["Failed to process database operation.", "Не удалось выполнить операцию с базой данных."],
  ["Are you sure you want to delete this product?", "Вы уверены, что хотите удалить этот товар?"],
  ["Product deleted.", "Товар удален."],
  ["Failed to delete product.", "Не удалось удалить товар."],
  ["No reviews match this criteria.", "Отзывы по выбранным критериям не найдены."],
  ["Service: {title}", "Услуга: {title}"],
  ["Delete Review", "Удалить отзыв"],
  ["Delete this review?", "Удалить этот отзыв?"],
  ["Review removed.", "Отзыв удален."],
  ["Failed to delete review.", "Не удалось удалить отзыв."],
  ["Error accessing database records.", "Ошибка доступа к записям базы данных."],
  ["Sign In", "Вход"],
  ["Register", "Регистрация"],
  ["Login", "Войти"],
  ["Email or Nickname", "Email или никнейм"],
  ["Password", "Пароль"],
  ["Last Name (Фамилия)", "Фамилия"],
  ["First Name (Имя)", "Имя"],
  ["Patronymic (Отчество - Опционально)", "Отчество (необязательно)"],
  ["Phone (+375)", "Телефон (+375)"],
  ["Email", "Email"],
  ["Birthdate", "Дата рождения"],
  ["Password Method", "Способ задания пароля"],
  ["Manual", "Вручную"],
  ["Generate Secure Password", "Сгенерировать надежный пароль"],
  ["Confirm Password", "Подтвердите пароль"],
  ["Generated Password", "Сгенерированный пароль"],
  ["Generate Nickname", "Сгенерировать никнейм"],
  ["I agree to the", "Я согласен с"],
  ["User Agreement", "пользовательским соглашением"],
  ["Close", "Закрыть"],
  ["Pasting is disabled in this field!", "Вставка в это поле запрещена!"],
  ["I Have Read the Agreement", "Я прочитал соглашение"],
  ["Please enter First Name and Last Name first!", "Сначала введите имя и фамилию!"],
  ["5 attempts used. You can now enter your nickname manually.", "Использованы 5 попыток. Теперь можно ввести никнейм вручную."],
  ["Attempts used: {count} of 5", "Использовано попыток: {count} из 5"],
  ["Only Belarus mobile numbers (+375 code 25, 29, 33, 44) are allowed", "Разрешены только белорусские мобильные номера (+375 коды 25, 29, 33, 44)"],
  ["Please provide a valid email format.", "Введите корректный формат email."],
  ["You must be at least 16 years old to register.", "Для регистрации вам должно быть не меньше 16 лет."],
  ["Password must be between 8 and 20 characters.", "Пароль должен быть от 8 до 20 символов."],
  ["Must contain at least one uppercase letter.", "Добавьте хотя бы одну заглавную букву."],
  ["Must contain at least one lowercase letter.", "Добавьте хотя бы одну строчную букву."],
  ["Must contain at least one number.", "Добавьте хотя бы одну цифру."],
  ["Must contain at least one special character.", "Добавьте хотя бы один специальный символ."],
  ["This password is too common (top list of 2024).", "Этот пароль слишком распространен."],
  ["This nickname is already taken.", "Этот никнейм уже занят."],
  ["Registration successful! You can now log in.", "Регистрация успешна! Теперь вы можете войти."],
  ["Registration failed. Try again.", "Регистрация не удалась. Попробуйте еще раз."],
  ["Welcome back, {nickname}!", "С возвращением, {nickname}!"],
  ["Invalid user credentials or password.", "Неверные учетные данные или пароль."],
  ["Leave Feedback", "Оставить отзыв"],
  ["Share", "Поделитесь"],
  ["Your Experience", "вашим опытом"],
  ["Share Your Experience", "Поделитесь вашим опытом"],
  ["Select Service (Only purchased)", "Выберите услугу (только купленную)"],
  ["-- Loading your purchases --", "-- Загружаем ваши покупки --"],
  ["Your Rating", "Ваша оценка"],
  ["★★★★★ (5 - Excellent)", "★★★★★ (5 - Отлично)"],
  ["★★★★☆ (4 - Good)", "★★★★☆ (4 - Хорошо)"],
  ["★★★☆☆ (3 - Average)", "★★★☆☆ (3 - Средне)"],
  ["★★☆☆☆ (2 - Poor)", "★★☆☆☆ (2 - Плохо)"],
  ["★☆☆☆☆ (1 - Very Bad)", "★☆☆☆☆ (1 - Очень плохо)"],
  ["Review Text (Min. 20 characters)", "Текст отзыва (мин. 20 символов)"],
  ["Tell us what you liked...", "Расскажите, что вам понравилось..."],
  ["Min. 20 required", "Минимум 20 символов"],
  ["Access Denied", "Доступ запрещен"],
  ["You must be logged in to leave feedback.", "Чтобы оставить отзыв, нужно войти в аккаунт."],
  ["Share your experience with purchased services.", "Поделитесь опытом использования купленных услуг."],
  ["Purchased Service", "Купленная услуга"],
  ["Rating", "Рейтинг"],
  ["5 — Excellent", "5 — Отлично"],
  ["4 — Good", "4 — Хорошо"],
  ["3 — Average", "3 — Средне"],
  ["2 — Poor", "2 — Плохо"],
  ["1 — Bad", "1 — Плохо"],
  ["Review Text", "Текст отзыва"],
  ["Describe your experience...", "Опишите ваш опыт..."],
  ["0 characters", "0 символов"],
  ["Submit Feedback", "Отправить отзыв"],
  ["You must be logged in to write a review. Please sign in first.", "Чтобы оставить отзыв, нужно войти в аккаунт."],
  ["Administrators cannot leave feedback. Please sign in with a client account.", "Администратор не может оставлять отзывы. Войдите как клиент."],
  ["You can only leave feedback on services you have purchased at least once.", "Вы можете оставить отзыв только на услуги, которые покупали хотя бы один раз."],
  ["-- Select purchased service --", "-- Выберите купленную услугу --"],
  ["Error checking order history. Please try again.", "Ошибка проверки истории заказов. Попробуйте еще раз."],
  ["{count} characters", "{count} символов"],
  ["Review text must be at least 20 characters long.", "Текст отзыва должен быть не короче 20 символов."],
  ["Submitting...", "Отправляем..."],
  ["Thank you! Your review has been saved.", "Спасибо! Ваш отзыв сохранен."],
  ["Failed to save review.", "Не удалось сохранить отзыв."],
  ["Портальная автомойка WashTec", "WashTec gantry car wash"],
  ["Автоматические мойки", "Automatic washes"],
  ["Современная портальная мойка для легковых автомобилей с бережной щеточной системой.", "Modern gantry wash for passenger cars with a gentle brush system."],
  ["Туннельная конвейерная линия", "Tunnel conveyor line"],
  ["Высокопроизводительная туннельная мойка модульного типа для большого потока машин.", "High-performance modular tunnel wash for heavy vehicle traffic."],
  ["Оборудование для поста самообслуживания", "Self-service bay equipment"],
  ["Самообслуживание", "Self-service"],
  ["Полный комплект для одного поста: АВД, консоли, пистолеты и пульт управления.", "Complete set for one bay: pressure washer, booms, guns, and control panel."],
  ["Робот-мойка (Бесконтактная)", "Robotic touchless wash"],
  ["Автоматическая бесконтактная мойка с 3D-сканированием контуров автомобиля.", "Automatic touchless wash with 3D vehicle contour scanning."],
  ["Система оборотного водоснабжения", "Water recycling system"],
  ["Очистка воды", "Water treatment"],
  ["Установка для очистки и повторного использования до 85% сточных вод автомойки.", "System for treating and reusing up to 85% of car wash wastewater."],
  ["Установка обратного осмоса", "Reverse osmosis system"],
  ["Система деминерализации воды для финального ополаскивания без пятен и разводов.", "Water demineralization system for spot-free final rinsing."],
  ["Двухтурбинный пылесос самообслуживания", "Two-turbine self-service vacuum"],
  ["Доп. оборудование", "Extra equipment"],
  ["Мощный пылесос из нержавеющей стали с жетоноприемником для сухой уборки салона.", "Powerful stainless-steel vacuum with token acceptor for dry interior cleaning."],
  ["Аппарат высокого давления (АВД)", "High-pressure washer"],
  ["Комплектующие", "Components"],
  ["Промышленная помпа с электродвигателем (200 бар, 15 л/мин) для интенсивной нагрузки.", "Industrial pump with electric motor (200 bar, 15 l/min) for intensive use."],
  ["Терминал оплаты для мойки", "Car wash payment terminal"],
  ["Уличный терминал с защитой от влаги IP65, поддержкой купюр, монет и банковских карт.", "Outdoor IP65 terminal supporting banknotes, coins, and bank cards."],
  ["Поворотная консоль (Пантограф)", "Swivel boom pantograph"],
  ["Z-образная потолочная консоль 360° из нержавеющей стали для шлангов ВД.", "360-degree Z-shaped stainless-steel ceiling boom for high-pressure hoses."],
  ["Дозирующий насос для химии", "Chemical dosing pump"],
  ["Высокоточный электромагнитный насос-дозатор для шампуня и воска.", "High-precision electromagnetic dosing pump for shampoo and wax."],
  ["Автохимия: Активная пена (20л)", "Car chemicals: active foam, 20 L"],
  ["Расходные материалы", "Consumables"],
  ["Сильнопенящееся щелочное средство для бесконтактной мойки любых типов кузова.", "High-foaming alkaline agent for touchless washing of all body types."],
  ["Аппарат для мойки ковриков", "Mat washing machine"],
  ["Автоматическая машина для влажной чистки и сушки автомобильных ковриков.", "Automatic machine for wet cleaning and drying car mats."],
  ["Воздушный компрессор 100л", "100 L air compressor"],
  ["Оборудование", "Equipment"],
  ["Поршневой масляный компрессор для обеспечения сжатым воздухом пневматических систем.", "Oil piston compressor for supplying compressed air to pneumatic systems."],
  ["Портальная мойка для грузовиков", "Truck gantry wash"],
  ["Крупногабаритная моечная установка для фур, автобусов и спецтехники.", "Large-format wash system for trucks, buses, and special vehicles."],
  ["Отличная работа! Сайт полностью адаптивный и быстрый. Рекомендую эту студию.", "Excellent work! The site is fully responsive and fast. I recommend this company."],
  [
    "220012, Республика Беларусь, г. Минск, ул. Толбухина 2а, к. 320",
    "220012, Republic of Belarus, Minsk, Tolbukhina St. 2a, office 320",
  ],
  ["Республика Беларусь", "Republic of Belarus"],
  ["г. Минск", "Minsk"],
  ["ул. Толбухина 2а, к. 320", "Tolbukhina St. 2a, office 320"],
];

const TRANSLATION_INDEX = new Map();

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function hasCyrillic(value) {
  return /[А-Яа-яЁёІіЎў]/.test(String(value));
}

function registerTranslation(key, entry) {
  const normalized = normalizeText(key);
  if (!TRANSLATION_INDEX.has(normalized)) {
    TRANSLATION_INDEX.set(normalized, entry);
  }
}

for (const [left, right] of TRANSLATION_ENTRIES) {
  const shouldSwap = !hasCyrillic(left) && hasCyrillic(right);
  const ru = shouldSwap ? right : left;
  const en = shouldSwap ? left : right;
  const entry = { ru, en };

  registerTranslation(ru, entry);
  registerTranslation(en, entry);
}

function interpolate(value, replacements = {}) {
  return String(value).replace(/\{(\w+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(replacements, key)
      ? replacements[key]
      : `{${key}}`,
  );
}

export function getLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : "ru";
}

export function translatePlainText(value, lang = getLanguage(), replacements) {
  const normalized = normalizeText(value);
  const entry = TRANSLATION_INDEX.get(normalized);
  const translated = entry ? entry[lang] : value;
  return replacements ? interpolate(translated, replacements) : translated;
}

export function t(value, replacements) {
  return translatePlainText(value, getLanguage(), replacements);
}

export function setLanguage(lang) {
  const nextLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : "ru";
  const previousLang = getLanguage();
  localStorage.setItem(LANGUAGE_KEY, nextLang);
  document.documentElement.lang = nextLang;
  applyTranslations(document);

  if (previousLang !== nextLang) {
    window.dispatchEvent(
      new CustomEvent("i18n:languagechange", {
        detail: { lang: nextLang, previousLang },
      }),
    );
  }
}

export function toggleLanguage() {
  setLanguage(getLanguage() === "ru" ? "en" : "ru");
}

function translateTextNode(node, lang) {
  const raw = node.nodeValue;
  const normalized = normalizeText(raw);
  if (!normalized) return;

  const entry = TRANSLATION_INDEX.get(normalized);
  if (!entry) return;

  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const trailing = raw.match(/\s*$/)?.[0] ?? "";
  node.nodeValue = `${leading}${entry[lang]}${trailing}`;
}

function translateAttributes(element, lang) {
  ["placeholder", "aria-label", "alt", "title"].forEach((attr) => {
    if (!element.hasAttribute(attr)) return;
    const translated = translatePlainText(element.getAttribute(attr), lang);
    element.setAttribute(attr, translated);
  });
}

function translateAttributeTree(root, lang) {
  const container = root instanceof Document ? root.documentElement : root;
  if (!container) return;

  if (container.nodeType === Node.ELEMENT_NODE) {
    translateAttributes(container, lang);
  }

  if (typeof container.querySelectorAll === "function") {
    container
      .querySelectorAll("[placeholder], [aria-label], [alt], [title]")
      .forEach((element) => translateAttributes(element, lang));
  }
}

export function applyTranslations(root = document) {
  const lang = getLanguage();
  document.documentElement.lang = lang;

  if (root === document && document.title) {
    document.title = translatePlainText(document.title, lang);
  }

  translateAttributeTree(root, lang);

  const treeRoot = root instanceof Document ? root.body : root;
  if (!treeRoot) return;

  const walker = document.createTreeWalker(
    treeRoot,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        const element =
          node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        if (!element) return NodeFilter.FILTER_REJECT;
        if (
          element.closest(
            "script, style, template, [data-i18n-ignore], input, textarea",
          )
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  let node = walker.currentNode;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node, lang);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateAttributes(node, lang);
    }
    node = walker.nextNode();
  }

  translateAttributeTree(root, lang);
}

export function initI18n() {
  document.documentElement.lang = getLanguage();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyTranslations(document));
  } else {
    applyTranslations(document);
  }
}

export function onLanguageChange(callback) {
  window.addEventListener("i18n:languagechange", callback);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat(getLanguage() === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  if (!value) return t("Дата не указана");

  return new Intl.DateTimeFormat(getLanguage() === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function localizeRecord(record, lang = getLanguage()) {
  if (!record || typeof record !== "object") return record;

  const localized = { ...record };

  if (record.i18n?.[lang]) {
    Object.assign(localized, record.i18n[lang]);
  }

  if (record.productI18n?.[lang] && localized.productTitle) {
    localized.productTitle = record.productI18n[lang].title;
  }

  ["title", "category", "description", "productTitle", "text"].forEach((field) => {
    if (typeof localized[field] === "string") {
      localized[field] = translatePlainText(localized[field], lang);
    }
  });

  if (Array.isArray(record.products)) {
    localized.products = record.products.map((product) =>
      localizeRecord(product, lang),
    );
  }

  localized._baseTitle = record.i18n?.ru?.title || record.title;
  localized._baseCategory = record.i18n?.ru?.category || record.category;
  localized._baseDescription =
    record.i18n?.ru?.description || record.description;

  return localized;
}

export function localizeRecords(records, lang = getLanguage()) {
  return Array.isArray(records)
    ? records.map((record) => localizeRecord(record, lang))
    : localizeRecord(records, lang);
}

export function getLocalizedCategoryLabel(category) {
  return category === "All" ? t("All") : translatePlainText(category);
}
