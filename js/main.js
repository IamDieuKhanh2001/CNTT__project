let productList = [];
let cartList = [];

//Xoa tat ca phan tu trong cartList
const resetCartList = () => {
  let htmlContent = "";
  cartList = [];
  document.getElementById("UI__cart").innerHTML = htmlContent;
};
//Xoa object trong array
const deleteObjectInArray = (idProduct, objectArray) => {
  for (let i in objectArray) {
    if (objectArray[i].id == idProduct) {
      objectArray.splice(i, 1);
    }
  }
};
//Kiem tra object id ton tai trong array
const getObjectIdInArray = (idProduct, ObjectArray) => {
  let objectHadIn = false;
  for (let item of ObjectArray) {
    if (item.id == idProduct) {
      objectHadIn = true;
    }
  }
  return objectHadIn;
};
//Kiem tra so luong san pham trong array
//Return -1 //Khong co san pham can tim
//Return value // so luong san pham can tim
const getObjectInventoryInArray = (idProduct, ObjectArray) => {
  let OjectInventoryNumber = -1;
  for (let item of ObjectArray) {
    if (item.id == idProduct) {
      OjectInventoryNumber = item.inventory;
      break;
    }
  }
  return OjectInventoryNumber;
};
//function 1 : lay san pham tu db
const fetchProducts = () => {
  productList = [];
  axios({
    url: "https://61482f59e950620017779c8b.mockapi.io/products",
    method: "GET",
  })
    .then(function (res) {
      console.log(res);
      mapData(res.data);
      renderProducts();
    })
    .catch(function (err) {
      console.log(err);
    });
};
//fuction 2 : hien thi san pham ra man hinh
const renderProducts = (list = undefined) => {
  let htmlContent = "";
  if (list === undefined) {
    for (let i in productList) {
      htmlContent += productList[i].render();
    }
  } else {
    for (let i in list) {
      htmlContent += list[i].render();
    }
  }

  document.getElementById("UI_sanPham").innerHTML = htmlContent;
};
//function 3: map tu ds san pham cua backend ra thanh doi tuong san pham cua minh
const mapData = (data) => {
  for (let item of data) {
    let myProductObject;
    myProductObject = new Product(
      item.id,
      item.name,
      item.image,
      item.description,
      item.price,
      item.inventory,
      item.rating,
      item.type
    );
    productList.push(myProductObject);
  }
  console.log(productList);
};
//function: xóa sản phẩm khỏi database
const deleteProduct = (idProduct) => {
  axios({
    url: `https://61482f59e950620017779c8b.mockapi.io/products/${idProduct}`,
    method: "DELETE",
  })
    .then(function (res) {
      console.log(res);
      fetchProducts();
    })
    .catch(function (err) {
      console.log(err);
    });
};
//Xử lí mua
const handlePurchasing = () => {
  for (let i of cartList) {
    console.log(i);
    deleteProduct(i.id);
  }
  resetCartList();
  fetchProducts();
  alert("Thanh toán thành công");
};
const goToProductInfoPage = () => {
  window.location.href = "../productInfo/productInfo.html";
};
//Tang inventory trong array product
const increaseQuantityOfObject = (
  idProduct,
  objectArray,
  increaseNumber = 1
) => {
  for (let item of objectArray) {
    if (item.id == idProduct) {
      console.log("cart");
      console.log(item);
      item.inventory += increaseNumber;
      console.log(item);
      break;
      //Tim xong san pham co id da chon, thoat lap
    }
  }
};
const getSumPriceProducts = (objectArray) => {
  let priceSumption = 0;
  for (let item of objectArray) {
    priceSumption += item.price * item.inventory;
  }
  return priceSumption;
};
// Render san pham tu cart list ra UI My Cart
const renderCart = () => {
  //Render san pham da cho vao cartList ra UI
  //render tong chi phi ra UI
  let htmlContent = "";
  for (let i in cartList) {
    htmlContent += cartList[i].cartRender();
  }
  let priceSumption = getSumPriceProducts(cartList);
  document.getElementById(
    "popup__cart-priceSumption"
  ).innerHTML = `Tổng tiền: ${priceSumption} VND`;
  document.getElementById("UI__cart").innerHTML = htmlContent;
};
//Compiling methods
const main = () => {
  //Bat dau chuong trinh
  fetchProducts(); //Lay san pham dua vao UI
};
main();
