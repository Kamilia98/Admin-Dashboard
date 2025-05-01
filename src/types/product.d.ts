export interface Product {
  _id: string;
  name: string;
  subtitle: string;
  price: number;
  date: string;
  sale: number;
  categories: string[];
  description?: string;
  brand?: string;
  colors: ColorVariant[];
  additionalInformation?: AdditionalInformation;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ColorVariant {
  name: string;
  hex?: string;
  images: Image[];
  quantity: number;
  sku?: string;
}

export interface Image {
  public_id: string;
  url: string;
}

export interface AdditionalInformation {
  general?: GeneralInfo;
  productDetails?: ProductDetails;
  dimensions?: Dimensions;
  materials?: Materials;
  specifications?: Specifications;
  warranty?: Warranty;
}

export interface GeneralInfo {
  salesPackage?: string;
  modelNumber?: string;
  secondaryMaterial?: string;
  configuration?: string;
  upholsteryMaterial?: string;
  upholsteryColor?: string;
}

export interface ProductDetails {
  fillingMaterial?: string;
  finishType?: string;
  adjustableHeadrest?: boolean;
  maximumLoadCapacity?: number;
  originOfManufacture?: string;
}

export interface Dimensions {
  width?: number;
  height?: number;
  depth?: number;
  seatHeight?: number;
  legHeight?: number;
}

export interface Materials {
  primaryMaterial?: string;
  upholsteryMaterial?: string;
  upholsteryColor?: string;
  fillingMaterial?: string;
  finishType?: string;
}

export interface Specifications {
  adjustableHeadrest?: boolean;
  maximumLoadCapacity?: number;
  originOfManufacture?: string;
  weight?: number;
  brand?: string;
}

export interface Warranty {
  summary?: string;
  serviceType?: string;
  covered?: string;
  notCovered?: string;
  domesticWarranty?: string;
}
