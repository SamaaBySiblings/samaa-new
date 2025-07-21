export interface ProductInfo {
  slug: string;
  name: string;
  price: number;
  image: string;
}

export const PRODUCTS: ProductInfo[] = [
  {
    slug: "golden-sandal",
    name: "Golden Sandal",
    price: 1299,
    image: "/images/golden-1.jpg",
  },
  {
    slug: "gajray-bonds",
    name: "Gajray Bonds",
    price: 1299,
    image: "/images/gajray-1.jpg",
  },
  {
    slug: "lemon-crystals",
    name: "Lemon Crystals",
    price: 1299,
    image: "/images/lemon-1.jpg",
  },
  {
    slug: "velvet-pearls",
    name: "Velvet Pearls",
    price: 1299,
    image: "/images/velvet-1.jpg",
  },
  {
    slug: "make-your-own-pack",
    name: "Make Your Own Pack",
    price: 4799,
    image: "/images/bundle.jpg",
  },
];
