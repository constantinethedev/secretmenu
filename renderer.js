// Sample data
const restaurants = [
    {
        name: "McDonald's",
        description: "Secret Menu Masters",
        secretItems: [
            "Land, Sea & Air Burger (Big Mac + McChicken + Filet-O-Fish)",
            "Monster Mac (Big Mac with 8 patties)",
            "McGangBang (McChicken inside a McDouble)",
            "Big McChicken (Big Mac using chicken patties as buns)",
            "Neapolitan Shake (Chocolate + Vanilla + Strawberry)",
            "McKinley Mac (Big Mac with Quarter Pounder patties)",
            "Apple Pie McFlurry (McFlurry with apple pie pieces)",
            "Hash Brown McMuffin (McMuffin with hash brown inside)",
            "Grilled Cheese (Bun with cheese, grilled)",
            "McCrepe (Hotcakes wrapped around fruit & yogurt parfait)"
        ]
    },
    {
        name: "Starbucks",
        description: "Hidden Drink Specialists",
        secretItems: [
            "Purple Drink (Passion Iced Tea with soy milk, vanilla, and blackberries)",
            "Nutella Frappuccino (Hazelnut + Mocha + Coffee Frappuccino)",
            "Cotton Candy Frappuccino (Vanilla Bean Frappuccino + Raspberry syrup)",
            "Butterbeer Frappuccino (Cream Frappuccino + Caramel + Toffee Nut + Caramel Drizzle)",
            "Medicine Ball (Jade Citrus Mint + Peach Tranquility Tea + Honey + Lemonade)",
            "Captain Crunch Frappuccino (Strawberries & Cream + Caramel + Hazelnut + Toffee Nut)",
            "Twix Frappuccino (Caramel Frappuccino + Caramel + Mocha + Java Chips + Hazelnut)",
            "Orange Drink (Orange Mango Juice + Vanilla Bean Powder + Coconut Milk)",
            "Baby Yoda Frappuccino (Matcha Green Tea + Caramel Drizzle)",
            "Cookies & Cream Frappuccino (Double Chocolate Chip + White Mocha)"
        ]
    },
    {
        name: "In-N-Out",
        description: "Legendary Secret Menu",
        secretItems: [
            "Animal Style Fries (Cheese, grilled onions, spread)",
            "4x4 Burger (Four patties, four cheese slices)",
            "Protein Style (Lettuce wrap instead of bun)",
            "Flying Dutchman (Two patties + cheese, no bun)",
            "3x3 (Triple-triple, three patties + cheese)",
            "Animal Style Burger (Mustard cooked patty + extras)",
            "Chopped Chilis (Add spicy yellow peppers)",
            "Roadkill Fries (Animal fries + burger patty on top)",
            "Double Meat (Two patties, no cheese)",
            "Grilled Cheese Animal Style (No meat, extra fixings)"
        ]
    },
    {
        name: "Chipotle",
        description: "Hidden Mexican Treasures",
        secretItems: [
            "Quesarito (Burrito wrapped in a cheese quesadilla)",
            "Burrito Bowl Extra Everything (No charging for extras)",
            "Nachos (Chips with all burrito bowl toppings)",
            "Double-Wrapped Burrito (Two tortillas, extra filling)",
            "Fresh Cilantro (Ask for extra fresh cilantro)",
            "Grilled Veggies (Ask for fajita veggies grilled extra)",
            "Extra Shells (Free taco shells on the side)",
            "Three-Pointer (Three ingredients for cheaper price)",
            "Dragon Sauce (Mix of hot salsa and sour cream)",
            "Single Taco (Order individual tacos instead of three)"
        ]
    },
    {
        name: "Jamba Juice",
        description: "Secret Smoothie Society",
        secretItems: [
            "White Gummy Bear (Peach juice + soy milk + raspberry sherbet + lime sherbet)",
            "Pink Starburst (Lemonade + lime sherbet + strawberries + vanilla)",
            "Skittles (Lime sherbet + strawberries + frozen yogurt)",
            "Sour Patch Kid (Lemonade + lime sherbet + blueberries + raspberry)",
            "Fruity Pebbles (Strawberries + banana + orange juice + vanilla)",
            "Push-Up Pop (Orange juice + vanilla + orange sherbet)",
            "Now & Later (Strawberries + orange juice + lime sherbet)",
            "Butterfinger (Carrot juice + frozen yogurt + peanut butter)",
            "Chocolate-Covered Strawberries (Chocolate + strawberries + frozen yogurt)",
            "Berry Rainbow (Mixed berries + rainbow sherbet + apple juice)"
        ]
    }
];

let currentSlide = 0;
let myLibrary = [];
let isAnimating = false; // Prevent multiple clicks during animation
let currentUser = null;

// Add these at the top with your other data
const trendingItems = [
    {
        restaurant: "McDonald's",
        item: "Land, Sea & Air Burger",
        description: "The ultimate mashup burger",
        votes: 1234,
        isVerified: true
    },
    {
        restaurant: "Starbucks",
        item: "Butterbeer Frappuccino",
        description: "Harry Potter fans' favorite",
        votes: 987,
        isVerified: true
    },
    // Add more trending items
];

// Add this near the top of the file with other data
const restaurantLogos = {
    "McDonald's": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png",
    "Starbucks": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
    "In-N-Out": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/In-N-Out_Burger_Logo.svg/800px-In-N-Out_Burger_Logo.svg.png",
    "Chipotle": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1200px-Chipotle_Mexican_Grill_logo.svg.png",
    "Jamba Juice": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Jamba_2019.svg/640px-Jamba_2019.svg.png"
};

// Import supabase client
const { supabase } = require('./supabaseConfig.js');

// Add these functions for handling community posts
async function createCommunityPost(postData) {
    try {
        const { data, error } = await supabase
            .from('community_finds')
            .insert([{
                restaurant: postData.restaurant,
                item_name: postData.itemName,
                description: postData.description,
                image_url: postData.image_url,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Database error:', error);
            throw new Error(error.message);
        }

        await renderCommunityPosts();
        return data;
    } catch (error) {
        console.error('Error in createCommunityPost:', error);
        throw new Error('Failed to save post to database: ' + error.message);
    }
}

async function renderCommunityPosts(filter = 'all') {
    const communityGrid = document.querySelector('.community-grid');
    communityGrid.innerHTML = '<div class="loading">Loading posts...</div>';

    try {
        let query = supabase.from('community_finds').select('*');
        
        if (filter === 'new') {
            query = query.order('created_at', { ascending: false }).limit(10);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (!data || data.length === 0) {
            communityGrid.innerHTML = '<div class="no-posts">No posts found</div>';
            return;
        }

        communityGrid.innerHTML = data.map(post => `
            <div class="community-post">
                <img src="${post.image_url}" alt="${post.item_name}">
                <h3>${post.item_name}</h3>
                <p class="restaurant">${post.restaurant}</p>
                <p class="description">${post.description}</p>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading posts:', error);
        communityGrid.innerHTML = '<div class="error">Failed to load posts. Please try again.</div>';
    }
}

function createRestaurantCards() {
    const container = document.querySelector('.featured-cards');
    container.innerHTML = '';
    
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        const safeName = restaurant.name.replace(/'/g, "\\'");
        const previewItems = restaurant.secretItems.slice(0, 3);
        
        card.innerHTML = `
            <div class="restaurant-logo">
                <img src="${restaurantLogos[restaurant.name]}" alt="${restaurant.name} logo">
            </div>
            <h2>${restaurant.name}</h2>
            <p>${restaurant.description}</p>
            <div class="secret-items">
                <h3>Secret Menu Items:</h3>
                <ul>
                    ${previewItems.map(item => `<li>${item.split('(')[0]}</li>`).join('')}
                </ul>
            </div>
            <div class="card-buttons">
                <button class="play-btn" onclick="showMenu('${safeName}')">View Menu</button>
                <button class="add-btn" onclick="addToLibrary('${safeName}')">+ My List</button>
            </div>
        `;
        
        container.appendChild(card);
    });

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
    const maxSlides = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= restaurants.length - maxSlides;
}

function nextSlide() {
    if (isAnimating) return;
    const maxSlides = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    if (currentSlide >= restaurants.length - maxSlides) return;
    
    isAnimating = true;
    currentSlide++;
    updateCarouselPosition();
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

function prevSlide() {
    if (isAnimating || currentSlide === 0) return;
    
    isAnimating = true;
    currentSlide--;
    updateCarouselPosition();
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Add resize handler
window.addEventListener('resize', () => {
    updateCarouselPosition();
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel-container');
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    // Load library from localStorage if available
    const savedLibrary = localStorage.getItem('myLibrary');
    if (savedLibrary) {
        myLibrary = JSON.parse(savedLibrary);
    }

    createRestaurantCards();
    showMainContent();

    // Add event listeners for search
    document.querySelector('.search-btn').addEventListener('click', () => {
        const searchModal = document.getElementById('searchModal');
        searchModal.style.display = 'flex';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const searchModal = document.getElementById('searchModal');
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
        }
    });

    // Community filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCommunityPosts(e.target.dataset.filter);
        });
    });

    // New find modal
    const newFindModal = document.getElementById('newFindModal');
    const addFindBtn = document.querySelector('.add-find-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    addFindBtn.addEventListener('click', () => {
        populateRestaurantSelect();
        newFindModal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        newFindModal.style.display = 'none';
        document.getElementById('newFindForm').reset();
        document.querySelector('.image-preview').innerHTML = '';
    });

    // Handle image preview
    const imageInput = document.querySelector('input[name="photo"]');
    const imagePreview = document.querySelector('.image-preview');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    document.getElementById('newFindForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';

            // Get restaurant name
            const isCustomRestaurant = formData.get('other-restaurant') === 'on';
            const restaurantName = isCustomRestaurant ? 
                formData.get('custom-restaurant') : 
                formData.get('restaurant');

            // Get and validate file
            const file = formData.get('photo');
            if (!file || !(file instanceof File)) {
                throw new Error('Please select an image');
            }

            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;

            // Upload file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    contentType: file.type
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('community-images')
                .getPublicUrl(fileName);

            // Create the post
            const post = {
                restaurant: restaurantName,
                itemName: formData.get('itemName'),
                description: formData.get('description'),
                image_url: publicUrl
            };

            await createCommunityPost(post);
            
            // Success handling
            form.reset();
            document.querySelector('.image-preview').innerHTML = '';
            document.getElementById('newFindModal').style.display = 'none';
            showNotification('Your find has been shared!');

        } catch (error) {
            console.error('Upload error:', error);
            showNotification(error.message || 'Failed to share your find. Please try again.');
        } finally {
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Share Find';
        }
    });

    // Add this to your DOMContentLoaded event listener
    document.querySelector('input[name="other-restaurant"]').addEventListener('change', (e) => {
        const customRestaurantDiv = document.querySelector('.custom-restaurant');
        const restaurantSelect = document.querySelector('select[name="restaurant"]');
        const customRestaurantInput = document.querySelector('input[name="custom-restaurant"]');
        
        if (e.target.checked) {
            customRestaurantDiv.style.display = 'block';
            restaurantSelect.disabled = true;
            restaurantSelect.required = false;
            customRestaurantInput.required = true;
        } else {
            customRestaurantDiv.style.display = 'none';
            restaurantSelect.disabled = false;
            restaurantSelect.required = true;
            customRestaurantInput.required = false;
        }
    });

    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const forms = document.querySelectorAll('.auth-form');
            forms.forEach(form => form.style.display = 'none');
            
            const formToShow = tab.dataset.tab === 'login' ? 'loginForm' : 'signupForm';
            document.getElementById(formToShow).style.display = 'flex';
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            currentUser = data.user;
            showApp();
            updateProfileUI();
        } catch (error) {
            showNotification(error.message);
        }
    });

    // Signup form
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const username = form.username.value;

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username
                    }
                }
            });

            if (error) throw error;

            showNotification('Account created! Please check your email to verify your account.');
            
            // Switch to login tab
            document.querySelector('.auth-tab[data-tab="login"]').click();
        } catch (error) {
            showNotification(error.message);
        }
    });

    // Logout
    document.addEventListener('click', (e) => {
        if (e.target.matches('.logout-btn')) {
            supabase.auth.signOut().then(() => {
                currentUser = null;
                showAuthModal();
                document.querySelector('.profile-btn').textContent = '👤';
            });
        }
    });

    // Check auth status on load
    checkAuth();
});

function handleSwipe() {
    const swipeThreshold = 50; // minimum distance for a swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) < swipeThreshold) return; // Ignore small movements
    
    if (diff > 0) {
        // Swipe left
        nextSlide();
    } else {
        // Swipe right
        prevSlide();
    }
}

function showMainContent() {
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('libraryContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'none';
    document.getElementById('communityContent').style.display = 'none';
    updateNavigation('main');
}

function showLibrary() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('libraryContent').style.display = 'block';
    document.getElementById('menuContent').style.display = 'none';
    updateNavigation('library');
    renderLibrary();
}

function showMenu(restaurantName) {
    const restaurant = restaurants.find(r => r.name === restaurantName);
    if (!restaurant) return;

    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('libraryContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'block';

    const menuDetails = document.querySelector('.menu-details');
    menuDetails.innerHTML = `
        <div class="restaurant-header">
            <h1>${restaurant.name}</h1>
            <p>${restaurant.description}</p>
        </div>
        <div class="secret-menu-full">
            <h2>Complete Secret Menu</h2>
            <div class="menu-items">
                ${restaurant.secretItems.map(item => `
                    <div class="menu-item">
                        <h3>${item.split('(')[0].trim()}</h3>
                        <p>${item.match(/\((.*?)\)/)?.[1] || ''}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function addToLibrary(restaurantName) {
    if (!myLibrary.includes(restaurantName)) {
        myLibrary.push(restaurantName);
        showNotification(`Added ${restaurantName} to your library!`);
        // Optional: Save to localStorage
        localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    }
}

function renderLibrary() {
    const libraryCards = document.querySelector('.library-cards');
    libraryCards.innerHTML = '';

    myLibrary.forEach(restaurantName => {
        const restaurant = restaurants.find(r => r.name === restaurantName);
        if (restaurant) {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            const previewItems = restaurant.secretItems.slice(0, 3);
            
            card.innerHTML = `
                <h2>${restaurant.name}</h2>
                <p>${restaurant.description}</p>
                <div class="secret-items">
                    <h3>Secret Menu Items:</h3>
                    <ul>
                        ${previewItems.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="card-buttons">
                    <button class="play-btn" onclick="showMenu('${restaurant.name}')">View Menu</button>
                    <button class="remove-btn" onclick="removeFromLibrary('${restaurant.name}')">Remove</button>
                </div>
            `;
            libraryCards.appendChild(card);
        }
    });
}

function removeFromLibrary(restaurantName) {
    myLibrary = myLibrary.filter(name => name !== restaurantName);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    renderLibrary();
    showNotification(`Removed ${restaurantName} from your library`);
}

function updateNavigation(active) {
    document.querySelectorAll('.bottom-nav a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.bottom-nav a[onclick*="${active}"]`);
    if (activeLink) activeLink.classList.add('active');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showCommunity() {
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('libraryContent').style.display = 'none';
    document.getElementById('menuContent').style.display = 'none';
    document.getElementById('communityContent').style.display = 'block';
    updateNavigation('community');
    renderCommunityPosts();
}

// Add this function to populate restaurant options
function populateRestaurantSelect() {
    const select = document.querySelector('select[name="restaurant"]');
    select.innerHTML = '<option value="">Select Restaurant</option>';
    
    restaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant.name;
        option.textContent = restaurant.name;
        select.appendChild(option);
    });
}

// Add these auth functions
async function checkAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
        currentUser = user;
        showApp();
        updateProfileUI();
    } else {
        showAuthModal();
    }
}

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showApp() {
    hideAuthModal();
    showMainContent();
}

function updateProfileUI() {
    const profileBtn = document.querySelector('.profile-btn');
    profileBtn.innerHTML = `
        <div class="profile-section">
            <span class="profile-name">${currentUser.email.split('@')[0]}</span>
            <button class="logout-btn">Logout</button>
        </div>
    `;
} 