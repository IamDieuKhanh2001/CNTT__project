class Product {
  constructor(id, name, image, description, price, inventory, rating, type) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
    this.inventory = inventory;
    this.rating = rating;
    this.type = type;
  }
  render() {
    return `
    <div class="products__item col l-3 m-4 c-6">
    <div class="products__item-img" onclick="goToProductInfoPage()">
        <img src="${this.image}" alt="" />
    </div>
    <div class="products__item-info">
        <div onclick="goToProductInfoPage()">
            <p class="products__item-type">${this.type}</p>
            <h3 class="products__item-title">${this.name}</h3>
            <p class="products__item-price">${this.price} VND</p>
            <p>Số lượng còn: ${this.inventory}</p>
        </div>
        <div class="product__item-favorite">
            <i class="far fa-heart" title="change__icon__when__click"></i>
        </div>
        <div class="products__item-button">
            <button onclick="addToCart(${this.id})">add to cart</button>
        </div>
    </div>
</div>
        `;
  }
  cartRender() {
    return `
    <div class="popup__cart-item">
                    <div class="popup__cart-item-img">
                        <img src="${this.image}" alt="">
                    </div>
                    <div class="popup__cart-item-des">
                        <div class="popup__cart-item-name">
                            <strong>${this.name}</strong>
                            <br>
                            <strong>${this.price * this.inventory} VND</strong>
                        </div>
                        <div class="popup__cart-item-quantity">
                            <p>Số lượng x${this.inventory}</p>
                        </div>
                        <div class="popup__cart-item-edit">
                            <button onclick="handleClickDecreaseQuantity(${this.id})"><i class="fas fa-minus"></i></button>
                            <button onclick="handleClickIncreaseQuantity(${this.id})"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
    `;
  }
}
