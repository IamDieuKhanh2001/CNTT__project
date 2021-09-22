//Button hien thi UI san pham
const handleRenderCartUI = () => {
  if (cartList.length != 0) {
    renderCart();
    document.getElementById("popup__cart-showEmpty").style.display = "none"; // Khi cartList có sp, hình emty ẩn lên
    document.getElementById("popup__cart-purchasing").style.display = "block"; //Nút mua hiện lên
  } else {
    document.getElementById("popup__cart-showEmpty").style.display = "block"; // Khi cartList trống, hình emty hiện lên
    document.getElementById("popup__cart-purchasing").style.display = "none"; //Nút mua ẩn
  }
};
// Them san pham vao my cart
const addToCart = (idProduct) => {
  //Khoi tao 1 bien khac luu item can cho vao cartList
  //Cho item vao cart list voi inventory = 1
  let cartObjectPushIn;
  console.log(idProduct);
  let objectHadInCart = getObjectIdInArray(idProduct, cartList); //Kiem tra san pham da co trong cartList chua
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
    deleteObjectInArray(idProduct, cartList);
    renderCart();
  }
  console.log(cartList);
};
