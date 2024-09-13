// Simulated product data
const products = [
    { id: 0, image: 'assests/Modern-models-of-laptop-on-transparent-background-PNG.png', title: 'Laptop', price: 49000, video: 'https://www.youtube.com/watch?v=-k3x_1pAs6Q' },
    { id: 1, image: 'assests/Realistic-digital-camera-vector-PNG.png', title: 'DSLR Camera', price: 30000, video: 'https://www.youtube.com/watch?v=Esk0ZKUPxbI' },
    { id: 2, image: 'assests/Samsung-glaxy-phone-isolated-on-transparent-background-PNG.png', title: 'Smart Phone', price: 20000, video: 'https://www.youtube.com/watch?v=QYaXJfPGEEk' },
    { id: 3, image: 'assests/Black-and-red-gaming-headphones-on-transparent-background-PNG.png', title: 'Head Phones', price: 5000, video: 'https://www.youtube.com/watch?v=0rteUqa6xCU' },
    { id: 4, image: 'assests/kindpng_6138253.png', title: 'Smart Watch', price: 7000, video: 'https://www.youtube.com/watch?v=KIb12hpkjRg' },
    { id: 5, image: 'assests/kindpng_7085209.png', title: 'VR 3D Glasses', price: 1500, video: 'https://www.youtube.com/embed/eYTT8A7COFs' }
];

let filteredProducts = [...products];
let cart = [];
let orderHistory = [];

function renderProducts(products) {
    document.getElementById('root').innerHTML = products.map((item, index) => {
        const { image, title, price, video } = item;
        const videoId = new URL(video).searchParams.get('v');
        return `
            <div class='box'>
                <div class='img-box'>
                    <img class='images' src='${image}' alt='${title}'>
                    <div class='video-thumbnail' onclick='showVideo("${video}")'>
                        <img src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg' alt='Play Video' class='thumbnail-image'>
                        <div class='play-button'></div>
                    </div>
                </div>
                <div class='bottom'>
                    <p>${title}</p>
                    <h2>₹ ${price.toLocaleString('en-IN')}.00</h2>
                    <button onclick='addtocart(${index}, event)'>Add to cart</button>
                </div>



 <div class='rating'>
                    ${[5, 4, 3, 2, 1].map(r => `
                        <span class='star' data-index='${index}' data-rating='${r}'>★</span>
                    `).join('')}
                </div>
                <div class='review'>
                    <textarea id='reviewInput${index}' placeholder='Write a review...'></textarea>
                    <button class='submit-review' data-index='${index}'>Submit Review</button>
                </div>
                <div id='reviews${index}' class='reviews'></div>

            </div>
        `;
    }).join('');



 // Attach event listeners for Add to Cart buttons
 document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        addToCart(index);
    });
});

// Attach event listeners for star rating
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        const rating = this.getAttribute('data-rating');
        rateProduct(index, rating);
    });
});

// Attach event listeners for review submission
document.querySelectorAll('.submit-review').forEach(button => {
    button.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        submitReview(index);
    });
});
}



function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery)
    );
    renderProducts(filteredProducts);
}

function filterProducts() {
    const filterValue = document.getElementById('filterSelect').value.toLowerCase();
    if (filterValue === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(filterValue)
        );
    }
    renderProducts(filteredProducts);
}

function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;

    if (sortValue === 'priceLowHigh') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'priceHighLow') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'titleAsc') {
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortValue === 'titleDesc') {
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderProducts(filteredProducts);
}

document.getElementById('searchInput').addEventListener('input', searchProducts);
document.getElementById('filterSelect').addEventListener('change', filterProducts);
document.getElementById('sortSelect').addEventListener('change', sortProducts);

// Initial render
renderProducts(filteredProducts);





function addtocart(index, event) {
    cart.push({ ...filteredProducts[index] });
    displayCart();

    // Add animation effect
    const button = event.target;
    button.classList.add('pulse');
    button.addEventListener('animationend', () => {
        button.classList.remove('pulse');
    });
}

function delElement(index) {
    cart.splice(index, 1);
    displayCart();
}

function displayCart() {
    let total = 0;
    document.getElementById("count").innerText = cart.length;

    if (cart.length === 0) {
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerText = "₹ 0.00";
    } else {
        document.getElementById("cartItem").innerHTML = cart.map((item, index) => {
            const { image, title, price } = item;
            total += price;
            return `
                <div class='cart-item'>
                    <div class='row-img'>
                        <img class='rowimg' src='${image}' alt='${title}'>
                    </div>
                    <p style='font-size:12px;'>${title}</p>
                    <h2 style='font-size: 15px;'>₹ ${price.toLocaleString('en-IN')}.00</h2>
                    <i class='fa-solid fa-trash' onclick='delElement(${index})'></i>
                </div>
            `;
        }).join('');
        document.getElementById("total").innerText = "₹ " + total.toLocaleString('en-IN') + ".00";
    }
}



function showVideo(videoUrl) {
    window.open(videoUrl, '_blank'); // Open the video URL in a new tab
}

function showOrderHistory() {
    const orderHistorySection = document.getElementById('orderHistory');
    const orderItems = document.getElementById('orderItems');

    orderItems.innerHTML = orderHistory.map(order => {
        const { items, orderDate, trackingNumber } = order;
        return items.map(item => {
            const { image, title, price } = item;
            return `
                <div class='order-item'>
                    <img src='${image}' alt='${title}'>
                    <div class='order-details'>
                        <h3>${title}</h3>
                        <p>Price: ₹ ${price.toLocaleString('en-IN')}.00</p>
                        <p>Order Date: ${orderDate}</p>
                        <p>Tracking Number: ${trackingNumber}</p>
                        <p class='order-status'>Status: Shipped</p> <!-- Example status -->
                    </div>
                </div>
            `;
        }).join('');
    }).join('');

    orderHistorySection.style.display = 'block'; // Show the order history section
}

document.getElementById('checkoutButton').addEventListener('click', function() {
    // Show the payment section first
    document.getElementById('paymentSection').style.display = 'block';
    document.getElementById('cartItem').style.display = 'none';
    document.getElementById('checkoutButton').style.display = 'none';
});

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Simulate payment completion
    setTimeout(() => {
        const currentDate = new Date().toLocaleDateString();
        const trackingNumber = 'TRK' + Math.floor(Math.random() * 1000000); // Simulated tracking number

        orderHistory.push({
            items: [...cart],
            orderDate: currentDate,
            trackingNumber: trackingNumber
        });

        document.getElementById('paymentSection').style.display = 'none'; // Hide payment section
        showOrderHistory(); // Show order history after payment is completed
        cart = []; // Clear cart after checkout
        displayCart();
    }, 1000); // Simulated delay for payment
});

// Initial render
renderProducts(filteredProducts);
displayCart();


