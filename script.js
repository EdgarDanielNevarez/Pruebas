// Productos del catálogo
const products = [
    { id: 1, name: 'Servicio de Torno Básico', category: 'torno', price: 500, unit: 'hora', emoji: '🔧', desc: 'Mecanizado de piezas básicas' },
    { id: 2, name: 'Torno de Precisión', category: 'torno', price: 800, unit: 'hora', emoji: '⚙️', desc: 'Alta precisión para componentes críticos' },
    { id: 3, name: 'Soldadura MIG/MAG', category: 'soldadura', price: 400, unit: 'hora', emoji: '🔥', desc: 'Soldadura con gas protector' },
    { id: 4, name: 'Soldadura TIG', category: 'soldadura', price: 600, unit: 'hora', emoji: '⚡', desc: 'Soldadura de alta calidad' },
    { id: 5, name: 'Reparación Hidráulica', category: 'hidraulica', price: 700, unit: 'servicio', emoji: '🔩', desc: 'Diagnóstico y reparación' },
    { id: 6, name: 'Mantenimiento Preventivo', category: 'hidraulica', price: 450, unit: 'servicio', emoji: '🛠️', desc: 'Mantenimiento programado' },
    { id: 7, name: 'Torno Portátil en Campo', category: 'campo', price: 1200, unit: 'servicio', emoji: '🚚', desc: 'Servicio móvil completo' },
    { id: 8, name: 'Emergencia 24h', category: 'campo', price: 1500, unit: 'servicio', emoji: '🚨', desc: 'Atención inmediata' },
];

// Estado global
let currentProposal = 1;
let currentPage = 'home';
let cart = [];
let selectedCategory = 'all';
let searchTerm = '';

// Cambiar entre propuestas
document.querySelectorAll('.proposal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const proposalNum = this.dataset.proposal;
        switchProposal(proposalNum);
    });
});

// Toggle mobile menu
function toggleMenu(proposal) {
    const nav = document.getElementById('nav-p' + proposal);
    nav.classList.toggle('active');
}

// Close menu when clicking on a link (mobile)
function closeMenu(proposal) {
    const nav = document.getElementById('nav-p' + proposal);
    if (window.innerWidth <= 768) {
        nav.classList.remove('active');
    }
}

function switchProposal(num) {
    // Ocultar todas las propuestas
    document.querySelectorAll('.proposal').forEach(p => p.classList.remove('active'));
    // Mostrar la propuesta seleccionada
    document.getElementById('proposal-' + num).classList.add('active');
    
    // Actualizar botones
    document.querySelectorAll('.proposal-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.proposal === num) {
            btn.classList.add('active');
        }
    });
    
    currentProposal = parseInt(num);
    currentPage = 'home';
    renderProducts(num);
}

// Mostrar diferentes páginas
function showPage(proposal, page) {
    const proposalEl = document.getElementById('proposal-' + proposal);
    
    // Cerrar menú móvil
    closeMenu(proposal);
    
    // Ocultar todas las páginas
    proposalEl.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
    
    // Mostrar la página seleccionada
    const pageEl = proposalEl.querySelector(`[data-page="${page}"]`);
    if (pageEl) {
        pageEl.style.display = 'block';
    }
    
    // Actualizar navegación activa
    proposalEl.querySelectorAll('nav a').forEach(a => {
        a.classList.remove('active');
        if (a.dataset.page === page) {
            a.classList.add('active');
        }
    });
    
    currentPage = page;
    
    // Si es la página de catálogo, renderizar productos
    if (page === 'catalog') {
        renderProducts(proposal);
        setupCatalogListeners(proposal);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Renderizar productos en el catálogo
function renderProducts(proposal) {
    const container = document.getElementById('products-p' + proposal);
    if (!container) return;
    
    const filtered = products.filter(p => {
        const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.desc.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });
    
    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-emoji">${product.emoji}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.desc}</p>
            <div class="product-price-row">
                <span class="product-price">$${product.price}</span>
                <span class="product-unit">por ${product.unit}</span>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id}, ${proposal})">
                🛒 AGREGAR AL CARRITO
            </button>
        </div>
    `).join('');
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">
                <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">⚠️</div>
                <p style="font-size: 1.2rem;">No se encontraron servicios con los criterios seleccionados</p>
            </div>
        `;
    }
}

// Configurar listeners del catálogo
function setupCatalogListeners(proposal) {
    // Búsqueda
    const searchInput = document.getElementById('search-p' + proposal);
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value;
            renderProducts(proposal);
        });
    }
    
    // Filtros
    const proposalEl = document.getElementById('proposal-' + proposal);
    const filterBtns = proposalEl.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.dataset.category;
            renderProducts(proposal);
        });
    });
}

// Agregar al carrito
function addToCart(productId, proposal) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({...product, quantity: 1});
        updateCartBadge(proposal);
        alert('✓ Producto agregado al carrito');
    }
}

// Actualizar badge del carrito
function updateCartBadge(proposal) {
    const cartIcon = document.getElementById('cart-p' + proposal);
    if (cart.length > 0) {
        cartIcon.style.display = 'flex';
        const badge = cartIcon.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = cart.length;
        }
    } else {
        cartIcon.style.display = 'none';
    }
}

// Sistema de facturación
let invoiceCounter = 4;

function createInvoice(proposal) {
    const client = document.getElementById('client-name').value;
    const amount = document.getElementById('amount').value;
    
    if (!client || !amount) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const invoiceId = 'INV-' + String(invoiceCounter).padStart(3, '0');
    
    const tbody = document.getElementById('invoices-tbody');
    const newRow = `
        <tr>
            <td>${invoiceId}</td>
            <td>${today}</td>
            <td>${client}</td>
            <td style="text-align: right; font-weight: 700;">$${parseFloat(amount).toLocaleString()}</td>
            <td style="text-align: center;"><span class="badge-pending">PENDIENTE</span></td>
            <td style="text-align: center;"><button class="btn-download">📥 PDF</button></td>
        </tr>
    `;
    
    tbody.insertAdjacentHTML('beforeend', newRow);
    
    // Limpiar formulario
    document.getElementById('client-name').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    
    // Actualizar contador
    invoiceCounter++;
    document.getElementById('total-invoices').textContent = invoiceCounter - 1;
    
    alert('✓ Factura creada exitosamente: ' + invoiceId);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar productos inicial
    renderProducts(1);
    
    // Hacer funciones globales
    window.showPage = showPage;
    window.addToCart = addToCart;
    window.createInvoice = createInvoice;
    window.toggleMenu = toggleMenu;
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.container-header') && window.innerWidth <= 768) {
            document.querySelectorAll('.nav-p1, .nav-p2').forEach(nav => {
                nav.classList.remove('active');
            });
        }
    });
});
