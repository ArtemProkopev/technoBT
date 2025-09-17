const products = [
	{
		id: 1,
		name: 'Смартфон XTech Pro',
		price: 29990,
		image: 'images/product1-opt.jpg',
	},
	{
		id: 2,
		name: 'Ноутбук GameBook Ultra',
		price: 89990,
		image: 'images/product2-opt.jpg',
	},
	{
		id: 3,
		name: 'Наушники AudioMax',
		price: 12990,
		image: 'images/product3-opt.jpg',
	},
	{
		id: 4,
		name: 'Планшет TabPro',
		price: 45990,
		image: 'images/product4-opt.jpg',
	},
	{
		id: 5,
		name: 'Умные часы WatchSmart',
		price: 19990,
		image: 'images/product5-opt.jpg',
	},
	{
		id: 6,
		name: 'Экшн-камера ActionPro',
		price: 24990,
		image: 'images/product6-opt.jpg',
	},
]

/* заменил на нативный scrollIntoView. */
function scrollToProducts() {
	const el = document.getElementById('products')
	if (el) el.scrollIntoView({ behavior: 'smooth' })
}

/* Этап 4.5: анимации при появлении через IntersectionObserver.
До этого был scroll listener с перебором всех элементов на каждом скролле. */
function initAnimations() {
	const animated = document.querySelectorAll('[data-animation]')
	if (!animated.length) return

	const io = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return
				// добавляем класс с типом анимации и отвязываем наблюдатель
				entry.target.classList.add(entry.target.dataset.animation)
				obs.unobserve(entry.target)
			})
		},
		{ rootMargin: '0px 0px -10% 0px' }
	) // чуть раньше триггерим для плавности

	animated.forEach(el => io.observe(el))
}

/* корзина (упрощённая логика из cart.js + main.js, без дублей и сайдбара)
   Только то, что реально используется на странице: счетчики и уведомление */

const cartInstance = { items: [], total: 0, count: 0 }

function addToCart(id) {
	// Находим товар по id (раньше был ручной цикл)
	const p = products.find(x => x.id === id)
	if (!p) return

	// Если уже есть — увеличиваем количество, иначе добавляем
	const existing = cartInstance.items.find(x => x.id === id)
	existing
		? (existing.quantity += 1)
		: cartInstance.items.push({ ...p, quantity: 1 })

	updateCart()
	showNotification('Товар добавлен в корзину!')
}

function updateCart() {
	// Считаем общее количество и сумму (reduce вместо двух циклов)
	cartInstance.count = cartInstance.items.reduce(
		(sum, i) => sum + i.quantity,
		0
	)
	cartInstance.total = cartInstance.items.reduce(
		(sum, i) => sum + i.price * i.quantity,
		0
	)

	// Здесь можно обновить видимые бейджи, если появятся (сейчас лог только для проверки)
	console.log(
		'В корзине:',
		cartInstance.count,
		'товаров на',
		cartInstance.total,
		'₽'
	)
}

// Лёгкое уведомление (вместо тяжёлой анимации и таймеров в несколько уровней)
function showNotification(message) {
	const n = document.createElement('div')
	n.textContent = message
	n.style.cssText =
		'position:fixed;top:20px;right:20px;background:#28a745;color:#fff;padding:10px 16px;' +
		'border-radius:6px;z-index:9999;box-shadow:0 4px 10px rgba(0,0,0,.15);transform:translateX(100%);' +
		'transition:transform .25s ease'
	document.body.appendChild(n)
	// показать
	requestAnimationFrame(() => {
		n.style.transform = 'translateX(0)'
	})
	// скрыть и удалить
	setTimeout(() => {
		n.style.transform = 'translateX(100%)'
		setTimeout(() => n.remove(), 250)
	}, 2000)
}

/* Инициализация всего нужного на странице */
document.addEventListener('DOMContentLoaded', () => {
	initAnimations() // запускаем наблюдатель анимаций
	// > нет тяжёлых preload’ов/валидаторов/параллаксов — их удалил как неиспользуемые (Этап 4.1–4.4 PDF).
})

/* Экспортируем в глобальную область только то, что реально вызывается из HTML.
   (в HTML есть onclick="scrollToProducts()" и onclick="addToCart(id)") */
window.scrollToProducts = scrollToProducts
window.addToCart = addToCart
