class OrderResObj {
  constructor(orderData) {
    this.id = orderData._id;
    this.products = this._getOrderResProducts(orderData.products);
    this.orderDate = orderData.orderDate;
    this.totalPrice = orderData.totalPrice.toFixed(2);
  }

  _getOrderResProducts(productsData) {
    return productsData.map((productData) => {
      return {
        id: productData.id,
        title: productData.title,
        quantity: productData.quantity,
        sellingPrice: productData.sellingPrice.toFixed(2),
      };
    });
  }
}

module.exports = { OrderResObj };
