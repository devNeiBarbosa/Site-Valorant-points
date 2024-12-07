const listProducts = document.querySelector(".products-cards") // lista dos produtos
const infoCart = document.querySelector(".addCart-quantity") // carrinho de compras
const checkinProducts = document.querySelector(".card-item-checkin") // checkin
const mascaraCheckin = document.querySelector(".mascara-checkin") // mascara do checkin para esconde-lo

let myDiv = '';
menuProducts.forEach(product => {
    myDiv +=
    `
    <div class="product-vp">
        <img class="img-card" src="${product.src}" alt="Info VPs - R$320,00" width="220px">
        <p>${product.name}</p>
        <button class="button-value">
            <img class="cart-button" src="assets/cart.png" alt="image cart"width="16px"><b>${formatCurrency(product.price)}</b>
        </button>
    </div> 
    `
}); 

listProducts.innerHTML = myDiv;

let cartItems = []; // Array para armazenar os produtos no carrinho

// Seleciona todos os botões de adicionar ao carrinho após renderizar os produtos
document.querySelectorAll(".button-value").forEach(button => {
    button.addEventListener("click", addToCart)
});

let addProduct = 0;
let cartItem = [...itemCart]; // array para armazenar os produtos adicionados ao carrinho

function addToCart(event) {
    document.getElementById("loading").classList.remove("hidden"); // Exibe o loading imediatamente
    addProduct++;
    setTimeout(() => { // Gerando atraso apenas na mudança da quantidades de itens no carrinho, 0 pra 1 e assim sucessivamente
        infoCart.innerHTML = addProduct; // altera o valor do cart, de acordo com a quantidade de itens que eu selecionar
        document.getElementById("loading").classList.add("hidden");  // Oculta o loading depois de executar toda a função
    }, 1000); // Usa setTimeout apenas para ocultar o loading após 1 segundo

    const indice = Array.from(document.querySelectorAll(".button-value")).indexOf(event.currentTarget); // Obtém o índice do botão clicado
    const selectedProduct = itemCart[indice]; // Obtém o produto correspondente

    cartItems.push(selectedProduct); // Adiciona o produto ao carrinho
    viewProductCheckin(cartItems); // Exibe os produtos no checkin
}

function viewProductCheckin(productsArray) {
    let myCheckin = '';
    productsArray.forEach(product => {
        myCheckin +=
            `
        <div class="container-checkin">
            <img class="img-checkin" src="${product.src}" alt="imagem card valorant points R$320,00">
            <p class="info-product-checkin">${product.name}</p>

            <p class="value">R$ ${formatCurrency(product.price)}</p>
            <button class="delet-icon-checkin"><img src="assets/lixo icon.png" alt="delet-icon" width="18px"></button>

            <select class="select-quantity" name="quantidade de itens" id="select-quantity-id">
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
        `
    }); 
    
    checkinProducts.innerHTML = myCheckin;

    // Verifica se a div finish-checkout já existe
    let finishCheckoutDiv = document.querySelector(".finish-checkout");
    if (!finishCheckoutDiv) {
        finishCheckoutDiv = document.createElement("div");
        finishCheckoutDiv.className = "finish-checkout";
        checkinProducts.appendChild(finishCheckoutDiv);
    }
    // Chama a função para atualizar o total
    updateTotalValue();

    // Adiciona o evento de mudança para cada <select> da quantidade
    document.querySelectorAll(".select-quantity").forEach((select, index) => {
        select.addEventListener("change", () => updateTotalValue());
    });

    // Adiciona o evento de clique ao botão de deletar
    document.querySelectorAll(".delet-icon-checkin").forEach(button => {
        button.addEventListener("click", deletProductFromCheckin);
    });
}

// Função para atualizar o total ao multiplicar o valor pela quantidade selecionada
function updateTotalValue() {
    let total = 0;

    setTimeout(() => {
        document.querySelectorAll(".container-checkin").forEach((container, index) => {
            
            const quantity = parseInt(container.querySelector(".select-quantity").value); // Obtém a quantidade selecionada
            const price = cartItems[index].price; // Obtém o preço do produto
            const itemTotal = price * quantity; // Calcula o total do item
            total += itemTotal; // Adiciona ao total
           
            // Atualiza o valor do produto no <p class="value">
            const valueElement = container.querySelector(".value");
            valueElement.innerHTML = `<b>${formatCurrency(itemTotal)}</b>`;
            // Oculta o loading depois de atualizar o último valor 
        });
       
        // Atualiza o valor total na div finish-checkout
        const finishCheckoutDiv = document.querySelector(".finish-checkout");
        finishCheckoutDiv.innerHTML = `
            <p class="finish-value">Total: ${formatCurrency(total)}</p> 
            <button><img class="finish-cart" src="assets/cart.png" alt="carrinho de compra" width="16px">FINALIZAR COMPRA</button>
        `;  
    }, 400);
}


function deletProductFromCheckin(event) {

    document.getElementById("loading").classList.remove("hidden"); // Exibe o loading imediatamente
    const deleteButton = event.target.closest(".delet-icon-checkin");
    if (deleteButton) {
        const containerCheckin = deleteButton.closest(".container-checkin");
        const itemIndex = Array.from(checkinProducts.children).indexOf(containerCheckin);

        setTimeout(() => { // Gerando atraso apenas no memento de excluir os itens do carrinho
            if (itemIndex !== -1) {
                cartItems.splice(itemIndex, 1); // Remove o item específico do array
                addProduct--; // Reduz o contador do carrinho
                infoCart.innerHTML = addProduct; // Atualiza a quantidade no carrinho

                document.getElementById("loading").classList.add("hidden");  // Oculta o loading depois de executar toda a função
                
                if (cartItems.length === 0) { // Verifica se o carrinho está vazio
                    addProduct = 0; // Reseta o contador do carrinho

                    // Remove a div `finish-checkout` do DOM
                    const finishCheckoutDiv = document.querySelector(".finish-checkout");
                    if (finishCheckoutDiv) {
                        finishCheckoutDiv.remove();
                    }
                    
                    hiddenCheckin(); // Oculta o view products
                }
                // Atualiza a exibição do checkin
                viewProductCheckin(cartItems);
            }
        }, 1000); // Usa setTimeout apenas para ocultar o loading após 1 segundo
    }
}

// funções para aparecer a seleção dos meus itens dentro do carrinho
function visibleCheckin() {
    checkinProducts.style.visibility = "visible"
    mascaraCheckin.style.visibility = "visible"
}; // abaixo estão os eventos de click para abrir o checkin
infoCart.addEventListener("click", visibleCheckin)
mascaraCheckin.addEventListener("click", visibleCheckin)

function hiddenCheckin() {
    checkinProducts.style.visibility = "hidden"
    mascaraCheckin.style.visibility = "hidden"
}; // abaixo está o evento de click para esconder o checkin
mascaraCheckin.addEventListener("click", hiddenCheckin)

function formatCurrency(value) { // irei usar o formatCurrency(item a formatar) exemplo: <p class="finish-value">Total: ${formatCurrency(total)}</p>
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}
