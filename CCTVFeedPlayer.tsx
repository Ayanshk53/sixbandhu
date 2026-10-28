import React, { useState, useEffect, useRef } from 'react';
import { CameraFeed, DetectedObject } from '../../types';
import { 
  Maximize2, 
  Eye, 
  Scan, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Camera, 
  Layers,
  ZoomIn,
  Moon,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCommandCenter } from '../../context/CommandCenterContext';

interface CCTVFeedPlayerProps {
  camera: CameraFeed;
  isDetailed?: boolean;
  showAiOverlayDefault?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const CCTVFeedPlayer: React.FC<CCTVFeedPlayerProps> = ({
  camera,
  isDetailed = false,
  showAiOverlayDefault = true,
  onSelect,
  className
}) => {
  const { setSelectedCamera, showToast } = useCommandCenter();
  const [showAiOverlay, setShowAiOverlay] = useState(showAiOverlayDefault);
  const [isNightVision, setIsNightVision] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentTimecode, setCurrentTimecode] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [objects, setObjects] = useState<DetectedObject[]>(camera.objects);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dynamic timecode updating millisecond precision
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const datePart = now.toISOString().slice(0, 10);
      const timePart = now.toTimeString().slice(0, 8);
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setCurrentTimecode(`${datePart} ${timePart}.${ms}`);
    };
    const timer = setInterval(updateTime, 40);
    return () => clearInterval(timer);
  }, []);

  // Reset video error on camera or activeVideoSrc change
  useEffect(() => {
    setVideoError(false);
    setIsVideoLoading(true);
  }, [camera.aiVideoUrl, camera.rawVideoUrl, camera.videoUrl, camera.id]);

  // Keep detected objects accurately synced with the camera feed
  useEffect(() => {
    setObjects(camera.objects);
  }, [camera.objects]);

  // AI optical tracking telemetry smoothing when stream is active (anchored to accurate vehicle coordinates)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setObjects(() =>
        camera.objects.map((origObj) => {
          // Subtle confidence telemetry flicker (+/- 0.3%) without shifting box off the vehicle
          const confDelta = (Math.random() - 0.5) * 0.6;
          return {
            ...origObj,
            confidence: Math.min(99.8, Math.max(91.0, origObj.confidence + confDelta)),
            box: { ...origObj.box }
          };
        })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, camera.objects]);

  // Active video source switches seamlessly between AI inference stream and raw CCTV stream
  const activeVideoSrc = showAiOverlay
    ? (camera.aiVideoUrl || camera.videoUrl)
    : (camera.rawVideoUrl || camera.videoUrl);

  const isVideoWithBurnedAi = Boolean(
    activeVideoSrc && (
      activeVideoSrc.includes('_output') ||
      activeVideoSrc.includes('_accident')
    )
  );

  // Dynamic video time tracking for smooth vehicle motion
  const [videoTime, setVideoTime] = useState(0);

  // Ensure HTML5 video starts and loops seamlessly with muted property explicitly assigned
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.defaultMuted = true;
    vid.muted = true;

    const playVideo = () => {
      if (isPlaying && vid.paused) {
        const p = vid.play();
        if (p !== undefined) {
          p.catch(() => {
            // Autoplay restrictions caught gracefully
          });
        }
      } else if (!isPlaying) {
        vid.pause();
      }
    };

    playVideo();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        playVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isPlaying, activeVideoSrc, videoError]);

  const handleCaptureSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('Snapshot Captured', `Frame from ${camera.id} saved to incident evidence vault.`, 'info');
  };

  const isOffline = camera.status === 'offline';
  const isWarning = camera.status === 'warning';
  const canPlayVideo = Boolean(activeVideoSrc && !videoError);

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden border transition-all duration-200 select-none group bg-slate-950",
        isOffline ? "border-slate-800" : isWarning ? "border-amber-500/50" : "border-slate-800/80 hover:border-cyan-500/60",
        className
      )}
      onClick={onSelect || (() => setSelectedCamera(camera))}
    >
      {/* CCTV Screen Viewport */}
      <div 
        className={cn(
          "relative w-full aspect-video overflow-hidden transition-all duration-300",
          isNightVision && "filter contrast-150 brightness-110 hue-rotate-90 saturate-200"
        )}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Synthetic Realistic Urban Surveillance Scene */}
        {isOffline ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-500 gap-2">
            <WifiOff className="w-10 h-10 text-slate-600 animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase">SIGNAL LOST // NO CARRIER</span>
            <span className="font-mono text-[10px] text-slate-600">IP: {camera.ip} (Timeout 4000ms)</span>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#0d131f] overflow-hidden">
            {canPlayVideo ? (
              <video
                ref={videoRef}
                key={activeVideoSrc}
                src={activeVideoSrc}
                poster={camera.imageUrl}
                autoPlay={isPlaying}
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={() => setIsVideoLoading(false)}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setVideoTime(videoRef.current.currentTime);
                  }
                }}
                onCanPlay={() => {
                  setIsVideoLoading(false);
                  setVideoError(false);
                  if (isPlaying && videoRef.current?.paused) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
                onEnded={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    if (isPlaying) videoRef.current.play().catch(() => {});
                  }
                }}
                onPause={() => {
                  // Maintain continuous loop if paused unexpectedly by background browser throttle
                  if (isPlaying && videoRef.current && !videoRef.current.seeking) {
                    videoRef.current.play().catch(() => {});
                  }
                }}
                onError={() => {
                  setVideoError(true);
                  setIsVideoLoading(false);
                }}
                className="w-full h-full object-cover"
              />
            ) : camera.imageUrl ? (
              <img
                src={camera.imageUrl}
                alt={camera.name}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  // If image fails, fallback to vector road
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              /* Simulated Road / Urban Scene Canvas Vector */
              <svg className="w-full h-full object-cover" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`road-grad-${camera.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#131b2c" />
                    <stop offset="100%" stopColor="#0a0f1a" />
                  </linearGradient>
                  <pattern id={`asphalt-${camera.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect width="8" height="8" fill="#111726" />
                    <circle cx="2" cy="2" r="0.5" fill="#1b253b" />
                    <circle cx="6" cy="6" r="0.5" fill="#172033" />
                  </pattern>
                </defs>

                {/* Road Geometry based on camera theme */}
                <rect width="100" height="100" fill={`url(#asphalt-${camera.id})`} />
                
                {camera.videoTheme === 'highway' ? (
                  <>
                    <polygon points="10,0 30,0 0,100 0,100" fill="#0f172a" />
                    <polygon points="70,0 90,0 100,100 100,100" fill="#0f172a" />
                    {/* Lane dividers */}
                    <line x1="38" y1="0" x2="25" y2="100" stroke="#f1f5f9" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.4" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
                    <line x1="62" y1="0" x2="75" y2="100" stroke="#f1f5f9" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.4" />
                  </>
                ) : camera.videoTheme === 'intersection' ? (
                  <>
                    {/* Crossroad layout */}
                    <rect x="25" y="0" width="50" height="100" fill="#141c2e" />
                    <rect x="0" y="25" width="100" height="50" fill="#141c2e" />
                    <rect x="25" y="25" width="50" height="50" fill="#18233a" />
                    {/* Crosswalk striping */}
                    <line x1="26" y1="23" x2="74" y2="23" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.5" />
                    <line x1="26" y1="77" x2="74" y2="77" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.5" />
                    <line x1="23" y1="26" x2="23" y2="74" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.5" />
                    <line x1="77" y1="26" x2="77" y2="74" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.5" />
                  </>
                ) : camera.videoTheme === 'bridge' ? (
                  <>
                    {/* Bridge structure */}
                    <rect x="15" y="0" width="70" height="100" fill="#151e33" />
                    <rect x="0" y="0" width="15" height="100" fill="#0b1b2d" opacity="0.8" />
                    <rect x="85" y="0" width="15" height="100" fill="#0b1b2d" opacity="0.8" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.5" />
                    {/* Bridge suspension cables */}
                    <line x1="15" y1="0" x2="35" y2="100" stroke="#475569" strokeWidth="0.6" strokeOpacity="0.5" />
                    <line x1="85" y1="0" x2="65" y2="100" stroke="#475569" strokeWidth="0.6" strokeOpacity="0.5" />
                  </>
                ) : (
                  <>
                    {/* Urban crosswalk / corridor */}
                    <rect x="15" y="10" width="70" height="80" fill="#121a2c" />
                    <line x1="15" y1="50" x2="85" y2="50" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.5" />
                    <line x1="40" y1="10" x2="40" y2="90" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
                    <line x1="60" y1="10" x2="60" y2="90" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
                  </>
                )}

                {/* Watermark Grid Coordinates */}
                <text x="3" y="97" fill="#475569" fontSize="3" fontFamily="monospace">GRID: {camera.coordinates.x}.00, {camera.coordinates.y}.00</text>
              </svg>
            )}

            {/* AI Bounding Boxes Overlay: Render HTML boxes only if feed does not have native burned-in AI model detection */}
            {showAiOverlay && !isVideoWithBurnedAi && (
              <div className="absolute inset-0 pointer-events-none">
                {objects.map((obj) => {
                  const isCar = obj.type === 'car';
                  const isBus = obj.type === 'bus';
                  const isTruck = obj.type === 'truck';
                  const isPed = obj.type === 'pedestrian';
                  const isAuto = obj.type === 'autorickshaw';
                  const isTwoWheeler = obj.type === 'motorcycle';
                  const isCattle = obj.type === 'cattle';
                  const isTempo = obj.type === 'tempo';

                  const boxBorderColor = obj.isViolation 
                    ? 'border-red-500 bg-red-500/15 text-red-400' 
                    : isAuto
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                    : isTwoWheeler
                    ? 'border-sky-400 bg-sky-400/15 text-sky-300'
                    : isCattle
                    ? 'border-purple-400 bg-purple-400/20 text-purple-300'
                    : isPed 
                    ? 'border-yellow-400 bg-yellow-400/15 text-yellow-300' 
                    : isBus || isTruck || isTempo
                    ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300'
                    : 'border-cyan-400 bg-cyan-400/15 text-cyan-300';

                  const tagBg = obj.isViolation 
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/40' 
                    : isAuto
                    ? 'bg-amber-600 text-slate-950 font-bold'
                    : isTwoWheeler
                    ? 'bg-sky-600 text-white font-bold'
                    : isCattle
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-900/95 text-cyan-300 border border-cyan-500/40';

                  const labelText = isAuto
                    ? 'Auto-Rickshaw'
                    : isTwoWheeler
                    ? 'Two-Wheeler'
                    : isCattle
                    ? 'Cattle Obstacle'
                    : isTempo
                    ? 'Mini-Truck'
                    : isBus
                    ? 'City Bus'
                    : isPed
                    ? 'Pedestrian'
                    : obj.type.toUpperCase();

                  // Calculate dynamic time-synced coordinates so box moves smoothly along the road with the vehicle
                  const speedFactor = (obj.speed || 40) / 45;
                  const t = (videoTime * speedFactor + parseInt(obj.id.replace(/\D/g, '') || '1', 10) * 2.3) % 10;
                  const normT = t / 10;
                  const currentX = obj.trajectory
                    ? obj.trajectory.startX + normT * (obj.trajectory.endX - obj.trajectory.startX)
                    : Math.max(5, Math.min(90, obj.box.x + (normT - 0.5) * 14));
                  const currentY = obj.trajectory
                    ? obj.trajectory.startY + normT * (obj.trajectory.endY - obj.trajectory.startY)
                    : Math.max(10, Math.min(88, obj.box.y + (normT - 0.5) * 10));
                  const currentW = obj.trajectory?.startW
                    ? obj.trajectory.startW + normT * ((obj.trajectory.endW || obj.box.w) - obj.trajectory.startW)
                    : obj.box.w * (0.9 + normT * 0.2);
                  const currentH = obj.trajectory?.startH
                    ? obj.trajectory.startH + normT * ((obj.trajectory.endH || obj.box.h) - obj.trajectory.startH)
                    : obj.box.h * (0.9 + normT * 0.2);

                  return (
                    <div
                      key={obj.id}
                      className={cn(
                        "absolute border transition-all duration-150 flex flex-col justify-between p-0.5",
                        boxBorderColor
                      )}
                      style={{
                        left: `${currentX}%`,
                        top: `${currentY}%`,
                        width: `${currentW}%`,
                        height: `${currentH}%`,
                      }}
                    >
                      {/* Top Label Tag */}
                      <div className="flex items-center gap-1 -translate-y-4">
                        <span className={cn(
                          "px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded leading-none whitespace-nowrap shadow-sm flex items-center gap-1",
                          tagBg
                        )}>
                          {labelText} {obj.confidence.toFixed(0)}%
                        </span>
                        {obj.speed !== undefined && obj.speed > 0 && (
                          <span className="bg-slate-900/90 text-[8px] font-mono px-1 py-0.2 rounded text-slate-300 border border-slate-700">
                            {obj.speed} km/h
                          </span>
                        )}
                      </div>

                      {/* Corner Target Markers */}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-current" />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-current" />
                      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-current" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-current" />

                      {/* License plate if detected */}
                      {obj.licensePlate && (
                        <div className="text-[7px] font-mono bg-black/80 text-amber-300 px-0.5 py-0.2 self-center rounded tracking-tighter">
                          [{obj.licensePlate}]
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Real-time model inference status badge */}
            <div className="absolute top-8 left-2 pointer-events-none flex items-center gap-1.5 z-10">
              {showAiOverlay ? (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono font-medium flex items-center gap-1.5 shadow-md backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  YOLOv11 Optical Tracking Active
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 text-[10px] font-mono flex items-center gap-1.5 backdrop-blur">
                  Raw Camera Stream
                </span>
              )}
            </div>
          </div>
        )}

        {/* Scanline CRT Texture */}
        <div className="absolute inset-0 cctv-scanline pointer-events-none opacity-40" />

        {/* Vignette border */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]" />

        {/* HUD Top Bar */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-white/90 pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2">
            {!isOffline ? (
              <span className="flex items-center gap-1 text-red-500 font-bold bg-black/60 px-1.5 py-0.5 rounded">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-blink inline-block" />
                REC
              </span>
            ) : (
              <span className="text-red-400 font-bold bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                <WifiOff className="w-3 h-3" /> NO SYNC
              </span>
            )}
            <span className="bg-black/60 px-1.5 py-0.5 rounded text-cyan-400 font-bold tracking-wider">
              {camera.id}
            </span>
            <span className="bg-black/50 px-1.5 py-0.5 rounded text-slate-300 hidden sm:inline">
              {camera.resolution}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-black/60 px-1.5 py-0.5 rounded text-emerald-400">
              {camera.fps} FPS
            </span>
            <span className="bg-black/60 px-1.5 py-0.5 rounded text-slate-200 hidden md:inline">
              {currentTimecode}
            </span>
          </div>
        </div>

        {/* HUD Bottom Status Bar */}
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-semibold text-white tracking-wide bg-black/60 px-1.5 py-0.5 rounded">
              {camera.name}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
              <span className="bg-black/50 px-1 py-0.5 rounded flex items-center gap-1 text-cyan-300">
                🚘 {camera.vehicleCount} Veh
              </span>
              <span className="bg-black/50 px-1 py-0.5 rounded flex items-center gap-1 text-amber-300">
                🚶 {camera.pedestrianCount} Ped
              </span>
              {camera.incidentType !== 'Normal' && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded font-bold flex items-center gap-1",
                  camera.incidentType === 'Traffic Accident'
                    ? "bg-red-600 text-white animate-pulse shadow-md shadow-red-500/50"
                    : "bg-red-950/80 text-red-400 border border-red-500/50"
                )}>
                  {camera.incidentType === 'Traffic Accident' ? '💥 ACCIDENT DETECTED' : `⚠️ ${camera.incidentType}`}
                </span>
              )}
            </div>
          </div>

          {/* Quick HUD controls overlay */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              type="button"
              title={isPlaying ? "Pause Feed" : "Resume Live Feed"}
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
                if (videoRef.current) {
                  if (isPlaying) videoRef.current.pause();
                  else videoRef.current.play();
                }
              }}
              className={cn(
                "p-1.5 rounded bg-black/70 backdrop-blur text-xs transition-colors hover:text-white",
                isPlaying ? "text-emerald-400 border border-emerald-500/40" : "text-amber-400 border border-amber-500/40"
              )}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              title={showAiOverlay ? "AI Overlay Active (Click to switch to Raw Camera)" : "AI Overlay Off (Click to enable AI Object Detection)"}
              onClick={(e) => {
                e.stopPropagation();
                const nextVal = !showAiOverlay;
                setShowAiOverlay(nextVal);
                if (videoRef.current) {
                  const curTime = videoRef.current.currentTime;
                  setTimeout(() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = curTime;
                      if (isPlaying) videoRef.current.play().catch(() => {});
                    }
                  }, 60);
                }
              }}
              className={cn(
                "p-1.5 rounded bg-black/70 backdrop-blur text-xs transition-colors hover:text-white flex items-center gap-1",
                showAiOverlay ? "text-cyan-400 border border-cyan-500/40" : "text-slate-400"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Toggle Night Vision"
              onClick={(e) => {
                e.stopPropagation();
                setIsNightVision(!isNightVision);
              }}
              className={cn(
                "p-1.5 rounded bg-black/70 backdrop-blur text-xs transition-colors hover:text-white",
                isNightVision ? "text-emerald-400 border border-emerald-500/40" : "text-slate-400"
              )}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Save Snapshot"
              onClick={handleCaptureSnapshot}
              className="p-1.5 rounded bg-black/70 backdrop-blur text-slate-300 hover:text-cyan-300 text-xs transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              title="Inspect Live Feed"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCamera(camera);
              }}
              className="p-1.5 rounded bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Footer (Shown in feed grids) */}
      {!isDetailed && (
        <div className="p-2.5 bg-slate-900/95 flex flex-col gap-1.5 border-t border-slate-800 text-xs">
          {/* Top row: Name, Location & Status */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isOffline ? "bg-slate-500" : isWarning ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              )} />
              <span className="font-semibold text-white text-xs truncate">
                {camera.name}
              </span>
            </div>

            <span className={cn(
              "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase shrink-0 border",
              isOffline ? "bg-slate-800 text-slate-400 border-slate-700" :
              isWarning ? "bg-amber-950 text-amber-300 border-amber-800" :
              "bg-emerald-950 text-emerald-300 border-emerald-800"
            )}>
              {camera.status}
            </span>
          </div>

          {/* Location Line */}
          <div className="text-[11px] text-slate-400 font-mono truncate">
            📍 {camera.location}
          </div>

          {/* Bottom row: Vehicle Count & AI Detection Labels */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono gap-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span>🚘 {camera.vehicleCount} Vehicles</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300">🚶 {camera.pedestrianCount} Peds</span>
            </div>

            {/* AI Detection Labels pills (Car, Bus, Pedestrian, Auto, Two-Wheeler) */}
            <div className="flex items-center gap-1">
              {Array.from(new Set(camera.objects.map((o) => {
                if (o.type === 'autorickshaw') return 'Auto';
                if (o.type === 'motorcycle') return 'Two-Wheeler';
                if (o.type === 'tempo') return 'Mini-Truck';
                if (o.type === 'bus') return 'Bus';
                if (o.type === 'cattle') return 'Cattle';
                if (o.type === 'pedestrian') return 'Pedestrian';
                return 'Car';
              }))).slice(0, 4).map((label, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[9px]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
