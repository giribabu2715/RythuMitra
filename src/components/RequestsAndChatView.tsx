import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Check, X, Ban } from 'lucide-react';
import { Language, RequestStatus, TradeRequest, UserAccount } from '../types';
import {
  formatCurrency,
  formatFullAddress,
  translateCrop,
  translateGrade,
  translateLocation,
  translateRole,
  UI_TEXT,
} from '../i18n';

interface RequestsAndChatViewProps {
  lang: Language;
  currentUser: UserAccount;
  requests: TradeRequest[];
  onUpdateStatus: (requestId: string, newStatus: RequestStatus) => void;
  onSendMessage: (requestId: string, text: string) => void;
}

export const RequestsAndChatView: React.FC<RequestsAndChatViewProps> = ({
  lang,
  currentUser,
  requests,
  onUpdateStatus,
  onSendMessage,
}) => {
  const t = UI_TEXT[lang];
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [tabDirection, setTabDirection] = useState<1 | -1>(1);

  const myReceived = requests.filter((r) => r.receiverId === currentUser.id);
  const mySent = requests.filter((r) => r.senderId === currentUser.id);
  const myAll = [...myReceived, ...mySent];

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    myReceived[0]?.id || mySent[0]?.id || ''
  );
  const [chatInput, setChatInput] = useState('');

  const displayedList = activeTab === 'received' ? myReceived : mySent;
  const activeChatRequest = myAll.find((r) => r.id === selectedRequestId) || displayedList[0];

  const handleTabSwitch = (nextTab: 'received' | 'sent') => {
    if (nextTab === activeTab) return;
    setTabDirection(nextTab === 'sent' ? 1 : -1);
    setActiveTab(nextTab);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatRequest || !chatInput.trim()) return;
    onSendMessage(activeChatRequest.id, chatInput.trim());
    setChatInput('');
  };

  const renderStatusText = (status: RequestStatus) => {
    if (status === 'Accepted') {
      return <span className="font-bold text-[#0F3D2A]">{t.statusAccepted}</span>;
    }
    if (status === 'Rejected') {
      return <span className="font-bold text-[#B4342A]">{t.statusRejected}</span>;
    }
    if (status === 'Cancelled') {
      return <span className="font-semibold text-[#627067]">{t.statusCancelled}</span>;
    }
    return <span className="font-bold text-[#C86D24]">{t.statusPending}</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Columns: Sent & Received Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-7 rm-card rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[#E4DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#17231C] font-display">
              {lang === 'en'
                ? 'Farmer–Buyer Direct Trade Requests'
                : 'రైతు–కొనుగోలుదారు ప్రత్యక్ష అభ్యర్థనలు'}
            </h2>
            <p className="text-xs text-[#5A675E] mt-0.5">
              {lang === 'en'
                ? 'Private to your account · Review counterparty address, pricing, and status'
                : 'మీ ఖాతాకు మాత్రమే పరిమితం · చిరునామా, ధర మరియు స్థితిని ట్రాక్ చేయండి'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-[#F1EDE2] border border-[#DFD7C2] rounded-lg self-start">
            <button
              type="button"
              onClick={() => handleTabSwitch('received')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'received'
                  ? 'bg-[#0F3D2A] text-white shadow-xs'
                  : 'text-[#4A584F] hover:text-[#17231C]'
              }`}
            >
              {t.receivedRequests} ({myReceived.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('sent')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'sent'
                  ? 'bg-[#0F3D2A] text-white shadow-xs'
                  : 'text-[#4A584F] hover:text-[#17231C]'
              }`}
            >
              {t.sentRequests} ({mySent.length})
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {displayedList.length === 0 ? (
            <motion.div
              key={`empty-${activeTab}`}
              initial={{ opacity: 0, x: tabDirection * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tabDirection * -24 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 text-center text-[#5A675E] text-sm"
            >
              {lang === 'en'
                ? 'No requests in this view yet. Send a request from the Buyer Requirements or Find Farmers page.'
                : 'ఈ విభాగంలో ప్రస్తుతం అభ్యర్థనలు లేవు.'}
            </motion.div>
          ) : (
            <motion.div
              key={`list-${activeTab}`}
              initial={{ opacity: 0, x: tabDirection * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tabDirection * -24 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="divide-y divide-[#E4DEC9]"
            >
              {displayedList.map((req, idx) => {
                const isReceived = req.receiverId === currentUser.id;
                const counterpartyName = isReceived ? req.senderName : req.receiverName;
                const counterpartyRole = isReceived ? req.senderRole : req.receiverRole;
                const counterpartyAddress = isReceived ? req.senderAddress : req.receiverAddress;
                const isSelected = activeChatRequest?.id === req.id;

                return (
                  <motion.div
                    key={`${req.id}-${activeTab}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(idx * 0.04, 0.2),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`p-5 transition-colors ${
                      isSelected ? 'bg-[#EEF6F1]' : 'hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A675E] font-mono">
                        <span className="font-bold text-[#17231C]">{req.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{req.dateOfRequest}</span>
                        <span aria-hidden="true">·</span>
                        {renderStatusText(req.status)}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedRequestId(req.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#0F3D2A] bg-[#E3EFE8] hover:bg-[#D4E7DC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>
                          {t.openChat} ({req.messages.length})
                        </span>
                      </button>
                    </div>

                    <div className="mt-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#17231C]">
                          {translateCrop(req.cropName, lang)} —{' '}
                          <span className="font-mono tabular-nums">
                            {req.quantityKg.toLocaleString('en-IN')} kg
                          </span>{' '}
                          ({translateGrade(req.quality, lang)})
                        </h3>
                        <p className="text-xs text-[#36443B] mt-1">
                          {lang === 'en' ? 'Counterparty:' : 'ఇతర పక్షం:'}{' '}
                          <span className="font-semibold">{translateLocation(counterpartyName, lang)}</span> ({translateRole(counterpartyRole, lang)})
                        </p>
                        <p className="text-xs text-[#5A675E] mt-0.5">
                          {lang === 'en' ? 'Full Registered Address:' : 'పూర్తి చిరునామా:'}{' '}
                          {formatFullAddress(counterpartyAddress, lang)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0 font-mono tabular-nums">
                        <div className="text-sm font-bold text-[#0F3D2A]">
                          ₹{req.offeredPricePerKg}/kg
                        </div>
                        <div className="text-xs text-[#4A584F]">
                          Total: {formatCurrency(req.quantityKg * req.offeredPricePerKg)}
                        </div>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs text-[#36443B] bg-[#FAF8F3] p-3 rounded-lg border border-[#E4DEC9]">
                      {lang === 'en'
                        ? `${req.senderRole === 'farmer' ? 'Direct supply offer' : 'Direct purchase offer'} from ${translateLocation(req.senderName, 'en')} (${translateLocation(req.senderAddress.city, 'en')}) for ${req.quantityKg.toLocaleString('en-IN')} kg ${translateCrop(req.cropName, 'en')} at ₹${req.offeredPricePerKg}/kg.`
                        : `${translateLocation(req.senderName, 'te')} (${translateLocation(req.senderAddress.city, 'te')}) నుండి ${req.quantityKg.toLocaleString('en-IN')} కిలోల ${translateCrop(req.cropName, 'te')} కోసం కిలో ₹${req.offeredPricePerKg} చొప్పున ${req.senderRole === 'farmer' ? 'నేరుగా సరఫరా ప్రతిపాదన' : 'నేరుగా కొనుగోలు ప్రతిపాదన'}.`}
                    </p>

                    {/* Action Controls for Pending Requests */}
                    {req.status === 'Pending' && (
                      <div className="mt-3 pt-3 border-t border-[#E4DEC9] flex items-center gap-2.5">
                        {isReceived ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(req.id, 'Accepted')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{t.acceptBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(req.id, 'Rejected')}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#B4342A] bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{t.rejectBtn}</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(req.id, 'Cancelled')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#36443B] bg-[#F1EDE2] hover:bg-[#E4DEC9] rounded-lg transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{t.cancelBtn}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right 5 Columns: Direct Farmer-Buyer Chat Thread */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-5 rm-card rounded-2xl flex flex-col h-[580px] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {activeChatRequest ? (
            <motion.div
              key={activeChatRequest.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full"
            >
              <div className="p-4 border-b border-[#E4DEC9] bg-[#FAF8F3] flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#0F3D2A]">
                      {activeChatRequest.id}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-[#5A675E]">
                      {translateCrop(activeChatRequest.cropName, lang)} (
                      {translateGrade(activeChatRequest.quality, lang)}) ·{' '}
                      {activeChatRequest.quantityKg.toLocaleString('en-IN')} kg @ ₹
                      {activeChatRequest.offeredPricePerKg}/kg
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#17231C] mt-0.5 truncate">
                    {lang === 'en' ? 'Direct Chat with ' : 'ప్రత్యక్ష సంభాషణ: '}
                    {translateLocation(
                      activeChatRequest.senderId === currentUser.id
                        ? activeChatRequest.receiverName
                        : activeChatRequest.senderName,
                      lang
                    )}
                  </h3>
                  <p className="text-[11px] text-[#5A675E] truncate">
                    {formatFullAddress(
                      activeChatRequest.senderId === currentUser.id
                        ? activeChatRequest.receiverAddress
                        : activeChatRequest.senderAddress,
                      lang
                    )}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F4EE]">
                {activeChatRequest.messages.length === 0 ? (
                  <div className="text-center text-xs text-[#5A675E] py-12">
                    {lang === 'en'
                      ? 'Start a direct conversation regarding crate packaging, weighbridge slip, or transport schedule.'
                      : 'రవాణా సమయం, ప్యాకేజింగ్ లేదా ధర గురించి నేరుగా సందేశం పంపండి.'}
                  </div>
                ) : (
                  activeChatRequest.messages.map((msg) => {
                    const isMine = msg.senderId === currentUser.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[11px] text-[#5A675E] mb-1">
                          {translateLocation(msg.senderName, lang)} · {msg.timestamp}
                        </div>
                        <div
                          className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            isMine
                              ? 'bg-[#0F3D2A] text-white'
                              : 'bg-white text-[#17231C] border border-[#E4DEC9]'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleChatSubmit}
                className="p-3 border-t border-[#E4DEC9] bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'Write a message in English or Telugu...'
                      : 'ఇంగ్లీష్ లేదా తెలుగులో సందేశం టైప్ చేయండి...'
                  }
                  className="flex-1 h-10 px-3.5 text-xs rm-input rounded-lg"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Send' : 'పంపు'}</span>
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="no-chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-xs text-[#5A675E] my-auto"
            >
              {lang === 'en'
                ? 'Select a request on the left to open the direct Farmer–Buyer chat.'
                : 'చాట్ చేయడానికి ఎడమవైపు ఉన్న అభ్యర్థనను ఎంచుకోండి.'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
