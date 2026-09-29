export interface TripPlaceItem {
  id: string;
  placeId: string;
  placeSlug: string;
  placeName: string;
  coverImage: string;
  categoryName?: string;
  categoryIcon?: string;
  district?: string;
  timeSlot?: string;
  note?: string;
  visited?: boolean;
  googleMapsUrl?: string;
}

export interface TripChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface TripBudgetState {
  total?: number;
  spent?: number;
  note?: string;
}

export interface TripPlan {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  duration: string;
  tags: string[];
  estimatedBudget?: string;
  bestTimeToVisit?: string;
  startDate?: string;
  endDate?: string;
  isCurated?: boolean;
  budget?: TripBudgetState;
  checklist?: {
    items: TripChecklistItem[];
  };
  items: TripPlaceItem[];
  createdAt: string;
  updatedAt: string;
}

