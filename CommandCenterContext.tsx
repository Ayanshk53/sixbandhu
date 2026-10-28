import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CameraFeed, 
  SafetyAlert, 
  TrafficHotspot, 
  ThemeMode, 
  NavigationTab,
  AlertSeverity,
  CityId,
  CityProfile
} from '../types';
import { 
  CITIES,
  INITIAL_CAMERAS, 
  INITIAL_SAFETY_ALERTS, 
  CONGESTION_HOTSPOTS 
} from '../data/mockData';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

interface CommandCenterContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // City Management (Pan-India)
  selectedCity: CityId;
  setSelectedCity: (cityId: CityId) => void;
  selectedCityProfile: CityProfile;
  cities: CityProfile[];

  // Data (Filtered by selected city)
  cameras: CameraFeed[];
  safetyAlerts: SafetyAlert[];
  hotspots: TrafficHotspot[];
  allCameras: CameraFeed[];
  allSafetyAlerts: SafetyAlert[];
  allHotspots: TrafficHotspot[];
  
  // Modals & Selection
  selectedCamera: CameraFeed | null;
  setSelectedCamera: (camera: CameraFeed | null) => void;
  selectedAlertForModal: SafetyAlert | null;
  setSelectedAlertForModal: (alert: SafetyAlert | null) => void;

  // Actions
  acknowledgeAlert: (alertId: string) => void;
  dispatchEmergencyTeam: (alertId: string, unitType: string) => void;
  rebootCamera: (cameraId: string) => void;
  triggerSimulatedAlert: () => void;
  
  // Filters & Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedZoneFilter: string;
  setSelectedZoneFilter: (zone: string) => void;
  
  // UI State
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  emergencyBannerOpen: boolean;
  setEmergencyBannerOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;

  // Real-time counter
  todayVehiclesCount: number;
}

const CommandCenterContext = createContext<CommandCenterContextType | undefined>(undefined);

// Web Audio API beep synthesizer for realistic control room sound effects
const playControlRoomBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.12) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio context autoplay restriction gracefully
  }
};

export const CommandCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [selectedCity, setSelectedCity] = useState<CityId>('all');
  const [allCameras, setAllCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [allSafetyAlerts, setAllSafetyAlerts] = useState<SafetyAlert[]>(INITIAL_SAFETY_ALERTS);
  const [allHotspots] = useState<TrafficHotspot[]>(CONGESTION_HOTSPOTS);
  
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(null);
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<SafetyAlert | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All');
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emergencyBannerOpen, setEmergencyBannerOpen] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [todayVehiclesCount, setTodayVehiclesCount] = useState(3363);

  // Active City Profile
  const selectedCityProfile = CITIES.find((c) => c.id === selectedCity) || CITIES[0];

  // Derived filtered lists
  const cameras = selectedCity === 'all' 
    ? allCameras 
    : allCameras.filter((c) => c.cityId === selectedCity);

  const safetyAlerts = selectedCity === 'all'
    ? allSafetyAlerts
    : allSafetyAlerts.filter((a) => a.cityId === selectedCity);

  const hotspots = selectedCity === 'all'
    ? allHotspots
    : allHotspots.filter((h) => h.cityId === selectedCity);

  // Sync theme to document body
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    document.documentElement.classList.remove('dark', 'theme-monochrome', 'theme-light');
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'monochrome') {
      document.documentElement.classList.add('dark', 'theme-monochrome');
    } else {
      document.documentElement.classList.add('theme-light');
    }
  };

  useEffect(() => {
    setTheme('light');
  }, []);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    if (soundEnabled) {
      if (type === 'critical') playControlRoomBeep(440, 'sawtooth', 0.25);
      else if (type === 'success') playControlRoomBeep(1040, 'sine', 0.15);
      else playControlRoomBeep(780, 'sine', 0.1);
    }
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Subtle live ticker: randomly jitter vehicle detection counter slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayVehiclesCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAllSafetyAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    showToast('Alert Acknowledged', `Incident ${alertId} logged as reviewed by Operator.`, 'success');
  };

  const dispatchEmergencyTeam = (alertId: string, unitType: string) => {
    const timeNow = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(new Date());

    setAllSafetyAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === alertId) {
          const updated: SafetyAlert = {
            ...alert,
            acknowledged: true,
            dispatchedStatus: 'dispatched',
            dispatchedUnits: [unitType, 'Rapid Traffic Division Unit 08'],
            dispatchedAt: timeNow,
            etaMinutes: 4,
          };
          if (selectedAlertForModal?.id === alertId) {
            setSelectedAlertForModal(updated);
          }
          return updated;
        }
        return alert;
      })
    );
    showToast(
      '🚨 Emergency Dispatched',
      `${unitType} and Rapid Response team deployed to ${alertId}. Estimated arrival: 4 mins.`,
      'critical'
    );
  };

  const rebootCamera = (cameraId: string) => {
    showToast('Camera Reboot Sent', `Sending soft power cycle signal to ${cameraId}...`, 'info');
    setTimeout(() => {
      setAllCameras((prev) =>
        prev.map((cam) =>
          cam.id === cameraId
            ? { ...cam, status: 'online', latencyMs: 26, incidentType: 'Normal' }
            : cam
        )
      );
      showToast('Camera Online', `${cameraId} RTSP video feed recovered and streaming.`, 'success');
    }, 2000);
  };

  const triggerSimulatedAlert = () => {
    const globalScenarios = [
      {
        cityId: 'india' as CityId,
        cityName: 'India',
        type: 'Traffic Accident' as const,
        severity: 'Critical' as AlertSeverity,
        location: 'India',
        zone: 'Urban Central',
        cameraId: 'CAM-01',
        cameraName: 'Central Junction & Flyover',
        aiExplanation: 'Collision anomaly detected between passenger sedans during junction merge.',
        confidence: 98.6,
        vehiclesInvolved: ['Red Sedan (DL-01-FA-4921)', 'Black Sedan (DL-01-EN-8812)'],
        videoUrl: '/videos/testing_output.mp4',
        datasetOrigin: 'Collision Investigation Vision Feed • India',
        collisionSpeedKmh: 58.4,
        impactGForce: 3.6,
        impactPointPercent: 42,
        anprPlates: [
          { plate: 'DL-01-FA-4921', vehicleType: 'Red Sedan', role: 'At-Fault' as const, speedKmh: 58.4 },
          { plate: 'DL-01-EN-8812', vehicleType: 'Black Sedan', role: 'Victim' as const, speedKmh: 24.0 }
        ],
        toastMsg: '[India] Collision detected at Central Junction!'
      },
      {
        cityId: 'usa' as CityId,
        cityName: 'USA',
        type: 'Traffic Accident' as const,
        severity: 'Critical' as AlertSeverity,
        location: 'USA',
        zone: 'Interstate Hub',
        cameraId: 'CAM-18',
        cameraName: 'Interstate Multi-Lane Gantry',
        aiExplanation: 'Multi-vehicle highway pileup detected with emergency deceleration (4.6G impact, ΔV: -44 km/h). Trajectory lock active.',
        confidence: 98.8,
        vehiclesInvolved: ['Red Hatchback (NY-448-GT)', 'Blue SUV (CA-882-PL)', 'White Van (TX-901-TR)'],
        videoUrl: '/videos/highway_pileup_accident.mp4',
        datasetOrigin: 'Interstate Highway Vision Feed • USA',
        collisionSpeedKmh: 88.0,
        impactGForce: 4.6,
        impactPointPercent: 38,
        anprPlates: [
          { plate: 'NY-448-GT', vehicleType: 'Red Hatchback', role: 'At-Fault' as const, speedKmh: 88.0 },
          { plate: 'CA-882-PL', vehicleType: 'Blue SUV', role: 'Victim' as const, speedKmh: 44.0 },
          { plate: 'TX-901-TR', vehicleType: 'Commercial Van', role: 'Witness' as const, speedKmh: 35.0 }
        ],
        toastMsg: '[USA] Multi-vehicle pileup detected on Interstate Gantry!'
      },
      {
        cityId: 'uk' as CityId,
        cityName: 'UK',
        type: 'Traffic Accident' as const,
        severity: 'Critical' as AlertSeverity,
        location: 'UK',
        zone: 'Tunnel Corridor',
        cameraId: 'CAM-41',
        cameraName: 'Subterranean Mountain Tunnel',
        aiExplanation: 'High-speed subterranean barrier collision detected at 114 km/h (5.2G impact). Structural deformation registered.',
        confidence: 99.2,
        vehiclesInvolved: ['Executive Sedan (LDN-77-VX)', 'Impact Barrier (UK-04-BARR)'],
        videoUrl: '/videos/tunnel_crash_accident.mp4',
        datasetOrigin: 'Tunnel Bore Surveillance Feed • UK',
        collisionSpeedKmh: 114.2,
        impactGForce: 5.2,
        impactPointPercent: 41,
        anprPlates: [
          { plate: 'LDN-77-VX', vehicleType: 'Executive Sedan', role: 'At-Fault' as const, speedKmh: 114.2 },
          { plate: 'UK-04-BARR', vehicleType: 'Impact Attenuator Barrier', role: 'Barrier' as const, speedKmh: 0.0 }
        ],
        toastMsg: '[UK] Barrier impact collision inside Mountain Tunnel!'
      },
      {
        cityId: 'india' as CityId,
        cityName: 'India',
        type: 'Traffic Accident' as const,
        severity: 'Critical' as AlertSeverity,
        location: 'India',
        zone: 'Express Highway',
        cameraId: 'CAM-07',
        cameraName: 'Express Highway Radar Corridor',
        aiExplanation: 'Severe high-speed rear-end collision detected on fast lane (4.8G impact). Kinetic transfer & spin registered.',
        confidence: 98.7,
        vehiclesInvolved: ['White Sedan (MH-02-EE-4190)', 'Silver SUV (KA-05-MN-9921)'],
        videoUrl: '/videos/expressway_rear_end_accident.mp4',
        datasetOrigin: 'Expressway Multi-Lane Vision • India',
        collisionSpeedKmh: 94.6,
        impactGForce: 4.8,
        impactPointPercent: 40,
        anprPlates: [
          { plate: 'MH-02-EE-4190', vehicleType: 'White Sedan', role: 'At-Fault' as const, speedKmh: 94.6 },
          { plate: 'KA-05-MN-9921', vehicleType: 'Silver SUV', role: 'Victim' as const, speedKmh: 45.0 }
        ],
        toastMsg: '[India] Rear-end collision detected on Express Highway!'
      }
    ];

    // Prefer scenarios matching selected city if not 'all'
    const relevantScenarios = selectedCity === 'all'
      ? globalScenarios
      : globalScenarios.filter((s) => s.cityId === selectedCity);

    const pool = relevantScenarios.length > 0 ? relevantScenarios : globalScenarios;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    const newAlert: SafetyAlert = {
      id: `ALT-${Math.floor(1100 + Math.random() * 900)}`,
      type: pick.type,
      severity: pick.severity,
      location: pick.location,
      cityId: pick.cityId,
      cityName: pick.cityName,
      zone: pick.zone,
      cameraId: pick.cameraId,
      cameraName: pick.cameraName,
      timestamp: new Date().toLocaleTimeString(),
      timeAgo: 'Just now',
      aiExplanation: pick.aiExplanation,
      confidence: pick.confidence,
      acknowledged: false,
      vehiclesInvolved: pick.vehiclesInvolved,
      snapshotBg: 'accident',
      videoUrl: pick.videoUrl,
      datasetOrigin: pick.datasetOrigin,
      collisionSpeedKmh: pick.collisionSpeedKmh,
      impactGForce: pick.impactGForce,
      impactPointPercent: pick.impactPointPercent,
      anprPlates: pick.anprPlates,
      dispatchedStatus: 'none',
    };

    setAllSafetyAlerts((prev) => [newAlert, ...prev]);
    showToast(`⚠️ AI INCIDENT DETECTED`, pick.toastMsg, pick.severity === 'Critical' ? 'critical' : 'warning');
  };

  return (
    <CommandCenterContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        selectedCity,
        setSelectedCity,
        selectedCityProfile,
        cities: CITIES,
        cameras,
        safetyAlerts,
        hotspots,
        allCameras,
        allSafetyAlerts,
        allHotspots,
        selectedCamera,
        setSelectedCamera,
        selectedAlertForModal,
        setSelectedAlertForModal,
        acknowledgeAlert,
        dispatchEmergencyTeam,
        rebootCamera,
        triggerSimulatedAlert,
        searchQuery,
        setSearchQuery,
        selectedZoneFilter,
        setSelectedZoneFilter,
        soundEnabled,
        setSoundEnabled,
        emergencyBannerOpen,
        setEmergencyBannerOpen,
        toasts,
        dismissToast,
        showToast,
        todayVehiclesCount,
      }}
    >
      {children}
    </CommandCenterContext.Provider>
  );
};

export const useCommandCenter = () => {
  const context = useContext(CommandCenterContext);
  if (!context) {
    throw new Error('useCommandCenter must be used within a CommandCenterProvider');
  }
  return context;
};
