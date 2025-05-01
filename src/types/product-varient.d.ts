export interface productVariant {
  _id: string;
  name: string;
  price: number;
  sale: number;
  categories: string;
  date: string;
  effectivePrice: number;
  salePrice: string;
  sku: string;
  color: string;
  quantity: number;
}

export interface ProductApiResponse {
  status: string;
  data: {
    totalProducts: number;
    products: productVariant[];
  };
}
