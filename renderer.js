const { supabase } = require('./src/supabaseConfig');

const restaurants = [
    {
        name: "Fast Burger Joint",
        description: "Community Suggested Menu Combinations",
        secretItems: [
            "Land, Sea & Air Burger (Big Mac + McChicken + Filet-O-Fish)",
            "Monster Mac (Big Mac with 8 patties)",
            "McGangBang (McChicken inside a McDouble)",
            "Big McChicken (Big Mac using chicken patties as buns)",
            "Neapolitan Shake (Chocolate + Vanilla + Strawberry)",
            "Apple Pie McFlurry (McFlurry with apple pie pieces)",
            "Hash Brown McMuffin (McMuffin with hash brown inside)",
            "Grilled Cheese (Bun grilled with cheese slices)",
            "Ice Cream Sandwich (Ice cream between two cookies)",
            "Poor Man's Big Mac (McDouble with Big Mac sauce and lettuce)"
        ]
    },
    {
        name: "Popular Coffee Chain",
        description: "Famous Coffee Shop Hidden Menu",
        secretItems: [
            "Purple Drink (Passion Iced Tea with soy milk, vanilla, and blackberries)",
            "Nutella Frappuccino (Hazelnut + Mocha + Coffee Frappuccino)",
            "Cotton Candy Frappuccino (Vanilla Bean Frappuccino + Raspberry syrup)",
            "Butterbeer Frappuccino (Cream Frappuccino + Caramel + Toffee Nut + Cinnamon Dolce)",
            "Medicine Ball (Jade Citrus Mint + Peach Tranquility + Honey + Lemonade)",
            "Captain Crunch Frappuccino (Strawberries & Cream + Caramel + Hazelnut + Toffee Nut)",
            "Twix Frappuccino (Caramel Frappuccino + Caramel + Mocha + Java Chips)",
            "Baby Yoda Frappuccino (Matcha Green Tea + Caramel)",
            "Snickerdoodle Hot Cocoa (White Hot Chocolate + Cinnamon Dolce)",
            "Cadbury Creme Egg Frappuccino (Java Chip Frappuccino + Vanilla + Caramel)"
        ]
    },
    {
        name: "West Coast Burger",
        description: "California-Style Burger Secret Menu",
        secretItems: [
            "Animal Style Fries (Cheese, grilled onions, spread)",
            "4x4 Burger (Four patties, four cheese slices)",
            "Protein Style (Lettuce wrap instead of bun)",
            "Flying Dutchman (Two patties and cheese only)",
            "3x3 (Triple-Triple) (Three patties with cheese)",
            "Chopped Chilis (Add spicy yellow peppers)",
            "Animal Style Burger (Mustard cooked patty + extras)",
            "Roadkill Fries (Animal fries with burger on top)",
            "Monkey Style (Burger with animal style fries inside)",
            "Grilled Cheese Animal Style (Vegetarian option with the works)"
        ]
    },
    {
        name: "Mexican Grill",
        description: "Fresh Mex Hidden Menu",
        secretItems: [
            "Quesarito (Burrito wrapped in a cheese quesadilla)",
            "Burrito Bowl Extra Everything (No charging for extras)",
            "Nachos (Chips with all burrito bowl toppings)",
            "Double-Wrapped Burrito (Two tortillas for extra strength)",
            "Fresh Cilantro (Ask for fresh cilantro topping)",
            "Taco Shell in Bowl (Crispy taco shell in your bowl)",
            "Extra Beans and Rice (Free extra portions)",
            "Single Taco (Order just one taco)",
            "Three-Pointer (Three items for cheaper price)",
            "Dragon Sauce (Mix of hot sauce and sour cream)"
        ]
    },
    {
        name: "Smoothie Stop",
        description: "Fresh Smoothie Hidden Menu",
        secretItems: [
            "White Gummy Bear (Peach juice + soy milk + raspberry sherbet)",
            "Pink Starburst (Lemonade + lime sherbet + strawberries)",
            "Skittles (Lime sherbet + strawberries + frozen yogurt)",
            "Sour Patch Kid (Lemonade + lime sherbet + raspberry + blueberry)",
            "Fruity Pebbles (Strawberry + lemon + banana + orange)",
            "Push-Up Pop (Orange + vanilla frozen yogurt + soymilk)",
            "Now & Later (Strawberry + lemonade + lime sherbet)",
            "Chocolate-Covered Strawberries (Chocolate + strawberries + frozen yogurt)",
            "PB&J (Strawberry + peanut butter + frozen yogurt)",
            "Red Gummy Bear (Raspberry + lime + strawberry)"
        ]
    }
];

// Replace restaurantLogos with generic icons
const restaurantIcons = {
    "Fast Burger Joint": "🍔",
    "Popular Coffee Chain": "☕",
    "West Coast Burger": "🍟",
    "Mexican Grill": "🌯",
    "Smoothie Stop": "🥤"
};

let currentSlide = 0;

// Library functionality
let myLibrary = [];

// Add at the top with other state variables
let currentUser = null;
let communityFinds = [];

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
                <div class="restaurant-icon">
                    <span class="icon-large">${restaurantIcons[restaurant.name]}</span>
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
            <div class="restaurant-icon">
                <span class="icon-large">${restaurantIcons[restaurant.name]}</span>
            </div>
            <h2>${restaurant.name}</h2>
            <p>${restaurant.description}</p>
            <div class="menu-notice">
                <p>⚠️ These are community-suggested combinations. 
                Availability, prices, and preparation may vary by location. 
                Please order politely and respect if items cannot be made.</p>
            </div>
        </div>
        <div class="menu-items">
            <h3>All Secret Menu Items:</h3>
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
    loadCommunityFinds();
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
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is already logged in
    const session = await getCurrentSession();
    if (session?.user) {
        currentUser = session.user;
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

        try {
            const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            console.log('Login successful:', { user, session });
            currentUser = user;
            hideAuthModal();
            showApp();
            showNotification('Welcome back!');
        } catch (error) {
            console.error('Login error:', error);
            showNotification(error.message || 'Login failed');
        }
    });

    // Handle signup
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const username = form.username.value;

        try {
            const { data: { user }, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username
                    }
                }
            });

            if (error) throw error;

            // Also insert into profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: user.id,
                        username,
                        email
                    }
                ]);

            if (profileError) throw profileError;

            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            hideAuthModal();
            showApp();
            showNotification('Account created successfully! Please check your email for verification.');
        } catch (error) {
            showNotification(error.message || 'Signup failed');
        }
    });

    // Handle logout
    document.querySelector('.profile-btn').addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            localStorage.removeItem('currentUser');
            currentUser = null;
            showAuthModal();
        }
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
        const previewItems = restaurant.secretItems.slice(0, 3);
        
        card.innerHTML = `
            <div class="restaurant-icon">
                <span class="icon-large">${restaurantIcons[restaurant.name]}</span>
            </div>
            <h2>${restaurant.name}</h2>
            <p>${restaurant.description}</p>
            <div class="secret-items">
                <h3>Featured Secret Items:</h3>
                <ul>
                    ${previewItems.map(item => `<li>${item.split('(')[0]}</li>`).join('')}
                </ul>
                <p class="more-items">+${restaurant.secretItems.length - 3} more items...</p>
            </div>
            <div class="card-buttons">
                <button class="view-btn" onclick="showMenu('${safeName}')">View Full Menu</button>
                <button class="add-btn" onclick="addToLibrary('${safeName}')">+ My List</button>
            </div>
        `;
        
        container.appendChild(card);
    });

    // Update the disclaimer HTML in createRestaurantCards
    const disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer';
    disclaimer.innerHTML = `
        <button class="close-disclaimer">×</button>
        <p>IMPORTANT DISCLAIMER:</p>
        <p>This app is not affiliated with, endorsed by, or connected to any restaurant chains. 
        All menu combinations are user-submitted suggestions and may not be available at all locations.
        Menu items, prices, and availability vary by location and are subject to change.
        These are unofficial menu suggestions collected from public sources and user experiences.</p>
        <p>Please be respectful when ordering and understand that restaurants may decline to make custom items.</p>
    `;

    // Add click handler for close button
    const closeButton = disclaimer.querySelector('.close-disclaimer');
    closeButton.addEventListener('click', () => {
        disclaimer.style.display = 'none';
    });

    document.body.appendChild(disclaimer);

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

// Add this function to handle community finds submission
async function submitCommunityFind(restaurantName, menuItem, imageFile) {
    if (!currentUser) {
        showNotification('Please login to share finds');
        return;
    }

    try {
        // First check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            throw new Error('No valid session found');
        }

        // Upload image first
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${session.user.id}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('proofimages')
            .upload(fileName, imageFile, { // Removed 'public/' prefix
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('proofimages')
            .getPublicUrl(fileName); // Removed 'public/' prefix

        // Insert the record
        const { data, error } = await supabase
            .from('community_finds')
            .insert([{
                user_id: session.user.id,
                restaurant: restaurantName,
                item_name: menuItem,
                image_url: publicUrl,
                description: 'Uploaded via app'
            }])
            .select();

        if (error) {
            console.error('Insert error:', error);
            throw error;
        }

        showNotification('Thanks for sharing your find!');
        loadCommunityFinds();
    } catch (error) {
        console.error('Operation failed:', error);
        showNotification(error.message || 'Failed to submit find');
    }
}

// Add this function to check the current user's session
async function getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Session error:', error);
        return null;
    }
    if (session) {
        console.log('Current session:', session);
    } else {
        console.log('No active session');
    }
    return session;
}

// Add function to load community finds
async function loadCommunityFinds() {
    try {
        const { data, error } = await supabase
            .from('community_finds')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        communityFinds = data;
        renderCommunityFinds();
    } catch (error) {
        console.error('Error loading community finds:', error);
    }
}

// Add function to render community finds
function renderCommunityFinds() {
    const container = document.getElementById('communityContent');
    container.innerHTML = `
        <h1>Community Finds</h1>
        <div class="community-form">
            <h3>Share Your Secret Find</h3>
            <div class="verification-guide">
                <h4>How to Verify Your Find:</h4>
                <ul>
                    <li>📍 Include the restaurant's storefront or sign in your photo</li>
                    <li>🧾 Show the receipt with the item (you can blur out personal info)</li>
                    <li>🍽️ Take a clear photo of the secret menu item</li>
                    <li>📱 Show the ordering process if possible</li>
                </ul>
            </div>
            <form id="findForm" class="find-form">
                <div class="form-group">
                    <label>Restaurant Name</label>
                    <input type="text" name="restaurant" required>
                    <small>Include full name and location (e.g., "West Coast Burger - Los Angeles")</small>
                </div>
                <div class="form-group">
                    <label>Menu Item</label>
                    <input type="text" name="menuItem" required>
                    <small>Include how you ordered it (e.g., "Ask for Animal Style Fries")</small>
                </div>
                <div class="form-group">
                    <label>Proof Image</label>
                    <input type="file" name="proofImage" accept="image/*" required>
                    <small>Include the restaurant sign/storefront in your photo</small>
                    <div class="file-preview"></div>
                </div>
                <button type="submit" class="submit-btn">Share Find</button>
            </form>
        </div>
        <div class="community-finds">
            ${communityFinds.map(find => `
                <div class="find-card">
                    <h3>${find.restaurant}</h3>
                    <h4>${find.item_name}</h4>
                    <div class="proof-image">
                        <img src="${find.image_url}" alt="Proof of ${find.item_name}">
                    </div>
                    <div class="find-meta">
                        <span>Shared by ${find.user_id}</span>
                        <span>${new Date(find.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Add form submission handler
    const form = document.getElementById('findForm');
    if (form) {
        // Add image preview handler
        const fileInput = form.querySelector('input[type="file"]');
        const preview = form.querySelector('.file-preview');
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });

        // Add form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            submitCommunityFind(
                formData.get('restaurant'),
                formData.get('menuItem'),
                formData.get('proofImage')
            );
            form.reset();
            preview.innerHTML = '';
        });
    }
} 