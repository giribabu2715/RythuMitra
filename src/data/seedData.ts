import {
  ActivityLogItem,
  BuyerRequirement,
  CropQuality,
  FarmerCropListing,
  MarketRecord,
  SellingOpportunityEvaluation,
  TradeRequest,
  UserAccount,
  VehicleOption,
} from '../types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'mini_auto',
    nameEn: 'Piaggio Ape / Mini Auto (Up to 1,000 kg)',
    nameTe: 'మినీ ఆటో (1,000 కిలోల వరకు)',
    capacityKg: 1000,
    ratePerKm: 14,
    loadingChargePerTon: 350,
  },
  {
    id: 'tata_ace',
    nameEn: 'Tata Ace / Chota Hathi (Up to 2,000 kg)',
    nameTe: 'టాటా ఏస్ వ్యాన్ (2,000 కిలోల వరకు)',
    capacityKg: 2000,
    ratePerKm: 18,
    loadingChargePerTon: 400,
  },
  {
    id: 'eicher_dcm',
    nameEn: 'Eicher DCM Light Truck (Up to 5,000 kg)',
    nameTe: 'ఐషర్ డిసిఎం లారీ (5,000 కిలోల వరకు)',
    capacityKg: 5000,
    ratePerKm: 26,
    loadingChargePerTon: 450,
  },
  {
    id: 'heavy_lorry',
    nameEn: 'Ashok Leyland 10-Ton Carrier (Up to 10,000 kg)',
    nameTe: '10-టన్నుల భారీ లారీ (10,000 కిలోల వరకు)',
    capacityKg: 10000,
    ratePerKm: 36,
    loadingChargePerTon: 500,
  },
];

// Coordinates for realistic road distance estimation across AP, Telangana & South India
const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  madanapalle: { lat: 13.5503, lng: 78.5029 },
  annamayya: { lat: 13.5503, lng: 78.5029 },
  chittoor: { lat: 13.2172, lng: 79.1003 },
  tirupati: { lat: 13.6288, lng: 79.4192 },
  guntur: { lat: 16.3067, lng: 80.4365 },
  duggirala: { lat: 16.3358, lng: 80.6284 },
  vijayawada: { lat: 16.5062, lng: 80.648 },
  krishna: { lat: 16.5062, lng: 80.648 },
  ntr: { lat: 16.5062, lng: 80.648 },
  hyderabad: { lat: 17.469, lng: 78.476 },
  bowenpally: { lat: 17.469, lng: 78.476 },
  secunderabad: { lat: 17.4399, lng: 78.4983 },
  medchal: { lat: 17.63, lng: 78.48 },
  rangareddy: { lat: 17.385, lng: 78.4867 },
  kurnool: { lat: 15.8281, lng: 78.0373 },
  warangal: { lat: 17.9689, lng: 79.5941 },
  enumamula: { lat: 17.98, lng: 79.61 },
  nizamabad: { lat: 18.6725, lng: 78.0941 },
  anantapur: { lat: 14.6819, lng: 77.6006 },
  rajahmundry: { lat: 17.0005, lng: 81.804 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  nellore: { lat: 14.4426, lng: 79.9865 },
  kadapa: { lat: 14.4673, lng: 78.8242 },
  khammam: { lat: 17.2473, lng: 80.1514 },
  karimnagar: { lat: 18.4386, lng: 79.1288 },
  nalgonda: { lat: 17.0575, lng: 79.2684 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
};

function findCoords(text: string): { lat: number; lng: number } | null {
  const normalized = text.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  return null;
}

export function estimateRoadDistanceKm(
  originText: string,
  destText: string,
  originPin?: string,
  destPin?: string
): number {
  const c1 = findCoords(originText);
  const c2 = findCoords(destText);
  if (c1 && c2) {
    const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
    const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((c1.lat * Math.PI) / 180) *
        Math.cos((c2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = 6371 * c;
    // Multiply by 1.24 road winding factor; if same town, 14 km local haul
    return straightKm < 8 ? 14 : Math.round(straightKm * 1.24);
  }
  if (originPin && destPin) {
    const p1 = parseInt(originPin.slice(0, 3), 10);
    const p2 = parseInt(destPin.slice(0, 3), 10);
    if (!isNaN(p1) && !isNaN(p2)) {
      return Math.max(15, Math.abs(p1 - p2) * 28);
    }
  }
  return 85;
}

export function selectRecommendedVehicle(quantityKg: number, preferredVehicleId?: string): VehicleOption {
  if (preferredVehicleId && preferredVehicleId !== 'auto') {
    const found = VEHICLE_OPTIONS.find((v) => v.id === preferredVehicleId);
    if (found) return found;
  }
  const suitable = VEHICLE_OPTIONS.find((v) => v.capacityKg >= quantityKg);
  return suitable || VEHICLE_OPTIONS[VEHICLE_OPTIONS.length - 1];
}

export function qualityRank(q: CropQuality): number {
  if (q === 'Grade A') return 3;
  if (q === 'Grade B') return 2;
  return 1;
}

export function evaluateSellingOpportunities(params: {
  cropName: string;
  quantityKg: number;
  quality: CropQuality;
  farmLocationText: string;
  farmPinCode?: string;
  preferredVehicleId?: string;
  customOtherCost?: number;
  markets: MarketRecord[];
  buyers: BuyerRequirement[];
}): SellingOpportunityEvaluation[] {
  const {
    cropName,
    quantityKg,
    quality,
    farmLocationText,
    farmPinCode,
    preferredVehicleId = 'auto',
    customOtherCost = 200,
    markets,
    buyers,
  } = params;

  const normalizedCrop = cropName.trim().toLowerCase();
  const vehicle = selectRecommendedVehicle(quantityKg, preferredVehicleId);
  const tripsRequired = Math.max(1, Math.ceil(quantityKg / vehicle.capacityKg));

  const results: SellingOpportunityEvaluation[] = [];

  // 1. Evaluate all matching Official Markets
  for (let mIdx = 0; mIdx < markets.length; mIdx++) {
    const market = markets[mIdx];
    const matchedEntry = market.crops.find(
      (c) =>
        c.cropName.toLowerCase().includes(normalizedCrop) ||
        normalizedCrop.includes(c.cropName.toLowerCase())
    );
    const cropEntry = matchedEntry || {
      id: `custom-${market.id}-${normalizedCrop}`,
      cropName,
      pricePerKg: 26 + ((mIdx * 3) % 9),
      pricePerQuintal: (26 + ((mIdx * 3) % 9)) * 100,
      unit: 'per kg' as const,
      qualityAccepted: ['Grade A', 'Grade B', 'Grade C'] as CropQuality[],
      maxCapacityKg: 25000,
      marketFeePercent: market.crops[0]?.marketFeePercent || 1.0,
      lastUpdated: new Date().toLocaleDateString('en-IN'),
      updatedByAdminId: market.adminId,
      history: [],
    };

    const distanceKm = estimateRoadDistanceKm(
      farmLocationText,
      `${market.marketLocation} ${market.city} ${market.district}`,
      farmPinCode,
      market.pinCode
    );

    const qualityMatch = cropEntry.qualityAccepted.includes(quality);
    const quantityAccepted = quantityKg <= cropEntry.maxCapacityKg;
    const sellableQty = Math.min(quantityKg, cropEntry.maxCapacityKg);

    // Price adjustment if Grade B or Grade C in open market
    const gradeMultiplier = quality === 'Grade A' ? 1 : quality === 'Grade B' ? 0.92 : 0.82;
    const effectivePricePerKg = +(cropEntry.pricePerKg * gradeMultiplier).toFixed(2);

    const grossRevenue = sellableQty * effectivePricePerKg;
    const transportCost = distanceKm * vehicle.ratePerKm * tripsRequired;
    const loadingUnloadingCost = Math.round((sellableQty / 1000) * vehicle.loadingChargePerTon);
    const marketFeeCost = Math.round((grossRevenue * cropEntry.marketFeePercent) / 100);
    const otherSellingCost = customOtherCost + loadingUnloadingCost;

    // Perishable crops like Tomatoes have higher transit spoilage over distance
    const isPerishable =
      normalizedCrop.includes('tomato') || normalizedCrop.includes('green chilli') || normalizedCrop.includes('onion');
    const spoilagePercent = isPerishable
      ? Math.min(12, +(0.4 + (distanceKm / 100) * 0.92).toFixed(1))
      : Math.min(5, +(0.2 + (distanceKm / 100) * 0.3).toFixed(1));
    const spoilageLossCost = Math.round((grossRevenue * spoilagePercent) / 100);

    // Net Earnings = Selling Revenue − Transportation Cost − Market Fees − Other Selling Costs − Spoilage Loss
    const netEarnings = Math.round(
      grossRevenue - transportCost - marketFeeCost - otherSellingCost - spoilageLossCost
    );

    results.push({
      id: `mkt-${market.id}-${cropEntry.id}`,
      type: 'market',
      destinationName: market.marketName,
      locationLabel: `${market.marketLocation}, ${market.city}`,
      district: market.district,
      distanceKm,
      offeredPricePerKg: effectivePricePerKg,
      sellableQuantityKg: sellableQty,
      qualityMatch,
      quantityAccepted,
      grossRevenue,
      transportCost,
      loadingUnloadingCost,
      marketFeeCost,
      otherSellingCost,
      spoilageLossCost,
      spoilagePercent,
      netEarnings,
      netPerKg: +(netEarnings / Math.max(1, sellableQty)).toFixed(2),
      vehicleUsed: vehicle.nameEn,
      marketRecord: market,
    });
  }

  // 2. Evaluate all matching Direct Buyers
  for (const buyer of buyers) {
    if (buyer.flagged) continue;
    const matchesCrop =
      buyer.cropName.toLowerCase().includes(normalizedCrop) ||
      normalizedCrop.includes(buyer.cropName.toLowerCase());
    if (!matchesCrop) continue;

    const distanceKm = estimateRoadDistanceKm(
      farmLocationText,
      `${buyer.buyerLocation} ${buyer.city} ${buyer.district}`,
      farmPinCode,
      buyer.buyerAddress.pinCode
    );

    const qualityMatch = qualityRank(quality) >= qualityRank(buyer.requiredQuality);
    const quantityAccepted = quantityKg <= buyer.requiredQuantityKg * 1.25; // Buyers accept up to their required lot
    const sellableQty = Math.min(quantityKg, buyer.requiredQuantityKg);
    const tripsForBuyer = Math.max(1, Math.ceil(sellableQty / vehicle.capacityKg));

    const grossRevenue = sellableQty * buyer.expectedPricePerKg;
    const transportCost = distanceKm * vehicle.ratePerKm * tripsForBuyer;
    const loadingUnloadingCost = Math.round((sellableQty / 1000) * vehicle.loadingChargePerTon);
    const marketFeeCost = 0; // Direct Farmer-Buyer sales save APMC market commission!
    const otherSellingCost = customOtherCost + loadingUnloadingCost;

    const isPerishable =
      normalizedCrop.includes('tomato') || normalizedCrop.includes('green chilli') || normalizedCrop.includes('onion');
    const spoilagePercent = isPerishable
      ? Math.min(10, +(0.3 + (distanceKm / 100) * 0.85).toFixed(1))
      : Math.min(4, +(0.15 + (distanceKm / 100) * 0.25).toFixed(1));
    const spoilageLossCost = Math.round((grossRevenue * spoilagePercent) / 100);

    const netEarnings = Math.round(
      grossRevenue - transportCost - marketFeeCost - otherSellingCost - spoilageLossCost
    );

    results.push({
      id: `byr-${buyer.id}`,
      type: 'buyer',
      destinationName: `${buyer.buyerOrganization} (${buyer.buyerName})`,
      locationLabel: `${buyer.buyerLocation}, ${buyer.city}`,
      district: buyer.district,
      distanceKm,
      offeredPricePerKg: buyer.expectedPricePerKg,
      sellableQuantityKg: sellableQty,
      qualityMatch,
      quantityAccepted,
      grossRevenue,
      transportCost,
      loadingUnloadingCost,
      marketFeeCost,
      otherSellingCost,
      spoilageLossCost,
      spoilagePercent,
      netEarnings,
      netPerKg: +(netEarnings / Math.max(1, sellableQty)).toFixed(2),
      vehicleUsed: vehicle.nameEn,
      buyerRecord: buyer,
    });
  }

  return results;
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-farmer-1',
    fullName: 'K. Rama Rao (కె. రామారావు)',
    username: 'ramarao',
    email: 'ramarao.farmer@rythumitra.in',
    phone: '+91 94401 28450',
    password: 'password123',
    role: 'farmer',
    approved: true,
    createdAt: '2026-09-12',
    address: {
      houseNumber: '4-88/A',
      streetName: 'Ankireddypalli Main Road',
      villageOrTown: 'kurabalakota',
      city: 'Madanapalle',
      district: 'Annamayya (Chittoor)',
      state: 'Andhra Pradesh',
      pinCode: '517325',
    },
  },
  {
    id: 'usr-farmer-2',
    fullName: 'D. Venkateswarlu (డి. వెంకటేశ్వర్లు)',
    username: 'venkat_farmer',
    email: 'venkat.guntur@rythumitra.in',
    phone: '+91 98482 61209',
    password: 'password123',
    role: 'farmer',
    approved: true,
    createdAt: '2026-09-18',
    address: {
      houseNumber: '12-104',
      streetName: 'Canal Bund Street',
      villageOrTown: 'Prathipadu',
      city: 'Guntur',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      pinCode: '522019',
    },
  },
  {
    id: 'usr-farmer-3',
    fullName: 'B. Mallikarjuna Reddy (బి. మల్లికార్జున రెడ్డి)',
    username: 'malli_farmer',
    email: 'malli.kurnool@rythumitra.in',
    phone: '+91 97015 33910',
    password: 'password123',
    role: 'farmer',
    approved: true,
    createdAt: '2026-10-02',
    address: {
      houseNumber: '7-42',
      streetName: 'Handri River Road',
      villageOrTown: 'Kodumur',
      city: 'Kurnool',
      district: 'Kurnool',
      state: 'Andhra Pradesh',
      pinCode: '518464',
    },
  },
  {
    id: 'usr-buyer-1',
    fullName: 'P.Harish Chandra (Sri Tirumala Fresh Mart)',
    username: 'harish_buyer',
    email: 'procurement@tirumalafresh.in',
    phone: '+91 90004 51234',
    password: 'password123',
    role: 'buyer',
    approved: true,
    createdAt: '2026-09-15',
    address: {
      houseNumber: 'Plot 42, D.No 19-4-112',
      streetName: 'Renigunta Industrial Bypass',
      villageOrTown: 'Tiruchanur',
      city: 'Tirupati',
      district: 'Tirupati',
      state: 'Andhra Pradesh',
      pinCode: '517503',
    },
  },
  {
    id: 'usr-buyer-2',
    fullName: 'Smt. K. Padmavathi (Annapurna Agro & Retail)',
    username: 'padma_buyer',
    email: 'buying@annapurnaretail.in',
    phone: '+91 98490 77812',
    password: 'password123',
    role: 'buyer',
    approved: true,
    createdAt: '2026-09-20',
    address: {
      houseNumber: 'Shed 14, Block C',
      streetName: 'Kukatpally Agro Logistics Park',
      villageOrTown: 'Balanagar',
      city: 'Hyderabad',
      district: 'Medchal-Malkajgiri',
      state: 'Telangana',
      pinCode: '500072',
    },
  },
  {
    id: 'usr-mktadmin-1',
    fullName: 'M. Srinivasulu (APMC Market Officer)',
    username: 'srinivas_admin',
    email: 'srinivas.apmc@rythumitra.in',
    phone: '+91 94901 11223',
    password: 'password123',
    role: 'market_admin',
    approved: true,
    managedMarketId: 'mkt-madanapalle',
    createdAt: '2026-09-01',
    address: {
      houseNumber: 'Admin Block 2',
      streetName: 'Bengaluru Road Market Yard',
      villageOrTown: 'Madanapalle Urban',
      city: 'Madanapalle',
      district: 'Annamayya (Chittoor)',
      state: 'Andhra Pradesh',
      pinCode: '517325',
    },
  },
  {
    id: 'usr-mktadmin-2',
    fullName: 'G. Narasimha Rao (Kurnool Yard Secretary)',
    username: 'narasimha_admin',
    email: 'narasimha.kurnool@rythumitra.in',
    phone: '+91 94408 99110',
    password: 'password123',
    role: 'market_admin',
    approved: false, // Pending Main Administrator Approval for demonstration
    managedMarketId: 'mkt-kurnool',
    createdAt: '2026-10-27',
    address: {
      houseNumber: 'Office 1-B',
      streetName: 'Bellary Road Agricultural Yard',
      villageOrTown: 'Kurnool Camp',
      city: 'Kurnool',
      district: 'Kurnool',
      state: 'Andhra Pradesh',
      pinCode: '518003',
    },
  },
  {
    id: 'usr-mainadmin-1',
    fullName: 'Dr. V. Rajasekhar (State Directorate Admin)',
    username: 'mainadmin',
    email: 'directorate@rythumitra.gov.in',
    phone: '+91 866 2478900',
    password: 'password123',
    role: 'main_admin',
    approved: true,
    createdAt: '2026-08-15',
    address: {
      houseNumber: 'Commissioner Bhavan, 3rd Floor',
      streetName: 'MG Road Bandar',
      villageOrTown: 'Labbipet',
      city: 'Vijayawada',
      district: 'NTR',
      state: 'Andhra Pradesh',
      pinCode: '520010',
    },
  },
];

export const INITIAL_MARKETS: MarketRecord[] = [
  {
    id: 'mkt-madanapalle',
    marketName: 'Madanapalle APMC Tomato & Vegetable Market',
    marketLocation: 'Bengaluru Highway Market Yard',
    city: 'Madanapalle',
    district: 'Annamayya (Chittoor)',
    state: 'Andhra Pradesh',
    pinCode: '517325',
    adminId: 'usr-mktadmin-1',
    crops: [
      {
        id: 'mc-1',
        cropName: 'Tomatoes',
        pricePerKg: 24,
        pricePerQuintal: 2400,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B', 'Grade C'],
        maxCapacityKg: 25000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:30 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [
          { pricePerKg: 21, pricePerQuintal: 2100, updatedAt: '2026-10-27 08:00 AM', updatedBy: 'M. Srinivasulu' },
          { pricePerKg: 22.5, pricePerQuintal: 2250, updatedAt: '2026-10-28 08:15 AM', updatedBy: 'M. Srinivasulu' },
        ],
      },
      {
        id: 'mc-2',
        cropName: 'Green Chilli',
        pricePerKg: 38,
        pricePerQuintal: 3800,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 10000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:45 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [
          { pricePerKg: 35, pricePerQuintal: 3500, updatedAt: '2026-10-27 09:00 AM', updatedBy: 'M. Srinivasulu' },
        ],
      },
      {
        id: 'mc-3',
        cropName: 'Groundnut',
        pricePerKg: 66,
        pricePerQuintal: 6600,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 18000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 09:00 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
    ],
  },
  {
    id: 'mkt-bowenpally',
    marketName: 'Dr. B.R. Ambedkar Bowenpally Wholesale Yard',
    marketLocation: 'NH-44 Secunderabad Bypass',
    city: 'Hyderabad',
    district: 'Medchal-Malkajgiri',
    state: 'Telangana',
    pinCode: '500011',
    adminId: 'usr-mktadmin-1',
    crops: [
      {
        id: 'mc-4',
        cropName: 'Tomatoes',
        pricePerKg: 28,
        pricePerQuintal: 2800,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 40000,
        marketFeePercent: 2.0,
        lastUpdated: '2026-10-29 07:45 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [
          { pricePerKg: 26, pricePerQuintal: 2600, updatedAt: '2026-10-28 07:30 AM', updatedBy: 'M. Srinivasulu' },
        ],
      },
      {
        id: 'mc-5',
        cropName: 'Onions',
        pricePerKg: 34,
        pricePerQuintal: 3400,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 35000,
        marketFeePercent: 2.0,
        lastUpdated: '2026-10-29 08:00 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [
          { pricePerKg: 31, pricePerQuintal: 3100, updatedAt: '2026-10-27 08:00 AM', updatedBy: 'M. Srinivasulu' },
        ],
      },
      {
        id: 'mc-6',
        cropName: 'Green Chilli',
        pricePerKg: 44,
        pricePerQuintal: 4400,
        unit: 'per kg',
        qualityAccepted: ['Grade A'],
        maxCapacityKg: 15000,
        marketFeePercent: 2.0,
        lastUpdated: '2026-10-29 08:15 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
    ],
  },
  {
    id: 'mkt-guntur',
    marketName: 'Guntur NTR Mirchi & Spice Market Yard',
    marketLocation: 'Chilakaluripet Road',
    city: 'Guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    pinCode: '522004',
    adminId: 'usr-mktadmin-1',
    crops: [
      {
        id: 'mc-7',
        cropName: 'Guntur Red Chilli',
        pricePerKg: 195,
        pricePerQuintal: 19500,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 50000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 09:15 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [
          { pricePerKg: 188, pricePerQuintal: 18800, updatedAt: '2026-10-26 10:00 AM', updatedBy: 'M. Srinivasulu' },
        ],
      },
      {
        id: 'mc-8',
        cropName: 'Turmeric',
        pricePerKg: 118,
        pricePerQuintal: 11800,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 25000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 09:20 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
      {
        id: 'mc-9',
        cropName: 'Tomatoes',
        pricePerKg: 25.5,
        pricePerQuintal: 2550,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 15000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 09:00 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
      {
        id: 'mc-10',
        cropName: 'Paddy (BPT-5204)',
        pricePerKg: 24.5,
        pricePerQuintal: 2450,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 60000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:30 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
    ],
  },
  {
    id: 'mkt-vijayawada',
    marketName: 'Swaraj Maidan Rythu Bazaar & Gollapudi Yard',
    marketLocation: 'NH-65 Gollapudi Market Ring',
    city: 'Vijayawada',
    district: 'NTR (Krishna)',
    state: 'Andhra Pradesh',
    pinCode: '521225',
    adminId: 'usr-mktadmin-1',
    crops: [
      {
        id: 'mc-11',
        cropName: 'Tomatoes',
        pricePerKg: 26,
        pricePerQuintal: 2600,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 18000,
        marketFeePercent: 0.5,
        lastUpdated: '2026-10-29 07:30 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
      {
        id: 'mc-12',
        cropName: 'Paddy (BPT-5204)',
        pricePerKg: 25.2,
        pricePerQuintal: 2520,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 80000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:00 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
      {
        id: 'mc-13',
        cropName: 'Onions',
        pricePerKg: 32,
        pricePerQuintal: 3200,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 22000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:10 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
    ],
  },
  {
    id: 'mkt-kurnool',
    marketName: 'Kurnool Special Grade APMC Onion & Grain Market',
    marketLocation: 'Bellary Cross Road',
    city: 'Kurnool',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    pinCode: '518003',
    adminId: 'usr-mktadmin-2',
    crops: [
      {
        id: 'mc-14',
        cropName: 'Onions',
        pricePerKg: 30,
        pricePerQuintal: 3000,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B', 'Grade C'],
        maxCapacityKg: 45000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:20 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
      {
        id: 'mc-15',
        cropName: 'Tomatoes',
        pricePerKg: 24.5,
        pricePerQuintal: 2450,
        unit: 'per kg',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 20000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 08:40 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
      {
        id: 'mc-16',
        cropName: 'Groundnut',
        pricePerKg: 68,
        pricePerQuintal: 6800,
        unit: 'per quintal',
        qualityAccepted: ['Grade A', 'Grade B'],
        maxCapacityKg: 30000,
        marketFeePercent: 1.0,
        lastUpdated: '2026-10-29 09:10 AM',
        updatedByAdminId: 'usr-mktadmin-1',
        history: [],
      },
    ],
  },
];

export const INITIAL_FARMER_CROPS: FarmerCropListing[] = [
  {
    id: 'crop-101',
    farmerId: 'usr-farmer-1',
    farmerName: 'K. Rama Rao (కె. రామారావు)',
    farmerPhone: '+91 94401 28450',
    farmerAddress: INITIAL_USERS[0].address,
    cropName: 'Tomatoes',
    quantityKg: 1000,
    quality: 'Grade A',
    expectedPricePerKg: 22,
    harvestDate: '2026-10-30',
    farmLocation: 'Kurabalakota, Madanapalle',
    city: 'Madanapalle',
    district: 'Annamayya (Chittoor)',
    createdAt: '2026-10-28',
  },
  {
    id: 'crop-102',
    farmerId: 'usr-farmer-1',
    farmerName: 'K. Rama Rao (కె. రామారావు)',
    farmerPhone: '+91 94401 28450',
    farmerAddress: INITIAL_USERS[0].address,
    cropName: 'Green Chilli',
    quantityKg: 600,
    quality: 'Grade A',
    expectedPricePerKg: 36,
    harvestDate: '2026-10-31',
    farmLocation: 'Kurabalakota, Madanapalle',
    city: 'Madanapalle',
    district: 'Annamayya (Chittoor)',
    createdAt: '2026-10-28',
  },
  {
    id: 'crop-103',
    farmerId: 'usr-farmer-2',
    farmerName: 'D. Venkateswarlu (డి. వెంకటేశ్వర్లు)',
    farmerPhone: '+91 98482 61209',
    farmerAddress: INITIAL_USERS[1].address,
    cropName: 'Guntur Red Chilli',
    quantityKg: 2500,
    quality: 'Grade A',
    expectedPricePerKg: 192,
    harvestDate: '2026-11-02',
    farmLocation: 'Prathipadu, Guntur',
    city: 'Guntur',
    district: 'Guntur',
    createdAt: '2026-10-27',
  },
  {
    id: 'crop-104',
    farmerId: 'usr-farmer-2',
    farmerName: 'D. Venkateswarlu (డి. వెంకటేశ్వర్లు)',
    farmerPhone: '+91 98482 61209',
    farmerAddress: INITIAL_USERS[1].address,
    cropName: 'Paddy (BPT-5204)',
    quantityKg: 4000,
    quality: 'Grade A',
    expectedPricePerKg: 24,
    harvestDate: '2026-11-04',
    farmLocation: 'Prathipadu, Guntur',
    city: 'Guntur',
    district: 'Guntur',
    createdAt: '2026-10-28',
  },
  {
    id: 'crop-105',
    farmerId: 'usr-farmer-3',
    farmerName: 'B. Mallikarjuna Reddy (బి. మల్లికార్జున రెడ్డి)',
    farmerPhone: '+91 97015 33910',
    farmerAddress: INITIAL_USERS[2].address,
    cropName: 'Onions',
    quantityKg: 3000,
    quality: 'Grade A',
    expectedPricePerKg: 29,
    harvestDate: '2026-10-30',
    farmLocation: 'Kodumur, Kurnool',
    city: 'Kurnool',
    district: 'Kurnool',
    createdAt: '2026-10-28',
  },
];

export const INITIAL_BUYER_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'req-buy-1',
    buyerId: 'usr-buyer-1',
    buyerName: 'P. Harish Chandra',
    buyerOrganization: 'Sri Tirumala Fresh Mart & Catering',
    buyerPhone: '+91 90004 51234',
    buyerAddress: INITIAL_USERS[3].address,
    cropName: 'Tomatoes',
    requiredQuantityKg: 1000,
    requiredQuality: 'Grade A',
    expectedPricePerKg: 26.5,
    buyerLocation: 'Tiruchanur Bypass, Tirupati',
    city: 'Tirupati',
    district: 'Tirupati',
    deliveryDate: '2026-10-31',
    additionalRequirements: 'Firm red Grade-A table tomatoes packed in 25kg ventilated plastic crates. Zero market commission.',
    createdAt: '2026-10-28',
  },
  {
    id: 'req-buy-2',
    buyerId: 'usr-buyer-2',
    buyerName: 'Smt. K. Padmavathi',
    buyerOrganization: 'Annapurna Agro & Supermarkets',
    buyerPhone: '+91 98490 77812',
    buyerAddress: INITIAL_USERS[4].address,
    cropName: 'Tomatoes',
    requiredQuantityKg: 1500,
    requiredQuality: 'Grade A',
    expectedPricePerKg: 27.5,
    buyerLocation: 'Balanagar Agro Park, Hyderabad',
    city: 'Hyderabad',
    district: 'Medchal-Malkajgiri',
    deliveryDate: '2026-11-01',
    additionalRequirements: 'Supermarket sorting quality, direct bank transfer on weighbridge slip.',
    createdAt: '2026-10-28',
  },
  {
    id: 'req-buy-3',
    buyerId: 'usr-buyer-2',
    buyerName: 'Smt. K. Padmavathi',
    buyerOrganization: 'Annapurna Agro & Supermarkets',
    buyerPhone: '+91 98490 77812',
    buyerAddress: INITIAL_USERS[4].address,
    cropName: 'Onions',
    requiredQuantityKg: 3000,
    requiredQuality: 'Grade A',
    expectedPricePerKg: 33.5,
    buyerLocation: 'Balanagar Agro Park, Hyderabad',
    city: 'Hyderabad',
    district: 'Medchal-Malkajgiri',
    deliveryDate: '2026-11-02',
    additionalRequirements: 'Dry cured medium-large bulbs, 50kg jute bags.',
    createdAt: '2026-10-28',
  },
  {
    id: 'req-buy-4',
    buyerId: 'usr-buyer-1',
    buyerName: 'P. Harish Chandra',
    buyerOrganization: 'Sri Tirumala Fresh Mart & Catering',
    buyerPhone: '+91 90004 51234',
    buyerAddress: INITIAL_USERS[3].address,
    cropName: 'Paddy (BPT-5204)',
    requiredQuantityKg: 4000,
    requiredQuality: 'Grade A',
    expectedPricePerKg: 25.8,
    buyerLocation: 'Tiruchanur Bypass, Tirupati',
    city: 'Tirupati',
    district: 'Tirupati',
    deliveryDate: '2026-11-05',
    additionalRequirements: 'Moisture under 14%, Sona Masoori BPT-5204 fine grain.',
    createdAt: '2026-10-29',
  },
];

export const INITIAL_TRADE_REQUESTS: TradeRequest[] = [
  {
    id: 'TR-2026-8041',
    senderId: 'usr-farmer-1',
    senderName: 'K. Rama Rao (కె. రామారావు)',
    senderRole: 'farmer',
    senderAddress: INITIAL_USERS[0].address,
    receiverId: 'usr-buyer-1',
    receiverName: 'P. Harish Chandra (Sri Tirumala Fresh Mart)',
    receiverRole: 'buyer',
    receiverAddress: INITIAL_USERS[3].address,
    cropName: 'Tomatoes',
    quantityKg: 1000,
    quality: 'Grade A',
    offeredPricePerKg: 26.5,
    relatedListingId: 'req-buy-1',
    dateOfRequest: '2026-10-29 09:40 AM',
    status: 'Accepted',
    notes: 'Ready to dispatch 1,000 kg Grade A Madanapalle tomatoes in 40 plastic crates tomorrow morning.',
    messages: [
      {
        id: 'msg-1',
        senderId: 'usr-farmer-1',
        senderName: 'K. Rama Rao',
        text: 'నమస్కారం హరీష్ గారు, మా పొలంలో 1,000 కిలోల గ్రేడ్-A టమాటాలు కోతకు సిద్ధంగా ఉన్నాయి. రేపు ఉదయం తిరుపతికి పంపమంటారా?',
        timestamp: '09:42 AM',
      },
      {
        id: 'msg-2',
        senderId: 'usr-buyer-1',
        senderName: 'P. Harish Chandra',
        text: 'Namaskaram Rama Rao garu! Yes, we accepted your request at ₹26.50/kg. Please bring in 25kg plastic crates to our Tiruchanur godown.',
        timestamp: '09:50 AM',
      },
    ],
  },
  {
    id: 'TR-2026-8042',
    senderId: 'usr-buyer-2',
    senderName: 'Smt. K. Padmavathi (Annapurna Agro & Retail)',
    senderRole: 'buyer',
    senderAddress: INITIAL_USERS[4].address,
    receiverId: 'usr-farmer-1',
    receiverName: 'K. Rama Rao (కె. రామారావు)',
    receiverRole: 'farmer',
    receiverAddress: INITIAL_USERS[0].address,
    cropName: 'Green Chilli',
    quantityKg: 600,
    quality: 'Grade A',
    offeredPricePerKg: 41,
    relatedListingId: 'crop-102',
    dateOfRequest: '2026-10-29 10:15 AM',
    status: 'Pending',
    notes: 'We would like to purchase your 600 kg Grade-A Green Chilli lot for our Hyderabad supermarket outlets.',
    messages: [
      {
        id: 'msg-3',
        senderId: 'usr-buyer-2',
        senderName: 'Smt. K. Padmavathi',
        text: 'Hello Rama Rao garu, we saw your 600 kg Green Chilli listing. We are offering ₹41/kg with immediate RTGS settlement upon delivery.',
        timestamp: '10:16 AM',
      },
    ],
  },
  {
    id: 'TR-2026-8043',
    senderId: 'usr-buyer-2',
    senderName: 'Smt. K. Padmavathi (Annapurna Agro & Retail)',
    senderRole: 'buyer',
    senderAddress: INITIAL_USERS[4].address,
    receiverId: 'usr-farmer-3',
    receiverName: 'B. Mallikarjuna Reddy (బి. మల్లికార్జున రెడ్డి)',
    receiverRole: 'farmer',
    receiverAddress: INITIAL_USERS[2].address,
    cropName: 'Onions',
    quantityKg: 3000,
    quality: 'Grade A',
    offeredPricePerKg: 33.5,
    relatedListingId: 'crop-105',
    dateOfRequest: '2026-10-29 10:05 AM',
    status: 'Accepted',
    notes: 'Direct purchase of 3,000 kg Kurnool Grade-A Onions.',
    messages: [
      {
        id: 'msg-4',
        senderId: 'usr-buyer-2',
        senderName: 'Smt. K. Padmavathi',
        text: 'Mallikarjuna garu, please confirm if 3,000 kg onions can reach Balanagar tomorrow afternoon.',
        timestamp: '10:06 AM',
      },
      {
        id: 'msg-5',
        senderId: 'usr-farmer-3',
        senderName: 'B. Mallikarjuna Reddy',
        text: 'తప్పకుండా మేడమ్, కర్నూలు నుండి ఐషర్ వ్యాన్‌లో ఈరోజు సాయంత్రం లోడ్ చేస్తున్నాము.',
        timestamp: '10:20 AM',
      },
    ],
  },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-29 08:30 AM',
    actorName: 'M. Srinivasulu',
    actorRole: 'market_admin',
    actionEn: 'Updated official Tomato price at Madanapalle APMC Market to ₹24/kg (₹2,400/quintal)',
    actionTe: 'మదనపల్లె మార్కెట్‌లో టమాటా అధికారిక ధరను కిలో ₹24 (క్వింటా ₹2,400) గా నవీకరించారు',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-29 09:40 AM',
    actorName: 'K. Rama Rao',
    actorRole: 'farmer',
    actionEn: 'Sent trade request TR-2026-8041 for 1,000 kg Grade A Tomatoes to Sri Tirumala Fresh Mart',
    actionTe: 'శ్రీ తిరుమల ఫ్రెష్ మార్ట్‌కు 1,000 కిలోల గ్రేడ్-A టమాటాల కోసం అభ్యర్థన పంపారు',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-29 09:50 AM',
    actorName: 'P. Harish Chandra',
    actorRole: 'buyer',
    actionEn: 'Accepted trade request TR-2026-8041 from farmer K. Rama Rao at ₹26.50/kg',
    actionTe: 'రైతు కె. రామారావు నుండి వచ్చిన అభ్యర్థన TR-2026-8041 ను కిలో ₹26.50 ధరకు ఆమోదించారు',
  },
];
