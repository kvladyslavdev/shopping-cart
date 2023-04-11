const gql = require('graphql-tag');

const typeDefs = gql`
  enum CategoryEnum {
    cheese
    vegetables
    fruits
  }
  type Product {
    id: ID!
    title: String!
    price: Float!
    category: CategoryEnum!
    description: String!
    amountAvailable: Int!
  }
  type ProductsReqInfo {
    total: Int!
    limit: Int!
    offset: Int!
  }
  type ProductsData {
    products: [Product!]!
    info: ProductsReqInfo!
  }
  type CartItem {
    product: Product!
    quantity: Int!
  }
  type Cart {
    items: [CartItem!]!
    totalCost: Float!
  }
  type OrderProduct {
    id: ID!
    title: String!
    quantity: Int!
    sellingPrice: Float!
  }
  type OrderData {
    products: [OrderProduct!]!
    orderDate: String!
    totalPrice: Float!
  }

  type Query {
    getProducts(category: CategoryEnum!, offset: Int, limit: Int): ProductsData!
    getCart: Cart!
  }
  type Mutation {
    addToCart(productId: String!): Cart!
    removeFromCart(productId: String!): Cart!
    placeOrder: OrderData!
  }
`;

module.exports = { typeDefs };
