import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Building2,
  Tractor,
} from 'lucide-react';
import { Language, UserAccount, UserRole } from '../types';
import { UI_TEXT } from '../i18n';

interface AuthGateProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  users: UserAccount[];
  onSignIn: (user: UserAccount) => void;
  onRegisterUser: (newUser: UserAccount) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  lang,
  onChangeLang,
  users,
  onSignIn,
  onRegisterUser,
}) => {
  const t = UI_TEXT[lang];
  const [showSplash, setShowSplash] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('ramarao');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  // Sign Up 12-field state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [villageOrTown, setVillageOrTown] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Guntur');
  const [state, setState] = useState('Andhra Pradesh');
  const [pinCode, setPinCode] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1850);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    const demoUser = users.find((u) => u.role === role);
    if (demoUser) {
      setLoginIdentifier(demoUser.username);
      setLoginPassword(demoUser.password);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = loginIdentifier.trim().toLowerCase();
    const matched = users.find(
      (u) =>
        u.role === selectedRole &&
        (u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed) &&
        u.password === loginPassword
    );
    if (!matched) {
      setErrorMsg(
        lang === 'en'
          ? 'Invalid username/email or password for the selected role.'
          : 'ఎంచుకున్న పాత్రకు యూజర్‌నేమ్ లేదా పాస్‌వర్డ్ సరిపోలలేదు.'
      );
      return;
    }
    onSignIn(matched);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !houseNumber.trim() ||
      !streetName.trim() ||
      !villageOrTown.trim() ||
      !city.trim() ||
      !district.trim() ||
      !state.trim() ||
      !pinCode.trim()
    ) {
      setErrorMsg(
        lang === 'en'
          ? 'Please complete all 12 registration and address fields.'
          : 'దయచేసి మొత్తం 12 రిజిస్ట్రేషన్ మరియు చిరునామా వివరాలను పూర్తి చేయండి.'
      );
      return;
    }

    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() ||
        u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      setErrorMsg(
        lang === 'en'
          ? 'Username or Email already exists. Please sign in or pick another username.'
          : 'ఈ యూజర్‌నేమ్ లేదా ఇమెయిల్ ఇప్పటికే ఉంది.'
      );
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${selectedRole}-${Date.now()}`,
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role: selectedRole,
      approved: selectedRole !== 'market_admin',
      createdAt: new Date().toISOString().slice(0, 10),
      address: {
        houseNumber: houseNumber.trim(),
        streetName: streetName.trim(),
        villageOrTown: villageOrTown.trim(),
        city: city.trim(),
        district: district.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
      },
    };

    onRegisterUser(newUser);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#17231C] flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          /* STAGE 1: Auto-Animated Logo & App Name Splash Screen */
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setShowSplash(false)}
            className="fixed inset-0 z-50 bg-gradient-to-br from-[#0F3D2A] via-[#134B34] to-[#0A291C] flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <motion.div
                layoutId="rm-brand-logo"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-3xl bg-white/10 border border-amber-300/30 flex items-center justify-center text-amber-300 shadow-2xl mb-6 backdrop-blur-sm"
              >
                <Sprout className="w-12 h-12" />
              </motion.div>

              <motion.h1
                layoutId="rm-brand-title"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display"
              >
                RythuMitra (రైతుమిత్ర)
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-3 text-sm sm:text-base font-medium text-emerald-100/90 max-w-md"
              >
                {t.tagline}
              </motion.p>

              {/* Animated Auto-Open Progress Bar */}
              <div className="mt-8 w-48 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.65, ease: 'easeInOut' }}
                  className="h-full bg-amber-300 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* STAGE 2: Auto-Opened Login & Sign Up Page Only */
          <motion.div
            key="auth-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen flex flex-col justify-between"
          >
            {/* Top Bar: Brand Title + Language Toggle Positioned Directly Below Title */}
            <header className="w-full px-6 lg:px-12 py-4 bg-white border-b border-[#E4DEC9] flex flex-col items-start gap-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <button
                  type="button"
                  onClick={() => setShowSplash(true)}
                  className="group flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <motion.div
                    layoutId="rm-brand-logo"
                    className="w-8 h-8 rounded-lg bg-[#0F3D2A] flex items-center justify-center text-amber-300 shadow-xs transition-transform group-hover:scale-105"
                  >
                    <Sprout className="w-5 h-5 group-hover:animate-pulse" />
                  </motion.div>
                  <motion.span
                    layoutId="rm-brand-title"
                    className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F3D2A] font-display"
                  >
                    RythuMitra (రైతుమిత్ర)
                  </motion.span>
                </button>
                <span className="text-xs sm:text-sm font-medium text-[#5A675E]">
                  — {t.tagline}
                </span>
              </div>

              <div
                role="group"
                aria-label="Language selection"
                className="inline-flex items-center gap-1 p-1 bg-[#F1EDE2] border border-[#DFD7C2] rounded-lg shrink-0"
              >
                <button
                  type="button"
                  onClick={() => onChangeLang('en')}
                  className={`inline-flex items-center justify-center min-w-[92px] h-8 px-3.5 text-xs font-semibold leading-none rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#0F3D2A] text-white shadow-xs'
                      : 'text-[#4A584F] hover:text-[#17231C] hover:bg-[#E7E1D2]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLang('te')}
                  className={`inline-flex items-center justify-center min-w-[92px] h-8 px-3.5 text-xs font-semibold leading-none rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    lang === 'te'
                      ? 'bg-[#0F3D2A] text-white shadow-xs'
                      : 'text-[#4A584F] hover:text-[#17231C] hover:bg-[#E7E1D2]'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </header>

            {/* Centered Login & Sign Up Card Only */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full ${
                  authMode === 'signup' ? 'max-w-2xl' : 'max-w-lg'
                } rm-card rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300`}
              >
                {/* Card Brand Header */}
                <div className="flex flex-col items-center text-center pb-5 border-b border-[#E4DEC9]">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F3D2A] flex items-center justify-center text-amber-300 shadow-xs mb-3">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F3D2A] font-display">
                    RythuMitra (రైతుమిత్ర)
                  </h2>
                  <p className="text-xs text-[#5A675E] mt-1">{t.tagline}</p>

                  {/* Login & Sign Up Toggle Switch */}
                  <div className="mt-5 grid grid-cols-2 w-full max-w-xs p-1 bg-[#F1EDE2] border border-[#DFD7C2] rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        setErrorMsg('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin'
                          ? 'bg-[#0F3D2A] text-white shadow-xs'
                          : 'text-[#4A584F] hover:text-[#17231C]'
                      }`}
                    >
                      {t.signIn}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setErrorMsg('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup'
                          ? 'bg-[#0F3D2A] text-white shadow-xs'
                          : 'text-[#4A584F] hover:text-[#17231C]'
                      }`}
                    >
                      {t.signUp}
                    </button>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-[#36443B] mb-2.5">
                    {lang === 'en' ? 'Select Role:' : 'పాత్రను ఎంచుకోండి:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(
                      [
                        {
                          role: 'farmer' as UserRole,
                          label: t.roleFarmer,
                          icon: <Tractor className="w-4 h-4 shrink-0" />,
                        },
                        {
                          role: 'buyer' as UserRole,
                          label: t.roleBuyer,
                          icon: <Building2 className="w-4 h-4 shrink-0" />,
                        },
                        {
                          role: 'market_admin' as UserRole,
                          label: t.roleMarketAdmin,
                          icon: <UserCheck className="w-4 h-4 shrink-0" />,
                        },
                        {
                          role: 'main_admin' as UserRole,
                          label: t.roleMainAdmin,
                          icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
                        },
                      ] as const
                    ).map((item) => {
                      const active = selectedRole === item.role;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => handleRoleSwitch(item.role)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-[#0F3D2A] text-white border-[#0F3D2A] shadow-xs'
                              : 'bg-[#FAF8F3] text-[#17231C] border-[#E4DEC9] hover:bg-[#F1EDE2]'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              active
                                ? 'bg-white/15 text-amber-300'
                                : 'bg-[#E9E3D3] text-[#0F3D2A]'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="text-xs font-bold truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Animated Switch Between Login and Sign Up */}
                <AnimatePresence mode="wait" initial={false}>
                  {authMode === 'signin' ? (
                    <motion.form
                      key={`signin-${selectedRole}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onSubmit={handleSignInSubmit}
                      className="mt-5 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.usernameOrEmail}
                        </label>
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder="e.g. ramarao"
                          className="w-full h-11 px-3.5 text-sm rm-input rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#36443B] mb-1.5">
                          {t.password}
                        </label>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 px-3.5 text-sm rm-input rounded-xl"
                        />
                      </div>

                      <div className="pt-2 space-y-3">
                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          <span>{t.signInBtn}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('signup');
                              setErrorMsg('');
                            }}
                            className="text-xs font-semibold text-[#0F3D2A] hover:underline cursor-pointer"
                          >
                            {lang === 'en'
                              ? "Don't have an account? Sign Up →"
                              : 'ఖాతా లేదా? కొత్త ఖాతా తెరవండి →'}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form
                      key={`signup-${selectedRole}`}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onSubmit={handleSignUpSubmit}
                      className="mt-5 space-y-4"
                    >
                      <div className="text-xs font-bold text-[#0F3D2A]">
                        {lang === 'en'
                          ? `1. Account Details (${selectedRole.replace('_', ' ')})`
                          : '1. ప్రాథమిక ఖాతా వివరాలు'}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.fullName} *
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. S. Subba Rao"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.username} *
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. subbarao_rythu"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.password} *
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.emailAddress} *
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="subbarao@example.com"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.phoneNumber} *
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98480 12345"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E4DEC9]">
                        <div className="text-xs font-bold text-[#0F3D2A]">
                          2. {t.addressSectionTitle}
                        </div>
                        <p className="text-[11px] text-[#5A675E] mt-0.5">{t.addressHelper}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.houseNumber} *
                          </label>
                          <input
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            placeholder="D.No. 4-112"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.streetName} *
                          </label>
                          <input
                            type="text"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            placeholder="Main Temple Road"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.villageOrTown} *
                          </label>
                          <input
                            type="text"
                            value={villageOrTown}
                            onChange={(e) => setVillageOrTown(e.target.value)}
                            placeholder="e.g. Duggirala"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.city} *
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Guntur"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.district} *
                          </label>
                          <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="e.g. Guntur"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.state} *
                          </label>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Andhra Pradesh"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#36443B] mb-1">
                            {t.pinCode} *
                          </label>
                          <input
                            type="text"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                            placeholder="522330"
                            className="w-full h-10 px-3 text-xs rm-input rounded-lg font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-3 space-y-3">
                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold text-white bg-[#0F3D2A] hover:bg-[#155239] rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          <span>{t.createAccountBtn}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('signin');
                              setErrorMsg('');
                            }}
                            className="text-xs font-semibold text-[#0F3D2A] hover:underline cursor-pointer"
                          >
                            {lang === 'en'
                              ? 'Already have an account? Sign In →'
                              : 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి →'}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
