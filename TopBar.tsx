import React, { useState, useEffect, useRef } from 'react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { 
  Building2, 
  Search, 
  Bell, 
  Clock, 
  Calendar, 
  Sun, 
  Moon, 
  Contrast, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Camera, 
  AlertTriangle,
  ChevronDown,
  UserCheck,
  Siren,
  Sparkles,
  MapPin,
  Globe2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeMode, CityId } from '../../types';

export const TopBar: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    soundEnabled, 
    setSoundEnabled, 
    safetyAlerts, 
    cameras, 
    setSelectedCamera,
    setSelectedAlertForModal,
    setActiveTab,
    triggerSimulatedAlert,
    selectedCity,
    setSelectedCity,
    selectedCityProfile,
    cities
  } = useCommandCenter();

  const [currentDateTime, setCurrentDateTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live Clock updating every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentDateTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter items for global search dropdown
  const searchResults = searchQuery.trim() ? {
    cameras: cameras.filter((c) => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
    alerts: safetyAlerts.filter((a) =>
      a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3),
  } : { cameras: [], alerts: [] };

  const unreadAlerts = safetyAlerts.filter((a) => !a.acknowledged);

  return (
    <header className="h-16 px-4 border-b border-slate-800 bg-[#0b0f1a] flex items-center justify-between z-30 sticky top-0 backdrop-blur-md">
      {/* Left: City Branding & Dynamic Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
          {selectedCity === 'all' ? <Globe2 className="w-5 h-5 text-cyan-200" /> : <Building2 className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-white tracking-wider uppercase font-mono truncate">
              {selectedCity === 'all' ? 'SmartCity Command Grid' : `${selectedCityProfile.name} Command Center`}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold shrink-0">
              {selectedCityProfile.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono hidden md:block truncate">
            {selectedCityProfile.tagline}
          </p>
        </div>
      </div>

      {/* Global / Country Switcher Dropdown */}
      <div ref={cityRef} className="relative mx-1 sm:mx-2 shrink-0">
        <button
          onClick={() => setCityMenuOpen(!cityMenuOpen)}
          className={cn(
            "px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm",
            selectedCity === 'all'
              ? "bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border-cyan-500/50 text-cyan-300 hover:border-cyan-400"
              : "bg-slate-900 border-slate-700 text-white hover:border-slate-500"
          )}
          title="Switch Region Surveillance Grid"
        >
          <span className="text-sm">
            {selectedCity === 'india' ? '🇮🇳' : selectedCity === 'usa' ? '🇺🇸' : selectedCity === 'uk' ? '🇬🇧' : '🌐'}
          </span>
          <span className="font-extrabold tracking-wide max-w-[100px] truncate sm:max-w-none">
            {selectedCity === 'all' ? 'Global Grid' : selectedCityProfile.name}
          </span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", cityMenuOpen && "rotate-180")} />
        </button>

        {cityMenuOpen && (
          <div className="absolute left-0 sm:left-auto top-full mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs font-mono space-y-1">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
              <span>Jurisdiction Network</span>
              <span className="text-cyan-400">UK • USA • INDIA</span>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1 pt-1">
              {cities.map((city) => {
                const isSelected = city.id === selectedCity;
                const flag = city.id === 'india' ? '🇮🇳' : city.id === 'usa' ? '🇺🇸' : city.id === 'uk' ? '🇬🇧' : '🌐';
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city.id);
                      setCityMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors",
                      isSelected
                        ? "bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 font-bold"
                        : "text-slate-300 hover:bg-slate-800/80 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {city.name}
                          <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900 text-cyan-300 font-mono">
                            {city.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal truncate max-w-[150px]">
                          {city.state}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold block text-slate-300">
                        {city.totalCameras.toLocaleString()} cams
                      </span>
                      <span className={cn(
                        "text-[9px] font-mono px-1 rounded",
                        city.congestionIndex > 75 ? "text-red-400 bg-red-950/50" :
                        city.congestionIndex > 55 ? "text-amber-400 bg-amber-950/50" :
                        "text-emerald-400 bg-emerald-950/50"
                      )}>
                        {city.congestionIndex}% Cong.
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={selectedCity === 'all' 
              ? "Search cameras, expressways, incidents (e.g. CAM-01, India, USA, UK)..." 
              : `Search ${selectedCityProfile.name} cameras, corridors, incidents...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Global Search Autocomplete Dropdown */}
        {searchOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs font-mono space-y-2">
            {searchResults.cameras.length > 0 && (
              <div>
                <span className="text-[10px] text-cyan-400 px-2 uppercase font-bold block mb-1">
                  Camera Feeds
                </span>
                {searchResults.cameras.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCamera(c);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-between text-slate-200"
                  >
                    <span>[{c.id}] {c.name}</span>
                    <span className="text-[10px] text-cyan-400">{c.zone}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.alerts.length > 0 && (
              <div>
                <span className="text-[10px] text-red-400 px-2 uppercase font-bold block mb-1">
                  Safety Incidents
                </span>
                {searchResults.alerts.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSelectedAlertForModal(a);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer flex items-center justify-between text-slate-200"
                  >
                    <span>{a.type} - {a.location}</span>
                    <span className="text-[10px] text-red-400 font-bold">{a.severity}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.cameras.length === 0 && searchResults.alerts.length === 0 && (
              <div className="p-3 text-center text-slate-500">
                No matching telemetry records found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Clock, Theme, Audio, Notifications, Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Live Date/Time Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentDateTime}</span>
        </div>

        {/* 1-Click Quick Theme Switch Button (White & Black vs Dark Command) */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={cn(
            "px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm",
            theme === 'light'
              ? "bg-slate-900 text-white border-slate-700 hover:bg-slate-800"
              : "bg-white text-slate-950 border-white hover:bg-slate-100"
          )}
          title="Toggle between White & Black Theme and Dark Command Center"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Dark Ops</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">White & Black</span>
            </>
          )}
        </button>

        {/* Live Demo Simulate Incident Button */}
        <button
          onClick={triggerSimulatedAlert}
          className="px-2.5 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          title="College Presentation Demo: Trigger AI Incident Simulation"
        >
          <Siren className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden md:inline">Simulate Incident</span>
        </button>

        {/* Theme Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs transition-colors flex items-center gap-1"
            title="Theme Profiles"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> :
             theme === 'monochrome' ? <Contrast className="w-4 h-4 text-white" /> :
             <Sun className="w-4 h-4 text-amber-400" />}
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-xl p-1.5 z-50 text-xs font-mono space-y-1">
              <button
                onClick={() => {
                  setTheme('light');
                  setThemeMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors",
                  theme === 'light' ? "bg-cyan-950 text-cyan-300 font-bold" : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" /> ⚪ White & Black (Operator)
              </button>

              <button
                onClick={() => {
                  setTheme('dark');
                  setThemeMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors",
                  theme === 'dark' ? "bg-cyan-950 text-cyan-300 font-bold" : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <Moon className="w-3.5 h-3.5 text-cyan-400" /> 🌑 Dark Command Room
              </button>

              <button
                onClick={() => {
                  setTheme('monochrome');
                  setThemeMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors",
                  theme === 'monochrome' ? "bg-white/20 text-white font-bold" : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <Contrast className="w-3.5 h-3.5 text-white" /> 🔳 High-Contrast OLED B&W
              </button>
            </div>
          )}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={cn(
            "p-2 rounded-lg border transition-colors text-xs",
            soundEnabled 
              ? "bg-slate-900 border-slate-800 text-cyan-400" 
              : "bg-slate-900/60 border-slate-800 text-slate-500"
          )}
          title={soundEnabled ? "Mute Control Room Audio" : "Enable Sound Effects"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Badge & Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Live Incident Stream
                </span>
                <span className="text-[10px] text-red-400 font-bold">
                  {unreadAlerts.length} PENDING
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {safetyAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlertForModal(alert);
                      setNotificationsOpen(false);
                    }}
                    className={cn(
                      "p-2 rounded-lg border cursor-pointer transition-colors text-[11px]",
                      alert.severity === 'Critical'
                        ? "bg-red-950/40 border-red-500/40 hover:bg-red-950/60 text-red-200"
                        : "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{alert.type}</span>
                      <span className="text-[10px] text-slate-400">{alert.timeAgo}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{alert.location}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveTab('alerts');
                  setNotificationsOpen(false);
                }}
                className="w-full py-1 text-center text-cyan-400 hover:text-cyan-300 text-xs border-t border-slate-800 pt-2 block"
              >
                View Complete Safety Registry →
              </button>
            </div>
          )}
        </div>

        {/* Operator Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold ring-2 ring-cyan-500/20">
            KS
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">Insp. K. Sharma</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {selectedCity === 'all' ? 'Global Operations' : `${selectedCityProfile.name} Operations`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
