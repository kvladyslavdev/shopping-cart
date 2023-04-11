const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    products: [
      {
        id: { type: Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
    ],
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalPrice: { type: Number, required: true },
  },
  { autoCreate: false }
);

module.exports = mongoose.model('Order', orderSchema);
