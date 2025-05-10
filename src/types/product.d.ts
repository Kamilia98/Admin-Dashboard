interface Image {
  public_id: string;
  url: string;
  _id?: string;
}

interface Color {
  _id?: string;
  name: string;
  hex: string;
  images: Image[];
  quantity: number;
  sku: string;
}

export interface Product {
  _id?: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  sale: number;
  brand: string;
  colors: Color[];
  categories: { _id: string; name: string }[];
  date?: string;
  additionalInformation: {
    general: {
      salesPackage: string;
      modelNumber: string;
      configuration: string;
      upholsteryMaterial: string;
      upholsteryColor: string;
    };
    productDetails: {
      fillingMaterial: string;
      finishType: string;
      adjustableHeadrest: boolean;
      maximumLoadCapacity: number;
      originOfManufacture: string;
    };
    dimensions: {
      width: number;
      height: number;
      depth: number;
      seatHeight: number;
      legHeight: number;
    };
    warranty: {
      summary: string;
      serviceType: string;
      covered: string;
      notCovered: string;
      domesticWarranty: string;
    };
  };
}
