let productList = [];
let cartList = [];
const resetCartList = () => {
    let htmlContent = "";
    cartList = [];
    document.getElementById("UI__cart").innerHTML = htmlContent;
}
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
// Render san pham tu cart list ra UI My Cart 
const renderCart = () => {
    for (let i in cartList) {
        console.log(i);
    }
    let htmlContent = "";
    for (let i in cartList) {
        htmlContent += cartList[i].cartRender();
    }
    document.getElementById("UI__cart").innerHTML = htmlContent;
}
// Them san pham vao my cart
const addToCart = (idProduct) => {
    console.log(idProduct);
    for(let item of productList){
        if(item.id == idProduct){
            console.log(item);
            cartList.push(item);
            alert("Đã thêm sản phẩm " + item.name + " vào giỏ hàng");
        }
    }
}
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
    for(let i of cartList){
        console.log(i);
        deleteProduct(i.id);
    }
    resetCartList();
    fetchProducts();
    alert("Thanh toán thành công")
}
//Compiling methods
const main = () => {
    fetchProducts();
}
main();