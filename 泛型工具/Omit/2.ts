export {}

// 考虑一个场景，我们需要从一个更复杂的类型中排除多个属性。
// 例如，我们有一个包含多个属性的 Product 类型：
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

// 排除产品描述和库存信息
type ProductSummary = Omit<Product, 'description' | 'stock'>;

const product: ProductSummary = {
  id: 1,
  name: "Laptop",
  price: 999.99
  // description and stock are not included in this type
};
// ProductSummary 类型包含了除 description 和 stock 之外的所有 Product 的属性，使其成为一个更简洁的产品摘要类型。