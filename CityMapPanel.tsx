import React, { useState } from 'react';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { CameraFeed, CityId } from '../../types';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Radio, 
  Compass, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw,
  Navigation,
  Globe2,
  ChevronRight,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const CityMapPanel: React.FC = () => {
  const { 
    cameras, 
    allCameras,
    setSelectedCamera, 
    safetyAlerts, 
    selectedCity, 
    setSelectedCity,
    selectedCityProfile,
    cities 
  } = useCommandCenter();

  const [activeLayers, setActiveLayers] = useState({
    cameras: true,
    heatmap: true,
    incidents: true,
    boundaries: true,
    corridors: true,
  });
  const [hoveredCamera, setHoveredCamera] = useState<CameraFeed | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(1);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const isNationalGrid = selectedCity === 'all';

  // Global Regional Hubs
  const nationalHubs = [
    { id: 'india' as CityId, name: 'India', x: 50, y: 50, code: 'IN', cams: '18.4k', cong: 52, status: 'warning', incident: 'Central Flyover' },
    { id: 'usa' as CityId, name: 'USA', x: 26, y: 35, code: 'US', cams: '21.5k', cong: 64, status: 'critical', incident: 'Interstate Gantry' },
    { id: 'uk' as CityId, name: 'UK', x: 45, y: 22, code: 'UK', cams: '8.7k', cong: 48, status: 'normal', incident: 'Mountain Tunnel' },
  ];

  return (
    <div className="relative rounded-xl border border-slate-800 bg-[#0c121e] overflow-hidden flex flex-col h-[460px] shadow-lg">
      {/* Map Header / Tactical Bar */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isNationalGrid ? (
            <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
              <Globe2 className="w-4 h-4 animate-spin text-cyan-400 duration-1000" />
            </div>
          ) : (
            <button
              onClick={() => setSelectedCity('all')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 border border-cyan-800/60 transition-colors"
              title="Return to Global Grid"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Global Grid</span>
            </button>
          )}

          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              {isNationalGrid ? (
                <>
                  Global GIS Command Grid
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                    WORLDWIDE • UK • USA • INDIA
                  </span>
                </>
              ) : (
                <>
                  {selectedCityProfile.name} Tactical Surveillance Grid
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                    {selectedCityProfile.badge}
                  </span>
                </>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isNationalGrid 
                ? 'International Arterial Highways & Expressways • Real-time AI Vision' 
                : `${selectedCityProfile.tagline} • Tactical RTSP Matrix & Arterial Heatmap`}
            </p>
          </div>
        </div>

        {/* Tactical Layer Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => toggleLayer('cameras')}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-mono transition-colors",
                activeLayers.cameras ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Cams ({cameras.length})
            </button>
            <button
              onClick={() => toggleLayer('heatmap')}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-mono transition-colors",
                activeLayers.heatmap ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Heatmap
            </button>
            <button
              onClick={() => toggleLayer('incidents')}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-mono transition-colors",
                activeLayers.incidents ? "bg-red-600 text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Incidents
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMapZoom((prev) => Math.min(prev + 0.15, 1.6))}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMapZoom((prev) => Math.max(prev - 0.15, 0.9))}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMapZoom(1)}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              title="Reset Zoom"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="relative flex-1 w-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#090d16]">
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${mapZoom})` }}
        >
          {/* Tactical Vector Map Canvas SVG */}
          <svg className="w-full h-full object-cover" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              {/* Radar gradient */}
              <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              
              {/* Heatmap blur filter */}
              <filter id="heatBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="30" />
              </filter>
            </defs>

            {/* Tactical Grid Background */}
            <g opacity="0.12" stroke="#38bdf8" strokeWidth="0.5">
              {[...Array(20)].map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
              ))}
              {[...Array(12)].map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
              ))}
            </g>

            {/* ======================================================== */}
            {/* VIEW MODE 1: PAN-INDIA NATIONAL COMMAND GRID MAP         */}
            {/* ======================================================== */}
            {isNationalGrid ? (
              <g>
                {/* Stylized Tactical India Landmass Outline */}
                <path
                  d="
                    M 370,40
                    L 440,70 L 420,110 L 460,150 L 520,165 L 590,195
                    L 650,230 L 740,240 L 850,220 L 910,240 L 870,280
                    L 800,280 L 730,320 L 680,360 L 600,430 L 530,510
                    L 460,575 L 430,530 L 390,460 L 310,430 L 260,370
                    L 210,330 L 210,270 L 260,250 L 300,190 L 340,150
                    L 350,90 Z
                  "
                  fill="#0b172a"
                  stroke="#1e3a5f"
                  strokeWidth="2.5"
                  opacity="0.85"
                />

                {/* Golden Quadrilateral Corridors (Delhi - Mumbai - Chennai - Kolkata - Delhi) */}
                {activeLayers.corridors && (
                  <g opacity="0.8">
                    {/* Delhi (380, 130) <-> Mumbai (260, 350) */}
                    <line x1="380" y1="130" x2="260" y2="350" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" />
                    {/* Mumbai (260, 350) <-> Bengaluru (440, 480) <-> Chennai (510, 485) */}
                    <path d="M 260,350 L 300,385 L 440,480 L 510,485" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" fill="none" />
                    {/* Chennai (510, 485) <-> Kolkata (730, 290) */}
                    <path d="M 510,485 Q 630,410 730,290" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" fill="none" />
                    {/* Kolkata (730, 290) <-> Delhi (380, 130) */}
                    <path d="M 730,290 L 560,210 L 380,130" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" fill="none" />

                    {/* NH-44 North-South Superhighway passing through ZERO MILE NAGPUR (480, 300) */}
                    <path d="M 380,45 L 380,130 L 480,300 L 470,390 L 440,480 L 460,575" stroke="#06b6d4" strokeWidth="3.5" fill="none" />

                    {/* Corridor Labels */}
                    <text x="360" y="220" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">GQ: WEST CORRIDOR</text>
                    <text x="490" y="270" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold">NH-44 NATIONAL ARTERY</text>
                    <text x="590" y="380" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">GQ: EAST COAST CORRIDOR</text>
                  </g>
                )}

                {/* Zero-Mile Geodetic Center of India Indicator (Nagpur) */}
                <g transform="translate(480, 300)">
                  <circle cx="0" cy="0" r="22" fill="#06b6d4" fillOpacity="0.2" className="animate-ping" />
                  <circle cx="0" cy="0" r="10" fill="#0891b2" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                  <rect x="14" y="-12" width="140" height="24" rx="4" fill="#030712" stroke="#06b6d4" strokeWidth="1" />
                  <text x="20" y="3" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">ZERO MILE (NAGPUR)</text>
                </g>

                {/* Heatmap blur for major urban congestion clusters */}
                {activeLayers.heatmap && (
                  <g filter="url(#heatBlur)">
                    <circle cx="380" cy="130" r="60" fill="#ef4444" opacity="0.38" />
                    <circle cx="260" cy="350" r="65" fill="#ef4444" opacity="0.45" />
                    <circle cx="440" cy="480" r="70" fill="#ef4444" opacity="0.50" />
                    <circle cx="480" cy="300" r="50" fill="#f59e0b" opacity="0.35" />
                    <circle cx="470" cy="390" r="50" fill="#f59e0b" opacity="0.32" />
                    <circle cx="300" cy="385" r="45" fill="#10b981" opacity="0.28" />
                  </g>
                )}
              </g>
            ) : (
              /* ======================================================== */
              /* VIEW MODE 2: LOCAL CITY TACTICAL GIS MAP                */
              /* ======================================================== */
              <g>
                {/* Water Bodies & City Rivers */}
                <ellipse cx="180" cy="480" rx="75" ry="55" fill="#0c2340" stroke="#0ea5e9" strokeWidth="1.2" opacity="0.85" />
                <text x="135" y="485" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.8">
                  {selectedCity === 'usa' ? 'PACIFIC COASTAL WATERWAY' : selectedCity === 'uk' ? 'THAMES RIVER BASIN' : 'COASTAL CANAL'}
                </text>

                <ellipse cx="230" cy="200" rx="55" ry="38" fill="#0c2340" stroke="#0ea5e9" strokeWidth="1" opacity="0.8" />
                <text x="195" y="205" fill="#38bdf8" fontSize="9" fontFamily="monospace" opacity="0.75">
                  {selectedCity === 'usa' ? 'METRO BAY' : selectedCity === 'uk' ? 'DOCKSIDE BASIN' : 'CENTRAL LAKE'}
                </text>

                {/* River / Channel Path */}
                <path
                  d="M 180,480 Q 300,450 480,440 T 720,390 Q 860,370 1000,420"
                  stroke="#0ea5e9"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.45"
                  strokeDasharray="6 3"
                />

                {/* Major Arterial Roads & Ring Roads */}
                <g opacity="0.75">
                  <ellipse cx="490" cy="360" rx="440" ry="290" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="8 6" />
                  <text x="820" y="160" fill="#64748b" fontSize="9" fontFamily="monospace">
                    {selectedCity === 'usa' ? 'INTERSTATE FREEWAY LOOP' : selectedCity === 'uk' ? 'ORBITAL MOTORWAY RING' : 'EXPRESSWAY RING ROAD'}
                  </text>

                  {/* Main Arterial Crossings */}
                  <path d="M 540,10 L 490,260 L 480,440 L 360,590" stroke="#475569" strokeWidth="5" fill="none" />
                  <path d="M 540,10 L 490,260 L 480,440 L 360,590" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="6 4" fill="none" />
                  <path d="M 80,380 L 280,420 L 480,440 L 980,380" stroke="#475569" strokeWidth="4.5" fill="none" />
                  <path d="M 480,440 L 620,540 L 800,590" stroke="#475569" strokeWidth="3.5" fill="none" />
                </g>

                {/* Metro Rapid Transit Line */}
                <g opacity="0.9">
                  <path d="M 540,20 L 510,180 L 480,440 L 365,590" stroke="#f97316" strokeWidth="3" strokeDasharray="8 4" fill="none" />
                  <text x="545" y="80" fill="#fb923c" fontSize="9" fontFamily="monospace" fontWeight="bold">METRO HIGH SPEED CORRIDOR</text>
                  <path d="M 920,370 L 720,380 L 480,440 L 280,420 L 160,560" stroke="#06b6d4" strokeWidth="3" strokeDasharray="8 4" fill="none" />
                  <text x="730" y="365" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">EXPRESS METRO LINE</text>
                </g>

                {/* Congestion Heatmap Overlays */}
                {activeLayers.heatmap && (
                  <g filter="url(#heatBlur)">
                    <circle cx="480" cy="440" r="85" fill="#ef4444" opacity="0.45" />
                    <circle cx="720" cy="380" r="75" fill="#ef4444" opacity="0.40" />
                    <circle cx="620" cy="540" r="70" fill="#f59e0b" opacity="0.35" />
                    <circle cx="280" cy="420" r="60" fill="#10b981" opacity="0.24" />
                  </g>
                )}
              </g>
            )}

            {/* Tactical Radar Sweep in corner */}
            <circle cx="920" cy="520" r="70" fill="url(#radarSweep)" className="animate-radar" />
            <circle cx="920" cy="520" r="70" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
            <circle cx="920" cy="520" r="35" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
            <text x="880" y="524" fill="#06b6d4" fontSize="8" fontFamily="monospace">BHARAT RADAR</text>
          </svg>

          {/* ======================================================== */}
          {/* NATIONAL VIEW: INTERACTIVE CLICKABLE CITY HUBS          */}
          {/* ======================================================== */}
          {isNationalGrid && nationalHubs.map((hub) => {
            const isHovered = hoveredCity === hub.id;
            const isCrit = hub.status === 'critical';

            return (
              <div
                key={hub.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 z-20 group"
                style={{
                  left: `${hub.x}%`,
                  top: `${hub.y}%`,
                }}
                onMouseEnter={() => setHoveredCity(hub.id)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => setSelectedCity(hub.id)}
              >
                {/* Radar Waves */}
                {isCrit ? (
                  <>
                    <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                    <span className="absolute -inset-4 rounded-full border border-red-500/50 animate-pulse pointer-events-none" />
                  </>
                ) : (
                  <span className="absolute -inset-2 rounded-full bg-cyan-500/30 animate-pulse pointer-events-none" />
                )}

                {/* Hub Pin */}
                <div className={cn(
                  "px-2.5 py-1.5 rounded-xl shadow-2xl border flex items-center gap-1.5 transition-all backdrop-blur",
                  isCrit 
                    ? "bg-red-950/90 border-red-500 text-white glow-red"
                    : hub.status === 'warning'
                    ? "bg-amber-950/90 border-amber-500 text-amber-200"
                    : "bg-slate-900/90 border-cyan-500/60 text-cyan-200"
                )}>
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div className="font-mono text-left leading-tight">
                    <div className="text-xs font-bold tracking-tight flex items-center gap-1">
                      {hub.name}
                      <span className="text-[9px] px-1 rounded bg-black/60 border border-slate-700 text-slate-300 font-normal">
                        {hub.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{hub.cams} cams</span>
                      <span className={hub.cong > 70 ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {hub.cong}% cong.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Incident Tooltip on Hover */}
                {hub.incident && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-red-950/95 border border-red-500 text-[9px] font-mono font-bold text-red-200 whitespace-nowrap shadow-xl pointer-events-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>{hub.incident}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* ======================================================== */}
          {/* LOCAL CITY VIEW: CAMERA PINS & LIVE INCIDENT CALLOUTS    */}
          {/* ======================================================== */}
          {!isNationalGrid && activeLayers.cameras && cameras.map((camera) => {
            const isCritical = camera.incidentType === 'Traffic Accident' || camera.incidentType === 'Wrong-Way Vehicle';
            const isWarning = camera.status === 'warning' || camera.incidentType !== 'Normal';
            const isOffline = camera.status === 'offline';

            return (
              <div
                key={camera.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20"
                style={{
                  left: `${camera.coordinates.x}%`,
                  top: `${camera.coordinates.y}%`,
                }}
                onMouseEnter={() => setHoveredCamera(camera)}
                onMouseLeave={() => setHoveredCamera(null)}
                onClick={() => setSelectedCamera(camera)}
              >
                {/* Pulsing Alert Waves */}
                {isCritical && (
                  <>
                    <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                    <span className="absolute -inset-4 rounded-full border border-red-500/50 animate-pulse pointer-events-none" />
                  </>
                )}

                {isWarning && !isCritical && (
                  <span className="absolute -inset-2 rounded-full bg-amber-500/30 animate-pulse pointer-events-none" />
                )}

                {/* Marker Pin Icon */}
                <div className={cn(
                  "p-1.5 rounded-full shadow-lg border flex items-center justify-center transition-all",
                  isOffline 
                    ? "bg-slate-800 border-slate-600 text-slate-400"
                    : isCritical
                    ? "bg-red-600 border-white text-white glow-red"
                    : isWarning
                    ? "bg-amber-500 border-amber-300 text-slate-950 glow-amber"
                    : "bg-cyan-600 border-cyan-300 text-white glow-cyan"
                )}>
                  {isCritical ? (
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Micro Label */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white whitespace-nowrap pointer-events-none border border-slate-700">
                  {camera.id}
                </span>
              </div>
            );
          })}

          {/* Incident Callouts Overlay (if active) */}
          {!isNationalGrid && activeLayers.incidents && safetyAlerts.slice(0, 2).map((alert) => {
            const cam = cameras.find((c) => c.id === alert.cameraId);
            if (!cam) return null;
            return (
              <div
                key={alert.id}
                className="absolute z-25 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
                style={{
                  left: `${cam.coordinates.x}%`,
                  top: `${cam.coordinates.y - 4}%`,
                }}
              >
                <div className="bg-red-950/95 border border-red-500 text-white px-2 py-1 rounded shadow-xl backdrop-blur flex items-center gap-1.5 whitespace-nowrap animate-bounce">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  <span className="text-[10px] font-mono font-bold text-red-200">
                    {alert.type.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Camera Card Tooltip */}
        {hoveredCamera && !isNationalGrid && (
          <div 
            className="absolute bottom-4 left-4 z-30 bg-slate-900/95 border border-cyan-500/50 rounded-lg p-3 shadow-2xl backdrop-blur w-72 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-cyan-400">
                {hoveredCamera.id}
              </span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.2 rounded uppercase font-semibold font-mono",
                hoveredCamera.status === 'online' ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                hoveredCamera.status === 'warning' ? "bg-amber-950 text-amber-300 border border-amber-800" :
                "bg-slate-800 text-slate-400"
              )}>
                {hoveredCamera.status}
              </span>
            </div>
            <p className="text-xs text-white font-medium mt-1.5">
              {hoveredCamera.name}
            </p>
            <p className="text-[11px] text-slate-400">
              {hoveredCamera.location}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
              <div className="text-slate-300">
                Vehicles: <span className="text-cyan-300 font-bold">{hoveredCamera.vehicleCount}</span>
              </div>
              <div className="text-slate-300">
                Pedestrians: <span className="text-amber-300 font-bold">{hoveredCamera.pedestrianCount}</span>
              </div>
              <div className="text-slate-300">
                Congestion: <span className={hoveredCamera.congestionScore > 75 ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {hoveredCamera.congestionScore}%
                </span>
              </div>
              <div className="text-slate-300">
                FPS: <span className="text-slate-200">{hoveredCamera.fps}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tactical Legend and GIS status in Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/85 backdrop-blur border border-slate-800 rounded-lg p-2 text-[10px] font-mono flex flex-col gap-1 text-slate-300">
          {isNationalGrid ? (
            <>
              <div className="text-[10px] font-bold text-cyan-400 border-b border-slate-800 pb-0.5">
                🇮🇳 Click any city node to drill down
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>Golden Quadrilateral & NH-44 Expressways</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span>Active Safety Alerts ({safetyAlerts.filter(a => !a.acknowledged).length})</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>Normal Stream ({cameras.filter(c => c.status === 'online' && c.incidentType === 'Normal').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Warning / Congestion ({cameras.filter(c => c.status === 'warning').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>Critical Incident ({cameras.filter(c => c.incidentType === 'Traffic Accident' || c.incidentType === 'Wrong-Way Vehicle').length})</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
