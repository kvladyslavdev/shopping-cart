const ProductModel = require('../models/product');

class ProductService {
  getProducts = async ({ category }, offset, limit) => {
    const query = { category };

    const products = await ProductModel.find(query)
      .sort({ inStock: -1, amountAvailable: 1, _id: -1 })
      .skip(offset)
      .limit(limit);

    const total = await ProductModel.count({ category });

    return { products, total };
  };

  getProductById = (id) => {
    return ProductModel.findById(id);
  };

  updateProduct = (id, updateDto) => {
    return ProductModel.updateOne({ _id: id }, updateDto);
  };
}

module.exports = { productService: new ProductService() };
