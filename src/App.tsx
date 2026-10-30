/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  LayoutDashboard,
  TrendingUp,
  Calculator,
  PackagePlus,
  Users,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  UserCog,
  LogOut,
  Search,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import {
  ActivityLogItem,
  BuyerRequirement,
  CropQuality,
  FarmerCropListing,
  Language,
  MarketRecord,
  PriceUnit,
  RequestStatus,
  TradeRequest,
  UserAccount,
} from './types';
import {
  estimateRoadDistanceKm,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_BUYER_REQUIREMENTS,
  INITIAL_FARMER_CROPS,
  INITIAL_MARKETS,
  INITIAL_TRADE_REQUESTS,
  INITIAL_USERS,
  qualityRank,
  selectRecommendedVehicle,
} from './data/seedData';
import {
  DEFAULT_CROPS,
  formatCurrency,
  formatFullAddress,
  translateCrop,
  translateGrade,
  translateLocation,
  translateMarketName,
  translateRole,
  UI_TEXT,
} from './i18n';
import { AuthGate } from './components/AuthGate';
import { ProfitCalculatorView } from './components/ProfitCalculatorView';
import { RequestsAndChatView } from './components/RequestsAndChatView';
import { MarketAdminView } from './components/MarketAdminView';
import { MainAdminView } from './components/MainAdminView';
import { CropSelector } from './components/CropSelector';

type ActivePage =
  | 'dashboard'
  | 'market_prices'
  | 'my_crops'
  | 'profit_calc'
  | 'buyer_requirements'
  | 'my_requirements'
  | 'find_farmers'
  | 'manage_markets'
  | 'requests'
  | 'main_admin'
  | 'profile';

const PAGE_ORDER: ActivePage[] = [
  'dashboard',
  'market_prices',
  'my_crops',
  'profit_calc',
  'buyer_requirements',
  'my_requirements',
  'find_farmers',
  'manage_markets',
  'requests',
  'main_admin',
  'profile',
];

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadState('rm_lang', 'en'));
  const [users, setUsers] = useState<UserAccount[]>(() => loadState('rm_users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadState('rm_current_user', null)
  );
  const [markets, setMarkets] = useState<MarketRecord[]>(() =>
    loadState('rm_markets', INITIAL_MARKETS)
  );
  const [farmerCrops, setFarmerCrops] = useState<FarmerCropListing[]>(() =>
    loadState('rm_farmer_crops', INITIAL_FARMER_CROPS)
  );
  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>(() =>
    loadState('rm_buyer_reqs', INITIAL_BUYER_REQUIREMENTS)
  );
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>(() =>
    loadState('rm_trade_requests', INITIAL_TRADE_REQUESTS)
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() =>
    loadState('rm_activity_logs', INITIAL_ACTIVITY_LOGS)
  );
  const [customCrops, setCustomCrops] = useState<string[]>(() =>
    loadState('rm_custom_crops', [])
  );

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [pageDirection, setPageDirection] = useState<1 | -1>(1);
  const [dashboardSlideIdx, setDashboardSlideIdx] = useState<number>(0);
  const [dashboardSlideDir, setDashboardSlideDir] = useState<1 | -1>(1);
  const [toastBanner, setToastBanner] = useState<string>('');
  const [mandiImgError, setMandiImgError] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  // Common Dashboard & Market Price filters
  const [searchCropQuery, setSearchCropQuery] = useState<string>('');
  const [selectedMarketFilter, setSelectedMarketFilter] = useState<string>('all');
  const [marketSortBy, setMarketSortBy] = useState<
    'highest_net' | 'highest_price' | 'lowest_price' | 'nearest' | 'lowest_transport'
  >('highest_net');

  // Farmer Add Crop Form State (Section 6.1)
  const [newCropName, setNewCropName] = useState('Tomatoes');
  const [newCropQty, setNewCropQty] = useState<number>(1000);
  const [newCropQuality, setNewCropQuality] = useState<CropQuality>('Grade A');
  const [newCropPrice, setNewCropPrice] = useState<number>(22);
  const [newCropHarvestDate, setNewCropHarvestDate] = useState('2026-11-01');
  const [newCropLocation, setNewCropLocation] = useState('');

  // Buyer Add Requirement Form State (Section 7.1)
  const [reqCropName, setReqCropName] = useState('Tomatoes');
  const [reqQty, setReqQty] = useState<number>(500);
  const [reqQuality, setReqQuality] = useState<CropQuality>('Grade A');
  const [reqBudget, setReqBudget] = useState<number>(26);
  const [reqDeliveryDate, setReqDeliveryDate] = useState('2026-11-02');
  const [reqLocation, setReqLocation] = useState('');
  const [reqNotes, setReqNotes] = useState('');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState<UserAccount | null>(null);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);

  const navigateToPage = (nextPage: ActivePage) => {
    setIsNavMenuOpen(false);
    if (nextPage === activePage) return;
    const prevIdx = PAGE_ORDER.indexOf(activePage);
    const nextIdx = PAGE_ORDER.indexOf(nextPage);
    setPageDirection(nextIdx >= prevIdx ? 1 : -1);
    setActivePage(nextPage);
  };

  useEffect(() => {
    localStorage.setItem('rm_lang', JSON.stringify(lang));
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('rm_current_user', JSON.stringify(currentUser));
    if (currentUser) {
      setProfileForm(currentUser);
      setNewCropLocation(`${currentUser.address.villageOrTown}, ${currentUser.address.city}`);
      setReqLocation(`${currentUser.address.villageOrTown}, ${currentUser.address.city}`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('rm_markets', JSON.stringify(markets));
  }, [markets]);

  useEffect(() => {
    localStorage.setItem('rm_farmer_crops', JSON.stringify(farmerCrops));
  }, [farmerCrops]);

  useEffect(() => {
    localStorage.setItem('rm_buyer_reqs', JSON.stringify(buyerRequirements));
  }, [buyerRequirements]);

  useEffect(() => {
    localStorage.setItem('rm_trade_requests', JSON.stringify(tradeRequests));
  }, [tradeRequests]);

  useEffect(() => {
    localStorage.setItem('rm_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('rm_custom_crops', JSON.stringify(customCrops));
  }, [customCrops]);

  const availableCrops = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const addUnique = (name: string) => {
      const trimmed = (name || '').trim();
      if (!trimmed) return;
      const lower = trimmed.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        list.push(trimmed);
      }
    };
    DEFAULT_CROPS.forEach(addUnique);
    customCrops.forEach(addUnique);
    markets.forEach((m) => m.crops.forEach((c) => addUnique(c.cropName)));
    farmerCrops.forEach((fc) => addUnique(fc.cropName));
    buyerRequirements.forEach((br) => addUnique(br.cropName));
    return list;
  }, [customCrops, markets, farmerCrops, buyerRequirements]);

  const handleAddCustomCrop = (cropName: string, refPrice?: number) => {
    const trimmed = cropName.trim();
    if (!trimmed) return;
    setCustomCrops((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [...prev, trimmed];
    });
    // Also ensure the custom crop is listed in at least the primary market so all profiles see it in Market Prices & Dashboard
    setMarkets((prevMarkets) => {
      const existsInAnyMarket = prevMarkets.some((m) =>
        m.crops.some((c) => c.cropName.toLowerCase() === trimmed.toLowerCase())
      );
      if (existsInAnyMarket || prevMarkets.length === 0) return prevMarkets;
      const basePrice = refPrice && refPrice > 0 ? refPrice : 28;
      const nowStr = new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      return prevMarkets.map((m, idx) => {
        if (idx !== 0) return m;
        return {
          ...m,
          crops: [
            ...m.crops,
            {
              id: `mc-custom-${Date.now()}`,
              cropName: trimmed,
              pricePerKg: basePrice,
              pricePerQuintal: Math.round(basePrice * 100),
              unit: 'kg',
              qualityAccepted: ['Grade A', 'Grade B'],
              maxCapacityKg: 25000,
              marketFeePercent: 1.5,
              lastUpdated: nowStr,
              updatedByAdminId: currentUser?.id || 'system',
              history: [],
            },
          ],
        };
      });
    });
    showToast(
      lang === 'en'
        ? `Added "${translateCrop(trimmed, 'en')}" (${translateCrop(trimmed, 'te')}) to all profiles!`
        : `"${translateCrop(trimmed, 'te')}" (${translateCrop(trimmed, 'en')}) అన్ని ప్రొఫైల్‌ల పంటల జాబితాలో చేర్చబడింది!`
    );
  };

  // Auto-advance dashboard spotlight slide every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setDashboardSlideDir(1);
      setDashboardSlideIdx((prev) => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => {
      setToastBanner((prev) => (prev === msg ? '' : prev));
    }, 4500);
  };

  const logActivity = (actor: UserAccount, actionEn: string, actionTe: string) => {
    const entry: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      actorName: actor.fullName,
      actorRole: actor.role,
      actionEn,
      actionTe,
    };
    setActivityLogs((prev) => [entry, ...prev]);
  };

  // Auth Handlers
  const handleSignIn = (user: UserAccount) => {
    setCurrentUser(user);
    setPageDirection(1);
    setActivePage('dashboard');
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setPageDirection(1);
    setActivePage('dashboard');
    logActivity(
      newUser,
      `Registered new ${newUser.role} account in ${newUser.address.city}, ${newUser.address.district}`,
      `${newUser.address.city} నుండి కొత్త ${newUser.role} ఖాతా నమోదు చేశారు`
    );
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setActivePage('dashboard');
  };

  // Farmer: Add Crop Listing (Section 6.1)
  const handleAddFarmerCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const trimmedCrop = newCropName.trim();
    if (!trimmedCrop) return;
    handleAddCustomCrop(trimmedCrop, Math.max(1, newCropPrice));
    const created: FarmerCropListing = {
      id: `crop-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.fullName,
      farmerPhone: currentUser.phone,
      farmerAddress: currentUser.address,
      cropName: trimmedCrop,
      quantityKg: Math.max(50, newCropQty),
      quality: newCropQuality,
      expectedPricePerKg: Math.max(1, newCropPrice),
      harvestDate: newCropHarvestDate,
      farmLocation:
        newCropLocation.trim() ||
        `${currentUser.address.villageOrTown}, ${currentUser.address.city}`,
      city: currentUser.address.city,
      district: currentUser.address.district,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setFarmerCrops((prev) => [created, ...prev]);
    logActivity(
      currentUser,
      `Listed ${created.quantityKg} kg of ${created.quality} ${translateCrop(created.cropName, 'en')} at ₹${created.expectedPricePerKg}/kg`,
      `${created.quantityKg} కిలోల ${translateCrop(created.cropName, 'te')} (₹${created.expectedPricePerKg}/kg) అమ్మకానికి ఉంచారు`
    );
    showToast(
      lang === 'en'
        ? `Published ${created.quantityKg} kg ${translateCrop(created.cropName, 'en')} to your active crop listings.`
        : `${created.quantityKg} కిలోల ${translateCrop(created.cropName, 'te')} మీ పంటల జాబితాలో ప్రచురించబడింది.`
    );
  };

  // Buyer: Add Requirement (Section 7.1)
  const handleAddBuyerRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const trimmedCrop = reqCropName.trim();
    if (!trimmedCrop) return;
    handleAddCustomCrop(trimmedCrop, Math.max(1, reqBudget));
    const created: BuyerRequirement = {
      id: `req-buy-${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      buyerOrganization: currentUser.fullName,
      buyerPhone: currentUser.phone,
      buyerAddress: currentUser.address,
      cropName: trimmedCrop,
      requiredQuantityKg: Math.max(50, reqQty),
      requiredQuality: reqQuality,
      expectedPricePerKg: Math.max(1, reqBudget),
      buyerLocation:
        reqLocation.trim() || `${currentUser.address.villageOrTown}, ${currentUser.address.city}`,
      city: currentUser.address.city,
      district: currentUser.address.district,
      deliveryDate: reqDeliveryDate,
      additionalRequirements:
        reqNotes.trim() || 'Direct weighbridge settlement upon quality verification.',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBuyerRequirements((prev) => [created, ...prev]);
    logActivity(
      currentUser,
      `Published buyer requirement for ${created.requiredQuantityKg} kg of ${created.requiredQuality} ${translateCrop(created.cropName, 'en')}`,
      `${created.requiredQuantityKg} కిలోల ${translateCrop(created.cropName, 'te')} కొనుగోలు అవసరాన్ని ప్రచురించారు`
    );
    showToast(
      lang === 'en'
        ? `Published requirement for ${created.requiredQuantityKg} kg ${translateCrop(created.cropName, 'en')}.`
        : `${created.requiredQuantityKg} కిలోల ${translateCrop(created.cropName, 'te')} కొనుగోలు అవసరం ప్రచురించబడింది.`
    );
  };

  // Send Trade Request: Farmer -> Buyer
  const handleSendRequestToBuyer = (
    buyer: BuyerRequirement,
    qtyKg: number,
    offeredPrice: number
  ) => {
    if (!currentUser) return;
    const newReq: TradeRequest = {
      id: `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: 'farmer',
      senderAddress: currentUser.address,
      receiverId: buyer.buyerId,
      receiverName: `${buyer.buyerOrganization} (${buyer.buyerName})`,
      receiverRole: 'buyer',
      receiverAddress: buyer.buyerAddress,
      cropName: buyer.cropName,
      quantityKg: qtyKg,
      quality: buyer.requiredQuality,
      offeredPricePerKg: offeredPrice,
      relatedListingId: buyer.id,
      dateOfRequest: new Date().toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Pending',
      notes: `Direct supply offer from ${currentUser.fullName} (${currentUser.address.city}) for ${qtyKg} kg ${translateCrop(buyer.cropName, lang)} at ₹${offeredPrice}/kg.`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          text:
            lang === 'en'
              ? `Namaskaram! I can supply ${qtyKg} kg of ${buyer.requiredQuality} ${translateCrop(buyer.cropName, 'en')} from ${currentUser.address.city} at ₹${offeredPrice}/kg.`
              : `నమస్కారం! మా వద్ద ${qtyKg} కిలోల ${buyer.requiredQuality} ${translateCrop(buyer.cropName, 'te')} సిద్ధంగా ఉంది. కిలో ₹${offeredPrice} చొప్పున సరఫరా చేయగలము.`,
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    };
    setTradeRequests((prev) => [newReq, ...prev]);
    navigateToPage('requests');
    showToast(
      lang === 'en'
        ? `Trade request ${newReq.id} sent to ${buyer.buyerOrganization}!`
        : `${buyer.buyerOrganization} కు అభ్యర్థన ${newReq.id} పంపబడింది!`
    );
  };

  // Send Trade Request: Buyer -> Farmer
  const handleSendRequestToFarmer = (farmerCrop: FarmerCropListing) => {
    if (!currentUser) return;
    const newReq: TradeRequest = {
      id: `TR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: 'buyer',
      senderAddress: currentUser.address,
      receiverId: farmerCrop.farmerId,
      receiverName: farmerCrop.farmerName,
      receiverRole: 'farmer',
      receiverAddress: farmerCrop.farmerAddress,
      cropName: farmerCrop.cropName,
      quantityKg: farmerCrop.quantityKg,
      quality: farmerCrop.quality,
      offeredPricePerKg: farmerCrop.expectedPricePerKg,
      relatedListingId: farmerCrop.id,
      dateOfRequest: new Date().toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Pending',
      notes: `Direct purchase offer from ${currentUser.fullName} (${currentUser.address.city}) for ${farmerCrop.quantityKg} kg ${translateCrop(farmerCrop.cropName, lang)} at ₹${farmerCrop.expectedPricePerKg}/kg.`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          text:
            lang === 'en'
              ? `Namaskaram ${farmerCrop.farmerName}! We want to purchase your ${farmerCrop.quantityKg} kg ${farmerCrop.quality} ${translateCrop(farmerCrop.cropName, 'en')} lot at ₹${farmerCrop.expectedPricePerKg}/kg.`
              : `నమస్కారం ${farmerCrop.farmerName} గారు! మీ వద్ద ఉన్న ${farmerCrop.quantityKg} కిలోల ${translateCrop(farmerCrop.cropName, 'te')} పంటను కిలో ₹${farmerCrop.expectedPricePerKg} ధరకు కొనుగోలు చేయాలనుకుంటున్నాము.`,
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    };
    setTradeRequests((prev) => [newReq, ...prev]);
    navigateToPage('requests');
    showToast(
      lang === 'en'
        ? `Purchase request ${newReq.id} sent to farmer ${farmerCrop.farmerName}!`
        : `రైతు ${farmerCrop.farmerName} కు కొనుగోలు అభ్యర్థన ${newReq.id} పంపబడింది!`
    );
  };

  const handleUpdateRequestStatus = (requestId: string, newStatus: RequestStatus) => {
    setTradeRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
    showToast(
      lang === 'en'
        ? `Request ${requestId} marked as ${newStatus}.`
        : `అభ్యర్థన ${requestId} స్థితి ${newStatus} గా మార్చబడింది.`
    );
  };

  const handleSendChatMessage = (requestId: string, text: string) => {
    if (!currentUser) return;
    const msg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setTradeRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, messages: [...r.messages, msg] } : r))
    );
  };

  // Market Admin Handlers
  const handleAddMarket = (newMarket: MarketRecord) => {
    setMarkets((prev) => [newMarket, ...prev]);
    if (currentUser) {
      logActivity(
        currentUser,
        `Added new market ${newMarket.marketName} (${newMarket.city})`,
        `కొత్త మార్కెట్ ${newMarket.marketName} (${newMarket.city}) జోడించారు`
      );
    }
  };

  const handleAddOrUpdateCropPrice = (
    marketId: string,
    cropName: string,
    pricePerKg: number,
    unit: PriceUnit,
    marketFeePercent: number
  ) => {
    if (!currentUser) return;
    const nowStr = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const pricePerQuintal = Math.round(pricePerKg * 100);

    setMarkets((prev) =>
      prev.map((m) => {
        if (m.id !== marketId) return m;
        const existingIdx = m.crops.findIndex(
          (c) => c.cropName.toLowerCase() === cropName.toLowerCase()
        );
        if (existingIdx >= 0) {
          const existing = m.crops[existingIdx];
          const updatedCrop = {
            ...existing,
            pricePerKg,
            pricePerQuintal,
            unit,
            marketFeePercent,
            lastUpdated: nowStr,
            updatedByAdminId: currentUser.id,
            history: [
              ...existing.history,
              {
                pricePerKg: existing.pricePerKg,
                pricePerQuintal: existing.pricePerQuintal,
                updatedAt: existing.lastUpdated,
                updatedBy: currentUser.fullName,
              },
            ],
          };
          const nextCrops = [...m.crops];
          nextCrops[existingIdx] = updatedCrop;
          return { ...m, crops: nextCrops };
        } else {
          return {
            ...m,
            crops: [
              ...m.crops,
              {
                id: `mc-${Date.now()}`,
                cropName,
                pricePerKg,
                pricePerQuintal,
                unit,
                qualityAccepted: ['Grade A', 'Grade B'],
                maxCapacityKg: 25000,
                marketFeePercent,
                lastUpdated: nowStr,
                updatedByAdminId: currentUser.id,
                history: [],
              },
            ],
          };
        }
      })
    );

    setCustomCrops((prev) => {
      if (prev.some((c) => c.toLowerCase() === cropName.trim().toLowerCase())) {
        return prev;
      }
      return [...prev, cropName.trim()];
    });

    logActivity(
      currentUser,
      `Updated ${translateCrop(cropName, 'en')} official price to ₹${pricePerKg}/kg (₹${pricePerQuintal}/quintal)`,
      `${translateCrop(cropName, 'te')} అధికారిక ధరను కిలో ₹${pricePerKg} గా నవీకరించారు`
    );
  };

  // Main Admin Handlers
  const handleToggleApproveMarketAdmin = (userId: string, approved: boolean) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, approved } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, approved } : null));
    }
    showToast(
      lang === 'en'
        ? `Market Administrator authorization updated to ${approved ? 'Approved' : 'Pending'}.`
        : 'మార్కెట్ అడ్మినిస్ట్రేటర్ ఆమోద స్థితి నవీకరించబడింది.'
    );
  };

  // Flattened Market Price Comparison Rows with Distance, Transport & Net Earnings for Current User
  const marketComparisonRows = useMemo(() => {
    if (!currentUser) return [];
    const userLocText = `${currentUser.address.villageOrTown} ${currentUser.address.city} ${currentUser.address.district}`;
    const refQtyKg = 1000;
    const vehicle = selectRecommendedVehicle(refQtyKg);

    const rows: Array<{
      id: string;
      marketId: string;
      marketName: string;
      location: string;
      district: string;
      state: string;
      pinCode: string;
      cropName: string;
      qualityAccepted: CropQuality[];
      pricePerKg: number;
      pricePerQuintal: number;
      unit: PriceUnit;
      lastUpdated: string;
      distanceKm: number;
      transportCost: number;
      marketFeeCost: number;
      spoilageCost: number;
      grossRevenue: number;
      netEarnings: number;
      netRatioPct: number;
    }> = [];

    for (const m of markets) {
      if (selectedMarketFilter !== 'all' && m.id !== selectedMarketFilter) continue;
      const distKm = estimateRoadDistanceKm(
        userLocText,
        `${m.marketLocation} ${m.city} ${m.district}`,
        currentUser.address.pinCode,
        m.pinCode
      );
      for (const c of m.crops) {
        const q = searchCropQuery.trim().toLowerCase();
        if (
          q &&
          !c.cropName.toLowerCase().includes(q) &&
          !translateCrop(c.cropName, 'en').toLowerCase().includes(q) &&
          !translateCrop(c.cropName, 'te').toLowerCase().includes(q)
        ) {
          continue;
        }
        const gross = refQtyKg * c.pricePerKg;
        const transportCost = distKm * vehicle.ratePerKm;
        const loadingCost = vehicle.loadingChargePerTon;
        const feeCost = Math.round((gross * c.marketFeePercent) / 100);
        const isPerishable =
          c.cropName.toLowerCase().includes('tomato') ||
          c.cropName.toLowerCase().includes('green chilli') ||
          c.cropName.toLowerCase().includes('onion');
        const spoilagePct = isPerishable
          ? Math.min(12, +(0.4 + (distKm / 100) * 0.92).toFixed(1))
          : Math.min(5, +(0.2 + (distKm / 100) * 0.3).toFixed(1));
        const spoilageCost = Math.round((gross * spoilagePct) / 100);
        const netEarnings = Math.round(
          gross - transportCost - loadingCost - feeCost - spoilageCost
        );
        const netRatioPct = gross > 0 ? Math.max(0, Math.round((netEarnings / gross) * 100)) : 0;

        rows.push({
          id: `${m.id}-${c.id}`,
          marketId: m.id,
          marketName: m.marketName,
          location: `${m.marketLocation}, ${m.city}`,
          district: m.district,
          state: m.state,
          pinCode: m.pinCode,
          cropName: c.cropName,
          qualityAccepted: c.qualityAccepted,
          pricePerKg: c.pricePerKg,
          pricePerQuintal: c.pricePerQuintal,
          unit: c.unit,
          lastUpdated: c.lastUpdated,
          distanceKm: distKm,
          transportCost,
          marketFeeCost: feeCost + loadingCost,
          spoilageCost,
          grossRevenue: gross,
          netEarnings,
          netRatioPct,
        });
      }
    }

    return rows.sort((a, b) => {
      switch (marketSortBy) {
        case 'highest_net':
          return b.netEarnings - a.netEarnings;
        case 'highest_price':
          return b.pricePerKg - a.pricePerKg;
        case 'lowest_price':
          return a.pricePerKg - b.pricePerKg;
        case 'nearest':
          return a.distanceKm - b.distanceKm;
        case 'lowest_transport':
          return a.transportCost - b.transportCost;
        default:
          return b.netEarnings - a.netEarnings;
      }
    });
  }, [currentUser, markets, selectedMarketFilter, searchCropQuery, marketSortBy]);

  // If user is not signed in, strictly render the Login & Registration Page (Section 2)
  if (!currentUser) {
    return (
      <AuthGate
        lang={lang}
        onChangeLang={setLang}
        users={users}
        onSignIn={handleSignIn}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  const t = UI_TEXT[lang];
  const myRequestsCount = tradeRequests.filter(
    (r) =>
      (r.receiverId === currentUser.id || r.senderId === currentUser.id) && r.status === 'Pending'
  ).length;

  const navItems: Array<{ id: ActivePage; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: t.navDashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'market_prices', label: t.navMarketPrices, icon: <TrendingUp className="w-4 h-4" /> },
  ];

  if (currentUser.role === 'farmer') {
    navItems.push(
      { id: 'my_crops', label: t.navMyCrops, icon: <PackagePlus className="w-4 h-4" /> },
      { id: 'profit_calc', label: t.navProfitCalc, icon: <Calculator className="w-4 h-4" /> },
      { id: 'buyer_requirements', label: t.navFindBuyers, icon: <Users className="w-4 h-4" /> },
      {
        id: 'requests',
        label: `${t.navRequests}${myRequestsCount > 0 ? ` (${myRequestsCount})` : ''}`,
        icon: <MessageSquare className="w-4 h-4" />,
      }
    );
  } else if (currentUser.role === 'buyer') {
    navItems.push(
      { id: 'my_requirements', label: t.navMyRequirements, icon: <PackagePlus className="w-4 h-4" /> },
      { id: 'find_farmers', label: t.navFindFarmers, icon: <Users className="w-4 h-4" /> },
      {
        id: 'requests',
        label: `${t.navRequests}${myRequestsCount > 0 ? ` (${myRequestsCount})` : ''}`,
        icon: <MessageSquare className="w-4 h-4" />,
      }
    );
  } else if (currentUser.role === 'market_admin') {
    navItems.push({
      id: 'manage_markets',
      label: t.navManageMarkets,
      icon: <UserCheck className="w-4 h-4" />,
    });
  } else if (currentUser.role === 'main_admin') {
    navItems.push(
      { id: 'main_admin', label: t.navAdminApproval, icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'manage_markets', label: t.navManageMarkets, icon: <UserCheck className="w-4 h-4" /> }
    );
  }

  navItems.push({ id: 'profile', label: t.navProfile, icon: <UserCog className="w-4 h-4" /> });

  const bestMarketRow = marketComparisonRows[0];
  const topBuyerReq = buyerRequirements[0];

  const dashboardSlides = [
    {
      id: 'mandi-network',
      image: '/src/assets/images/rythumitra_mandi_market_1793295506378.jpg',
      isMandi: true,
      kicker: lang === 'en' ? 'SLIDE 01 / 03 · LIVE MANDI NETWORK' : '01 / 03 · ప్రత్యక్ష మార్కెట్ నెట్‌వర్క్',
      title: bestMarketRow
        ? `${translateCrop(bestMarketRow.cropName, lang)} @ ₹${bestMarketRow.pricePerKg}/kg — ${translateMarketName(bestMarketRow.marketName, lang)}`
        : 'AP & Telangana Official Market Network',
      metric: bestMarketRow
        ? `${formatCurrency(bestMarketRow.netEarnings)} Net (${bestMarketRow.netRatioPct}% Ratio)`
        : `${markets.length} Markets Active`,
      sub: bestMarketRow
        ? `${bestMarketRow.distanceKm} km · ${translateLocation(currentUser.address.city, lang)} · ${lang === 'en' ? 'Transport' : 'రవాణా'} −${formatCurrency(bestMarketRow.transportCost)}`
        : 'Real-time per-kg and per-quintal rates',
    },
    {
      id: 'profit-engine',
      image: '/src/assets/images/rythumitra_farming_hero_1793295504886.jpg',
      isMandi: false,
      kicker: lang === 'en' ? 'SLIDE 02 / 03 · NET PROFIT RATIO ENGINE' : '02 / 03 · నికర ఆదాయ నిష్పత్తి',
      title:
        lang === 'en'
          ? 'Smart Route & Spoilage Deduction Calculator'
          : 'రవాణా ఖర్చు & తరుగుదల పోను నికర లాభం',
      metric: lang === 'en' ? '1,000 kg Reference Lot' : '1,000 కిలోల పంట అంచనా',
      sub:
        lang === 'en'
          ? 'Compares Mini-Auto, Bolero Pickup, DCM 5-Ton & Eicher 10-Ton freight automatically'
          : 'ఆటో, బొలెరో, డీసీఎం మరియు ఐషర్ వాహనాల కిరాయి ఆధారంగా గణన',
    },
    {
      id: 'direct-buyer',
      image: '/src/assets/images/rythumitra_mandi_market_1793295506378.jpg',
      isMandi: true,
      kicker: lang === 'en' ? 'SLIDE 03 / 03 · 0% FEE DIRECT BUYERS' : '03 / 03 · నేరుగా కొనుగోలుదారుల బేరం',
      title: topBuyerReq
        ? `${translateLocation(topBuyerReq.buyerOrganization, lang)} — ${topBuyerReq.requiredQuantityKg.toLocaleString('en-IN')} kg ${translateCrop(topBuyerReq.cropName, lang)}`
        : 'Direct Farmer–Buyer Trade Desk',
      metric: topBuyerReq ? `₹${topBuyerReq.expectedPricePerKg}/kg · 0% Yard Fee` : '0% Commission',
      sub: topBuyerReq
        ? `${translateLocation(topBuyerReq.city, lang)}, ${translateLocation(topBuyerReq.district, lang)} · ${topBuyerReq.deliveryDate}`
        : 'Send direct supply requests and negotiate via live chat',
    },
  ];

  const activeDashSlide = dashboardSlides[dashboardSlideIdx];

  const stepDashboardSlide = (dir: 1 | -1) => {
    setDashboardSlideDir(dir);
    setDashboardSlideIdx((prev) => (prev + dir + dashboardSlides.length) % dashboardSlides.length);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#17231C] flex flex-col">
      {/* Top Bar Contract: Left Corner 3-Line Menu Toggle + Brand Title + Language Switcher Below Title */}
      <header className="flex items-center justify-between gap-6 px-6 py-3 bg-white border-b border-[#E4DEC9] sticky top-0 z-40">
        <div className="flex items-start gap-3.5 shrink-0">
          {/* 3-Line Hamburger Toggle Button in the Left Corner */}
          <button
            type="button"
            onClick={() => setIsNavMenuOpen((prev) => !prev)}
            aria-label={isNavMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isNavMenuOpen}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5 ${
              isNavMenuOpen
                ? 'bg-[#0F3D2A] text-white border-[#0F3D2A] shadow-xs'
                : 'bg-[#FAF8F3] text-[#0F3D2A] border-[#DFD7C2] hover:bg-[#F1EDE2]'
            }`}
          >
            {isNavMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex flex-col items-start gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateToPage('dashboard')}
              className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#0F3D2A] font-display whitespace-nowrap shrink-0 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0F3D2A] flex items-center justify-center text-amber-300 shadow-xs transition-transform duration-300 group-hover:scale-105">
                <Sprout className="w-4 h-4 transition-transform duration-300 group-hover:animate-pulse group-hover:scale-110" />
              </div>
              <span>RythuMitra (రైతుమిత్ర)</span>
            </button>

            <div
              role="group"
              aria-label="Language selection"
              className="inline-flex items-center gap-1 p-1 bg-[#F1EDE2] border border-[#DFD7C2] rounded-lg shrink-0"
            >
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`inline-flex items-center justify-center min-w-[76px] h-7 px-3 text-xs font-semibold leading-none rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#0F3D2A] text-white shadow-xs'
                    : 'text-[#4A584F] hover:text-[#17231C] hover:bg-[#E7E1D2]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('te')}
                className={`inline-flex items-center justify-center min-w-[76px] h-7 px-3 text-xs font-semibold leading-none rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'te'
                    ? 'bg-[#0F3D2A] text-white shadow-xs'
                    : 'text-[#4A584F] hover:text-[#17231C] hover:bg-[#E7E1D2]'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Body: Left-Corner Collapsible Drawer + Fluid Main Content Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto relative">
        {/* Left Navigation Drawer: Opens & Closes via 3-Line Button in Left Corner */}
        <AnimatePresence initial={false}>
          {isNavMenuOpen && (
            <>
              {/* Backdrop to close menu when clicking outside */}
              <motion.div
                key="nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setIsNavMenuOpen(false)}
                className="fixed inset-0 bg-black/35 z-30"
              />

              <motion.aside
                key="nav-drawer"
                initial={{ opacity: 0, x: -280 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -280 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-[89px] left-0 bottom-0 w-[290px] bg-white border-r border-[#E4DEC9] p-4 flex flex-col justify-between z-40 overflow-y-auto shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E4DEC9]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F3D2A]">
                      {lang === 'en' ? 'Navigation Menu' : 'మెనూ (Navigation)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNavMenuOpen(false)}
                      className="p-1 rounded-lg text-[#5A675E] hover:text-[#17231C] hover:bg-[#F1EDE2] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Farmer / Buyer / Admin Location Passbook Card */}
                  <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E4DEC9]">
                    <div className="text-[11px] font-mono text-[#C86D24] font-bold tracking-wider uppercase">
                      {translateRole(currentUser.role, lang)}
                    </div>
                    <div className="text-sm font-bold text-[#17231C] truncate mt-0.5">
                      {translateLocation(currentUser.fullName, lang)}
                    </div>
                    <div className="text-xs text-[#4A584F] mt-1 leading-relaxed">
                      {formatFullAddress(currentUser.address, lang)}
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const active = activePage === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateToPage(item.id)}
                          className={`relative flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active ? 'text-white' : 'text-[#36443B] hover:bg-[#F1EDE2]'
                          }`}
                        >
                          {active && (
                            <motion.div
                              layoutId="sidebarActiveSlide"
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 bg-[#0F3D2A] rounded-xl shadow-xs"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.label}</span>
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 mt-6 border-t border-[#E4DEC9]">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.signOut}</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Viewport */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 min-w-0 overflow-x-hidden flex flex-col justify-between">
          <AnimatePresence>
            {toastBanner && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="p-3.5 rounded-xl bg-[#0F3D2A] text-white text-xs font-semibold flex items-center justify-between shadow-sm"
              >
                <span>{toastBanner}</span>
                <button
                  type="button"
                  onClick={() => setToastBanner('')}
                  className="text-emerald-200 hover:text-white ml-4 cursor-pointer"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Directional Page Slide Container */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activePage}-${currentUser.id}`}
              initial={{ opacity: 0, x: pageDirection * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: pageDirection * -24 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* PAGE 1: COMMON DASHBOARD (Section 4) */}
              {activePage === 'dashboard' && (
                <div className="space-y-6">
                  {/* Balanced 7:5 Grid Ratio Hero with Interactive 16:10 Slide Carousel */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                  >
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#C86D24] font-bold">
                          <span>{t.tagline}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#0F3D2A]">
                            {lang === 'en' ? 'Registered Address:' : 'నమోదైన చిరునామా:'}{' '}
                            {formatFullAddress(currentUser.address, lang)}
                          </span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#17231C] font-display leading-tight">
                          {lang === 'en'
                            ? `Namaskaram, ${translateLocation(currentUser.fullName, 'en')}`
                            : `నమస్కారం, ${translateLocation(currentUser.fullName, 'te')}`}
                        </h1>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {currentUser.role === 'farmer' && (
                          <>
                            <button
                              type="button"
                              onClick={() => navigateToPage('profit_calc')}
                              className="h-10 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer shadow-xs"
                            >
                              {t.navProfitCalc}
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateToPage('my_crops')}
                              className="h-10 px-4 text-xs font-semibold text-[#17231C] bg-[#F1EDE2] hover:bg-[#E4DEC9] rounded-xl transition-colors cursor-pointer"
                            >
                              + {t.addCropTitle}
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateToPage('buyer_requirements')}
                              className="h-10 px-4 text-xs font-semibold text-[#17231C] bg-[#F1EDE2] hover:bg-[#E4DEC9] rounded-xl transition-colors cursor-pointer"
                            >
                              {t.navFindBuyers}
                            </button>
                          </>
                        )}
                        {currentUser.role === 'buyer' && (
                          <>
                            <button
                              type="button"
                              onClick={() => navigateToPage('find_farmers')}
                              className="h-10 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer shadow-xs"
                            >
                              {t.navFindFarmers}
                            </button>
                            <button
                              type="button"
                              onClick={() => navigateToPage('my_requirements')}
                              className="h-10 px-4 text-xs font-semibold text-[#17231C] bg-[#F1EDE2] hover:bg-[#E4DEC9] rounded-xl transition-colors cursor-pointer"
                            >
                              + {t.addRequirementTitle}
                            </button>
                          </>
                        )}
                        {currentUser.role === 'market_admin' && (
                          <button
                            type="button"
                            onClick={() => navigateToPage('manage_markets')}
                            className="h-10 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer shadow-xs"
                          >
                            {t.navManageMarkets}
                          </button>
                        )}
                        {currentUser.role === 'main_admin' && (
                          <button
                            type="button"
                            onClick={() => navigateToPage('main_admin')}
                            className="h-10 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer shadow-xs"
                          >
                            {t.navAdminApproval}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right 5 Columns: Aspect-Locked 16:10 Interactive Market & Profit Slide Deck */}
                    <div className="lg:col-span-5">
                      <div className="rounded-xl border border-[#E4DEC9] bg-[#0F3D2A] overflow-hidden h-full flex flex-col justify-between">
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F3D2A]">
                          <AnimatePresence initial={false} mode="wait">
                            <motion.div
                              key={activeDashSlide.id}
                              initial={{ opacity: 0, x: dashboardSlideDir * 32 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: dashboardSlideDir * -32 }}
                              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 w-full h-full"
                            >
                              {(activeDashSlide.isMandi ? !mandiImgError : !heroImgError) ? (
                                <img
                                  src={activeDashSlide.image}
                                  alt={activeDashSlide.title}
                                  referrerPolicy="no-referrer"
                                  onError={() =>
                                    activeDashSlide.isMandi
                                      ? setMandiImgError(true)
                                      : setHeroImgError(true)
                                  }
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-stone-200 bg-[#0F3D2A]">
                                  <Sprout className="w-8 h-8 text-amber-300 mb-1" />
                                  <span className="text-xs font-semibold">
                                    RythuMitra Live Market Network
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[11px] font-mono font-semibold text-amber-300">
                                    {activeDashSlide.kicker}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                                    {activeDashSlide.metric}
                                  </span>
                                </div>
                                <div className="text-sm font-bold text-white mt-1 line-clamp-1">
                                  {activeDashSlide.title}
                                </div>
                                <div className="text-[11px] text-stone-200 mt-0.5 line-clamp-1">
                                  {activeDashSlide.sub}
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <div className="px-3.5 py-2.5 bg-[#0A2B1D] border-t border-[#1C523B] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {dashboardSlides.map((s, idx) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                  setDashboardSlideDir(idx > dashboardSlideIdx ? 1 : -1);
                                  setDashboardSlideIdx(idx);
                                }}
                                aria-label={`Slide ${idx + 1}`}
                                className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                                  idx === dashboardSlideIdx
                                    ? 'w-5 bg-amber-400'
                                    : 'w-2 bg-emerald-800'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => stepDashboardSlide(-1)}
                              aria-label="Previous slide"
                              className="p-1 rounded bg-[#154A33] hover:bg-[#1E6346] text-stone-100 transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => stepDashboardSlide(1)}
                              aria-label="Next slide"
                              className="p-1 rounded bg-[#154A33] hover:bg-[#1E6346] text-stone-100 transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Equal 4-Column Summary Strip (1:1:1:1 Ratio) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                    {[
                      {
                        title:
                          lang === 'en' ? 'Connected Official Markets' : 'అందుబాటులో ఉన్న మార్కెట్లు',
                        value: markets.length,
                        sub: 'AP & Telangana APMC / Rythu Bazaars',
                        accent: false,
                      },
                      {
                        title: lang === 'en' ? 'Active Farmer Crop Lots' : 'రైతుల పంటల జాబితా',
                        value: farmerCrops.length,
                        sub: `${farmerCrops
                          .reduce((acc, c) => acc + c.quantityKg, 0)
                          .toLocaleString('en-IN')} kg total supply`,
                        accent: false,
                      },
                      {
                        title: lang === 'en' ? 'Active Buyer Requirements' : 'కొనుగోలుదారుల అవసరాలు',
                        value: buyerRequirements.length,
                        sub: `${buyerRequirements
                          .reduce((acc, b) => acc + b.requiredQuantityKg, 0)
                          .toLocaleString('en-IN')} kg direct demand`,
                        accent: false,
                      },
                      {
                        title: lang === 'en' ? 'Your Trade Requests' : 'మీ వ్యాపార అభ్యర్థనలు',
                        value: tradeRequests.filter(
                          (r) => r.senderId === currentUser.id || r.receiverId === currentUser.id
                        ).length,
                        sub: `${myRequestsCount} ${
                          lang === 'en' ? 'pending action' : 'పెండింగ్‌లో ఉన్నాయి'
                        }`,
                        accent: true,
                      },
                    ].map((stat, idx) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.22,
                          delay: idx * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="rm-card rounded-2xl p-4 flex flex-col justify-between h-full"
                      >
                        <div className="text-xs font-medium text-[#5A675E]">{stat.title}</div>
                        <div
                          className={`text-2xl font-bold font-mono tabular-nums mt-1.5 ${
                            stat.accent ? 'text-[#0F3D2A]' : 'text-[#17231C]'
                          }`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-[11px] text-[#5A675E] mt-1">{stat.sub}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Common Dashboard Live Market Price Search & Comparison Table */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl overflow-hidden"
                  >
                    <div className="p-5 border-b border-[#E4DEC9] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-[#17231C] font-display">
                          {lang === 'en'
                            ? 'Live Market Prices & Expected Net Earnings (Per 1,000 kg Reference Lot)'
                            : 'ప్రస్తుత మార్కెట్ ధరలు & అంచనా నికర ఆదాయం (1,000 కిలోల పంటకు)'}
                        </h2>
                        <p className="text-xs text-[#5A675E] mt-0.5">
                          {lang === 'en'
                            ? `Distances and transport costs automatically calculated from ${currentUser.address.villageOrTown}, ${currentUser.address.city}`
                            : `దూరం మరియు రవాణా ఖర్చు ${translateLocation(currentUser.address.villageOrTown, 'te')}, ${translateLocation(currentUser.address.city, 'te')} నుండి లెక్కించబడింది`}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-[#5A675E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchCropQuery}
                            onChange={(e) => setSearchCropQuery(e.target.value)}
                            placeholder={t.searchCropPlaceholder}
                            className="h-9 pl-8 pr-3 text-xs rm-input rounded-lg w-56"
                          />
                        </div>

                        <select
                          value={selectedMarketFilter}
                          onChange={(e) => setSelectedMarketFilter(e.target.value)}
                          className="h-9 px-3 text-xs rm-input rounded-lg"
                        >
                          <option value="all">{t.allMarkets}</option>
                          {markets.map((m) => (
                            <option key={m.id} value={m.id}>
                              {translateMarketName(m.marketName, lang)} ({translateLocation(m.city, lang)})
                            </option>
                          ))}
                        </select>

                        <select
                          value={marketSortBy}
                          onChange={(e) => setMarketSortBy(e.target.value as typeof marketSortBy)}
                          className="h-9 px-3 text-xs font-semibold rm-input rounded-lg"
                        >
                          <option value="highest_net">{t.sortHighestNet}</option>
                          <option value="highest_price">{t.sortHighestPrice}</option>
                          <option value="lowest_price">{t.sortLowestPrice}</option>
                          <option value="nearest">{t.sortNearestDistance}</option>
                          <option value="lowest_transport">{t.sortLowestTransport}</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E4DEC9] bg-[#F1EDE2]/70 text-[11px] font-bold text-[#36443B] uppercase tracking-wider">
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Crop' : 'పంట'}</th>
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Market Name & Location' : 'మార్కెట్ పేరు & ప్రాంతం'}</th>
                            <th className="py-3.5 px-4 text-right">{t.currentPrice}</th>
                            <th className="py-3.5 px-4">{t.lastUpdated}</th>
                            <th className="py-3.5 px-4 text-right">{t.estDistance}</th>
                            <th className="py-3.5 px-4 text-right">{t.estTransport} (1T)</th>
                            <th className="py-3.5 px-4 text-right">{t.estNetEarnings} & Ratio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4DEC9] text-xs">
                          {marketComparisonRows.map((row, idx) => (
                            <motion.tr
                              key={`${row.id}-${selectedMarketFilter}-${marketSortBy}-${searchCropQuery}`}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: Math.min(idx * 0.025, 0.22),
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className={
                                idx === 0 && marketSortBy === 'highest_net'
                                  ? 'bg-[#EEF6F1] hover:bg-[#E4F0E9]'
                                  : 'hover:bg-[#FAF8F3]'
                              }
                            >
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#17231C]">
                                  {translateCrop(row.cropName, lang)}
                                </div>
                                <div className="text-[11px] font-semibold text-[#0F3D2A] mt-0.5">
                                  {row.qualityAccepted.map((g) => translateGrade(g, lang)).join(', ')}
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#17231C]">
                                  {translateMarketName(row.marketName, lang)}
                                </div>
                                <div className="text-[11px] text-[#5A675E]">
                                  {translateLocation(row.location, lang)} ·{' '}
                                  {translateLocation(row.district, lang)} ({lang === 'en' ? 'PIN' : 'పిన్'} {row.pinCode})
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                <span className="font-bold text-[#17231C]">₹{row.pricePerKg}/kg</span>
                                <div className="text-[11px] text-[#5A675E]">
                                  ₹{row.pricePerQuintal.toLocaleString('en-IN')}/q (
                                  {translateLocation(row.unit, lang)})
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-[#5A675E]">
                                {row.lastUpdated}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#36443B]">
                                {row.distanceKm} km
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#B4342A]">
                                −{formatCurrency(row.transportCost)}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                <div className="font-bold text-[#0F3D2A]">
                                  {formatCurrency(row.netEarnings)}
                                </div>
                                <div className="text-[11px] text-[#5A675E]">
                                  {row.netRatioPct}% net ratio
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* PAGE 2: DEDICATED MARKET PRICE LISTING & COMPARISON PAGE */}
              {activePage === 'market_prices' && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-bold text-[#17231C] font-display">
                      {lang === 'en'
                        ? 'Official Market Price Directory & Multi-Market Net Profit Comparison'
                        : 'అధికారిక మార్కెట్ ధరల జాబితా & నికర ఆదాయ పోలిక'}
                    </h2>
                    <p className="text-xs text-[#5A675E] mt-1">
                      {lang === 'en'
                        ? 'Search any crop to compare prices across markets. RythuMitra prioritizes expected net earnings after deducting transport, market fees, and transit spoilage.'
                        : 'ఏదైనా పంటను ఎంచుకుని వివిధ మార్కెట్లలో ధరలను పోల్చండి. కేవలం గరిష్ట ధర కాకుండా రవాణా ఖర్చు పోను మిగిలే నికర లాభం ఆధారంగా మార్కెట్లను చూడండి.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <input
                        type="text"
                        value={searchCropQuery}
                        onChange={(e) => setSearchCropQuery(e.target.value)}
                        placeholder={t.searchCropPlaceholder}
                        className="h-10 px-3.5 text-xs rm-input rounded-lg"
                      />
                      <select
                        value={selectedMarketFilter}
                        onChange={(e) => setSelectedMarketFilter(e.target.value)}
                        className="h-10 px-3.5 text-xs rm-input rounded-lg"
                      >
                        <option value="all">{t.allMarkets}</option>
                        {markets.map((m) => (
                          <option key={m.id} value={m.id}>
                            {translateMarketName(m.marketName, lang)} ({translateLocation(m.city, lang)})
                          </option>
                        ))}
                      </select>
                      <select
                        value={marketSortBy}
                        onChange={(e) => setMarketSortBy(e.target.value as typeof marketSortBy)}
                        className="h-10 px-3.5 text-xs font-semibold rm-input rounded-lg"
                      >
                        <option value="highest_net">{t.sortHighestNet}</option>
                        <option value="highest_price">{t.sortHighestPrice}</option>
                        <option value="lowest_price">{t.sortLowestPrice}</option>
                        <option value="nearest">{t.sortNearestDistance}</option>
                        <option value="lowest_transport">{t.sortLowestTransport}</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E4DEC9] bg-[#F1EDE2]/70 text-[11px] font-bold text-[#36443B] uppercase tracking-wider">
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Market Name' : 'మార్కెట్ పేరు'}</th>
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Market Location' : 'మార్కెట్ ప్రాంతం'}</th>
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Crop' : 'పంట'}</th>
                            <th className="py-3.5 px-4 text-right">{t.currentPrice}</th>
                            <th className="py-3.5 px-4">{t.unit}</th>
                            <th className="py-3.5 px-4">{t.lastUpdated}</th>
                            <th className="py-3.5 px-4 text-right">{t.estDistance}</th>
                            <th className="py-3.5 px-4 text-right">{t.estTransport}</th>
                            <th className="py-3.5 px-4 text-right">{t.estNetEarnings} (1,000 kg)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4DEC9] text-xs">
                          {marketComparisonRows.map((row, idx) => (
                            <motion.tr
                              key={`mp-${row.id}-${selectedMarketFilter}-${marketSortBy}-${searchCropQuery}`}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: Math.min(idx * 0.025, 0.22),
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="hover:bg-[#FAF8F3]"
                            >
                              <td className="py-3.5 px-4 font-bold text-[#17231C]">
                                {translateMarketName(row.marketName, lang)}
                              </td>
                              <td className="py-3.5 px-4 text-[#4A584F]">
                                {translateLocation(row.location, lang)},{' '}
                                {translateLocation(row.district, lang)} ({lang === 'en' ? 'PIN' : 'పిన్'} {row.pinCode})
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#17231C]">
                                  {translateCrop(row.cropName, lang)}
                                </div>
                                <div className="text-[11px] font-semibold text-[#0F3D2A]">
                                  {row.qualityAccepted.map((g) => translateGrade(g, lang)).join(', ')}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#0F3D2A]">
                                ₹{row.pricePerKg}/kg (₹{row.pricePerQuintal}/q)
                              </td>
                              <td className="py-3.5 px-4 text-[#4A584F]">
                                {translateLocation(row.unit, lang)}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[11px] text-[#5A675E]">
                                {row.lastUpdated}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                {row.distanceKm} km
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#B4342A]">
                                −{formatCurrency(row.transportCost)}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                <div className="font-bold text-[#0F3D2A]">
                                  {formatCurrency(row.netEarnings)}
                                </div>
                                <div className="text-[11px] text-[#5A675E]">
                                  {row.netRatioPct}% net ratio
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* PAGE 3: FARMER CROP LISTING & MANAGEMENT PAGE */}
              {activePage === 'my_crops' && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-bold text-[#17231C] font-display">
                      {t.addCropTitle}
                    </h2>
                    <p className="text-xs text-[#5A675E] mt-0.5">
                      {lang === 'en'
                        ? 'List your harvested or upcoming crops so verified supermarkets, processors, and wholesale buyers can send you direct purchase offers.'
                        : 'మీ వద్ద అందుబాటులో ఉన్న పంట వివరాలను నమోదు చేయండి. కొనుగోలుదారులు నేరుగా మిమ్మల్ని సంప్రదిస్తారు.'}
                    </p>

                    <form
                      onSubmit={handleAddFarmerCrop}
                      className="mt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.cropName}
                        </label>
                        <CropSelector
                          lang={lang}
                          value={newCropName}
                          crops={availableCrops}
                          onChange={setNewCropName}
                          onAddCustomCrop={handleAddCustomCrop}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.availableQty}
                        </label>
                        <input
                          type="number"
                          min={50}
                          step={50}
                          value={newCropQty}
                          onChange={(e) => setNewCropQty(Number(e.target.value) || 0)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.cropQuality}
                        </label>
                        <select
                          value={newCropQuality}
                          onChange={(e) => setNewCropQuality(e.target.value as CropQuality)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                        >
                          <option value="Grade A">{translateGrade('Grade A', lang)}</option>
                          <option value="Grade B">{translateGrade('Grade B', lang)}</option>
                          <option value="Grade C">{translateGrade('Grade C', lang)}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.expectedSellingPrice}
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={0.5}
                          value={newCropPrice}
                          onChange={(e) => setNewCropPrice(Number(e.target.value) || 0)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.harvestDate}
                        </label>
                        <input
                          type="date"
                          value={newCropHarvestDate}
                          onChange={(e) => setNewCropHarvestDate(e.target.value)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.saveCropBtn}</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl overflow-hidden"
                  >
                    <div className="p-5 border-b border-[#E4DEC9]">
                      <h3 className="text-base font-bold text-[#17231C] font-display">
                        {lang === 'en' ? 'Your Published Crop Listings' : 'మీరు ప్రచురించిన పంటల జాబితా'}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E4DEC9] bg-[#F1EDE2]/70 text-[11px] font-bold text-[#36443B] uppercase tracking-wider">
                            <th className="py-3.5 px-4">{t.cropName}</th>
                            <th className="py-3.5 px-4 text-right">{t.availableQty}</th>
                            <th className="py-3.5 px-4">{t.cropQuality}</th>
                            <th className="py-3.5 px-4 text-right">{t.expectedSellingPrice}</th>
                            <th className="py-3.5 px-4">{t.harvestDate}</th>
                            <th className="py-3.5 px-4">{t.farmLocation}</th>
                            <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Actions' : 'చర్యలు'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4DEC9] text-xs">
                          {farmerCrops
                            .filter((c) => c.farmerId === currentUser.id)
                            .map((crop, idx) => (
                              <motion.tr
                                key={crop.id}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: Math.min(idx * 0.03, 0.2),
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="hover:bg-[#FAF8F3]"
                              >
                                <td className="py-3.5 px-4 font-bold text-[#17231C]">
                                  {translateCrop(crop.cropName, lang)}
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                  {crop.quantityKg.toLocaleString('en-IN')} kg
                                </td>
                                <td className="py-3.5 px-4 font-bold text-[#0F3D2A]">
                                  {translateGrade(crop.quality, lang)}
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold">
                                  ₹{crop.expectedPricePerKg}/kg
                                </td>
                                <td className="py-3.5 px-4 font-mono text-[#5A675E]">
                                  {crop.harvestDate}
                                </td>
                                <td className="py-3.5 px-4 text-[#4A584F]">
                                  <div className="font-semibold text-[#17231C]">
                                    {translateLocation(crop.farmLocation, lang)},{' '}
                                    {translateLocation(crop.district, lang)}
                                  </div>
                                  <div className="text-[11px] text-[#5A675E] mt-0.5">
                                    {formatFullAddress(crop.farmerAddress, lang)}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-right space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => navigateToPage('profit_calc')}
                                    className="font-bold text-[#0F3D2A] hover:underline cursor-pointer"
                                  >
                                    {lang === 'en' ? 'Compare Best Profit →' : 'లాభం పోల్చండి →'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFarmerCrops((prev) =>
                                        prev.filter((item) => item.id !== crop.id)
                                      )
                                    }
                                    className="text-[#B4342A] hover:underline cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 inline" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* PAGE 4: PROFIT & TRANSPORT CALCULATOR */}
              {activePage === 'profit_calc' && (
                <ProfitCalculatorView
                  lang={lang}
                  currentUser={currentUser}
                  farmerCrops={farmerCrops}
                  markets={markets}
                  buyers={buyerRequirements}
                  availableCrops={availableCrops}
                  onAddCustomCrop={handleAddCustomCrop}
                  onSendRequestToBuyer={handleSendRequestToBuyer}
                />
              )}

              {/* PAGE 5: FARMER VIEW OF BUYER REQUIREMENTS */}
              {activePage === 'buyer_requirements' && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-bold text-[#17231C] font-display">
                      {lang === 'en'
                        ? 'Verified Buyer Requirements — Direct Supply Opportunities'
                        : 'కొనుగోలుదారుల అవసరాలు — నేరుగా పంట అమ్మే అవకాశాలు'}
                    </h2>
                    <p className="text-xs text-[#5A675E] mt-1">
                      {lang === 'en'
                        ? 'Compare buyer requirements, inspect full buyer address, road distance, estimated transport cost, and expected net earnings before sending a direct supply request.'
                        : 'కొనుగోలుదారుల పూర్తి చిరునామా, దూరం, రవాణా ఖర్చు మరియు నికర ఆదాయాన్ని పోల్చి నేరుగా అభ్యర్థన పంపండి.'}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-4">
                    {buyerRequirements.map((req, idx) => {
                      const distKm = estimateRoadDistanceKm(
                        `${currentUser.address.villageOrTown} ${currentUser.address.city}`,
                        `${req.buyerLocation} ${req.city} ${req.district}`,
                        currentUser.address.pinCode,
                        req.buyerAddress.pinCode
                      );
                      const vehicle = selectRecommendedVehicle(req.requiredQuantityKg);
                      const trips = Math.max(
                        1,
                        Math.ceil(req.requiredQuantityKg / vehicle.capacityKg)
                      );
                      const transportCost = distKm * vehicle.ratePerKm * trips;
                      const loadingCost = Math.round(
                        (req.requiredQuantityKg / 1000) * vehicle.loadingChargePerTon
                      );
                      const gross = req.requiredQuantityKg * req.expectedPricePerKg;
                      const spoilageCost = Math.round(gross * 0.012);
                      const expectedNet = Math.round(
                        gross - transportCost - loadingCost - spoilageCost
                      );
                      const netRatioPct =
                        gross > 0 ? Math.max(0, Math.round((expectedNet / gross) * 100)) : 0;

                      return (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.22,
                            delay: Math.min(idx * 0.04, 0.2),
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="rm-card rounded-2xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                        >
                          <div className="lg:col-span-8">
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A675E]">
                                <span className="font-bold text-[#17231C]">
                                  {translateLocation(req.buyerOrganization, lang)}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>
                                  {lang === 'en' ? 'Contact:' : 'సంప్రదించండి:'}{' '}
                                  {translateLocation(req.buyerName, lang)}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#C86D24] font-semibold">
                                  {lang === 'en' ? 'Delivery by' : 'డెలివరీ తేదీ:'} {req.deliveryDate}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-[#17231C] font-display">
                                {translateCrop(req.cropName, lang)} —{' '}
                                <span className="font-mono tabular-nums">
                                  {req.requiredQuantityKg.toLocaleString('en-IN')} kg
                                </span>{' '}
                                ({translateGrade(req.requiredQuality, lang)}) @{' '}
                                <span className="text-[#0F3D2A] font-mono">
                                  ₹{req.expectedPricePerKg}/kg
                                </span>
                              </h3>

                              <p className="text-xs text-[#36443B]">
                                <span className="font-semibold">
                                  {lang === 'en'
                                    ? 'Buyer Registered Address:'
                                    : 'కొనుగోలుదారు చిరునామా:'}
                                </span>{' '}
                                {formatFullAddress(req.buyerAddress, lang)}
                              </p>

                              <p className="text-xs text-[#5A675E]">
                                {translateLocation(req.additionalRequirements, lang)}
                              </p>
                            </div>
                          </div>

                          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-end justify-between gap-3 bg-[#FAF8F3] p-4 rounded-xl border border-[#E4DEC9]">
                            <div className="text-left sm:text-right font-mono tabular-nums space-y-0.5">
                              <div className="text-xs text-[#5A675E]">
                                {t.estDistance}: {distKm} km · {t.estTransport}:{' '}
                                {formatCurrency(transportCost + loadingCost)}
                              </div>
                              <div className="text-xs text-[#36443B]">
                                {lang === 'en' ? 'Expected Net Earnings:' : 'అంచనా నికర ఆదాయం:'} (
                                {netRatioPct}% Ratio)
                              </div>
                              <div className="text-xl font-bold text-[#0F3D2A]">
                                {formatCurrency(expectedNet)}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleSendRequestToBuyer(
                                  req,
                                  req.requiredQuantityKg,
                                  req.expectedPricePerKg
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{t.sendRequest}</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PAGE 6: BUYER MODULE — ADD & MANAGE REQUIREMENTS */}
              {activePage === 'my_requirements' && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl p-6"
                  >
                    <h2 className="text-xl font-bold text-[#17231C] font-display">
                      {t.addRequirementTitle}
                    </h2>
                    <p className="text-xs text-[#5A675E] mt-0.5">
                      {lang === 'en'
                        ? 'Publish your required crop, quantity, quality grade, budget, and delivery date so matching farmers can supply directly.'
                        : 'మీకు కావలసిన పంట, పరిమాణం, నాణ్యత మరియు ధర వివరాలను ప్రచురించండి.'}
                    </p>

                    <form
                      onSubmit={handleAddBuyerRequirement}
                      className="mt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.cropName}
                        </label>
                        <CropSelector
                          lang={lang}
                          value={reqCropName}
                          crops={availableCrops}
                          onChange={setReqCropName}
                          onAddCustomCrop={handleAddCustomCrop}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.requiredQty}
                        </label>
                        <input
                          type="number"
                          min={50}
                          step={50}
                          value={reqQty}
                          onChange={(e) => setReqQty(Number(e.target.value) || 0)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.requiredQuality}
                        </label>
                        <select
                          value={reqQuality}
                          onChange={(e) => setReqQuality(e.target.value as CropQuality)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                        >
                          <option value="Grade A">{translateGrade('Grade A', lang)}</option>
                          <option value="Grade B">{translateGrade('Grade B', lang)}</option>
                          <option value="Grade C">{translateGrade('Grade C', lang)}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.expectedBudget}
                        </label>
                        <input
                          type="number"
                          min={1}
                          step={0.5}
                          value={reqBudget}
                          onChange={(e) => setReqBudget(Number(e.target.value) || 0)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.deliveryDate}
                        </label>
                        <input
                          type="date"
                          value={reqDeliveryDate}
                          onChange={(e) => setReqDeliveryDate(e.target.value)}
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.saveRequirementBtn}</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl overflow-hidden"
                  >
                    <div className="p-5 border-b border-[#E4DEC9]">
                      <h3 className="text-base font-bold text-[#17231C] font-display">
                        {lang === 'en'
                          ? 'Published Buyer Requirements'
                          : 'ప్రచురించిన కొనుగోలు అవసరాలు'}
                      </h3>
                    </div>
                    <div className="divide-y divide-[#E4DEC9]">
                      {buyerRequirements.map((r, idx) => (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: Math.min(idx * 0.03, 0.2),
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-[#FAF8F3]"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-[#17231C]">
                              {translateCrop(r.cropName, lang)} ·{' '}
                              <span className="font-mono">
                                {r.requiredQuantityKg.toLocaleString('en-IN')} kg
                              </span>{' '}
                              ({translateGrade(r.requiredQuality, lang)}) @ ₹{r.expectedPricePerKg}/kg
                            </div>
                            <div className="text-[#4A584F]">
                              {translateLocation(r.buyerOrganization, lang)} ·{' '}
                              {formatFullAddress(r.buyerAddress, lang)} ·{' '}
                              {lang === 'en' ? 'Delivery:' : 'డెలివరీ:'} {r.deliveryDate}
                            </div>
                            <div className="text-[#5A675E]">
                              {translateLocation(r.additionalRequirements, lang)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchCropQuery(r.cropName);
                              navigateToPage('find_farmers');
                            }}
                            className="px-3.5 py-2 text-xs font-semibold text-[#0F3D2A] bg-[#E3EFE8] hover:bg-[#D4E7DC] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {lang === 'en' ? 'Find Matching Farmers →' : 'సరిపోయే రైతులను చూడండి →'}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* PAGE 7: BUYER MODULE — FIND SUITABLE FARMERS & TOTAL PURCHASE COST */}
              {activePage === 'find_farmers' && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-[#17231C] font-display">
                          {lang === 'en'
                            ? 'Find Suitable Farmers & Estimate Total Purchase Cost'
                            : 'తగిన రైతులను కనుగొనండి & మొత్తం కొనుగోలు ఖర్చు అంచనా వేయండి'}
                        </h2>
                        <p className="text-xs font-mono text-[#4A584F] mt-1">
                          {t.buyerCostFormulaNotice}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={searchCropQuery}
                          onChange={(e) => setSearchCropQuery(e.target.value)}
                          placeholder={t.searchCropPlaceholder}
                          className="h-10 px-3.5 text-xs rm-input rounded-lg w-64"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="rm-card rounded-2xl overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E4DEC9] bg-[#F1EDE2]/70 text-[11px] font-bold text-[#36443B] uppercase tracking-wider">
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Farmer & Full Address' : 'రైతు పేరు & పూర్తి చిరునామా'}</th>
                            <th className="py-3.5 px-4">{lang === 'en' ? 'Available Crop & Grade' : 'పంట & నాణ్యత'}</th>
                            <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Quantity' : 'పరిమాణం'}</th>
                            <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Expected Price' : 'రైతు ధర'}</th>
                            <th className="py-3.5 px-4 text-right">{t.estDistance}</th>
                            <th className="py-3.5 px-4 text-right">{t.estTransport}</th>
                            <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Total Purchase Cost' : 'మొత్తం కొనుగోలు ఖర్చు'}</th>
                            <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Action' : 'చర్య'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4DEC9] text-xs">
                          {farmerCrops
                            .filter((fc) => {
                              const q = searchCropQuery.trim().toLowerCase();
                              if (!q) return true;
                              return (
                                fc.cropName.toLowerCase().includes(q) ||
                                translateCrop(fc.cropName, 'en').toLowerCase().includes(q) ||
                                translateCrop(fc.cropName, 'te').toLowerCase().includes(q)
                              );
                            })
                            .map((fc, idx) => {
                              const distKm = estimateRoadDistanceKm(
                                `${currentUser.address.villageOrTown} ${currentUser.address.city}`,
                                `${fc.farmLocation} ${fc.city} ${fc.district}`,
                                currentUser.address.pinCode,
                                fc.farmerAddress.pinCode
                              );
                              const vehicle = selectRecommendedVehicle(fc.quantityKg);
                              const trips = Math.max(
                                1,
                                Math.ceil(fc.quantityKg / vehicle.capacityKg)
                              );
                              const transportCost = distKm * vehicle.ratePerKm * trips;
                              const otherCharges = Math.round(
                                (fc.quantityKg / 1000) * vehicle.loadingChargePerTon
                              );
                              const cropPurchaseAmount = fc.quantityKg * fc.expectedPricePerKg;
                              const totalPurchaseCost =
                                cropPurchaseAmount + transportCost + otherCharges;
                              const landedPerKg = +(totalPurchaseCost / fc.quantityKg).toFixed(2);

                              const buyerReq = buyerRequirements.find(
                                (r) => r.cropName.toLowerCase() === fc.cropName.toLowerCase()
                              );
                              const meetsQty = buyerReq
                                ? fc.quantityKg >= buyerReq.requiredQuantityKg * 0.5
                                : true;
                              const meetsQuality = buyerReq
                                ? qualityRank(fc.quality) >= qualityRank(buyerReq.requiredQuality)
                                : true;

                              return (
                                <motion.tr
                                  key={`${fc.id}-${searchCropQuery}`}
                                  initial={{ opacity: 0, x: 12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: Math.min(idx * 0.03, 0.2),
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="hover:bg-[#FAF8F3]"
                                >
                                  <td className="py-3.5 px-4">
                                    <div className="font-bold text-[#17231C]">
                                      {translateLocation(fc.farmerName, lang)}
                                    </div>
                                    <div className="text-[11px] text-[#5A675E] mt-0.5">
                                      {formatFullAddress(fc.farmerAddress, lang)}
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <div>
                                      <div className="font-bold text-[#17231C]">
                                        {translateCrop(fc.cropName, lang)}
                                      </div>
                                      <div className="text-[11px] text-[#0F3D2A] font-bold">
                                        {translateGrade(fc.quality, lang)} ·{' '}
                                        {lang === 'en' ? 'Harvest:' : 'కోత తేదీ:'} {fc.harvestDate}
                                      </div>
                                      {meetsQty && meetsQuality ? (
                                        <div className="text-[11px] text-[#156042] flex items-center gap-1 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3" />{' '}
                                          {lang === 'en'
                                            ? 'Meets quality & quantity'
                                            : 'నాణ్యత & పరిమాణం సరిపోతుంది'}
                                        </div>
                                      ) : (
                                        <div className="text-[11px] text-[#C86D24] flex items-center gap-1 mt-0.5">
                                          <AlertTriangle className="w-3 h-3" />{' '}
                                          {lang === 'en'
                                            ? 'Partial quantity/grade match'
                                            : 'పాక్షిక నాణ్యత/పరిమాణం'}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold">
                                    {fc.quantityKg.toLocaleString('en-IN')} kg
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                    ₹{fc.expectedPricePerKg}/kg
                                    <div className="text-[11px] text-[#5A675E]">
                                      Crop: {formatCurrency(cropPurchaseAmount)}
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                    {distKm} km
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#36443B]">
                                    +{formatCurrency(transportCost + otherCharges)}
                                  </td>
                                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                                    <div className="font-bold text-sm text-[#17231C]">
                                      {formatCurrency(totalPurchaseCost)}
                                    </div>
                                    <div className="text-[11px] text-[#5A675E]">
                                      Landed: ₹{landedPerKg}/kg
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleSendRequestToFarmer(fc)}
                                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                    >
                                      {t.sendRequest}
                                    </button>
                                  </td>
                                </motion.tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* PAGE 8: COMMON REQUESTS & DIRECT CHAT MODULE */}
              {activePage === 'requests' && (
                <RequestsAndChatView
                  lang={lang}
                  currentUser={currentUser}
                  requests={tradeRequests}
                  onUpdateStatus={handleUpdateRequestStatus}
                  onSendMessage={handleSendChatMessage}
                />
              )}

              {/* PAGE 9: MARKET ADMINISTRATOR CONSOLE */}
              {activePage === 'manage_markets' && (
                <MarketAdminView
                  lang={lang}
                  currentUser={currentUser}
                  markets={markets}
                  availableCrops={availableCrops}
                  onAddCustomCrop={handleAddCustomCrop}
                  onAddMarket={handleAddMarket}
                  onAddOrUpdateCropPrice={handleAddOrUpdateCropPrice}
                />
              )}

              {/* PAGE 10: MAIN ADMINISTRATOR GOVERNANCE */}
              {activePage === 'main_admin' && (
                <MainAdminView
                  lang={lang}
                  users={users}
                  farmerCrops={farmerCrops}
                  buyerRequirements={buyerRequirements}
                  activityLogs={activityLogs}
                  onToggleApproveMarketAdmin={handleToggleApproveMarketAdmin}
                  onRemoveFarmerCrop={(id) =>
                    setFarmerCrops((prev) => prev.filter((c) => c.id !== id))
                  }
                  onRemoveBuyerRequirement={(id) =>
                    setBuyerRequirements((prev) => prev.filter((b) => b.id !== id))
                  }
                />
              )}

              {/* PAGE 11: USER PROFILE & 12-FIELD ADDRESS DETAILS PAGE */}
              {activePage === 'profile' && profileForm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="rm-card rounded-2xl p-6 max-w-4xl"
                >
                  <h2 className="text-xl font-bold text-[#17231C] font-display">
                    {lang === 'en'
                      ? 'User Profile & 12-Field Registered Address Details'
                      : 'వినియోగదారు ప్రొఫైల్ & పూర్తి చిరునామా వివరాలు'}
                  </h2>
                  <p className="text-xs text-[#5A675E] mt-1">{t.addressHelper}</p>

                  {/* Live Bilingual Registered Address Summary Card */}
                  <div className="mt-4 p-4 rounded-xl bg-[#FAF8F3] border border-[#E4DEC9] space-y-1">
                    <div className="text-[11px] font-mono font-bold text-[#C86D24] uppercase tracking-wider">
                      {translateRole(profileForm.role, lang)} ·{' '}
                      {lang === 'en' ? 'Registered Full Address' : 'నమోదైన పూర్తి చిరునామా'}
                    </div>
                    <div className="text-sm font-bold text-[#17231C]">
                      {translateLocation(profileForm.fullName, lang)}
                    </div>
                    <div className="text-xs text-[#36443B]">
                      {formatFullAddress(profileForm.address, lang)}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setUsers((prev) =>
                        prev.map((u) => (u.id === profileForm.id ? profileForm : u))
                      );
                      setCurrentUser(profileForm);
                      showToast(
                        lang === 'en'
                          ? 'Profile and address updated. All road distances and transport costs recalculated!'
                          : 'ప్రొఫైల్ మరియు చిరునామా నవీకరించబడ్డాయి!'
                      );
                    }}
                    className="mt-6 space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.fullName}
                        </label>
                        <input
                          type="text"
                          value={translateLocation(profileForm.fullName, lang)}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, fullName: e.target.value })
                          }
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.username}
                        </label>
                        <input
                          type="text"
                          value={profileForm.username}
                          disabled
                          className="w-full h-10 px-3 text-xs bg-[#F1EDE2] border border-[#E4DEC9] rounded-lg font-mono text-[#5A675E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.emailAddress}
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.phoneNumber}
                        </label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E4DEC9]">
                      <h3 className="text-xs font-bold text-[#0F3D2A] mb-3">
                        {t.addressSectionTitle}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.houseNumber}
                          </label>
                          <input
                            type="text"
                            value={translateLocation(profileForm.address.houseNumber, lang)}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, houseNumber: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.streetName}
                          </label>
                          <input
                            type="text"
                            value={translateLocation(profileForm.address.streetName, lang)}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, streetName: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.villageOrTown}
                          </label>
                          <input
                            type="text"
                            value={translateLocation(profileForm.address.villageOrTown, lang)}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, villageOrTown: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.city}
                          </label>
                          <input
                            type="text"
                            value={translateLocation(profileForm.address.city, lang)}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, city: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.district}
                          </label>
                          <input
                            type="text"
                            value={translateLocation(profileForm.address.district, lang)}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, district: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.state}
                          </label>
                          <input
                            type="text"
                            value={translateLocation(profileForm.address.state, lang)}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, state: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1.5">
                            {t.pinCode}
                          </label>
                          <input
                            type="text"
                            value={profileForm.address.pinCode}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                address: { ...profileForm.address, pinCode: e.target.value },
                              })
                            }
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="h-10 px-5 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer"
                    >
                      {lang === 'en'
                        ? 'Save Profile & Recalculate Distances'
                        : 'చిరునామా వివరాలు సేవ్ చేయండి'}
                    </button>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
