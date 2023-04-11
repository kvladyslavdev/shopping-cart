const { cartService } = require('./services/cart.service');
const { productService } = require('./services/product.service');
const { orderService } = require('./services/order.service');
const { ProductResObj } = require('./mappers/product.res-obj');
const { OrderResObj } = require('./mappers/order.res-obj');
const { PRICE_DEC_PLACES } = require('./common/constants');
const { NotFoundExeption } = require('./exeptions/not-found.exeption');
const { BadRequestExeption } = require('./exeptions/bad-request.exeption');
const {
  InternalServerErrorExeption,
} = require('./exeptions/internal-server-error.exeption');

class ShoppingMediator {
  constructor() {
    this.cartService = cartService;
    this.productService = productService;
    this.orderService = orderService;
  }

  getProducts = async ({ category }, offset, limit) => {
    const { products: productsData, total } =
      await this.productService.getProducts({ category }, offset, limit);

    const products = productsData.map((product) => new ProductResObj(product));
    return {
      products,
      info: { total, limit, offset },
    };
  };

  getCart = async () => {
    const populatedCart = await this.cartService.getPopulatedCart();

    return this._aggregateCartRes(populatedCart);
  };

  addToCart = async (productId) => {
    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new NotFoundExeption('Product Not Found');
    }

    if (!product.inStock) {
      throw new BadRequestExeption('Product is not available');
    }

    await this.cartService.addItem(productId).catch((err) => {
      throw new InternalServerErrorExeption();
    });

    const populatedCart = await this.cartService.getPopulatedCart();

    return this._aggregateCartRes(populatedCart);
  };

  removeFromCart = async (productId) => {
    await this.cartService.removeItem(productId).catch((err) => {
      throw new InternalServerErrorExeption();
    });

    const populatedCart = await this.cartService.getPopulatedCart();

    return this._aggregateCartRes(populatedCart);
  };

  placeOrder = async () => {
    const populatedCart = await this.cartService.getPopulatedCart();

    if (!populatedCart.items.length) {
      throw new BadRequestExeption(`Can't proceed order with empty cart`);
    }

    const { items } = populatedCart;
    const placeOrderDto = { products: [] };

    for await (const item of items) {
      const { productId: product, quantity } = item;
      const { _id: id } = product;
      const updateProductDto = {};
      if (!product.amountAvailable || !product.inStock) {
        throw new InternalServerErrorExeption(`Product ${id} is not available`);
      }

      const amountAfterOrder = product.amountAvailable - quantity;

      if (amountAfterOrder < 0) {
        throw new BadRequestExeption(
          `Product ${id} amount available: ${product.amountAvailable} `
        );
      }

      updateProductDto.amountAvailable = amountAfterOrder;

      await this.productService.updateProduct(id, updateProductDto);

      placeOrderDto.products.push({
        id: id,
        title: product.name,
        sellingPrice: product.price,
        quantity,
      });
    }

    placeOrderDto.totalPrice = this.cartService.countTotalPrice(
      populatedCart.items
    );

    const placedOrder = await this.orderService
      .placeOrder(placeOrderDto)
      .catch((err) => {
        throw new InternalServerErrorExeption();
      });

    await this.cartService.clearCart(populatedCart._id);

    return new OrderResObj(placedOrder);
  };

  _aggregateCartRes(populatedCart) {
    const totalCost = this.cartService
      .countTotalPrice(populatedCart.items)
      .toFixed(PRICE_DEC_PLACES);

    const items = populatedCart.items.map((cartItem) => {
      return {
        product: new ProductResObj(cartItem.productId),
        quantity: cartItem.quantity,
      };
    });

    return { items, totalCost };
  }
}

module.exports = { shoppingMediator: new ShoppingMediator() };
