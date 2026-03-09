import collectionSK from "@/assets/collection-shalwar-kameez.jpg";
import collectionWC from "@/assets/collection-waistcoats.jpg";
import collection3P from "@/assets/collection-3piece.jpg";
import collectionPants from "@/assets/collection-pants.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  categorySlug: string;
  images: string[];
  description: string;
  rating: number;
  tag?: string;
  fabric: string;
  inStock: boolean;
}

export interface Category {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
}

export const categories: Category[] = [
  { slug: "shalwar-kameez", title: "Shalwar Kameez", subtitle: "Stitched & Unstitched", image: collectionSK },
  { slug: "waistcoats", title: "Waistcoats", subtitle: "Premium Collection", image: collectionWC },
  { slug: "3-piece", title: "3-Piece Suits", subtitle: "Formal Elegance", image: collection3P },
  { slug: "trousers", title: "Trousers & Shirts", subtitle: "Modern Classics", image: collectionPants },
];

export const products: Product[] = [
  {
    id: "royal-navy-waistcoat",
    name: "Royal Navy Waistcoat",
    price: 8500,
    priceFormatted: "PKR 8,500",
    category: "Waistcoats",
    categorySlug: "waistcoats",
    images: [collectionWC],
    description: "A premium navy waistcoat crafted from the finest fabric. Features intricate detailing, a tailored fit, and a luxurious finish perfect for formal events and special occasions.",
    rating: 4.9,
    tag: "Best Seller",
    fabric: "Premium Wool Blend",
    inStock: true,
  },
  {
    id: "classic-white-shalwar-kameez",
    name: "Classic White Shalwar Kameez",
    price: 5200,
    priceFormatted: "PKR 5,200",
    category: "Shalwar Kameez",
    categorySlug: "shalwar-kameez",
    images: [collectionSK],
    description: "A timeless white Shalwar Kameez made from premium cotton lawn. Comfortable, breathable, and perfect for everyday wear or Friday prayers.",
    rating: 4.8,
    tag: "New",
    fabric: "Premium Cotton Lawn",
    inStock: true,
  },
  {
    id: "premium-black-3piece",
    name: "Premium Black 3-Piece",
    price: 15000,
    priceFormatted: "PKR 15,000",
    category: "3-Piece Suits",
    categorySlug: "3-piece",
    images: [collection3P],
    description: "An elegant black 3-piece suit featuring a Kameez, Shalwar, and Waistcoat. Crafted with premium fabric for a sophisticated look at weddings and formal events.",
    rating: 5.0,
    tag: "Popular",
    fabric: "Premium Blended Wool",
    inStock: true,
  },
  {
    id: "formal-black-ensemble",
    name: "Formal Black Ensemble",
    price: 6800,
    priceFormatted: "PKR 6,800",
    category: "Trousers & Shirts",
    categorySlug: "trousers",
    images: [collectionPants],
    description: "A sleek formal ensemble pairing premium black trousers with a tailored shirt. Modern cut with classic appeal for office and evening wear.",
    rating: 4.7,
    fabric: "Cotton Blend",
    inStock: true,
  },
  {
    id: "embroidered-cream-kameez",
    name: "Embroidered Cream Kameez",
    price: 7500,
    priceFormatted: "PKR 7,500",
    category: "Shalwar Kameez",
    categorySlug: "shalwar-kameez",
    images: [collectionSK],
    description: "A beautifully embroidered cream Shalwar Kameez with intricate threadwork on collar and cuffs. Perfect for Eid and festive occasions.",
    rating: 4.6,
    tag: "New",
    fabric: "Wash & Wear",
    inStock: true,
  },
  {
    id: "maroon-velvet-waistcoat",
    name: "Maroon Velvet Waistcoat",
    price: 9500,
    priceFormatted: "PKR 9,500",
    category: "Waistcoats",
    categorySlug: "waistcoats",
    images: [collectionWC],
    description: "A luxurious maroon velvet waistcoat with gold-tone buttons and premium lining. Statement piece for wedding functions.",
    rating: 4.8,
    fabric: "Premium Velvet",
    inStock: true,
  },
  {
    id: "grey-formal-3piece",
    name: "Grey Formal 3-Piece",
    price: 13500,
    priceFormatted: "PKR 13,500",
    category: "3-Piece Suits",
    categorySlug: "3-piece",
    images: [collection3P],
    description: "A sophisticated grey 3-piece suit ideal for formal gatherings. Includes Kameez, Shalwar, and matching Waistcoat.",
    rating: 4.9,
    fabric: "Tropical Wool",
    inStock: true,
  },
  {
    id: "slim-fit-navy-trousers",
    name: "Slim Fit Navy Trousers",
    price: 4200,
    priceFormatted: "PKR 4,200",
    category: "Trousers & Shirts",
    categorySlug: "trousers",
    images: [collectionPants],
    description: "Modern slim-fit navy trousers with comfort stretch. Versatile piece that pairs with both casual and formal shirts.",
    rating: 4.5,
    fabric: "Cotton Stretch",
    inStock: true,
  },
];

export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.categorySlug === slug);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const priceRanges = [
  { label: "Under PKR 5,000", min: 0, max: 5000 },
  { label: "PKR 5,000 - 10,000", min: 5000, max: 10000 },
  { label: "PKR 10,000 - 15,000", min: 10000, max: 15000 },
  { label: "Above PKR 15,000", min: 15000, max: Infinity },
];
