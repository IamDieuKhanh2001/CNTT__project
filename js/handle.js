//Button hien thi UI san pham
const handleRenderCartUI = () => {
  if (cartList.length != 0) {
    renderCart();
    document.getElementById("popup__cart-showEmpty").style.display = "none"; // Khi cartList có sp, hình emty ẩn lên
    document.getElementById("popup__cart-purchasing").style.display = "block"; //Nút mua hiện lên
  } else {
    document.getElementById("popup__cart-showEmpty").style.display = "block"; // Khi cartList trống, hình emty hiện lên
    document.getElementById("popup__cart-purchasing").style.display = "none"; //Nút mua ẩn
    document.getElementById("popup__cart-result").style.display = "none"; //ẩn thoogn báo mua thành công
  }
};
// Them san pham vao my cart
const addToCart = (idProduct) => {
  //Khoi tao 1 bien khac luu item can cho vao cartList
  //Cho item vao cart list voi inventory = 1
  let cartObjectPushIn;
  console.log(idProduct);
  let objectHadInCart = checkObjectAppearedInArray(idProduct, cartList); //Kiem tra san pham da co trong cartList chua
  if (objectHadInCart == false) {
    //San pham chua co trong cartList, tao san pham trong cartList
    for (let item of productList) {
      if (item.id == idProduct) {
        console.log(item);
        cartObjectPushIn = new Product(
          item.id,
          item.name,
          item.image,
          item.description,
          item.price,
          item.inventory,
          item.rating,
          item.type
        );
        cartObjectPushIn.inventory = 1; //Tao san pham trong cartList va cho quantity = 1
        console.log(cartObjectPushIn);
        break;
        //Tim xong san pham co id da chon, thoat lap
      }
    }
    cartList.push(cartObjectPushIn); //dua bien chua san pham vao cartList
    alert("Đã thêm sản phẩm " + cartObjectPushIn.name + " vào giỏ hàng");
  } else {
    //San pham da co trong cartList, tang quantity cua san pham trong cartList them 1
    increaseQuantityOfObject(idProduct, cartList, 1);
    alert("Đã thêm sản phẩm vào giỏ");
  }
};
//Tang quantity san pham them 1 khi click btn plus trong cartList
const handleClickIncreaseQuantity = (idProduct) => {
  increaseQuantityOfObject(idProduct, cartList);
  renderCart();
};
//Giam quantity san pham them 1 khi click btn minus trong cartList
const handleClickDecreaseQuantity = (idProduct) => {
  // lấy số lượng sản phẩm từ cartList[i] ra
  // san pham co so luong 1, xoa san pham khoi cartList, render lại list sản phẩm ra UI
  // san pham co so luong tu 2 tro len, giảm quantity san pham 1 đơn vị, render lại list sản phẩm ra UI
  let ojectQuantityNumber = getObjectInventoryInArray(idProduct, cartList); //Lay so luong san pham cua object trong cartList
  console.log(ojectQuantityNumber);
  if (ojectQuantityNumber != 1) {
    increaseQuantityOfObject(idProduct, cartList, -1);
    renderCart();
  } else {
    deleteObjectInArray(idProduct, cartList); //XÓa phần tử khỏi cartList khi quantity user nhấn về 0
    renderCart();
  }
  console.log(cartList);
};
//Xử lí mua
//Khi sản phẩm trong cart nhỏ hơn số lượng sản phẩm trong db, tiến hành PUT sản phẩm với số lượng mới
//Khi số lượng của sản phẩm đang bằng với số lượng trong db, DELETE sản phẩm trong db
//Số lượng sau khi mua trong db còn = số lượng productList - số lượng trong cartList
const handlePurchasing = () => {
  let objectInventoryRemain;
  for (let item of cartList) {
    console.log(item);
    objectInventoryRemain = getObjectInventoryInArray(item.id, productList);
    if (item.inventory === objectInventoryRemain) {
      deleteProduct(item.id);
    } else {
      updateQuantityProduct(item.id);
    }
    //else chỉnh sửa sản phẩm quantity
  }
  resetCartList();
  fetchProducts();
  alert("Thanh toán thành công");
  document.getElementById("popup__cart-result").style.display = "block";
  document.getElementById("popup__cart-purchasing").style.display = "none"; //Nút mua ẩn
};
//Xử lí event sort product
//Đầu ra là productListSorted đã được sắp xếp
const handleSortProduct = () => {
  productListSorted = []; // reset productListSorted tránh lỗi
  let sortValue = document.getElementById("js-sortID").value; //Dom id input
  productListSorted = [...productList]; //Spread operator sang productListSorted
  if (sortValue === "AZ") {
    sortProduct(); //Sort AZ
  } else {
    sortProduct(); //Nếu người dùng chọn sort ZA, sort AZ rồi đảo mảng
    productListSorted.reverse();
  }
  renderProducts(productListSorted); //Render UI product đã được sort
};
//ẩn hiện kết quả tìm kiếm và tên tìm kiếm lên UI
const hideSearchResult = (hide = true, keyWord = "") => {
  if (hide === false) {
    document.getElementById("js-show__search__result").style.display = "block";
    document.getElementById("js-search__keyword").innerHTML = keyWord;
  }
  if (keyWord == "") {
    document.getElementById("js-show__search__result").style.display = "none";
  }
};
//Xử lí tìm kiếm theo tên input
const handleSearchInput = () => {
  productListSorted = []; // reset productListSorted tránh lỗi
  let inputValue = document.getElementById("search__bar").value;
  inputValue.trim().toLowerCase();
  for (let item of productList) {
    let currentName = item.name.toLowerCase();
    if (currentName.includes(inputValue)) {
      productListSorted.push(item);
    }
  }
  if (productListSorted.length !== 0) {
    hideSearchResult(false, inputValue);
    renderProducts(productListSorted);
  } 
  else {
    hideSearchResult(true);
    renderProducts();
  }
};
