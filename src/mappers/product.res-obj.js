class ProductResObj {
  constructor(productData) {
    this.id = productData.id;
    this.title = productData.name;
    this.price = productData.price.toFixed(2);
    this.category = productData.category;
    this.description = productData.description;
    this.amountAvailable = productData.amountAvailable;
  }
}

module.exports = { ProductResObj };
