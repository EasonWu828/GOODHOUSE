//AOS 動畫
AOS.init({
  duration:800,
  once: true
});
// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.nav-menu a');
let menu = document.querySelector('.nav-menu');

menuOpenBtn.addEventListener('click', menuToggle);

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu);
})
function closeMenu() {
  menu.classList.remove('openMenu');
}

//串接資料
const productWrap = document.querySelector('.productWrap');
const discardAllBtn = document.querySelector('.discardAllBtn');
const totalPrice = document.querySelector('.totalPrice');
const cartList = document.querySelector('.cart-list');
const productSelect = document.querySelector('.productSelect');
const addCardBtn = document.querySelector('.addCardBtn');
const shoppingCartTable = document.querySelector('.shoppingCart-table');
const api_path = 'alanwu0828';

let productData = [];
let cartData = [];
// 接api
function init() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then((res) => {
      productData = res.data.products;
      getProductList(productData);
    })
    .catch((err) => {
      console.log(err);
    })
}
init();
// 初始資料
function getProductList(productData) {
  let str = '';
  productData.forEach((item) => {
    str += `<li class="productCard">
          <h4 class="productType">${item.category}</h4>
          <div>
          <img
            src="${item.images}"
            alt="${item.category}">
            </div>
          <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
          <h4>${item.title}</h4>
          <del class="originPrice">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p>
        </li>`
  })
  productWrap.innerHTML = str;
}

// 產品篩選
productSelect.addEventListener('change', selectProductList);
function selectProductList(e) {
  let selectData = [];
  let category = e.target.value;
  selectData = productData.filter((item) => {
    if (category === '全部') {
      return item;
    } else {
      return category === item.category;
    }
  })
  getProductList(selectData);
}

//取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      cartData = res.data.carts;
      let finalTotal = res.data.finalTotal;
      renderCartList(cartData, finalTotal);
      orderStatus();
    })
    .catch((err) => {
      console.log(err);
    })
}
getCartList()

// 渲染購物車頁面
function renderCartList(cartData, finalTotal) {
  let str = '';
  let strTitle = `<tr>
              <th width="40%">品項</th>
              <th class="15">單價</th>
              <th class="15">數量</th>
              <th class="15">金額</th>
              <th class="15"></th>
            </tr>`;
  let strFooter = ``
  if (!cartData.length) {
    strTitle = '';
    //按鈕 disabled 狀態
    discardAllBtn.classList.add('disabled');
  } else {
    discardAllBtn.classList.remove('disabled');
    cartData.forEach((item) => {
      str += `<tr>
                <td>
                  <div class="cardItem-title">
                    <img src="${item.product.images}">
                    <p>${item.product.title}</p>
                  </div>
                </td>
                <td>NT$${item.product.price}</td>
                <td>
                  <button class="material-icons remove" data-id="${item.id}" ${quantityStatus(item.quantity)}>remove</button>
                  ${item.quantity}
                  <button class="material-icons add" data-id="${item.id}">add</button>
                </td>
                <td>NT$${item.product.price * item.quantity}</td>
                <td class="discardBtn"><a href="#" class="material-icons" data-id="${item.id}">close</a>
                </td>
              </tr>`
    })
  }
  totalPrice.textContent = `NT$${finalTotal}`;
  cartList.innerHTML = strTitle + str;
}

//刪除數量按鈕狀態
function quantityStatus(quantity){
  if (quantity === 1){
    return `disabled`
  }else{
    return
  }
}

//加入購物車
productWrap.addEventListener('click', addCart);
function addCart(e) {
  e.preventDefault();
  if (e.target.dataset.id) {
    let productId = e.target.dataset.id;
    let num = 1;
    cartData.forEach((item) => {
      if (item.product.id === productId) {
        num = item.quantity += 1;
      }
    })
    let obj = {
      productId,
      quantity: num
    }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      data: obj
    })
      .then((res) => {
        swal("商品加入成功", "", "success");
        getCartList();
      })
      .catch((err) => {
        console.log(err);
      })
  }
}

//修改購物車項目數量、刪除項目
cartList.addEventListener('click', editCartItem);
function editCartItem(e) {
  e.preventDefault();
  let cartId = e.target.dataset.id;
  //刪除項目
  if (e.target.textContent === 'close') {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
      .then((res) => {
        getCartList();
      })
      .catch((err) => {
        console.log(err);
      })
  }
  //增加項目數量
  if (e.target.textContent === 'add') {
    let num;
    cartData.forEach((item) => {
      if (item.id === cartId) {
        num = item.quantity += 1;
      }
    })
    let obj = {
      id: cartId,
      quantity: num
    }
    axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      data: obj
    })
      .then((res) => {
        getCartList();
      })
      .catch((err) => {
        console.log(err);
      })
  }
  //刪除項目數量
  if (e.target.textContent === 'remove') {
    let num;
    cartData.forEach((item) => {
      if (item.quantity <= 1){
        return
      }
      if (item.id === cartId) {
        num = item.quantity -= 1;
      }
    })
    let obj = {
      id: cartId,
      quantity: num
    }
    axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
      data: obj
    })
      .then((res) => {
        getCartList();
      })
      .catch((err) => {
        console.log(err);
      })
  }
}

// 刪除全部購物車
discardAllBtn.addEventListener('click', e =>{
  e.preventDefault();
  swal({
    title: "是否刪除所有商品?",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then((value)=>{
    if (value){
      discardAllItem(e)
    }else{
      return
    }
  })
});

function discardAllItem(e) {
  e.preventDefault();
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
      getCartList();
    })
    .catch((err) => {
      console.log(err);
    })
}

//訂單填寫狀態
function orderStatus(){
  const inputs = document.querySelectorAll('.orderInfo-form input,.orderInfo-form select');
  inputs.forEach((item)=>{
    if (!cartData.length){
      item.disabled = 'disabled';
      orderInfoBtn.classList.add('disabled');
    }else{
      item.disabled = '';
      orderInfoBtn.classList.remove('disabled');
    }
  })
}

//送出訂單
const orderInfoBtn = document.querySelector('.orderInfo-btn')
orderInfoBtn.addEventListener('click', createOrder);
function createOrder(e){
  e.preventDefault();
  const message = document.querySelectorAll('.orderInfo-message');
  const form = document.querySelector('.orderInfo-form');
  const name = document.querySelector('#customerName').value.trim();
  const tel = document.querySelector('#customerPhone').value.trim();
  const email = document.querySelector('#customerEmail').value.trim();
  const address = document.querySelector('#customerAddress').value.trim();
  const payment = document.querySelector('#tradeWay').value;
  if (name === '' || name.length < 2) {
    message[0].textContent = '請輸入姓名';
    return;
  }else{
    message[0].textContent = '';
  }
}