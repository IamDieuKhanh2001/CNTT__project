let productList = [];
let cartList = [];
let productListSorted = [];

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
const checkObjectAppearedInArray = (idProduct, ObjectArray) => {
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
  let IdRender = document.getElementById("UI_sanPham");
  if(IdRender !== null){
    document.getElementById("UI_sanPham").innerHTML = htmlContent;
  }
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
};
//function: x??a s???n ph???m kh???i database
const deleteProduct = (idProduct) => {
  axios({
    url: `https://61482f59e950620017779c8b.mockapi.io/products/${idProduct}`,
    method: "DELETE",
  })
    .then(function (res) {
      console.log(res);
      fetchProducts(); //Load l???i s???n ph???m UI
    })
    .catch(function (err) {
      console.log(err);
    });
};
// Function: S???a s??? l?????ng s???n ph???m
//Khi s???n ph???m trong cart nh??? h??n s??? l?????ng s???n ph???m trong db, ti???n h??nh PUT s???n ph???m v???i s??? l?????ng m???i
//S??? l?????ng sau khi mua trong db c??n = s??? l?????ng productList - s??? l?????ng trong cartList
const updateQuantityProduct = (idProduct) => {
  let updateObject;//S???n ph???m khi kh??ch h??ng mua
  console.log("update product");
  for (let item of cartList) {//T??m trong cartList object user mua
    if (item.id == idProduct) {
      const value = item;
      updateObject = { ...value };//Clone ph???n t??? object user mua
    }
  }//Ch???nh s???a l???i thu???c t??nh inventory c???a s???n ph???m kh??ch mua
  updateObject.inventory = getObjectInventoryInArray(idProduct, productList) - getObjectInventoryInArray(idProduct, cartList);
  axios({//G???i axios s???a s???n ph???m tr??n db
    url: `https://61482f59e950620017779c8b.mockapi.io/products/${idProduct}`,
    method: "PUT",
    data: updateObject//s???n ph???m s???a
  })
    .then(function (res) {
      fetchProducts();//Sau khi call api s???a xong, render l???i UI
    })
};
const goToProductInfoPage = () => {
  window.location.href = "../productInfo/productInfo.html";
};
//Kiem tra san pham cua object cartList b???ng gi?? tr??? object n?? tr??n productList kh??ng
const checkInventoryLimitReached = (idProduct) => {
  let objectInventoryLimitReached = true;
  productObjectInventoryNumber = getObjectInventoryInArray(
    idProduct,
    productList
  ); //L???y quantity c???a object t???i productList
  cartObjectInventoryNumber = getObjectInventoryInArray(idProduct, cartList); //L???y quantity c???a object t???i cartList
  if (productObjectInventoryNumber === cartObjectInventoryNumber) {
    objectInventoryLimitReached = true; //quantity b???ng nhau
  } else {
    objectInventoryLimitReached = false; //quantity ch??a b???ng nhau
  }
  return objectInventoryLimitReached;
};
//Tang inventory trong array product
const increaseQuantityOfObject = (
  idProduct,
  objectArray,
  increaseNumber = 1
) => {
  let inventoryLimitReached;
  for (let item of objectArray) {
    if (item.id == idProduct) {
      console.log("cart");
      console.log(item);
      inventoryLimitReached = checkInventoryLimitReached(idProduct); //Kiem tra quantity c?? b???ng v???i trong productList kh??ng
      if (!inventoryLimitReached || increaseNumber < 0) {
        //x??? l?? th??m gi?? tr??? khi ch??a ?????n gi???i h???n v?? s??? th??m m???i l???n l?? d????ng
        item.inventory += increaseNumber; //Ho???c increaseNumber truy???n v??o ??m, gi???m quantity s???n ph???m trong cart, kh??ng c???n x??t ???? ?????t gi???i h???n hay ch??a
      } else {
        alert("s???n ph???m ???? ?????t gi???i h???n th??m");
      }
      console.log(item);
      break;
      //X??? l?? xong san pham co id da chon, thoat lap
    }
  }
};
//L???y t???ng gi?? tr??? thu???c t??nh price c???a c??c object trong cartList
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
  ).innerHTML = `T???ng ti???n: ${priceSumption} VND`;
  document.getElementById("UI__cart").innerHTML = htmlContent;
};
//S???p x???p s???n ph???m theo t??n A-Z
const sortProduct = () => {
  productListSorted.sort(function(a,b){//?????t quy c??ch sort t??? A-Z
    let firstProductName = a.name.toLowerCase();//?????ng nh???t t??n 1 v?? 2 c???a 2 product list chuy???n v??? lower 
    let secondProductName = b.name.toLowerCase();
    if(firstProductName > secondProductName){
      return 1;
    }else if(firstProductName < secondProductName){
      return -1;
    }return 0;
  })
}
//Compiling methods
const main = () => {
  fetchProducts(); //Lay san pham dua vao UI
};
main();  //Bat dau chuong trinh
