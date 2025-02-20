const restaurants = [
    {
        name: "McDonald's",
        description: "Secret Menu Masters",
        secretItems: [
            "Land, Sea & Air Burger (Big Mac + McChicken + Filet-O-Fish)",
            "Monster Mac (Big Mac with 8 patties)",
            "McGangBang (McChicken inside a McDouble)"
        ]
    },
    {
        name: "Starbucks",
        description: "Hidden Drink Specialists",
        secretItems: [
            "Purple Drink (Passion Iced Tea with soy milk, vanilla, and blackberries)",
            "Nutella Frappuccino (Hazelnut + Mocha + Coffee Frappuccino)",
            "Cotton Candy Frappuccino (Vanilla Bean Frappuccino + Raspberry syrup)"
        ]
    },
    {
        name: "In-N-Out",
        description: "Legendary Secret Menu",
        secretItems: [
            "Animal Style Fries (Cheese, grilled onions, spread)",
            "4x4 Burger (Four patties, four cheese slices)",
            "Protein Style (Lettuce wrap instead of bun)"
        ]
    },
    {
        name: "Chipotle",
        description: "Hidden Mexican Treasures",
        secretItems: [
            "Quesarito (Burrito wrapped in a cheese quesadilla)",
            "Burrito Bowl Extra Everything (No charging for extras)",
            "Nachos (Chips with all burrito bowl toppings)"
        ]
    },
    {
        name: "Jamba Juice",
        description: "Secret Smoothie Society",
        secretItems: [
            "White Gummy Bear (Peach juice + soy milk + raspberry sherbet)",
            "Pink Starburst (Lemonade + lime sherbet + strawberries)",
            "Skittles (Lime sherbet + strawberries + frozen yogurt)"
        ]
    }
];

const restaurantLogos = {
    "McDonald's": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
    "Starbucks": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
    "In-N-Out": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/In-N-Out_Burger_Logo.svg/800px-In-N-Out_Burger_Logo.svg.png",
    "Chipotle": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1200px-Chipotle_Mexican_Grill_logo.svg.png",
    "Jamba Juice": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Jamba_2019.svg/640px-Jamba_2019.svg.png"
};

let currentSlide = 0;

// Library functionality
let myLibrary = [];

// Add at the top with other state variables
let currentUser = null;

function addToLibrary(restaurantName) {
    if (!myLibrary.includes(restaurantName)) {
        myLibrary.push(restaurantName);
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
        showNotification('Added to My List');
    }
}

function removeFromLibrary(restaurantName) {
    myLibrary = myLibrary.filter(name => name !== restaurantName);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    renderLibrary();
    showNotification('Removed from My List');
}

function renderLibrary() {
    const container = document.querySelector('.library-cards');
    container.innerHTML = '';
    
    myLibrary.forEach(restaurantName => {
        const restaurant = restaurants.find(r => r.name === restaurantName);
        if (restaurant) {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            card.innerHTML = `
                <div class="restaurant-logo">
                    <img src="${restaurantLogos[restaurant.name]}" alt="${restaurant.name} logo">
                </div>
                <h2>${restaurant.name}</h2>
                <p>${restaurant.description}</p>
                <div class="secret-items">
                    <h3>Secret Menu Items:</h3>
                    <ul>
                        ${restaurant.secretItems.map(item => `<li>${item.split('(')[0]}</li>`).join('')}
                    </ul>
                </div>
                <div class="card-buttons">
                    <button class="view-btn" onclick="showMenu('${restaurant.name}')">View Menu</button>
                    <button class="remove-btn" onclick="removeFromLibrary('${restaurant.name}')">Remove</button>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

// Menu functionality
function showMenu(restaurantName) {
    const restaurant = restaurants.find(r => r.name === restaurantName);
    if (!restaurant) return;

    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('libraryContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'block';

    const menuDetails = document.querySelector('.menu-details');
    menuDetails.innerHTML = `
        <button class="back-btn" onclick="showMainContent()">← Back</button>
        <div class="restaurant-header">
            <div class="restaurant-logo">
                <img src="${restaurantLogos[restaurant.name]}" alt="${restaurant.name}">
            </div>
            <h2>${restaurant.name}</h2>
            <p>${restaurant.description}</p>
        </div>
        <div class="menu-items">
            ${restaurant.secretItems.map(item => `
                <div class="menu-item">
                    <h3>${item.split('(')[0]}</h3>
                    <p>${item.match(/\((.*?)\)/)?.[1] || ''}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Navigation functions
function showLibrary() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('communityContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'none';
    document.getElementById('libraryContent').style.display = 'block';
    updateNavigation('library');
    renderLibrary();
}

function showCommunity() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('libraryContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'none';
    document.getElementById('communityContent').style.display = 'block';
    updateNavigation('community');
}

function updateNavigation(active) {
    document.querySelectorAll('.bottom-nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.bottom-nav a[onclick*="${active}"]`)?.classList.add('active');
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Add these auth functions
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update the initialization code
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
    } else {
        showAuthModal();
    }

    // Load saved library
    const savedLibrary = localStorage.getItem('myLibrary');
    if (savedLibrary) {
        myLibrary = JSON.parse(savedLibrary);
    }

    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const isLogin = tab.dataset.tab === 'login';
            document.getElementById('loginForm').style.display = isLogin ? 'flex' : 'none';
            document.getElementById('signupForm').style.display = isLogin ? 'none' : 'flex';
        });
    });

    // Handle login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        // Simple validation - in real app, you'd verify against a backend
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            hideAuthModal();
            showApp();
            showNotification('Welcome back!');
        } else {
            showNotification('Invalid email or password');
        }
    });

    // Handle signup
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const username = form.username.value;

        // Simple validation - in real app, you'd use a backend
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            showNotification('Email already exists');
            return;
        }

        const newUser = { email, password, username };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        hideAuthModal();
        showApp();
        showNotification('Account created successfully!');
    });

    // Handle logout
    document.querySelector('.profile-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        showAuthModal();
    });

    createRestaurantCards();
    showMainContent();
});

function showApp() {
    hideAuthModal();
    createRestaurantCards();
    showMainContent();
    updateProfileUI();
}

function updateProfileUI() {
    const profileBtn = document.querySelector('.profile-btn');
    profileBtn.textContent = currentUser ? '👤' : '👤';
}

// Make sure all your functions are defined here
function createRestaurantCards() {
    const container = document.querySelector('.featured-cards');
    container.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        const safeName = restaurant.name.replace(/'/g, "\\'");
        
        card.innerHTML = `
            <div class="restaurant-logo">
                <img src="${restaurantLogos[restaurant.name]}" alt="${restaurant.name} logo">
            </div>
            <h2>${restaurant.name}</h2>
            <p>${restaurant.description}</p>
            <div class="secret-items">
                <h3>Secret Menu Items:</h3>
                <ul>
                    ${restaurant.secretItems.map(item => `<li>${item.split('(')[0]}</li>`).join('')}
                </ul>
            </div>
            <div class="card-buttons">
                <button class="view-btn" onclick="showMenu('${safeName}')">View Menu</button>
                <button class="add-btn" onclick="addToLibrary('${safeName}')">+ My List</button>
            </div>
        `;
        
        container.appendChild(card);
    });

    setTimeout(updateCarouselPosition, 100);
}

function showMainContent() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('libraryContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'none';
    document.getElementById('communityContent').style.display = 'none';
    
    // Update navigation
    document.querySelectorAll('.bottom-nav a').forEach(a => a.classList.remove('active'));
    document.querySelector('.bottom-nav a:first-child').classList.add('active');
    
    // Reset carousel
    currentSlide = 0;
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const container = document.querySelector('.featured-cards');
    const cardWidth = document.querySelector('.restaurant-card').offsetWidth;
    const gap = 32; // 2rem gap
    const slideAmount = (cardWidth + gap) * currentSlide;
    container.style.transform = `translateX(-${slideAmount}px)`;
    
    // Update buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const maxSlides = restaurants.length - 1;
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= maxSlides;
}

function nextSlide() {
    if (currentSlide >= restaurants.length - 1) return;
    currentSlide++;
    updateCarouselPosition();
}

function prevSlide() {
    if (currentSlide === 0) return;
    currentSlide--;
    updateCarouselPosition();
} 