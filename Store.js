const cartItems = [];
const cartTable = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout");
const receiptSection = document.getElementById("receipt-section");
const receiptContent = document.getElementById("receipt-content");
const newPurchaseButton = document.getElementById("new-purchase");


document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (e) => {
    const product = e.target.parentElement;
    const id = product.dataset.id;
    const price = parseFloat(product.dataset.price);
    const name = product.querySelector("h3").textContent;

    addToCart({ id, name, price });
  });
});


function addToCart(product) {
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  renderCart();
}


function removeFromCart(productId) {
  const index = cartItems.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cartItems.splice(index, 1);
    renderCart();
  }
}


function renderCart() {
  cartTable.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>#${item.price.toFixed(2)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-id="${
      item.id
    }">
      </td>
      <td>#${itemTotal.toFixed(2)}</td>
      <td><button class="remove" data-id="${item.id}">Remove</button></td>
    `;

    cartTable.appendChild(row);
  });

  totalPriceElement.textContent = total.toFixed(2);

  cartTable.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const quantity = parseInt(e.target.value, 10);

      updateQuantity(id, quantity);
    });
  });

  cartTable.querySelectorAll(".remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeFromCart(id);
    });
  });
}


function updateQuantity(productId, quantity) {
  const item = cartItems.find((item) => item.id === productId);
  if (item) {
    item.quantity = quantity;
    renderCart();
  }
}


checkoutButton.addEventListener("click", () => {
  if (cartItems.length > 0) {
    generateReceipt();
    document.querySelector("main").classList.add("hidden");
    receiptSection.classList.remove("hidden");
  } else {
    alert("Your cart is empty. Add items to buy.");
  }
});


function generateReceipt() {
  let total = 0;
  receiptContent.innerHTML = `
    <h3>Thank you for your purchase!</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${cartItems
          .map((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            return `
            <tr>
              <td>${item.name}</td>
              <td>#${item.price.toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>#${itemTotal.toFixed(2)}</td>
            </tr>
          `;
          })
          .join("")}
      </tbody>
    </table>
    <h4>Total: #${total.toFixed(2)}</h4>
  `;

  cartItems.length = 0;
  renderCart();
}


newPurchaseButton.addEventListener("click", () => {
  receiptSection.classList.add("hidden");
  document.querySelector("main").classList.remove("hidden");
});
