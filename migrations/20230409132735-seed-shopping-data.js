const fs = require('fs');
const path = require('path');

const products = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './seed/products.json'), {
    encoding: 'utf-8',
  })
);

module.exports = {
  async up(db, client) {
    await db.collection('products').insertMany(products);
    await db.collection('carts').insertOne({ items: [] });
  },

  async down(db, client) {
    await db
      .collection('products')
      .deleteMany({ category: { $in: ['cheese', 'fruits', 'vegetables'] } });

    await db.collection('carts').deleteOne({});
  },
};
