module.exports = {
  async up(db, client) {
    const productPropSchema = {
      name: { bsonType: 'string', maxLength: 50 },
      price: { bsonType: 'double' },
      description: { bsonType: 'string', maxLength: 150 },
      amountAvailable: { bsonType: 'int' },
      category: {
        bsonType: 'string',
        enum: ['vegetables', 'fruits', 'cheese'],
      },
      inStock: { bsonType: 'bool' },
    };

    const cartPropSchema = {
      items: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: {
              bsonType: 'objectId',
            },
            quantity: {
              bsonType: 'int',
              minimum: 1,
            },
          },
        },
      },
    };

    const orderPropSchema = {
      products: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['id', 'title', 'quantity', 'sellingPrice'],
          properties: {
            id: { bsonType: 'objectId' },
            title: { bsonType: 'string' },
            quantity: { bsonType: 'int' },
            sellingPrice: { bsonType: 'double' },
          },
        },
      },
      orderDate: { bsonType: 'date' },
      totalPrice: { bsonType: 'double' },
    };

    await db.createCollection('products', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: [
            'name',
            'price',
            'amountAvailable',
            'description',
            'category',
            'inStock',
          ],
          properties: productPropSchema,
        },
      },
    });

    await db.collection('products').createIndex({ category: 1 });

    await db.createCollection('carts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['items'],
          properties: cartPropSchema,
        },
      },
    });

    await db.createCollection('orders', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['products', 'orderDate', 'totalPrice'],
          properties: orderPropSchema,
        },
      },
    });
  },

  async down(db, client) {
    await db.collection('products').drop();
    await db.collection('carts').drop();
    await db.collection('orders').drop();
  },
};
