export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: 'digital' | 'physical';
  image: string;
  splineEmbedUrl?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'stripe' | 'razorpay';
  createdAt: string;
}