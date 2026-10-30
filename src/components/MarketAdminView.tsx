import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, History, RefreshCw, AlertCircle } from 'lucide-react';
import {
  CropQuality,
  Language,
  MarketCropPrice,
  MarketRecord,
  PriceUnit,
  UserAccount,
} from '../types';
import {
  formatFullAddress,
  translateCrop,
  translateGrade,
  translateLocation,
  translateMarketName,
} from '../i18n';
import { CropSelector } from './CropSelector';

interface MarketAdminViewProps {
  lang: Language;
  currentUser: UserAccount;
  markets: MarketRecord[];
  availableCrops: string[];
  onAddCustomCrop: (newCropName: string) => void;
  onAddMarket: (newMarket: MarketRecord) => void;
  onAddOrUpdateCropPrice: (
    marketId: string,
    cropName: string,
    priceValue: number,
    unit: PriceUnit,
    marketFeePercent: number
  ) => void;
}

export const MarketAdminView: React.FC<MarketAdminViewProps> = ({
  lang,
  currentUser,
  markets,
  availableCrops,
  onAddCustomCrop,
  onAddMarket,
  onAddOrUpdateCropPrice,
}) => {
  const isApproved = currentUser.approved || currentUser.role === 'main_admin';

  const [selectedMarketId, setSelectedMarketId] = useState<string>(
    currentUser.managedMarketId || markets[0]?.id || ''
  );
  const [cropName, setCropName] = useState('Tomatoes');
  const [priceInput, setPriceInput] = useState<number>(25);
  const [unit, setUnit] = useState<PriceUnit>('per kg');
  const [marketFeePercent] = useState<number>(1.0);
  const [statusNotice, setStatusNotice] = useState('');

  // New Market Form
  const [showNewMarketForm, setShowNewMarketForm] = useState(false);
  const [newMarketName, setNewMarketName] = useState('');
  const [newMarketLocation, setNewMarketLocation] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newPinCode, setNewPinCode] = useState('');

  // Inline quick price edit
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number>(0);

  const selectedMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];

  const handlePublishPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApproved || !selectedMarket) return;
    if (!cropName.trim() || priceInput <= 0) return;

    onAddCustomCrop(cropName.trim());
    onAddOrUpdateCropPrice(
      selectedMarket.id,
      cropName.trim(),
      priceValueToKg(priceInput, unit),
      unit,
      marketFeePercent
    );
    setStatusNotice(
      lang === 'en'
        ? `Official price for ${cropName} updated in ${selectedMarket.marketName}.`
        : `${translateMarketName(selectedMarket.marketName, lang)} లో ${translateCrop(cropName, lang)} అధికారిక ధర నవీకరించబడింది.`
    );
  };

  const priceValueToKg = (val: number, u: PriceUnit) => {
    return u === 'per quintal' ? +(val / 100).toFixed(2) : val;
  };

  const handleCreateMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApproved) return;
    if (!newMarketName.trim() || !newCity.trim() || !newDistrict.trim()) return;

    const created: MarketRecord = {
      id: `mkt-${Date.now()}`,
      marketName: newMarketName.trim(),
      marketLocation: newMarketLocation.trim() || newCity.trim(),
      city: newCity.trim(),
      district: newDistrict.trim(),
      state: currentUser.address.state || 'Andhra Pradesh',
      pinCode: newPinCode.trim() || currentUser.address.pinCode,
      adminId: currentUser.id,
      crops: [
        {
          id: `mc-${Date.now()}`,
          cropName: 'Tomatoes',
          pricePerKg: 24,
          pricePerQuintal: 2400,
          unit: 'per kg',
          qualityAccepted: ['Grade A', 'Grade B'] as CropQuality[],
          maxCapacityKg: 20000,
          marketFeePercent: 1.0,
          lastUpdated: new Date().toLocaleString('en-IN'),
          updatedByAdminId: currentUser.id,
          history: [],
        },
      ],
    };

    onAddMarket(created);
    setSelectedMarketId(created.id);
    setShowNewMarketForm(false);
    setNewMarketName('');
    setNewMarketLocation('');
    setNewCity('');
    setNewDistrict('');
    setNewPinCode('');
  };

  const handleInlineSave = (crop: MarketCropPrice) => {
    if (!selectedMarket || inlinePriceValue <= 0) return;
    onAddOrUpdateCropPrice(
      selectedMarket.id,
      crop.cropName,
      inlinePriceValue,
      crop.unit,
      crop.marketFeePercent
    );
    setEditingCropId(null);
  };

  return (
    <div className="space-y-6">
      {/* Unapproved Market Admin Warning Banner (Section 12 Requirement) */}
      {!isApproved && (
        <div className="bg-[#FEF6EB] border border-[#E5C298] rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#C86D24] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-[#17231C]">
              {lang === 'en'
                ? 'Market Administrator Account Pending Main Administrator Approval'
                : 'మార్కెట్ అడ్మినిస్ట్రేటర్ ఖాతా ప్రధాన అడ్మిన్ ఆమోదం కోసం వేచి ఉంది'}
            </h3>
            <p className="text-xs text-[#4A584F] mt-1">
              {lang === 'en'
                ? 'Per platform governance rules, only approved Market Administrators are authorized to publish or modify official market prices. Switch to the Main Administrator account to approve this profile.'
                : 'నిబంధనల ప్రకారం, ఆమోదించబడిన మార్కెట్ అడ్మినిస్ట్రేటర్లు మాత్రమే అధికారిక ధరలను ప్రచురించగలరు.'}
            </p>
          </div>
        </div>
      )}

      {/* Top Controls: Select Managed Market or Add New Market */}
      <div className="rm-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4DEC9]">
          <div>
            <h2 className="text-xl font-bold text-[#17231C] font-display">
              {lang === 'en'
                ? 'Market Administrator Console — Official Crop Price Publishing'
                : 'మార్కెట్ అడ్మినిస్ట్రేటర్ విభాగం — అధికారిక పంట ధరల నిర్వహణ'}
            </h2>
            <p className="text-xs text-[#5A675E] mt-0.5">
              {lang === 'en'
                ? 'Add market details, update daily per-kg or per-quintal crop rates, and audit historical price logs.'
                : 'మార్కెట్ వివరాలు జోడించండి, రోజువారీ కిలో లేదా క్వింటా ధరలను నవీకరించండి.'}
            </p>
          </div>

          {isApproved && (
            <button
              type="button"
              onClick={() => setShowNewMarketForm(!showNewMarketForm)}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-semibold text-[#17231C] bg-[#F1EDE2] hover:bg-[#E4DEC9] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {lang === 'en' ? 'Add New Market Yard' : 'కొత్త మార్కెట్ యార్డ్ జోడించండి'}
              </span>
            </button>
          )}
        </div>

        {/* Add New Market Form (Section 5.2) */}
        {showNewMarketForm && isApproved && (
          <form
            onSubmit={handleCreateMarket}
            className="mt-5 p-4 bg-[#FAF8F3] border border-[#E4DEC9] rounded-xl space-y-4"
          >
            <div className="text-xs font-bold text-[#0F3D2A]">
              {lang === 'en' ? 'Register New Agricultural Market Yard' : 'కొత్త మార్కెట్ యార్డ్ నమోదు'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Market Name (e.g. Warangal Enumamula Yard)"
                value={newMarketName}
                onChange={(e) => setNewMarketName(e.target.value)}
                className="sm:col-span-2 h-10 px-3 text-xs rm-input rounded-lg"
              />
              <input
                type="text"
                placeholder="Market Location / Road"
                value={newMarketLocation}
                onChange={(e) => setNewMarketLocation(e.target.value)}
                className="h-10 px-3 text-xs rm-input rounded-lg"
              />
              <input
                type="text"
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="h-10 px-3 text-xs rm-input rounded-lg"
              />
              <input
                type="text"
                placeholder="District"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="h-10 px-3 text-xs rm-input rounded-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="PIN Code (e.g. 506002)"
                value={newPinCode}
                onChange={(e) => setNewPinCode(e.target.value)}
                className="w-40 h-10 px-3 text-xs rm-input rounded-lg font-mono"
              />
              <button
                type="submit"
                className="h-10 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg cursor-pointer"
              >
                {lang === 'en' ? 'Save Market' : 'మార్కెట్ సేవ్ చేయండి'}
              </button>
            </div>
          </form>
        )}

        {/* Select Market & Add/Update Crop Price Form (6-Column Ratio) */}
        <form onSubmit={handlePublishPrice} className="mt-5 grid grid-cols-1 sm:grid-cols-6 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {lang === 'en' ? 'Select Market Yard' : 'మార్కెట్ యార్డ్ ఎంచుకోండి'}
            </label>
            <select
              value={selectedMarket?.id || ''}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {translateMarketName(m.marketName, lang)} ({translateLocation(m.city, lang)}, {translateLocation(m.district, lang)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {lang === 'en' ? 'Crop Name' : 'పంట పేరు'}
            </label>
            <CropSelector
              lang={lang}
              value={cropName}
              crops={availableCrops}
              onChange={setCropName}
              onAddCustomCrop={onAddCustomCrop}
              disabled={!isApproved}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {lang === 'en' ? 'Price Unit' : 'ధర యూనిట్'}
            </label>
            <select
              value={unit}
              onChange={(e) => {
                const nextUnit = e.target.value as PriceUnit;
                setUnit(nextUnit);
                if (nextUnit === 'per quintal' && priceInput < 200) {
                  setPriceInput(priceInput * 100);
                } else if (nextUnit === 'per kg' && priceInput >= 200) {
                  setPriceInput(+(priceInput / 100).toFixed(2));
                }
              }}
              disabled={!isApproved}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg"
            >
              <option value="per kg">{lang === 'en' ? 'Per Kilogram (₹/kg)' : 'కిలోకు (₹/kg)'}</option>
              <option value="per quintal">
                {lang === 'en' ? 'Per Quintal (₹/100kg)' : 'క్వింటాకు (₹/100kg)'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
              {unit === 'per kg'
                ? lang === 'en'
                  ? 'Current Price (₹/kg)'
                  : 'ప్రస్తుత ధర (₹/కిలో)'
                : lang === 'en'
                ? 'Current Price (₹/quintal)'
                : 'ప్రస్తుత ధర (₹/క్వింటా)'}
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={priceInput}
              onChange={(e) => setPriceInput(Number(e.target.value) || 0)}
              disabled={!isApproved}
              className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!isApproved}
              className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] disabled:bg-stone-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Publish Price' : 'ధర ప్రచురించండి'}</span>
            </button>
          </div>
        </form>

        {statusNotice && (
          <div className="mt-4 text-xs font-bold text-[#0F3D2A]">{statusNotice}</div>
        )}
      </div>

      {/* Managed Market Crop Prices & Historical Audit Log */}
      {selectedMarket && (
        <motion.div
          key={selectedMarket.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="rm-card rounded-2xl overflow-hidden"
        >
          <div className="p-5 border-b border-[#E4DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#17231C] font-display">
                {translateMarketName(selectedMarket.marketName, lang)}
              </h3>
              <p className="text-xs text-[#5A675E]">
                {translateLocation(selectedMarket.marketLocation, lang)},{' '}
                {translateLocation(selectedMarket.city, lang)},{' '}
                {translateLocation(selectedMarket.district, lang)}{' '}
                {lang === 'en' ? 'Dist.' : 'జిల్లా'} — {lang === 'en' ? 'PIN' : 'పిన్'}{' '}
                {selectedMarket.pinCode}
              </p>
              <p className="text-[11px] text-[#4A584F] mt-0.5">
                {lang === 'en' ? 'Admin Registered Address:' : 'అడ్మిన్ చిరునామా:'}{' '}
                {formatFullAddress(currentUser.address, lang)}
              </p>
            </div>
            <div className="text-xs font-semibold text-[#0F3D2A]">
              {lang === 'en'
                ? `${selectedMarket.crops.length} Official Crop Rates Published`
                : `${selectedMarket.crops.length} అధికారిక పంట ధరలు`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4DEC9] bg-[#F1EDE2]/70 text-[11px] font-bold text-[#36443B] uppercase tracking-wider">
                  <th className="py-3.5 px-4">{lang === 'en' ? 'Crop Name' : 'పంట పేరు'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Price / kg' : 'కిలో ధర'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Price / Quintal' : 'క్వింటా ధర'}</th>
                  <th className="py-3.5 px-4">{lang === 'en' ? 'Unit' : 'యూనిట్'}</th>
                  <th className="py-3.5 px-4">{lang === 'en' ? 'Last Updated Date & Time' : 'చివరిగా నవీకరించిన సమయం'}</th>
                  <th className="py-3.5 px-4">{lang === 'en' ? 'Previously Entered Prices' : 'గత ధరల చరిత్ర'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Quick Update' : 'సవరణ'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4DEC9] text-xs">
                {selectedMarket.crops.map((crop, idx) => (
                  <motion.tr
                    key={`${selectedMarket.id}-${crop.id}-${crop.lastUpdated}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(idx * 0.03, 0.2),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="hover:bg-[#FAF8F3]"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#17231C]">
                        {translateCrop(crop.cropName, lang)}
                      </div>
                      <div className="text-[11px] font-semibold text-[#0F3D2A] mt-0.5">
                        {crop.qualityAccepted.map((g) => translateGrade(g, lang)).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-[#0F3D2A]">
                      {editingCropId === crop.id ? (
                        <input
                          type="number"
                          step="0.5"
                          value={inlinePriceValue}
                          onChange={(e) => setInlinePriceValue(Number(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-right rm-input rounded font-mono"
                        />
                      ) : (
                        `₹${crop.pricePerKg}`
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#36443B]">
                      ₹{crop.pricePerQuintal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#4A584F]">{translateLocation(crop.unit, lang)}</td>
                    <td className="py-3.5 px-4 font-mono text-[#5A675E]">{crop.lastUpdated}</td>
                    <td className="py-3.5 px-4 text-[#5A675E]">
                      {crop.history.length === 0 ? (
                        <span>{lang === 'en' ? 'Initial entry' : 'మొదటి నమోదు'}</span>
                      ) : (
                        <div className="space-y-0.5">
                          {crop.history.slice(-2).map((h, i) => (
                            <div key={i} className="text-[11px] font-mono">
                              <History className="w-3 h-3 inline mr-1 text-[#738077]" />₹
                              {h.pricePerKg}/kg (₹{h.pricePerQuintal}/q) · {h.updatedAt}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isApproved &&
                        (editingCropId === crop.id ? (
                          <button
                            type="button"
                            onClick={() => handleInlineSave(crop)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-[#0F3D2A] rounded-md cursor-pointer"
                          >
                            {lang === 'en' ? 'Save' : 'సేవ్'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCropId(crop.id);
                              setInlinePriceValue(crop.pricePerKg);
                            }}
                            className="px-3 py-1 text-xs font-semibold text-[#0F3D2A] hover:underline cursor-pointer"
                          >
                            {lang === 'en' ? 'Edit Price' : 'ధర మార్చు'}
                          </button>
                        ))}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};
