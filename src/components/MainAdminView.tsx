import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Check, X, Trash2 } from 'lucide-react';
import {
  ActivityLogItem,
  BuyerRequirement,
  FarmerCropListing,
  Language,
  UserAccount,
} from '../types';
import {
  formatFullAddress,
  translateCrop,
  translateGrade,
  translateLocation,
  translateRole,
} from '../i18n';

interface MainAdminViewProps {
  lang: Language;
  users: UserAccount[];
  farmerCrops: FarmerCropListing[];
  buyerRequirements: BuyerRequirement[];
  activityLogs: ActivityLogItem[];
  onToggleApproveMarketAdmin: (userId: string, approved: boolean) => void;
  onRemoveFarmerCrop: (cropId: string) => void;
  onRemoveBuyerRequirement: (reqId: string) => void;
}

export const MainAdminView: React.FC<MainAdminViewProps> = ({
  lang,
  users,
  farmerCrops,
  buyerRequirements,
  activityLogs,
  onToggleApproveMarketAdmin,
  onRemoveFarmerCrop,
  onRemoveBuyerRequirement,
}) => {
  const marketAdmins = users.filter((u) => u.role === 'market_admin');

  return (
    <div className="space-y-6">
      {/* 1. Market Administrator Approval Queue (Section 12) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="rm-card rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[#E4DEC9] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17231C] font-display flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F3D2A] text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>
                {lang === 'en'
                  ? 'Market Administrator Account Approvals'
                  : 'మార్కెట్ అడ్మినిస్ట్రేటర్ ఖాతాల ఆమోదం'}
              </span>
            </h2>
            <p className="text-xs text-[#5A675E] mt-1">
              {lang === 'en'
                ? 'Only approved Market Administrators are authorized to publish official market prices.'
                : 'ఆమోదించబడిన మార్కెట్ అడ్మినిస్ట్రేటర్లు మాత్రమే అధికారిక మార్కెట్ ధరలను ప్రచురించగలరు.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E4DEC9] bg-[#F1EDE2]/70 text-[11px] font-bold text-[#36443B] uppercase tracking-wider">
                <th className="py-3.5 px-4">{lang === 'en' ? 'Administrator Name' : 'అడ్మిన్ పేరు'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Contact & Username' : 'వివరాలు'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Registered Address' : 'చిరునామా'}</th>
                <th className="py-3.5 px-4">{lang === 'en' ? 'Authorization Status' : 'ప్రస్తుత స్థితి'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'en' ? 'Action' : 'చర్య'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DEC9] text-xs">
              {marketAdmins.map((admin, idx) => (
                <motion.tr
                  key={`${admin.id}-${admin.approved}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: Math.min(idx * 0.04, 0.2),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="hover:bg-[#FAF8F3]"
                >
                  <td className="py-3.5 px-4 font-bold text-[#17231C]">{translateLocation(admin.fullName, lang)}</td>
                  <td className="py-3.5 px-4 text-[#4A584F] font-mono">
                    @{admin.username} · {admin.phone}
                  </td>
                  <td className="py-3.5 px-4 text-[#4A584F]">
                    {formatFullAddress(admin.address, lang)}
                  </td>
                  <td className="py-3.5 px-4">
                    {admin.approved ? (
                      <span className="font-bold text-[#0F3D2A]">
                        {lang === 'en' ? 'Approved (Authorized)' : 'ఆమోదించబడింది'}
                      </span>
                    ) : (
                      <span className="font-bold text-[#C86D24]">
                        {lang === 'en' ? 'Pending Approval' : 'ఆమోదం పెండింగ్‌లో ఉంది'}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {admin.approved ? (
                      <button
                        type="button"
                        onClick={() => onToggleApproveMarketAdmin(admin.id, false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#B4342A] bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Revoke Access' : 'అనుమతి రద్దు'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleApproveMarketAdmin(admin.id, true)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Approve Administrator' : 'ఆమోదించండి'}</span>
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 2. Registered Users & Moderation of Listings (1:1 Split Ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rm-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#E4DEC9] bg-[#FAF8F3]">
            <h3 className="text-sm font-bold text-[#17231C]">
              {lang === 'en'
                ? `Registered Platform Users (${users.length})`
                : `నమోదైన వినియోగదారులు (${users.length})`}
            </h3>
          </div>
          <div className="divide-y divide-[#E4DEC9] max-h-96 overflow-y-auto">
            {users.map((u) => (
              <div key={u.id} className="p-4 text-xs space-y-1 hover:bg-[#FAF8F3]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17231C]">{translateLocation(u.fullName, lang)}</span>
                  <span className="font-mono font-semibold text-[#0F3D2A]">
                    {translateRole(u.role, lang)}
                  </span>
                </div>
                <div className="text-[#4A584F] font-mono">
                  @{u.username} · {u.email} · {u.phone}
                </div>
                <div className="text-[#5A675E]">{formatFullAddress(u.address, lang)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rm-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#E4DEC9] bg-[#FAF8F3]">
            <h3 className="text-sm font-bold text-[#17231C]">
              {lang === 'en' ? 'Platform Activity & Price Audit Log' : 'ప్లాట్‌ఫారమ్ కార్యాచరణ చిట్టా'}
            </h3>
          </div>
          <div className="divide-y divide-[#E4DEC9] max-h-96 overflow-y-auto">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 text-xs space-y-1 hover:bg-[#FAF8F3]">
                <div className="flex items-center justify-between text-[#5A675E] font-mono">
                  <span>
                    {translateLocation(log.actorName, lang)} ({translateRole(log.actorRole, lang)})
                  </span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-[#17231C] font-medium">
                  {lang === 'en' ? log.actionEn : log.actionTe}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Content Moderation: Remove Inappropriate or Incorrect Listings */}
      <div className="rm-card rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-[#17231C]">
          {lang === 'en'
            ? 'Listing Governance — Review & Remove Incorrect Farmer or Buyer Listings'
            : 'తప్పుడు పంట లేదా కొనుగోలు వివరాల తొలగింపు'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#36443B]">
              {lang === 'en' ? 'Active Farmer Crop Listings' : 'రైతుల పంటల జాబితా'}
            </div>
            {farmerCrops.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#E4DEC9] bg-[#FAF8F3] text-xs"
              >
                <div className="space-y-0.5">
                  <div>
                    <span className="font-bold text-[#17231C]">
                      {translateCrop(c.cropName, lang)}
                    </span>{' '}
                    ({translateGrade(c.quality, lang)}) · {c.quantityKg} kg @ ₹
                    {c.expectedPricePerKg}/kg ({translateLocation(c.farmerName, lang)})
                  </div>
                  <div className="text-[11px] text-[#5A675E]">
                    {formatFullAddress(c.farmerAddress, lang)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFarmerCrop(c.id)}
                  className="text-[#B4342A] hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Remove' : 'తొలగించు'}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#36443B]">
              {lang === 'en' ? 'Active Buyer Requirement Listings' : 'కొనుగోలుదారుల అవసరాల జాబితా'}
            </div>
            {buyerRequirements.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[#E4DEC9] bg-[#FAF8F3] text-xs"
              >
                <div className="space-y-0.5">
                  <div>
                    <span className="font-bold text-[#17231C]">
                      {translateCrop(b.cropName, lang)}
                    </span>{' '}
                    ({translateGrade(b.requiredQuality, lang)}) · {b.requiredQuantityKg} kg @ ₹
                    {b.expectedPricePerKg}/kg ({translateLocation(b.buyerOrganization, lang)})
                  </div>
                  <div className="text-[11px] text-[#5A675E]">
                    {formatFullAddress(b.buyerAddress, lang)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveBuyerRequirement(b.id)}
                  className="text-[#B4342A] hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Remove' : 'తొలగించు'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
