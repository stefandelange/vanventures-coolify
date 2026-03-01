export type Visitor = "stefan" | "kathrin" | "both";

export const VISITOR_COLORS: Record<
  Visitor,
  { fill: string; border: string; fillOpacity: number }
> = {
  stefan: { fill: "#3b82f6", border: "#1d4ed8", fillOpacity: 0.45 },
  kathrin: { fill: "#a855f7", border: "#7e22ce", fillOpacity: 0.45 },
  both: { fill: "#22c55e", border: "#15803d", fillOpacity: 0.45 },
};

export const PROFILE_IMAGES: Record<
  Visitor,
  { url: string; objectPosition: string }
> = {
  stefan: {
    url: "https://cdn-eu.vanventures.blog/images/general/Stefan_Canada.jpeg?width=80&quality=85",
    objectPosition: "50% 17%",
  },
  kathrin: {
    url: "https://cdn-eu.vanventures.blog/images/general/Kathrin_Canada.jpg?width=80&quality=85",
    objectPosition: "50% 17%",
  },
  both: {
    url: "https://cdn-eu.vanventures.blog/images/general/Stefan+und+Kathrin+in+Kanada+Banff.jpeg?width=80&quality=85",
    objectPosition: "50% 67%",
  },
};

/**
 * World countries by ISO_A3 code.
 * Note: Norway appears as ISO_A3="-99" in the GeoJSON — matched via ADM0_A3 fallback.
 * Note: Island territories are part of their country's entry (no separate features in 50m data):
 *   - Madeira, Azores → PRT (Portugal)
 *   - Canary Islands (Tenerife, Fuerteventura, La Palma, La Gomera) → ESP (Spain)
 *   - Tortola → VGB (British Virgin Islands)
 */
export const countryVisits: Record<string, Visitor> = {
  // Stefan only
  BHS: "stefan", // Bahamas
  CYM: "stefan", // Cayman Islands
  PRT: "stefan", // Portugal — covers Madeira (island territory)
  CHE: "stefan", // Switzerland
  TUN: "stefan", // Tunisia
  IRL: "stefan", // Ireland

  // Kathrin only
  GRC: "kathrin", // Greece
  CZE: "kathrin", // Czech Republic
  LUX: "kathrin", // Luxembourg

  // Kathrin & Stefan
  NOR: "both", // Norway (matched via ADM0_A3 fallback)
  SWE: "both", // Sweden
  DNK: "both", // Denmark
  NLD: "both", // Netherlands
  BEL: "both", // Belgium
  MAR: "both", // Morocco
  NZL: "both", // New Zealand
  ABW: "both", // Aruba
  MEX: "both", // Mexico
  BLZ: "both", // Belize
  KNA: "both", // Saint Kitts and Nevis
  JAM: "both", // Jamaica
  DOM: "both", // Dominican Republic
  POL: "both", // Poland
  SVK: "both", // Slovakia
  AUT: "both", // Austria
  ITA: "both", // Italy
  ESP: "both", // Spain — covers Canary Islands (Tenerife, Fuerteventura, La Palma, La Gomera)
  DEU: "both", // Germany
  GBR: "both", // United Kingdom — covers England, Wales, Scotland
  VGB: "both", // British Virgin Islands — Tortola
  TUR: "both", // Turkey
  FRA: "both", // France
};

/**
 * US States by exact name as in the GeoJSON 'name' property.
 */
export const stateVisits: Record<string, Visitor> = {
  // Stefan only
  Ohio: "stefan",
  Oregon: "stefan",

  // Kathrin & Stefan
  "New York": "both",
  Massachusetts: "both",
  Nevada: "both",
  Florida: "both",
  "New Jersey": "both",

  // Kathrin only
  California: "kathrin",
  Utah: "kathrin",
  Arizona: "kathrin",
};

/**
 * Canadian provinces by exact name as in the GeoJSON 'name' property.
 */
export const provinceVisits: Record<string, Visitor> = {
  "British Columbia": "both",
  Alberta: "both",
};

/**
 * Pre-defined [lat, lng] centers for visited Canadian provinces (for marker placement).
 */
export const provinceCenters: Record<string, [number, number]> = {
  "British Columbia": [54.0, -125.0],
  Alberta: [54.5, -115.0],
};

/**
 * Pre-defined [lat, lng] centers for visited US states (for marker placement).
 */
export const stateCenters: Record<string, [number, number]> = {
  Ohio: [40.4, -82.7],
  Oregon: [44.0, -120.5],
  Illinois: [40.0, -89.2],
  Washington: [47.5, -120.5],
  "New Jersey": [40.1, -74.5],
  "New York": [42.9, -75.6],
  Massachusetts: [42.4, -71.8],
  Nevada: [38.5, -117.1],
  Florida: [27.8, -81.6],
  California: [37.2, -119.4],
  Utah: [39.3, -111.5],
  Arizona: [34.0, -111.7],
};
