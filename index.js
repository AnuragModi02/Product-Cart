import products from "./data.js";

const cardContainer = document.getElementsByClassName('card-container')[0];

let selectedItems = [];

products.forEach(product => {
    selectedItems.push({ 'productName' : product.name, 'quantity' : 0 });

    const cardDiv = document.createElement('div');
    cardDiv.className = "card";
    const addToCardId = `add-to-cart-${product.name}`;
    cardDiv.innerHTML = 
    `
    <img src="${product.image.desktop}"></img>
        <div id='${addToCardId}' class="add-to-cart">
            <img></img>
            <p>Add to Cart</p>
            <div class="allow-add hide">
                <img class="decrement">
                <p> ${selectedItems.find(x => x.productName == product.name).quantity} </p>
                <img class="increment">
            </div>
        </div>
        <div class="card-details">
            <p class="category"> ${product.category}</p>
            <p class="name"> ${product.name} </p>
            <p class="price">$${product.price}</p>
        </div>
    `
    cardDiv.id = product.name;

    cardContainer.appendChild(cardDiv);

    const addToCartElement = document.getElementById(`${addToCardId}`);
    addToCartElement.addEventListener('click', function(){
        enableAddToCart(addToCardId);
    })

    attachEventHandlersOnIncrementAndDecrementIcons(addToCardId, product.name);
});

function enableAddToCart(addToCardId){
    const addToCardElement = document.getElementById(addToCardId);    
    const imgElement = addToCardElement.getElementsByTagName('img')[0];
    const paragrahElement = addToCardElement.getElementsByTagName('p')[0];
    const allowAddElement = addToCardElement.getElementsByClassName('allow-add')[0];

    imgElement.classList.add('hide');
    paragrahElement.classList.add('hide');
    allowAddElement.classList.remove('hide');
}

function removeAddToCart(addToCardId)
{
    const addToCardElement = document.getElementById(addToCardId);    
    const imgElement = addToCardElement.getElementsByTagName('img')[0];
    const paragrahElement = addToCardElement.getElementsByTagName('p')[0];
    const allowAddElement = addToCardElement.getElementsByClassName('allow-add')[0];

    imgElement.classList.remove('hide');
    paragrahElement.classList.remove('hide');
    allowAddElement.classList.add('hide');
}

function attachEventHandlersOnIncrementAndDecrementIcons(addToCardId, productName){
    const addToCardElement = document.getElementById(addToCardId);

    const allowAddElement = addToCardElement.getElementsByClassName('allow-add')[0];
    const decrementElement = allowAddElement.getElementsByClassName('decrement')[0];
    const incrementElement = allowAddElement.getElementsByClassName('increment')[0];

    const quantity = allowAddElement.getElementsByTagName('p')[0];
    const cartHeaderElement =  document.getElementsByClassName('total-cart-items')[0].getElementsByTagName('span')[0];

    decrementElement.addEventListener('click', function(event){
        let selectedItem = selectedItems.find(x => x.productName == productName);

        if(selectedItem.quantity > 0)
        {
            selectedItem.quantity -= 1;
            quantity.innerHTML = selectedItem.quantity;          
        }  

        if(selectedItem.quantity == 0)
        {
            event.stopPropagation();
            removeAddToCart(addToCardId);
        }

        cartHeaderElement.innerHTML = selectedItems.filter(x => x.quantity > 0).length;
        showSelectedProducts(selectedItems);
    })

    incrementElement.addEventListener('click', function(){
    
        var selectedItem = selectedItems.find(x => x.productName == productName);        
        selectedItem.quantity += 1;      
        quantity.innerHTML = selectedItem.quantity;     
        
        cartHeaderElement.innerHTML = selectedItems.filter(x => x.quantity > 0).length;
        showSelectedProducts(selectedItems);
    })
}

function showSelectedProducts()
{
    const isAnyProductSelected = selectedItems.some(x => x.quantity > 0);

    const cartImage = document.getElementById('cart-image');
    const cartText = document.getElementById('cart-text');
    const selectedItemElement = document.getElementById('selected-items');
    
    if (isAnyProductSelected) {
        cartImage.classList.add("hide");
        cartText.classList.add("hide");

        if(selectedItemElement)
        {
            selectedItemElement.classList.remove("hide");
        }
    } else {
        cartImage.classList.remove("hide");
        cartText.classList.remove("hide");

        if(selectedItemElement)
        {
            selectedItemElement.classList.add("hide");
        }
    }

    selectedItems.forEach(selectedItem => {

        const element = document.getElementById(`selected-item-details-${selectedItem.productName}`);
        let product = products.find(x => x.name == selectedItem.productName);

        if(selectedItem.quantity > 0 && element == null)
        {
            const selectedItemDiv = document.createElement('div');
            selectedItemDiv.className = 'selected-item-details';
            selectedItemDiv.id = `selected-item-details-${selectedItem.productName}`;
                    
            const selectedItemDescription = document.createElement('p');
            const selectedItemQuantity = document.createElement('p');
            const selectedItemPrice = document.createElement('p');
            const selectedItemTotal = document.createElement('p');
    
            selectedItemDescription.className = "selected-items-description";
            selectedItemDescription.innerHTML = product.name;

            const productMeta = document.createElement('div');
            productMeta.className = "meta";

            selectedItemQuantity.className = "selected-items-quantity";
            selectedItemQuantity.innerHTML = `${selectedItem.quantity}x`;;
            selectedItemPrice.className = "selected-items-price";
            selectedItemPrice.innerHTML = `@ $${product.price}`;
            selectedItemTotal.className = "selected-items-total";
            selectedItemTotal.innerHTML = `$${selectedItem.quantity * product.price}`;
           
            selectedItemDiv.appendChild(selectedItemDescription);
            
            productMeta.appendChild(selectedItemQuantity);
            productMeta.appendChild(selectedItemPrice);
            productMeta.appendChild(selectedItemTotal);
         
            selectedItemDiv.appendChild(productMeta)

            const closeIcon = document.createElement('img');
            closeIcon.className="close";
            closeIcon.id = `close-selected-item-details-${selectedItem.productName}`
            selectedItemDiv.appendChild(closeIcon);

            closeIcon.addEventListener('click', function(){          

                let index = selectedItems.findIndex(x => x.productName == selectedItem.productName);                
                selectedItems[index].quantity = 0;  

                const totalPrice = getTotal(selectedItems);  
                
                var orderTotalPriceElement = document.getElementsByClassName('order-total-price')[0];                
                orderTotalPriceElement.innerHTML = `$${totalPrice}`;

                const cartHeaderElement =  document.getElementsByClassName('total-cart-items')[0].getElementsByTagName('span')[0];
                cartHeaderElement.innerHTML = selectedItems.filter(x => x.quantity > 0).length;

                const addToCardElement = document.getElementById(`add-to-cart-${product.name}`);
                const allowAddElement = addToCardElement.getElementsByClassName('allow-add')[0];
                const quantity = allowAddElement.getElementsByTagName('p')[0];
                const imgElement = addToCardElement.getElementsByTagName('img')[0];
                const paragrahElement = addToCardElement.getElementsByTagName('p')[0];
                quantity.innerHTML = selectedItem.quantity;
                selectedItemDiv.remove();  
                
                allowAddElement.classList.add('hide');              
                imgElement.removeAttribute('class');               
                paragrahElement.removeAttribute('class');

                if(selectedItems.every(x => x.quantity == 0))
                {
                    document.getElementById('selected-items').classList.add('hide');
                    document.getElementById('cart-image').classList.remove('hide');
                    document.getElementById('cart-text').classList.remove('hide');
                }
                
            })

            selectedItemElement.appendChild(selectedItemDiv);
        }
        else if(selectedItem.quantity > 0 && element != null)
        {                
            updateCart(element, selectedItem, product);
        }
        else if (selectedItem.quantity == 0 && element != null)
        {
            element.remove();
        }

        const orderTotalElement = createOrderTotal(selectedItems);    
        selectedItemElement.appendChild(orderTotalElement);
    });
}

function createOrderTotal(selectedItems)
{
    let orderTotalElement = document.getElementById('order-total');
    if(orderTotalElement != null)
    {
        orderTotalElement.remove();
    }
    
    const totalPrice = getTotal(selectedItems);

    const orderTotal = document.createElement('div');
    orderTotal.className = 'order-total';
    orderTotal.id = 'order-total';
    orderTotal.innerHTML = `
    <div class="order-total-meta">
        <p class="order-total-text">Order Total</p>
        <p class="order-total-price">$${totalPrice}</p>
    </div>
    <div class="carbon-neutral">
        <img class="carbon-neutral-img">
        <p>This is a <span class="carbon-neutral-bold">carbon neutral</span> delivery</p>
    </div>
    <div class="confirmed-order">
     <p class="confired-order-p">Confirm Order</p>
    </div>
    `;
    
    return orderTotal;
}

function getTotal(selectedItems)
{
    let prices = [];
    selectedItems.forEach(item => {
        let selectedProduct = products.find(x => x.name == item.productName);
        prices.push(item.quantity * selectedProduct.price);
    })

    return prices.reduce((a,b) => a + b);
}

function updateCart(element, selectedItem, product)
{
    const totalElement = element.getElementsByClassName('selected-items-total')[0];
    totalElement.innerHTML = `$${selectedItem.quantity * product.price}`;

    const totalItems = element.getElementsByClassName('selected-items-quantity')[0];
    totalItems.innerHTML = `${selectedItem.quantity}x`;
}
