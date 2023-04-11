const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'cheese'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amountAvailable: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: function () {
        return this.amountAvailable > 0;
      },
    },
  },
  { autoCreate: false }
);

module.exports = mongoose.model('Product', productSchema);
