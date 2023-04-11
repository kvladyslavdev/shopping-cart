const CartModel = require('../models/cart');

const MIN_ITEM_QUANTITY = 1;

class CartService {
  getCart = () => {
    return CartModel.findOne();
  };

  getPopulatedCart = async () => {
    return CartModel.findOne().populate('items.productId');
  };

  addItem = async (productId) => {
    const cart = await this.getCart();

    const { items } = cart;
    const productIndex = items.findIndex(
      (item) => item.productId.toString() === productId
    );

    const updatedItems = [...items];

    if (productIndex >= 0) {
      const product = updatedItems[productIndex];
      updatedItems[productIndex] = {
        ...product,
        ...{ quantity: product.quantity + 1 },
      };
    } else {
      updatedItems.push({ productId, quantity: 1 });
    }
    cart.items = updatedItems;

    return cart.save();
  };

  removeItem = async (productId) => {
    const cart = await this.getCart();
    const { _id: cartId, items } = cart;

    const productIndex = items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex < 0) {
      return;
    }

    const product = items[productIndex];

    let updatedItems;

    if (product.quantity === MIN_ITEM_QUANTITY) {
      updatedItems = items.filter(
        ({ productId: id }) => id.toString() !== productId
      );
    } else {
      updatedItems = [...items];
      const product = updatedItems[productIndex];
      updatedItems[productIndex] = {
        ...product,
        ...{ quantity: product.quantity - 1 },
      };
    }

    cart.items = updatedItems;

    return cart.save();
  };

  clearCart = (id) => {
    return CartModel.updateOne({ _id: id }, { items: [] });
  };

  countTotalPrice = (items) => {
    return items.reduce((acc, { productId: { price }, quantity }) => {
      return acc + price * quantity;
    }, 0);
  };
}

module.exports = { cartService: new CartService() };
