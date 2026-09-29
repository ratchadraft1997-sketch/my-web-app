export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Place {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  highlight: string | null;
  cover_image: string;
  images: string[];
  address: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  opening_hours: string | null;
  fee: string | null;
  phone: string | null;
  is_featured: boolean;
  rating: number;
  review_count: number;
  vibes?: string[];
  best_time_to_visit?: string | null;
  weather_pattern?: string | null;
  crowd_level?: "เงียบ" | "ปานกลาง" | "คึก" | "แนะนำไปตอนเช้า" | string | null;
  travel_tips?: string[];
  nearby_highlights?: string[];
  nearby_recommendations?: Array<{
    name: string;
    kind: string;
    distance: string;
    note: string;
  }>;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}
