import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Send, ArrowUpDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  BuyerRequirement,
  CropQuality,
  FarmerCropListing,
  Language,
  MarketRecord,
  UserAccount,
} from '../types';
import {
  evaluateSellingOpportunities,
  VEHICLE_OPTIONS,
} from '../data/seedData';
import {
  formatCurrency,
  translateCrop,
  translateGrade,
  translateLocation,
  UI_TEXT,
} from '../i18n';
import { CropSelector } from './CropSelector';

interface ProfitCalculatorViewProps {
  lang: Language;
  currentUser: UserAccount;
  farmerCrops: FarmerCropListing[];
  markets: MarketRecord[];
  buyers: BuyerRequirement[];
  availableCrops: string[];
  onAddCustomCrop: (newCropName: string) => void;
  onSendRequestToBuyer: (buyer: BuyerRequirement, qtyKg: number, offeredPrice: number) => void;
}

type SortKey = 'highest_net' | 'highest_price' | 'lowest_price' | 'nearest' | 'lowest_transport';

export const ProfitCalculatorView: React.FC<ProfitCalculatorViewProps> = ({
  lang,
  currentUser,
  farmerCrops,
  markets,
  buyers,
  availableCrops,
  onAddCustomCrop,
  onSendRequestToBuyer,
}) => {
  const t = UI_TEXT[lang];
  const myCrops = farmerCrops.filter((c) => c.farmerId === currentUser.id);
  const initialCrop = myCrops[0] || farmerCrops[0];

  const [selectedCropName, setSelectedCropName] = useState<string>(initialCrop?.cropName || 'Tomatoes');
  const [quantityKg, setQuantityKg] = useState<number>(initialCrop?.quantityKg || 1000);
  const [quality, setQuality] = useState<CropQuality>(initialCrop?.quality || 'Grade A');
  const [farmLocationText, setFarmLocationText] = useState<string>(
    `${currentUser.address.villageOrTown}, ${currentUser.address.city}, ${currentUser.address.district}`
  );
  const [vehicleId, setVehicleId] = useState<string>('auto');
  const [otherCost, setOtherCost] = useState<number>(200);
  const [sortBy, setSortBy] = useState<SortKey>('highest_net');
  const [filterType, setFilterType] = useState<'all' | 'market' | 'buyer'>('all');

  const handleLoadFromListing = (listing: FarmerCropListing) => {
    setSelectedCropName(listing.cropName);
    setQuantityKg(listing.quantityKg);
    setQuality(listing.quality);
    setFarmLocationText(`${listing.farmLocation}, ${listing.city}, ${listing.district}`);
  };

  const rawEvaluations = useMemo(() => {
    return evaluateSellingOpportunities({
      cropName: selectedCropName,
      quantityKg: Math.max(10, quantityKg),
      quality,
      farmLocationText,
      farmPinCode: currentUser.address.pinCode,
      preferredVehicleId: vehicleId,
      customOtherCost: otherCost,
      markets,
      buyers,
    });
  }, [
    selectedCropName,
    quantityKg,
    quality,
    farmLocationText,
    currentUser.address.pinCode,
    vehicleId,
    otherCost,
    markets,
    buyers,
  ]);

  const recommendedOption = useMemo(() => {
    const eligible = rawEvaluations.filter((e) => e.qualityMatch && e.quantityAccepted);
    const pool = eligible.length > 0 ? eligible : rawEvaluations;
    if (pool.length === 0) return null;
    return [...pool].sort((a, b) => b.netEarnings - a.netEarnings)[0];
  }, [rawEvaluations]);

  const highestGrossOption = useMemo(() => {
    if (rawEvaluations.length === 0) return null;
    return [...rawEvaluations].sort((a, b) => b.offeredPricePerKg - a.offeredPricePerKg)[0];
  }, [rawEvaluations]);

  const sortedEvaluations = useMemo(() => {
    const filtered = rawEvaluations.filter((item) =>
      filterType === 'all' ? true : item.type === filterType
    );
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'highest_net':
          return b.netEarnings - a.netEarnings;
        case 'highest_price':
          return b.offeredPricePerKg - a.offeredPricePerKg;
        case 'lowest_price':
          return a.offeredPricePerKg - b.offeredPricePerKg;
        case 'nearest':
          return a.distanceKm - b.distanceKm;
        case 'lowest_transport':
          return a.transportCost - b.transportCost;
        default:
          return b.netEarnings - a.netEarnings;
      }
    });
  }, [rawEvaluations, sortBy, filterType]);

  const recommendedRatios = useMemo(() => {
    if (!recommendedOption || recommendedOption.grossRevenue <= 0) return null;
    const gross = recommendedOption.grossRevenue;
    const netPct = Math.max(0, +((recommendedOption.netEarnings / gross) * 100).toFixed(1));
    const transPct = Math.max(0, +((recommendedOption.transportCost / gross) * 100).toFixed(1));
    const feesPct = Math.max(
      0,
      +(((recommendedOption.marketFeeCost + recommendedOption.otherSellingCost) / gross) * 100).toFixed(1)
    );
    const spoilPct = Math.max(0, +((recommendedOption.spoilageLossCost / gross) * 100).toFixed(1));
    return { netPct, transPct, feesPct, spoilPct };
  }, [recommendedOption]);

  return (
    <div className="space-y-6">
      {/* Header & Quick Load from Farmer's Crops */}
      <div className="rm-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E4DEC9]">
          <div>
            <h2 className="text-xl font-bold text-[#17231C] font-display flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F3D2A] text-amber-300 flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <span>
                {lang === 'en'
                  ? 'Transportation Cost, Market Fee & Expected Net Profit Calculator'
                  : 'రవాణా ఖర్చు, మార్కెట్ ఫీజు & నికర లాభం పోలిక సాధనం'}
              </span>
            </h2>
            <p className="text-xs font-mono text-[#4A584F] mt-1.5">{t.netFormulaNotice}</p>
          </div>

          {myCrops.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#5A675E]">
                {lang === 'en' ? 'Load your listed crop:' : 'మీ పంటను ఎంచుకోండి:'}
              </span>
              {myCrops.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => handleLoadFromListing(crop)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCropName === crop.cropName && quantityKg === crop.quantityKg
                      ? 'bg-[#0F3D2A] text-white border-[#0F3D2A]'
                      : 'bg-[#FAF8F3] text-[#17231C] border-[#E4DEC9] hover:bg-[#F1EDE2]'
                  }`}
                >
                  <span>
                    {translateCrop(crop.cropName, lang)} ({translateGrade(crop.quality, lang)}) ·{' '}
                    {crop.quantityKg.toLocaleString('en-IN')} kg
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Parameter Controls (Balanced 6-Column Equal Grid Ratio) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-5">
          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {t.cropName}
            </label>
            <CropSelector
              lang={lang}
              value={selectedCropName}
              crops={availableCrops}
              onChange={setSelectedCropName}
              onAddCustomCrop={onAddCustomCrop}
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
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value) || 0)}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {t.cropQuality}
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as CropQuality)}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg"
            >
              <option value="Grade A">
                {lang === 'en' ? 'Grade A (Export / Prime)' : 'గ్రేడ్ ఎ (ఉత్తమ / ఎగుమతి నాణ్యత)'}
              </option>
              <option value="Grade B">
                {lang === 'en' ? 'Grade B (Standard)' : 'గ్రేడ్ బి (సాధారణ నాణ్యత)'}
              </option>
              <option value="Grade C">
                {lang === 'en' ? 'Grade C (Processing)' : 'గ్రేడ్ సి (ప్రాసెసింగ్ నాణ్యత)'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {t.farmLocation}
            </label>
            <input
              type="text"
              value={translateLocation(farmLocationText, lang)}
              onChange={(e) => setFarmLocationText(e.target.value)}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {lang === 'en' ? 'Vehicle Type' : 'వాహనం రకం'}
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg"
            >
              <option value="auto">
                {lang === 'en' ? 'Auto-Select Optimal Vehicle' : 'ఆటోమేటిక్ ఉత్తమ వాహనం'}
              </option>
              {VEHICLE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {lang === 'en' ? v.nameEn : v.nameTe} (₹{v.ratePerKm}/km)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {lang === 'en' ? 'Packing / Weighbridge (₹)' : 'ఇతర ప్యాకింగ్ ఖర్చు (₹)'}
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={otherCost}
              onChange={(e) => setOtherCost(Number(e.target.value) || 0)}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
            />
          </div>
        </div>
      </div>

      {/* #1 Recommended Selling Option Banner with Proportional Cost-to-Profit Ratio Bar */}
      <AnimatePresence mode="wait">
        {recommendedOption && (
          <motion.div
            key={`rec-${recommendedOption.id}-${quantityKg}-${quality}-${vehicleId}`}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0F3D2A] text-stone-100 rounded-2xl p-6 border border-[#1E5B41] space-y-5 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.recommendedOption}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-200">
                    {recommendedOption.type === 'buyer'
                      ? lang === 'en'
                        ? 'Direct Buyer (0% Market Fee)'
                        : 'నేరుగా కొనుగోలుదారు (0% మార్కెట్ ఫీజు)'
                      : lang === 'en'
                      ? 'Official APMC Market'
                      : 'అధికారిక మార్కెట్ యార్డ్'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white font-display">
                  {translateLocation(recommendedOption.destinationName, lang)} — {translateLocation(recommendedOption.locationLabel, lang)}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-200 font-mono tabular-nums">
                  <span>
                    {lang === 'en' ? 'Offered Price:' : 'ధర:'} ₹{recommendedOption.offeredPricePerKg}/kg
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'en' ? 'Road Distance:' : 'దూరం:'} {recommendedOption.distanceKm} km
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'en' ? 'Vehicle:' : 'వాహనం:'}{' '}
                    {translateLocation(recommendedOption.vehicleUsed, lang)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'en' ? 'Grade:' : 'గ్రేడ్:'} {translateGrade(quality, lang)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'en' ? 'Quantity Accepted:' : 'పరిమాణం:'}{' '}
                    {recommendedOption.sellableQuantityKg.toLocaleString('en-IN')} kg
                  </span>
                </div>

                {highestGrossOption &&
                  highestGrossOption.id !== recommendedOption.id &&
                  highestGrossOption.offeredPricePerKg > recommendedOption.offeredPricePerKg && (
                    <p className="text-xs text-amber-200 pt-1 leading-relaxed">
                      {lang === 'en'
                        ? `Smart Advisory: While ${highestGrossOption.destinationName} offers a higher headline price (₹${highestGrossOption.offeredPricePerKg}/kg), its ${highestGrossOption.distanceKm} km distance costs ${formatCurrency(highestGrossOption.transportCost)} in transport and ${formatCurrency(highestGrossOption.spoilageLossCost)} in spoilage. Selling to ${recommendedOption.destinationName} earns you ${formatCurrency(recommendedOption.netEarnings - highestGrossOption.netEarnings)} MORE in pure net profit.`
                        : `గమనిక: ${translateLocation(highestGrossOption.destinationName, lang)} లో కిలో ధర ఎక్కువగా (₹${highestGrossOption.offeredPricePerKg}) ఉన్నప్పటికీ, ${highestGrossOption.distanceKm} కి.మీ రవాణా మరియు తరుగుదల ఖర్చుల వల్ల నికర ఆదాయం తగ్గుతుంది. కాబట్టి ${translateLocation(recommendedOption.destinationName, lang)} ఎంచుకోవడం ద్వారా మీకు ${formatCurrency(recommendedOption.netEarnings - highestGrossOption.netEarnings)} అదనపు నికర లాభం వస్తుంది.`}
                    </p>
                  )}
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-end justify-between gap-3 bg-[#154D36] p-4 rounded-xl border border-[#24694D]">
                <div className="sm:text-right">
                  <div className="text-xs text-emerald-200">
                    {lang === 'en' ? 'Expected Net Earnings (Take-Home)' : 'అంచనా నికర ఆదాయం (Net Profit)'}
                  </div>
                  <div className="text-3xl font-bold text-white font-mono tabular-nums mt-0.5">
                    {formatCurrency(recommendedOption.netEarnings)}
                  </div>
                  <div className="text-xs text-amber-300 font-mono tabular-nums mt-0.5">
                    {lang === 'en' ? 'Effective Net:' : 'నికర కిలో ఆదాయం:'} ₹{recommendedOption.netPerKg}/kg
                  </div>
                </div>

                {recommendedOption.type === 'buyer' && recommendedOption.buyerRecord && (
                  <button
                    type="button"
                    onClick={() =>
                      onSendRequestToBuyer(
                        recommendedOption.buyerRecord!,
                        recommendedOption.sellableQuantityKg,
                        recommendedOption.offeredPricePerKg
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-400 text-[#0F3D2A] hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.sendRequest}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Proportional Revenue-to-Profit Ratio Bar */}
            {recommendedRatios && (
              <div className="pt-4 border-t border-[#1E5B41] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums">
                  <span className="text-emerald-200 font-semibold">
                    {lang === 'en'
                      ? 'Revenue Allocation Ratio (100% Gross Revenue Breakdown):'
                      : 'స్థూల ఆదాయంలో నికర లాభం & ఖర్చుల నిష్పత్తి:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-[11px]">
                    <span className="text-emerald-300 font-bold">
                      {lang === 'en' ? 'Net Profit:' : 'నికర లాభం:'} {recommendedRatios.netPct}%
                    </span>
                    <span className="text-amber-300">
                      {lang === 'en' ? 'Transport:' : 'రవాణా:'} {recommendedRatios.transPct}%
                    </span>
                    <span className="text-stone-300">
                      {lang === 'en' ? 'Fees & Loading:' : 'ఫీజులు:'} {recommendedRatios.feesPct}%
                    </span>
                    <span className="text-red-300">
                      {lang === 'en' ? 'Spoilage:' : 'తరుగుదల:'} {recommendedRatios.spoilPct}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-md bg-[#09271B] overflow-hidden flex">
                  <div
                    style={{ width: `${recommendedRatios.netPct}%` }}
                    className="bg-emerald-400 h-full transition-all duration-300"
                    title={`Net Profit: ${recommendedRatios.netPct}%`}
                  />
                  <div
                    style={{ width: `${recommendedRatios.transPct}%` }}
                    className="bg-amber-400 h-full transition-all duration-300"
                    title={`Transport: ${recommendedRatios.transPct}%`}
                  />
                  <div
                    style={{ width: `${recommendedRatios.feesPct}%` }}
                    className="bg-stone-400 h-full transition-all duration-300"
                    title={`Fees & Loading: ${recommendedRatios.feesPct}%`}
                  />
                  <div
                    style={{ width: `${recommendedRatios.spoilPct}%` }}
                    className="bg-red-400 h-full transition-all duration-300"
                    title={`Spoilage: ${recommendedRatios.spoilPct}%`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter & Sort Controls + Detailed Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="rm-card rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[#E4DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1 p-1 bg-[#F1EDE2] border border-[#DFD7C2] rounded-lg self-start">
            {(
              [
                {
                  id: 'all',
                  label:
                    lang === 'en'
                      ? 'All Options (Markets + Buyers)'
                      : 'అన్ని ఎంపికలు (మార్కెట్లు + కొనుగోలుదారులు)',
                },
                {
                  id: 'market',
                  label: lang === 'en' ? 'Official Markets Only' : 'మార్కెట్లు మాత్రమే',
                },
                {
                  id: 'buyer',
                  label: lang === 'en' ? 'Direct Buyers Only' : 'కొనుగోలుదారులు మాత్రమే',
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#0F3D2A] text-white shadow-xs'
                    : 'text-[#4A584F] hover:text-[#17231C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#5A675E] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-10 px-3.5 text-xs font-semibold rm-input rounded-lg"
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
                <th className="py-3.5 px-4">{lang === 'en' ? 'Rank & Option' : 'ర్యాంక్ & మార్కెట్ / కొనుగోలుదారు'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Price/kg' : 'కిలో ధర'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Distance' : 'దూరం'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Gross Revenue' : 'స్థూల ఆదాయం'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Transport (−)' : 'రవాణా ఖర్చు (−)'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Fees & Loading (−)' : 'ఫీజు & లోడింగ్ (−)'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Spoilage Loss (−)' : 'తరుగుదల (−)'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Net Profit & Ratio' : 'నికర లాభం & నిష్పత్తి'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Action' : 'చర్య'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DEC9] text-xs">
              {sortedEvaluations.map((ev, idx) => {
                const isBest = recommendedOption?.id === ev.id;
                const netRatioPct =
                  ev.grossRevenue > 0
                    ? Math.max(0, Math.round((ev.netEarnings / ev.grossRevenue) * 100))
                    : 0;
                return (
                  <motion.tr
                    key={`${ev.id}-${sortBy}-${filterType}-${selectedCropName}-${quantityKg}`}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: Math.min(idx * 0.03, 0.25),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={
                      isBest
                        ? 'bg-[#EEF6F1] hover:bg-[#E4F0E9] transition-colors'
                        : 'hover:bg-[#FAF8F3] transition-colors'
                    }
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#17231C] flex items-center gap-2">
                        <span className="font-mono text-[#5A675E]">#{idx + 1}</span>
                        <span>{translateLocation(ev.destinationName, lang)}</span>
                        {isBest && (
                          <span className="text-[11px] font-bold text-[#0F3D2A]">
                            · {lang === 'en' ? 'Best Net Profit' : 'ఉత్తమ నికర లాభం'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#5A675E] mt-0.5">
                        {ev.type === 'market'
                          ? lang === 'en'
                            ? 'Official Market'
                            : 'అధికారిక మార్కెట్'
                          : lang === 'en'
                          ? 'Direct Buyer'
                          : 'నేరుగా కొనుగోలుదారు'}{' '}
                        · {translateLocation(ev.locationLabel, lang)},{' '}
                        {translateLocation(ev.district, lang)} ·{' '}
                        {ev.sellableQuantityKg.toLocaleString('en-IN')} kg (
                        {translateGrade(quality, lang)})
                        {!ev.qualityMatch && (
                          <span className="text-[#C86D24] font-semibold">
                            {' '}
                            · <AlertTriangle className="w-3 h-3 inline" />{' '}
                            {lang === 'en' ? 'Grade mismatch' : 'గ్రేడ్ సరిపోలలేదు'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#17231C]">
                      ₹{ev.offeredPricePerKg}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#4A584F]">
                      {ev.distanceKm} km
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#17231C]">
                      {formatCurrency(ev.grossRevenue)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#B4342A]">
                      −{formatCurrency(ev.transportCost)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#B4342A]">
                      −{formatCurrency(ev.marketFeeCost + ev.otherSellingCost)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#B4342A]">
                      −{formatCurrency(ev.spoilageLossCost)} ({ev.spoilagePercent}%)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-sm text-[#0F3D2A]">
                        {formatCurrency(ev.netEarnings)}
                      </div>
                      <div className="text-[11px] text-[#5A675E]">
                        ₹{ev.netPerKg}/kg · {netRatioPct}% take-home
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ev.type === 'buyer' && ev.buyerRecord ? (
                        <button
                          type="button"
                          onClick={() =>
                            onSendRequestToBuyer(
                              ev.buyerRecord!,
                              ev.sellableQuantityKg,
                              ev.offeredPricePerKg
                            )
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          {t.sendRequest}
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#5A675E] whitespace-nowrap font-medium">
                          {lang === 'en' ? 'Open Yard Auction' : 'మార్కెట్ యార్డ్ వేలం'}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
