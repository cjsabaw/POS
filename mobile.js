const supabaseUrl = 'https://onblqmfikivwbbbghfcr.supabase.co';
const supabaseKey = 'sb_publishable_scu-Qu2IxDvRLgGpLOI6UA_4JmRfxmh';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Your product list (Keep this synced with your main JS)
const products = [
    { id: 1, name: 'Oishi', price: 10.00, image: 'products/oishi.png', barcode: '100' },
    { id: 2, name: 'Yakult', price: 12.00, image: 'products/yakult.jpg', barcode: '101' },
    { id: 3, name: 'Century Tuna', price: 30.00, image: 'products/centuryTuna.png', barcode: '102' },
    { id: 4, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '103' },
    { id: 5, name: 'Happy', price: 2.00, image: 'products/happy.webp', barcode: '104' },
    { id: 6, name: 'Ding Dong', price: 2.00, image: 'products/dingdong.jpg', barcode: '105' },
    { id: 7, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '106' },
    { id: 8, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '107' },
    { id: 9, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '108' },
    { id: 10, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '109' },
    { id: 11, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '110' },
    { id: 12, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '111' },
    { id: 13, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '112' },
    { id: 14, name: 'Lucky Me Cup noodles', price: 16.00, image: 'products/luckyMeCup.png', barcode: '113' }
];

let cart = [];

// --- SCANNER LOGIC ---
function onScanSuccess(decodedText, decodedResult) {
    // decodedText is the barcode number found by the camera
    const product = products.find(p => p.barcode === decodedText);
    
    if (product) {
        addToCart(product);
        // Beep or vibrate for feedback
        if (navigator.vibrate) navigator.vibrate(100); 
        alert(`Added: ${product.name}`);
    }
}

const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
    { facingMode: "environment" }, // Use back camera
    { fps: 10, qrbox: { width: 250, height: 150 } },
    onScanSuccess
);

// --- CART LOGIC ---
function addToCart(product) {
    cart.push(product);
    updateUI();
}

function updateUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    let subtotal = 0;

    container.innerHTML = cart.map(item => {
        subtotal += item.price;
        return `<div class="cart-item"><span>${item.name}</span> ₱${item.price}</div>`;
    }).join('');

    const total = subtotal + (subtotal * 0.08);
    totalEl.innerText = `₱${total.toFixed(2)}`;
}

async function checkout() {
    if (cart.length === 0) return alert("Bag is empty!");

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.08;
    
    const { error } = await supabaseClient.from('transactions').insert([{
        items: cart,
        subtotal: subtotal,
        tax: tax,
        total: subtotal + tax
    }]);

    if (!error) {
        alert("Transaction Recorded on PC!");
        cart = [];
        updateUI();
    } else {
        alert("Error: " + error.message);
    }
}