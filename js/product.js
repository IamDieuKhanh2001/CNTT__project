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
                        <div class="products__item-img">
                            <img src="${this.image}" alt="" />
                        </div>
                        <div class="products__item-info">
                            <p class="products__item-type">${this.type}</p>
                            <h3 class="products__item-title">${this.name}</h3>
                            <p class="products__item-price">${this.price}</p>
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
  cartRender(){
    return `
    <div class="popup__cart-item">
                    <div class="popup__cart-item-img">
                        <img src="${this.image}" alt="">
                    </div>
                    <div class="popup__cart-item-des">
                        <div class="popup__cart-item-name">
                            <strong>${this.name}</strong>
                        </div>
                        <div class="popup__cart-item-quantity">
                            <p>Số lượng: 1</p>
                        </div>
                        <div class="popup__cart-item-edit">
                            <button><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
    `
  }
}
