const listaProdutos = [
    { nome: "Amaciante", preco: "15,90", img: "amaciante.webp", categoria: "Produtos Variados" },
    { nome: "Amendoim", preco: "5,50", img: "amendoin.webp", categoria: "Alimentos" },
    { nome: "Arroz 5kg", preco: "28,90", img: "arroz.webp", categoria: "Alimentos" },
    { nome: "Cerveja Lata", preco: "4,50", img: "cerveja.webp", categoria: "Cervejas e Destilados" },
    { nome: "Detergente", preco: "2,20", img: "detergente.jpg", categoria: "Produtos Variados" },
    { nome: "Frango (kg)", preco: "18,90", img: "frango.webp", categoria: "Carnes e Churrasco" },
    { nome: "Lava Roupas", preco: "12,40", img: "lava_roupas.jpg", categoria: "Produtos Variados" },
    { nome: "Óleo de Soja", preco: "7,30", img: "oleo.webp", categoria: "Alimentos" }
];

let carrinho = [];

/* Renderiza os cards de produtos na vitrine */
function renderizarProdutos(lista) {
    const vitrine = document.getElementById('vitrine');
    
    if (lista.length === 0) {
        vitrine.innerHTML = "<p style='color: #802020; font-weight: bold;'>Nenhum item encontrado.</p>";
        return;
    }

    vitrine.innerHTML = lista.map((prod) => `
        <div class="product-card">
            <img src="${prod.img}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <div class="price-box">R$ ${prod.preco}</div>
            <button onclick="adicionarAoCarrinho('${prod.nome}', '${prod.preco}')" class="buy-link">Adicionar ao Carrinho</button>
        </div>
    `).join('');
}

/* Filtra produtos por texto ou categoria */
function aplicarFiltro(termo) {
    const busca = termo.toLowerCase().trim();
    let categoriaAlvo = busca;

    if (busca === "bebidas") categoriaAlvo = "cervejas e destilados";
    if (busca === "casa") categoriaAlvo = "produtos variados";

    const filtrados = listaProdutos.filter(p => 
        p.categoria.toLowerCase().includes(categoriaAlvo) || 
        p.nome.toLowerCase().includes(busca)
    );

    renderizarProdutos(filtrados);
}

/* Gerenciamento do Carrinho */
function adicionarAoCarrinho(nome, preco) {
    const valor = parseFloat(preco.replace(',', '.'));
    carrinho.push({ nome, valor });
    atualizarCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');

    cartItems.innerHTML = carrinho.map((item, index) => `
        <div class="cart-item">
            <span>${item.nome}</span>
            <span>R$ ${item.valor.toFixed(2).replace('.', ',')}</span>
            <button onclick="removerDoCarrinho(${index})" style="background:none; border:none; color:red; cursor:pointer;">X</button>
        </div>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + item.valor, 0);
    totalPrice.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartCount.innerText = carrinho.length;
}

/* Inicialização e Eventos */
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(listaProdutos);

    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            aplicarFiltro(card.querySelector('p').innerText.replace('\n', ' '));
        });
    });

    document.querySelectorAll('.category-menu li').forEach(li => {
        if (!li.classList.contains('menu-title')) {
            li.addEventListener('click', () => aplicarFiltro(li.innerText));
        }
    });

    document.querySelector('.search-bar').addEventListener('input', (e) => {
        aplicarFiltro(e.target.value);
    });

    document.getElementById('cart-float-btn').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('open');
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('open');
    });
});

/* Envio do pedido para o WhatsApp */
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const itensTexto = carrinho.map(item => `- ${item.nome}: R$ ${item.valor.toFixed(2).replace('.', ',')}`).join('%0A');
    const totalTexto = document.getElementById('total-price').innerText;
    const numeroWhatsApp = "5547984202397";
    
    const mensagemFinal = `Olá! Gostaria de fazer um pedido:%0A%0A${itensTexto}%0A%0A*Total: ${totalTexto}*`;
    window.open(`https://wa.me{numeroWhatsApp}?text=${mensagemFinal}`, '_blank');
});