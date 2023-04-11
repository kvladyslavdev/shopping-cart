const { MAX_PRODUCT_REQ_LIMIT } = require('../common/constants');
const { BadRequestExeption } = require('../exeptions/bad-request.exeption');
const { shoppingMediator } = require('../shopping.mediator');
const { errorHandler } = require('./error.handler');

const resolvers = {
  Query: {
    getProducts: async (
      _,
      { category, offset = 0, limit = MAX_PRODUCT_REQ_LIMIT }
    ) => {
      try {
        if (offset < 0) {
          throw new BadRequestExeption('Offset should be bigger that 0');
        }
        if (limit < 1 || limit > MAX_PRODUCT_REQ_LIMIT) {
          throw new BadRequestExeption(
            'Wrong limit, expect values from 1 to 5'
          );
        }
        const products = await shoppingMediator.getProducts(
          { category },
          offset,
          limit
        );

        return products;
      } catch (error) {
        errorHandler(error);
      }
    },
    getCart: async () => {
      try {
        const cart = await shoppingMediator.getCart();

        return cart;
      } catch (error) {
        errorHandler(error);
      }
    },
  },
  Mutation: {
    addToCart: async (_, { productId }) => {
      try {
        const cart = await shoppingMediator.addToCart(productId);

        return cart;
      } catch (error) {
        errorHandler(error);
      }
    },
    removeFromCart: async (_, { productId }) => {
      try {
        const cart = await shoppingMediator.removeFromCart(productId);

        return cart;
      } catch (error) {
        errorHandler(error);
      }
    },
    placeOrder: async () => {
      try {
        const order = await shoppingMediator.placeOrder();

        return order;
      } catch (error) {
        errorHandler(error);
      }
    },
  },
};

module.exports = { resolvers };
