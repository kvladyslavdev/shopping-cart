const OrderModel = require('../models/order');

class OrderService {
  placeOrder = async (placeOrderDto) => {
    const orderModel = new OrderModel(placeOrderDto);

    return orderModel.save();
  };
}

module.exports = { orderService: new OrderService() };
