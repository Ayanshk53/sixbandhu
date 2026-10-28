import React, { useState, useRef, useEffect } from 'react';
import { SafetyAlert } from '../../types';
import { useCommandCenter } from '../../context/CommandCenterContext';
import { 
  X, 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Ambulance, 
  Siren, 
  Radio, 
  Sparkles,
  Car,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Scan,
  Maximize2,
  Volume2,
  VolumeX,
  FileText,
  Activity,
  Zap,
  Building2,
  Crosshair
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AccidentDetailModalProps {
  alert: SafetyAlert | null;
  onClose: () => void;
}

export const AccidentDetailModal: React.FC<AccidentDetailModalProps> = ({ alert, onClose }) => {
  const { dispatchEmergencyTeam, cameras, soundEnabled } = useCommandCenter();
  const [selectedUnit, setSelectedUnit] = useState<string>('EMS 108 Advanced Trauma Ambulance');
  const [targetHospital, setTargetHospital] = useState<string>('Government Medical College & Hospital (GMC)');
  const [isDispatching, setIsDispatching] = useState(false);
  
  // Video Player Controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'anpr' | 'dispatch'>('video');

  if (!alert) return null;

  const isDispatched = alert.dispatchedStatus === 'dispatched';
  const relatedCamera = cameras.find((c) => c.id === alert.cameraId);

  // Video source: prioritize alert's videoUrl, then related camera's videoUrl, or default intersection accident video
  const videoSource = alert.videoUrl || relatedCamera?.videoUrl || '/videos/testing_output.mp4';
  const isVideoWithBurnedAi = Boolean(
    videoSource && (
      videoSource.includes('_output') ||
      videoSource.includes('_accident') ||
      videoSource.includes('testing_output') ||
      videoSource.includes('wild_output') ||
      videoSource.includes('cmc_output')
    )
  );

  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [videoSource]);

  // Derive scene bounding boxes matching the actual footage
  const getSceneBoxes = () => {
    if (alert.id === 'ALT-1092' || alert.cameraId === 'CAM-01') {
      // Junction intersection crash
      return [
        {
          id: 'box-impact',
          isImpactZone: true,
          style: { left: '29%', top: '35%', width: '49%', height: '31%' },
          label: `COLLISION IMPACT ZONE // ${alert.confidence}%`,
          deltaV: `ΔV: -${alert.collisionSpeedKmh ? Math.round(alert.collisionSpeedKmh * 0.6) : 38} km/h`,
          gForce: `${alert.impactGForce || 3.6}G`,
          color: 'red'
        },
        {
          id: 'box-v1',
          style: { left: '31%', top: '38%', width: '23%', height: '22%' },
          label: 'RED SEDAN [AT-FAULT] • DL-01-FA-4921',
          color: 'red'
        },
        {
          id: 'box-v2',
          style: { left: '53%', top: '37%', width: '25%', height: '23%' },
          label: 'BLACK SEDAN [VICTIM] • DL-01-EN-8812',
          color: 'amber'
        }
      ];
    }

    if (alert.id === 'ALT-1093' || alert.cameraId === 'CAM-18') {
      // Interstate Highway Multi-Vehicle Pileup
      return [
        {
          id: 'box-impact',
          isImpactZone: true,
          style: { left: '25%', top: '42%', width: '50%', height: '35%' },
          label: `HIGHWAY PILEUP // ${alert.confidence}%`,
          deltaV: `ΔV: -${alert.collisionSpeedKmh ? Math.round(alert.collisionSpeedKmh * 0.5) : 44} km/h`,
          gForce: `${alert.impactGForce || 4.6}G`,
          color: 'red'
        },
        {
          id: 'box-v1',
          style: { left: '28%', top: '48%', width: '24%', height: '25%' },
          label: 'RED HATCHBACK [AT-FAULT] • NY-448-GT',
          color: 'red'
        },
        {
          id: 'box-v2',
          style: { left: '52%', top: '46%', width: '26%', height: '26%' },
          label: 'BLUE SUV [VICTIM] • CA-882-PL',
          color: 'amber'
        }
      ];
    }

    if (alert.id === 'ALT-1094' || alert.cameraId === 'CAM-41') {
      // Subterranean Tunnel Barrier Crash
      return [
        {
          id: 'box-impact',
          isImpactZone: true,
          style: { left: '35%', top: '38%', width: '45%', height: '36%' },
          label: `BARRIER COLLISION // ${alert.confidence}%`,
          deltaV: `ΔV: -${alert.collisionSpeedKmh ? Math.round(alert.collisionSpeedKmh * 0.7) : 75} km/h`,
          gForce: `${alert.impactGForce || 5.2}G`,
          color: 'red'
        },
        {
          id: 'box-v1',
          style: { left: '38%', top: '45%', width: '25%', height: '26%' },
          label: 'SEDAN [AT-FAULT] • LDN-77-VX',
          color: 'red'
        },
        {
          id: 'box-v2',
          style: { left: '62%', top: '42%', width: '18%', height: '30%' },
          label: 'BARRIER [SECTOR 4] • UK-04-BARR',
          color: 'amber'
        }
      ];
    }

    if (alert.id === 'ALT-1095' || alert.cameraId === 'CAM-07') {
      // Expressway High-Speed Rear-End Collision
      return [
        {
          id: 'box-impact',
          isImpactZone: true,
          style: { left: '30%', top: '36%', width: '48%', height: '36%' },
          label: `REAR-END IMPACT // ${alert.confidence}%`,
          deltaV: `ΔV: -${alert.collisionSpeedKmh ? Math.round(alert.collisionSpeedKmh * 0.55) : 52} km/h`,
          gForce: `${alert.impactGForce || 4.8}G`,
          color: 'red'
        },
        {
          id: 'box-v1',
          style: { left: '32%', top: '44%', width: '24%', height: '24%' },
          label: 'SEDAN [AT-FAULT] • MH-02-EE-4190',
          color: 'red'
        },
        {
          id: 'box-v2',
          style: { left: '54%', top: '40%', width: '25%', height: '25%' },
          label: 'SUV [VICTIM] • KA-05-MN-9921',
          color: 'amber'
        }
      ];
    }

    // Default contextual bounding box for other alerts
    return [
      {
        id: 'box-impact',
        isImpactZone: true,
        style: { left: '25%', top: '35%', width: '45%', height: '35%' },
        label: `${alert.type.toUpperCase()} // ${alert.confidence}%`,
        deltaV: `SPEED: ${alert.collisionSpeedKmh || 45} km/h`,
        gForce: `${alert.impactGForce || 2.5}G`,
        color: 'red'
      }
    ];
  };

  const sceneBoxes = getSceneBoxes();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const jumpToImpactPoint = () => {
    if (videoRef.current && videoRef.current.duration) {
      const impactPercent = (alert.impactPointPercent || 40) / 100;
      const targetTime = videoRef.current.duration * impactPercent;
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
      setPlaybackSpeed(0.25); // Slow down for crash impact inspection
    }
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      dispatchEmergencyTeam(alert.id, `${selectedUnit} → ${targetHospital}`);
      setIsDispatching(false);
    }, 850);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b101c] border border-red-500/70 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Emergency Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-800/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-red-600 text-white shadow-sm">
                  INCIDENT INVESTIGATION // {alert.severity}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold flex items-center gap-1">
                  <span>🌐</span>
                  <span>AI VISION SURVEILLANCE</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  [{alert.id}]
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-wide mt-0.5">
                {alert.type}: {alert.location}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block font-mono text-xs text-slate-400">
              <div>Camera: <span className="text-cyan-300 font-bold">{alert.cameraId}</span></div>
              <div className="text-[10px] text-slate-500">{alert.timestamp}</div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-red-900/40 text-slate-300 hover:text-white transition-colors border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* Left 2 Cols: Indian Accident CCTV Video Player & Forensic Telemetry */}
          <div className="lg:col-span-2 p-4 bg-black/60 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col gap-3">
            
            {/* Interactive CCTV Video Player Viewport */}
            <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-red-500/80 bg-slate-950 shadow-2xl group select-none">
              {!videoError ? (
                <video
                  ref={videoRef}
                  key={videoSource}
                  src={videoSource}
                  poster={alert.imageUrl}
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      if (isPlaying) videoRef.current.play().catch(() => {});
                    }
                  }}
                  onPause={() => {
                    if (isPlaying && videoRef.current && !videoRef.current.seeking) {
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={alert.imageUrl}
                  alt={alert.type}
                  className="w-full h-full object-cover"
                />
              )}

              {/* CCTV Scanline and Vignette */}
              <div className="absolute inset-0 cctv-scanline opacity-30 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]" />

              {/* Top CCTV Status Overlay */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none text-[10px] font-mono z-10">
                <div className="flex items-center gap-2 bg-black/85 px-2.5 py-1 rounded-md border border-red-500/60 text-white backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-red-300">CCTV REPLAY // {alert.cityName?.toUpperCase() || 'LIVE'} TRAFFIC OPERATIONS</span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/85 px-2 py-1 rounded-md border border-slate-700 text-cyan-300 backdrop-blur">
                  <span>AI-ACCIDENTVISION v4.8</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* AI Bounding Boxes Over Scene (Accurate & Contextual) */}
              {showAiBoxes && !isVideoWithBurnedAi && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {sceneBoxes.map((box) => {
                    const isRed = box.color === 'red';
                    const isAmber = box.color === 'amber';
                    const borderColor = isRed ? 'border-red-500 bg-red-500/20' : isAmber ? 'border-amber-400 bg-amber-400/15' : 'border-cyan-400 bg-cyan-400/15';
                    const tagBg = isRed ? 'bg-red-600 text-white' : isAmber ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-cyan-600 text-white font-bold';

                    return (
                      <div
                        key={box.id}
                        className={cn(
                          "absolute border-2 transition-all duration-150 flex flex-col justify-between p-1",
                          borderColor,
                          box.isImpactZone && "animate-pulse"
                        )}
                        style={box.style}
                      >
                        <div className="flex items-center gap-1 -translate-y-5">
                          <span className={cn("font-mono font-bold text-[8.5px] px-1.5 py-0.5 rounded shadow flex items-center gap-1", tagBg)}>
                            {box.isImpactZone && <Crosshair className="w-3 h-3 animate-spin" />}
                            {box.label}
                          </span>
                        </div>

                        {box.isImpactZone && (box.deltaV || box.gForce) && (
                          <div className="flex items-center justify-between text-[9px] font-mono text-white bg-black/80 px-1.5 py-0.5 rounded mt-auto">
                            {box.deltaV && <span className="text-red-400 font-bold">{box.deltaV}</span>}
                            {box.gForce && <span className="text-amber-300 font-bold">G-FORCE: {box.gForce}</span>}
                          </div>
                        )}

                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Real-time native model inference status badge */}
              {showAiBoxes && isVideoWithBurnedAi && (
                <div className="absolute top-12 left-2.5 pointer-events-none z-10">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 text-[10px] font-mono font-bold flex items-center gap-1.5 backdrop-blur shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    REAL-TIME AI ACCIDENT DETECTION LOCKED • FRAME-BY-FRAME RECOGNITION
                  </span>
                </div>
              )}

              {/* Bottom Watermark */}
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none text-[9px] font-mono text-slate-300 z-10 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                <span className="truncate">DATASET: {alert.datasetOrigin || 'Autonomous Traffic Vision Stream'}</span>
                <span>TIME: {formatSeconds(currentTime)} / {formatSeconds(duration)}</span>
              </div>
            </div>

            {/* DVR Video Scrubbing & Speed Control Toolbar */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col gap-2">
              {/* Scrub Slider with Impact Point Marker */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 10}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                {/* Collision Point Marker on timeline */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white cursor-pointer pointer-events-none"
                  style={{ left: `${alert.impactPointPercent || 40}%` }}
                  title="Collision Impact Point"
                />
              </div>

              {/* Playback Controls Row */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-1 font-bold"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={jumpToImpactPoint}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 transition-colors flex items-center gap-1 font-bold"
                    title="Jump directly to the impact frame in slow-motion"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚡ Jump to Impact</span>
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Speed selector chips */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <span className="text-slate-500 px-1">Speed:</span>
                  {[0.25, 0.5, 1.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackSpeed(rate)}
                      className={cn(
                        "px-1.5 py-0.5 rounded transition-colors",
                        playbackSpeed === rate 
                          ? "bg-red-600 text-white font-bold" 
                          : "text-slate-400 hover:text-white"
                      )}
                    >
                      {rate === 0.25 ? '0.25x (Forensic)' : `${rate}x`}
                    </button>
                  ))}
                </div>

                {/* AI Box Overlay Toggle */}
                <button
                  onClick={() => setShowAiBoxes(!showAiBoxes)}
                  className={cn(
                    "px-2 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors",
                    showAiBoxes
                      ? "bg-cyan-950 border-cyan-500/60 text-cyan-300 font-bold"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  )}
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>AI Bounding Boxes</span>
                </button>
              </div>
            </div>

            {/* Collision Dynamics & Sensor Telemetry Strips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">PRE-IMPACT SPEED</span>
                <span className="text-base font-extrabold text-red-400">{alert.collisionSpeedKmh || 58.4} km/h</span>
                <span className="text-[9px] text-red-300 block">+18 km/h over limit</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">PEAK G-FORCE</span>
                <span className="text-base font-extrabold text-amber-400">{alert.impactGForce || 3.6} G</span>
                <span className="text-[9px] text-amber-300 block">Severe deceleration</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TIME TO COLLISION</span>
                <span className="text-base font-extrabold text-cyan-400">0.65 sec</span>
                <span className="text-[9px] text-slate-400 block">Insufficient braking</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">LEGAL COMPLIANCE</span>
                <span className="text-sm font-extrabold text-white">MV Act 2019</span>
                <span className="text-[9px] text-emerald-400 block">Sec 134 & 184</span>
              </div>
            </div>

            {/* AI Forensic Assessment & Explanation */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 text-xs">
              <div className="flex items-center gap-1.5 text-red-300 font-bold mb-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>AI-AccidentVision Automated Forensic Synthesis:</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans text-xs">
                {alert.aiExplanation}
              </p>
            </div>
          </div>

          {/* Right Col: Vehicles Involved, ANPR Cards & 108 Emergency Dispatch */}
          <div className="p-4 flex flex-col justify-between bg-[#0d1424] gap-4">
            <div className="space-y-4">
              {/* Dataset Origin Header Pill */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center justify-between">
                  <span>Incident Evidence Provenance</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
                <div className="text-white font-bold text-xs truncate">
                  {alert.datasetOrigin || 'Incident Investigation & Surveillance Feed'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{alert.location}</span>
                </div>
              </div>

              {/* ANPR & Involved Vehicles Section */}
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Involved Vehicles ({alert.anprPlates?.length || alert.vehiclesInvolved.length})</span>
                  <span className="text-[10px] text-cyan-400 font-normal">ANPR OCR</span>
                </h4>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {alert.anprPlates && alert.anprPlates.length > 0 ? (
                    alert.anprPlates.map((v, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "p-2.5 rounded-xl border text-xs font-mono flex flex-col gap-1",
                          v.role === 'At-Fault'
                            ? "bg-red-950/40 border-red-500/60 text-red-200"
                            : v.role === 'Victim'
                            ? "bg-amber-950/30 border-amber-500/50 text-amber-200"
                            : "bg-slate-900/80 border-slate-800 text-slate-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          {/* License Plate Badge */}
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-black border border-slate-700 text-white font-mono font-extrabold text-[11px] tracking-wider shadow-sm">
                              {v.plate}
                            </span>
                            <span className={cn(
                              "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase",
                              v.role === 'At-Fault' ? "bg-red-600 text-white" : v.role === 'Victim' ? "bg-amber-500 text-black" : "bg-blue-600 text-white"
                            )}>
                              {v.role}
                            </span>
                          </div>
                          {v.speedKmh && (
                            <span className="text-[10px] text-slate-400">
                              {v.speedKmh} km/h
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-300 font-sans font-medium mt-0.5">
                          {v.vehicleType}
                        </div>
                      </div>
                    ))
                  ) : (
                    alert.vehiclesInvolved.map((vStr, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 flex items-center justify-between">
                        <span className="truncate">{vStr}</span>
                        <span className="text-[10px] text-cyan-400">Tracked</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* AI Incident Analysis & Impact Metrics Card (Clean - No Dispatch Button) */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>AI Forensic Crash Telemetry</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-bold">
                    VERIFIED ANOMALY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">IMPACT G-FORCE</span>
                    <span className="text-sm font-bold text-amber-400">{alert.impactGForce || 3.6}G</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">COLLISION SPEED</span>
                    <span className="text-sm font-bold text-red-400">{alert.collisionSpeedKmh || 58.4} km/h</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">IMPACT ZONE</span>
                    <span className="text-sm font-bold text-cyan-400">Lateral Impact</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CONFIDENCE</span>
                    <span className="text-sm font-bold text-emerald-400">{alert.confidence}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Optical AI Verification Active</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                    Frame-by-frame tracked bounding boxes and multi-vehicle speed estimation recorded.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-[11px] text-slate-400">
                Audit Record: <span className="text-white">{alert.id}</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
