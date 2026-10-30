import React, { useState } from 'react';
import { Plus, Check, List } from 'lucide-react';
import { Language } from '../types';
import { translateCrop } from '../i18n';

interface CropSelectorProps {
  lang: Language;
  value: string;
  crops: string[];
  onChange: (cropName: string) => void;
  onAddCustomCrop: (newCropName: string) => void;
  disabled?: boolean;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  lang,
  value,
  crops,
  onChange,
  onAddCustomCrop,
  disabled = false,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Ensure current value is always visible in the options list when not empty
  const mergedCrops = React.useMemo(() => {
    const list = [...crops];
    if (
      value &&
      value.trim() &&
      !list.some((c) => c.toLowerCase() === value.trim().toLowerCase())
    ) {
      list.push(value.trim());
    }
    return list;
  }, [crops, value]);

  const handleConfirmCustom = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddCustomCrop(trimmed);
    onChange(trimmed);
    setIsCustomMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmCustom();
    }
  };

  return (
    <div className="w-full">
      {isCustomMode ? (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                lang === 'en'
                  ? 'Enter your own crop name...'
                  : 'మీ స్వంత పంట పేరును టైప్ చేయండి...'
              }
              className="w-full h-10 px-3 text-xs rm-input rounded-lg min-w-0"
            />
            <button
              type="button"
              onClick={handleConfirmCustom}
              title={lang === 'en' ? 'Save Crop Name' : 'పంట పేరు సేవ్ చేయండి'}
              className="h-10 px-2.5 bg-[#0F3D2A] hover:bg-[#155239] text-white rounded-lg flex items-center justify-center gap-1 text-xs font-semibold shrink-0 cursor-pointer transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Add' : 'జోడించు'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!value.trim() && mergedCrops.length > 0) {
                  onChange(mergedCrops[0]);
                }
                setIsCustomMode(false);
              }}
              title={lang === 'en' ? 'Choose from list' : 'జాబితా నుండి ఎంచుకోండి'}
              className="h-10 px-2.5 bg-[#F1EDE2] hover:bg-[#E4DEC9] text-[#36443B] rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
          {value.trim() && (
            <div className="text-[11px] text-[#0F3D2A] font-medium truncate">
              {lang === 'en'
                ? `Telugu: ${translateCrop(value.trim(), 'te')}`
                : `English: ${translateCrop(value.trim(), 'en')}`}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <select
            value={value}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.value === '__ADD_NEW_CROP__') {
                onChange('');
                setIsCustomMode(true);
              } else {
                onChange(e.target.value);
              }
            }}
            className="w-full h-10 px-3 text-xs rm-input rounded-lg min-w-0"
          >
            {mergedCrops.map((crop) => (
              <option key={crop} value={crop}>
                {translateCrop(crop, lang)}
              </option>
            ))}
            <option value="__ADD_NEW_CROP__" className="font-bold text-[#0F3D2A]">
              {lang === 'en' ? '+ Add Your Own Crop...' : '+ మీ స్వంత పంటను జోడించండి...'}
            </option>
          </select>
          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsCustomMode(true);
              }}
              title={
                lang === 'en'
                  ? 'Type & add your own crop'
                  : 'మీ స్వంత పంటను టైప్ చేసి జోడించండి'
              }
              className="h-10 px-2.5 bg-[#F1EDE2] hover:bg-[#0F3D2A] text-[#0F3D2A] hover:text-white border border-[#DFD7C2] rounded-lg flex items-center justify-center gap-1 text-xs font-bold shrink-0 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'New' : 'కొత్త పంట'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
