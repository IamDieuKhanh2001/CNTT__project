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
//function: xóa sản phẩm khỏi database
const deleteProduct = (idProduct) => {
  axios({
    url: `https://61482f59e950620017779c8b.mockapi.io/products/${idProduct}`,
    method: "DELETE",
  })
    .then(function (res) {
      console.log(res);
      fetchProducts(); //Load lại sản phẩm UI
    })
    .catch(function (err) {
      console.log(err);
    });
};
// Function: Sửa số lượng sản phẩm
//Khi sản phẩm trong cart nhỏ hơn số lượng sản phẩm trong db, tiến hành PUT sản phẩm với số lượng mới
//Số lượng sau khi mua trong db còn = số lượng productList - số lượng trong cartList
const updateQuantityProduct = (idProduct) => {
  let updateObject;//Sản phẩm khi khách hàng mua
  console.log("update product");
  for (let item of cartList) {//Tìm trong cartList object user mua
    if (item.id == idProduct) {
      const value = item;
      updateObject = { ...value };//Clone phần tử object user mua
    }
  }//Chỉnh sửa lại thuộc tính inventory của sản phẩm khách mua
  updateObject.inventory = getObjectInventoryInArray(idProduct, productList) - getObjectInventoryInArray(idProduct, cartList);
  axios({//Gọi axios sửa sản phẩm trên db
    url: `https://61482f59e950620017779c8b.mockapi.io/products/${idProduct}`,
    method: "PUT",
    data: updateObject//sản phẩm sửa
  })
    .then(function (res) {
      fetchProducts();//Sau khi call api sửa xong, render lại UI
    })
};
const goToProductInfoPage = () => {
  window.location.href = "../productInfo/productInfo.html";
};
//Kiem tra san pham cua object cartList bằng giá trị object nó trên productList không
const checkInventoryLimitReached = (idProduct) => {
  let objectInventoryLimitReached = true;
  productObjectInventoryNumber = getObjectInventoryInArray(
    idProduct,
    productList
  ); //Lấy quantity của object tại productList
  cartObjectInventoryNumber = getObjectInventoryInArray(idProduct, cartList); //Lấy quantity của object tại cartList
  if (productObjectInventoryNumber === cartObjectInventoryNumber) {
    objectInventoryLimitReached = true; //quantity bằng nhau
  } else {
    objectInventoryLimitReached = false; //quantity chưa bằng nhau
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
      inventoryLimitReached = checkInventoryLimitReached(idProduct); //Kiem tra quantity có bằng với trong productList không
      if (!inventoryLimitReached || increaseNumber < 0) {
        //xử lí thêm giá trị khi chưa đến giới hạn và số thêm mỗi lần là dương
        item.inventory += increaseNumber; //Hoặc increaseNumber truyền vào âm, giảm quantity sản phẩm trong cart, không cần xét đã đạt giới hạn hay chưa
      } else {
        alert("sản phẩm đã đạt giới hạn thêm");
      }
      console.log(item);
      break;
      //Xử lí xong san pham co id da chon, thoat lap
    }
  }
};
//Lấy tổng giá trị thuộc tính price của các object trong cartList
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
//Sắp xếp sản phẩm theo tên A-Z
const sortProduct = () => {
  productListSorted.sort(function(a,b){//Đặt quy cách sort từ A-Z
    let firstProductName = a.name.toLowerCase();//Đồng nhất tên 1 và 2 của 2 product list chuyển về lower 
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
