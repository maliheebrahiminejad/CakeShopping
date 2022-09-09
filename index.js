// algorithm
// 1.get products
// 2.display
// 3.storage
// algotith m for add tocart
// 1.get data-id product
// 2.update cart
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");
const productsDOM = document.querySelector(".product-center");
const cartContent = document.querySelector(".cart__content");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const clearCart = document.querySelector(".clear-cart");
const navToggler=document.querySelector(".nav__toggler");
navToggler.addEventListener("click",()=>{
navToggler.classList.toggle('nav__expanded');


})

// const addToCartBtns=document.querySelectorAll(".add-to-cart");
// console.log(addToCartBtns);
// NodeList []

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
// import from module
// import { hello } from './products.js';
// let val = hello();
// console.log(val);
let cart = [];
let butns = [];
import { productsData } from "./products.js";
// console.log(productsData);

// 1.get products
class Products {
  getProducts() {
    return productsData;
  }
}
// 2.display
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((element) => {
      result += `<section class="product">
    <div class="image-container">
      <img
        class="product-image"
        src=${element.imgUrl}
        alt="dounat"
      />
    </div>
    <div class="product-desc">
      <p class="product-title">${element.title}</p>
      <p class="product-price">${element.price}$</p>
    </div>
    <button class="btn add-to-cart" data-id="${element.id}">
      add to cart
    </button>
  </section>`;
    });
    productsDOM.innerHTML = result;
  }
  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    // console.log(...addToCartBtns);
    // <button class="btn add-to-cart" data-id="1"></button> and ...
    // set global buttons
    butns = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      // console.log(btn.dataset.id);
      // 1,2,3
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));

      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        // get product from storage
        const addedProduct = { ...Storage.getStorage(id), quantity: 1 };
        // add to cart
        cart = [...cart, addedProduct];
        // save  cart to storage
        Storage.saveCart(cart);
        // update cart value=> cart items and total price
        this.setCartValue(cart);
        // add to cartitem
        this.addToCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let countItems = 0;
    const totalprice = cart.reduce((acc, curr) => {
      countItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `total price : ${totalprice.toFixed(2)}$`;
    cartItems.innerText = countItems;
  }
  addToCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<div class="cart-item__img">
    <img src="${cartItem.imgUrl}" alt="${cartItem.title}" />
    </div>
    <div class="cart-item__desc">
    <h4>${cartItem.title}</h4>
    <h5>${cartItem.price} $</h5>
    </div>
    <div class="cart-item__conteoller">
    <i class="fa fa-chevron-up" aria-hidden="true" data-id="${cartItem.id}"></i>
    <p>${cartItem.quantity}</p>
    <i class="fa fa-chevron-down" aria-hidden="true" data-id="${cartItem.id}"></i>
    </div>
    <span class="remove__item">
    <i class="fa fa-trash-alt" aria-hidden="true" data-id="${cartItem.id}"></i>
    </span>`;
    cartContent.appendChild(div);
  }
  setupApp() {
    // get cart from storage
    cart = Storage.getCart();
    // add cart Item
    cart.forEach((cartItem) => this.addToCartItem(cartItem));
    // set value: total price and cartitems
    this.setCartValue(cart);
  }
  logicCart() {
    // clear cart
    clearCart.addEventListener("click", () => this.clearCart());
    // car fanctionality
    // add quantity
    // 1.get item and add quantity
    // 2.save cart
    // 3.set cart value
    cartContent.addEventListener("click", (e) => {
      const selectedItem = e.target;
      const classItem = selectedItem.classList;
      if (classItem.contains("fa-chevron-up")) {
        this.addQuantity(selectedItem);
      } else if (classItem.contains("fa-chevron-down")) {
        this.subQuantity(selectedItem);
      } else if (classItem.contains("fa-trash-alt")) {
        const findItem = cart.find(
          (cItem) => cItem.id == selectedItem.dataset.id
        );
        this.removeItem(findItem.id);
        cartContent.removeChild(selectedItem.parentElement.parentElement);
      }
    });
  }
  addQuantity(item) {
    const findItem = cart.find((cItem) => cItem.id == item.dataset.id);
    findItem.quantity++;
    // update total price + cartItems
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);
    item.nextElementSibling.innerText = findItem.quantity;
  }
  subQuantity(item) {
    const findItem = cart.find((cItem) => cItem.id == item.dataset.id);
    if (findItem.quantity === 1) {
      this.removeItem(findItem.id);
      cartContent.removeChild(item.parentElement.parentElement);
      return;
    }

    findItem.quantity--;

    // update total price + cartItems
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);
    item.previousElementSibling.innerText = findItem.quantity;
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    // 1.update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    // update total price + cartItems
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);
    // get add to cart btns=> update text and disabled
    const button = butns.find((b) => parseInt(b.dataset.id) === id);
    button.innerText = "add to cart";
    button.disabled = false;
  }
}
// 3.storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getStorage(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => parseInt(id) === p.id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.logicCart();
  Storage.saveProducts(productsData);
});

// cart item modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}
