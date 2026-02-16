export type ApartmentType = '1h+k' | '2h+k' | '3h+k' | '4h+k';

export interface Apartment {
  id: string;
  number: string; // e.g. "A 1"
  staircase: string; // e.g. "A"
  floor: number;
  type: ApartmentType;
  area: number; // m²
  shares: string; // e.g. "1-420"
  resident: string;
}
