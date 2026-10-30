export type Language = 'en' | 'te';

export type UserRole = 'farmer' | 'buyer' | 'market_admin' | 'main_admin';

export type CropQuality = 'Grade A' | 'Grade B' | 'Grade C';

export type PriceUnit = 'per kg' | 'per quintal';

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';

export interface UserAddress {
  houseNumber: string;
  streetName: string;
  villageOrTown: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  address: UserAddress;
  approved: boolean; // Relevant for market_admin approval by main_admin
  managedMarketId?: string;
  createdAt: string;
}

export interface PriceHistoryEntry {
  pricePerKg: number;
  pricePerQuintal: number;
  updatedAt: string;
  updatedBy: string;
}

export interface MarketCropPrice {
  id: string;
  cropName: string;
  pricePerKg: number;
  pricePerQuintal: number;
  unit: PriceUnit;
  qualityAccepted: CropQuality[];
  maxCapacityKg: number;
  marketFeePercent: number;
  lastUpdated: string;
  updatedByAdminId: string;
  history: PriceHistoryEntry[];
}

export interface MarketRecord {
  id: string;
  marketName: string;
  marketLocation: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  adminId: string;
  crops: MarketCropPrice[];
}

export interface FarmerCropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerAddress: UserAddress;
  cropName: string;
  quantityKg: number;
  quality: CropQuality;
  expectedPricePerKg: number;
  harvestDate: string;
  farmLocation: string;
  city: string;
  district: string;
  createdAt: string;
  flagged?: boolean;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerOrganization: string;
  buyerPhone: string;
  buyerAddress: UserAddress;
  cropName: string;
  requiredQuantityKg: number;
  requiredQuality: CropQuality;
  expectedPricePerKg: number;
  buyerLocation: string;
  city: string;
  district: string;
  deliveryDate: string;
  additionalRequirements: string;
  createdAt: string;
  flagged?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface TradeRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'buyer';
  senderAddress: UserAddress;
  receiverId: string;
  receiverName: string;
  receiverRole: 'farmer' | 'buyer';
  receiverAddress: UserAddress;
  cropName: string;
  quantityKg: number;
  quality: CropQuality;
  offeredPricePerKg: number;
  relatedListingId?: string;
  dateOfRequest: string;
  status: RequestStatus;
  notes: string;
  messages: ChatMessage[];
}

export interface VehicleOption {
  id: string;
  nameEn: string;
  nameTe: string;
  capacityKg: number;
  ratePerKm: number;
  loadingChargePerTon: number;
}

export interface SellingOpportunityEvaluation {
  id: string;
  type: 'market' | 'buyer';
  destinationName: string;
  locationLabel: string;
  district: string;
  distanceKm: number;
  offeredPricePerKg: number;
  sellableQuantityKg: number;
  qualityMatch: boolean;
  quantityAccepted: boolean;
  grossRevenue: number;
  transportCost: number;
  loadingUnloadingCost: number;
  marketFeeCost: number;
  otherSellingCost: number;
  spoilageLossCost: number;
  spoilagePercent: number;
  netEarnings: number;
  netPerKg: number;
  vehicleUsed: string;
  buyerRecord?: BuyerRequirement;
  marketRecord?: MarketRecord;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actionEn: string;
  actionTe: string;
}
