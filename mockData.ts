import { 
  CameraFeed, 
  SafetyAlert, 
  TrafficHotspot, 
  HourlyTrafficData, 
  ZoneSpeedData, 
  VehicleDistribution,
  WeeklyTrendPoint,
  CityProfile 
} from '../types';

/**
 * Multi-Region Urban Surveillance, Traffic Telemetry & Collision Detection
 * Participating Regions: India, USA, UK + Global Grid
 */

export const CITIES: CityProfile[] = [
  {
    id: 'all',
    name: 'Global Grid',
    state: 'Worldwide (India, USA, UK)',
    tagline: 'Multi-Country Intelligent Surveillance & Telemetry Grid',
    badge: 'ALL REGIONS',
    coordinates: { x: 49, y: 52 },
    totalCameras: 48600,
    congestionIndex: 58,
    activeIncidents: 12,
    avgSpeed: 45.2,
    flagshipCorridor: 'International Arterial Highways & Expressways'
  },
  {
    id: 'india',
    name: 'India',
    state: 'India',
    tagline: 'National Highway & Smart City Traffic Network',
    badge: 'INDIA / IN',
    coordinates: { x: 50, y: 50 },
    totalCameras: 18400,
    congestionIndex: 52,
    activeIncidents: 4,
    avgSpeed: 42.5,
    flagshipCorridor: 'National Expressway Corridor & Metro Interchanges'
  },
  {
    id: 'usa',
    name: 'USA',
    state: 'USA',
    tagline: 'Interstate Highway & Metropolitan AI Traffic Grid',
    badge: 'USA / US',
    coordinates: { x: 30, y: 35 },
    totalCameras: 21500,
    congestionIndex: 64,
    activeIncidents: 5,
    avgSpeed: 54.0,
    flagshipCorridor: 'Interstate Expressways & Multi-Lane Gantry Systems'
  },
  {
    id: 'uk',
    name: 'UK',
    state: 'UK',
    tagline: 'Metropolitan Motorway & Intelligent Transport Grid',
    badge: 'UK / GB',
    coordinates: { x: 45, y: 25 },
    totalCameras: 8700,
    congestionIndex: 48,
    activeIncidents: 3,
    avgSpeed: 38.6,
    flagshipCorridor: 'Orbital Motorways & Subterranean Express Tunnels'
  }
];

export const INITIAL_CAMERAS: CameraFeed[] = [
  // --- INDIA ---
  {
    id: 'CAM-01',
    name: 'Central Junction & Flyover',
    location: 'India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Urban Central',
    status: 'warning',
    resolution: '4K UltraHD',
    fps: 30,
    ip: '192.168.10.101',
    vehicleCount: 2,
    pedestrianCount: 0,
    congestionScore: 89,
    incidentType: 'Traffic Accident',
    latencyMs: 34,
    activeAiModels: ['YOLOv11-Urban', 'PlateOCR-Pro', 'ImpactDetector'],
    coordinates: { x: 49, y: 52 },
    videoTheme: 'intersection',
    videoUrl: '/videos/testing_output.mp4',
    rawVideoUrl: '/videos/testing.mp4',
    aiVideoUrl: '/videos/testing_output.mp4',
    imageUrl: '/posters/cam01_intersection.jpg',
    objects: [
      { id: 'obj-1', type: 'car', confidence: 98.4, box: { x: 44.0, y: 48.0, w: 16.0, h: 18.0 }, speed: 38, licensePlate: 'DL-01-FA-4921' },
      { id: 'obj-2', type: 'car', confidence: 97.2, box: { x: 22.0, y: 46.0, w: 18.0, h: 19.0 }, speed: 52, licensePlate: 'DL-01-EN-8812', isViolation: true }
    ],
    recentEvents: [
      { time: '12:34:11', text: 'Vehicle collision detected by AI Vision (98.4% conf)', severity: 'Critical' },
      { time: '12:32:04', text: 'Rapid deceleration anomaly detected on flyover ramp', severity: 'High' }
    ]
  },
  {
    id: 'CAM-07',
    name: 'Express Highway Radar Corridor',
    location: 'India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Express Highway',
    status: 'warning',
    resolution: '4K UltraHD',
    fps: 60,
    ip: '192.168.10.107',
    vehicleCount: 46,
    pedestrianCount: 0,
    congestionScore: 82,
    incidentType: 'Traffic Accident',
    latencyMs: 22,
    activeAiModels: ['SpeedRadar-AI', 'ImpactDetector', 'FlowTracker'],
    coordinates: { x: 47, y: 55 },
    videoTheme: 'highway',
    videoUrl: '/videos/expressway_rear_end_accident.mp4',
    rawVideoUrl: '/videos/wild-input.mp4',
    aiVideoUrl: '/videos/expressway_rear_end_accident.mp4',
    imageUrl: '/posters/cam07_highway.jpg',
    objects: [
      { id: 'obj-11', type: 'car', confidence: 98.8, box: { x: 38.0, y: 52.0, w: 18.0, h: 22.0 }, speed: 94, licensePlate: 'MH-02-EE-4190', isViolation: true },
      { id: 'obj-12', type: 'car', confidence: 99.1, box: { x: 50.0, y: 44.0, w: 20.0, h: 24.0 }, speed: 45, licensePlate: 'KA-05-MN-9921' }
    ],
    recentEvents: [
      { time: '12:36:10', text: 'High-speed rear-end collision detected on fast lane (4.8G impact)', severity: 'Critical' },
      { time: '12:30:19', text: 'Vehicle clocked at 94.6 km/h approaching deceleration zone', severity: 'High' }
    ]
  },
  {
    id: 'CAM-12',
    name: 'Highway Freight Transit',
    location: 'India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Freight Transit',
    status: 'online',
    resolution: '1080p FHD',
    fps: 30,
    ip: '192.168.10.112',
    vehicleCount: 4,
    pedestrianCount: 0,
    congestionScore: 32,
    incidentType: 'Normal',
    latencyMs: 29,
    activeAiModels: ['FlowTracker', 'PlateOCR-Pro'],
    coordinates: { x: 48, y: 51 },
    videoTheme: 'crosswalk',
    videoUrl: '/videos/cmc_output.mp4',
    rawVideoUrl: '/videos/CMC_input.mp4',
    aiVideoUrl: '/videos/cmc_output.mp4',
    imageUrl: '/posters/cam12_bay.jpg',
    objects: [
      { id: 'obj-21', type: 'bus', confidence: 98.8, box: { x: 10.0, y: 45.0, w: 22.0, h: 28.0 }, speed: 38, licensePlate: 'BUS-210-IN' },
      { id: 'obj-22', type: 'car', confidence: 97.8, box: { x: 48.0, y: 52.0, w: 12.0, h: 14.0 }, speed: 44, licensePlate: 'IN-31-BZ-8090' },
      { id: 'obj-23', type: 'truck', confidence: 96.5, box: { x: 74.0, y: 44.0, w: 14.0, h: 18.0 }, speed: 40, licensePlate: 'IN-44-TR-1022' },
      { id: 'obj-24', type: 'car', confidence: 95.8, box: { x: 62.0, y: 56.0, w: 10.0, h: 12.0 }, speed: 46, licensePlate: 'IN-12-AX-7721' }
    ],
    recentEvents: [
      { time: '11:58:12', text: 'Freight corridor flow steady: 42 km/h average velocity', severity: 'Low' }
    ]
  },
  {
    id: 'CAM-10',
    name: 'Grand Boulevard Crossroads',
    location: 'India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Boulevard Arterial',
    status: 'online',
    resolution: '1080p FHD',
    fps: 30,
    ip: '192.168.10.110',
    vehicleCount: 42,
    pedestrianCount: 16,
    congestionScore: 35,
    incidentType: 'Normal',
    latencyMs: 28,
    activeAiModels: ['YOLOv11-Urban', 'FlowTracker'],
    coordinates: { x: 50, y: 52 },
    videoTheme: 'intersection',
    videoUrl: '/videos/cam01_intersection_output.mp4',
    rawVideoUrl: '/videos/cam01_intersection.mp4',
    aiVideoUrl: '/videos/cam01_intersection_output.mp4',
    imageUrl: '/posters/cam01_intersection.jpg',
    objects: [
      { id: 'obj-101', type: 'car', confidence: 98.2, box: { x: 38.0, y: 62.0, w: 6.0, h: 7.0 }, speed: 38, licensePlate: 'IN-10-AZ-2201' },
      { id: 'obj-102', type: 'car', confidence: 97.5, box: { x: 55.0, y: 68.0, w: 5.5, h: 6.5 }, speed: 40, licensePlate: 'IN-10-CB-4491' }
    ],
    recentEvents: [
      { time: '12:10:00', text: 'Traffic progression smooth through city boulevard', severity: 'Low' }
    ]
  },

  // --- USA ---
  {
    id: 'CAM-18',
    name: 'Interstate Multi-Lane Gantry',
    location: 'USA',
    cityId: 'usa',
    cityName: 'USA',
    zone: 'Interstate Hub',
    status: 'warning',
    resolution: '4K UltraHD',
    fps: 30,
    ip: '192.168.20.118',
    vehicleCount: 62,
    pedestrianCount: 0,
    congestionScore: 84,
    incidentType: 'Traffic Accident',
    latencyMs: 27,
    activeAiModels: ['HighwaySpeedNet', 'ImpactDetector', 'ANPR-OCR'],
    coordinates: { x: 30, y: 35 },
    videoTheme: 'intersection',
    videoUrl: '/videos/highway_pileup_accident.mp4',
    rawVideoUrl: '/videos/industry_input.mp4',
    aiVideoUrl: '/videos/highway_pileup_accident.mp4',
    imageUrl: '/posters/cam18_tech.jpg',
    objects: [
      { id: 'obj-31', type: 'car', confidence: 98.6, box: { x: 35.0, y: 48.0, w: 22.0, h: 20.0 }, speed: 88, licensePlate: 'NY-448-GT', isViolation: true },
      { id: 'obj-32', type: 'car', confidence: 97.9, box: { x: 48.0, y: 52.0, w: 24.0, h: 22.0 }, speed: 76, licensePlate: 'CA-882-PL' },
      { id: 'obj-33', type: 'van', confidence: 98.4, box: { x: 18.0, y: 40.0, w: 20.0, h: 24.0 }, speed: 70, licensePlate: 'TX-901-TR' }
    ],
    recentEvents: [
      { time: '12:35:00', text: 'Multi-vehicle highway pileup detected (4.6G impact, ΔV: -44 km/h)', severity: 'Critical' },
      { time: '12:31:55', text: 'Sudden multi-lane braking anomaly flagged on Interstate Gantry', severity: 'High' }
    ]
  },
  {
    id: 'CAM-24',
    name: 'Metro Underpass Arterial',
    location: 'USA',
    cityId: 'usa',
    cityName: 'USA',
    zone: 'Metro Underpass',
    status: 'online',
    resolution: '1080p FHD',
    fps: 30,
    ip: '192.168.20.124',
    vehicleCount: 84,
    pedestrianCount: 0,
    congestionScore: 62,
    incidentType: 'Normal',
    latencyMs: 31,
    activeAiModels: ['FlowTracker', 'SpeedRadar-AI'],
    coordinates: { x: 32, y: 36 },
    videoTheme: 'roundabout',
    videoUrl: '/videos/traffic_zone_output.mp4',
    rawVideoUrl: '/videos/traffic_zone_input.mp4',
    aiVideoUrl: '/videos/traffic_zone_output.mp4',
    imageUrl: '/posters/cam24_port.jpg',
    objects: [
      { id: 'obj-41', type: 'car', confidence: 97.6, box: { x: 61.0, y: 46.5, w: 6.0, h: 5.5 }, speed: 55, licensePlate: 'TX-441-USA' },
      { id: 'obj-42', type: 'truck', confidence: 98.4, box: { x: 51.5, y: 42.5, w: 5.5, h: 7.5 }, speed: 48, licensePlate: 'WA-881-TR' }
    ],
    recentEvents: [
      { time: '12:25:10', text: 'Underpass traffic velocity steady at 52 km/h', severity: 'Low' }
    ]
  },
  {
    id: 'CAM-33',
    name: 'Civic Center Interchange',
    location: 'USA',
    cityId: 'usa',
    cityName: 'USA',
    zone: 'Interchange Plaza',
    status: 'online',
    resolution: '4K UltraHD',
    fps: 30,
    ip: '192.168.20.133',
    vehicleCount: 5,
    pedestrianCount: 0,
    congestionScore: 36,
    incidentType: 'Normal',
    latencyMs: 26,
    activeAiModels: ['YOLOv11-Urban', 'PlateOCR-Pro'],
    coordinates: { x: 28, y: 34 },
    videoTheme: 'intersection',
    videoUrl: '/videos/testing2_output.mp4',
    rawVideoUrl: '/videos/testing2.mp4',
    aiVideoUrl: '/videos/testing2_output.mp4',
    imageUrl: '/posters/cam33_civic.jpg',
    objects: [
      { id: 'obj-51', type: 'car', confidence: 98.4, box: { x: 12.5, y: 31.0, w: 25.0, h: 21.0 }, speed: 48, licensePlate: 'FL-902-USA' },
      { id: 'obj-52', type: 'car', confidence: 97.5, box: { x: 81.5, y: 35.0, w: 18.0, h: 24.0 }, speed: 55, licensePlate: 'CA-412-USA' },
      { id: 'obj-53', type: 'car', confidence: 96.8, box: { x: 2.9, y: 41.0, w: 10.0, h: 9.0 }, speed: 45, licensePlate: 'NY-882-TR' },
      { id: 'obj-54', type: 'truck', confidence: 95.2, box: { x: 12.5, y: 31.0, w: 25.0, h: 21.0 }, speed: 42, licensePlate: 'US-TR-502' }
    ],
    recentEvents: [
      { time: '12:18:22', text: 'Multi-modal transit synchronization nominal', severity: 'Low' }
    ]
  },
  {
    id: 'CAM-11',
    name: 'Pacific Coast Highway',
    location: 'USA',
    cityId: 'usa',
    cityName: 'USA',
    zone: 'Coastal Expressway',
    status: 'online',
    resolution: '4K UltraHD',
    fps: 60,
    ip: '192.168.20.111',
    vehicleCount: 54,
    pedestrianCount: 0,
    congestionScore: 40,
    incidentType: 'Normal',
    latencyMs: 24,
    activeAiModels: ['SpeedRadar-AI', 'CoastalMonitor'],
    coordinates: { x: 27, y: 38 },
    videoTheme: 'highway',
    videoUrl: '/videos/cam07_highway_output.mp4',
    rawVideoUrl: '/videos/cam07_highway.mp4',
    aiVideoUrl: '/videos/cam07_highway_output.mp4',
    imageUrl: '/posters/cam07_highway.jpg',
    objects: [
      { id: 'obj-111', type: 'car', confidence: 98.7, box: { x: 45.0, y: 60.0, w: 6.5, h: 7.5 }, speed: 65, licensePlate: 'CA-PCH-770' },
      { id: 'obj-112', type: 'car', confidence: 97.9, box: { x: 55.0, y: 70.0, w: 7.0, h: 8.0 }, speed: 68, licensePlate: 'NV-402-TR' }
    ],
    recentEvents: [
      { time: '12:05:00', text: 'Expressway corridor traffic moving smoothly at 65 km/h', severity: 'Low' }
    ]
  },

  // --- UK ---
  {
    id: 'CAM-41',
    name: 'Subterranean Mountain Tunnel',
    location: 'UK',
    cityId: 'uk',
    cityName: 'UK',
    zone: 'Tunnel Corridor',
    status: 'warning',
    resolution: '1080p FHD',
    fps: 25,
    ip: '192.168.30.141',
    vehicleCount: 54,
    pedestrianCount: 0,
    congestionScore: 84,
    incidentType: 'Traffic Accident',
    latencyMs: 44,
    activeAiModels: ['TunnelSmokeAI', 'ImpactDetector', 'SpeedRadar-AI'],
    coordinates: { x: 45, y: 25 },
    videoTheme: 'tunnel',
    videoUrl: '/videos/tunnel_crash_accident.mp4',
    rawVideoUrl: '/videos/cam41_tunnel.mp4',
    aiVideoUrl: '/videos/tunnel_crash_accident.mp4',
    imageUrl: '/posters/cam41_tunnel.jpg',
    objects: [
      { id: 'obj-61', type: 'car', confidence: 99.2, box: { x: 42.0, y: 56.0, w: 22.0, h: 20.0 }, speed: 114, licensePlate: 'LDN-77-VX', isViolation: true },
      { id: 'obj-62', type: 'barrier', confidence: 98.6, box: { x: 62.0, y: 58.0, w: 18.0, h: 24.0 }, speed: 0, licensePlate: 'UK-04-BARR' }
    ],
    recentEvents: [
      { time: '12:35:45', text: 'High-speed tunnel barrier collision detected (5.2G impact, 114 km/h)', severity: 'Critical' },
      { time: '12:29:40', text: 'Vehicle clocked at 114 km/h in restricted 70 km/h tunnel portal', severity: 'Critical' }
    ]
  },
  {
    id: 'CAM-49',
    name: 'Harbour Logistics Transit Gate',
    location: 'UK',
    cityId: 'uk',
    cityName: 'UK',
    zone: 'Harbour District',
    status: 'online',
    resolution: '1080p FHD',
    fps: 30,
    ip: '192.168.30.149',
    vehicleCount: 18,
    pedestrianCount: 2,
    congestionScore: 28,
    incidentType: 'Normal',
    latencyMs: 32,
    activeAiModels: ['HeavyVehicleWeightNet', 'FlowTracker'],
    coordinates: { x: 47, y: 26 },
    videoTheme: 'bridge',
    videoUrl: '/videos/cam49_harbour_output.mp4',
    rawVideoUrl: '/videos/cam49_harbour.mp4',
    aiVideoUrl: '/videos/cam49_harbour_output.mp4',
    imageUrl: '/posters/cam49_harbour.jpg',
    objects: [
      { id: 'obj-71', type: 'car', confidence: 98.2, box: { x: 40.5, y: 66.8, w: 3.5, h: 5.5 }, speed: 48, licensePlate: 'UK-44-HB' },
      { id: 'obj-72', type: 'truck', confidence: 97.5, box: { x: 56.5, y: 57.5, w: 4.5, h: 7.0 }, speed: 42, licensePlate: 'UK-88-TR' }
    ],
    recentEvents: [
      { time: '12:20:00', text: 'Harbour freight transit gate clearance nominal', severity: 'Low' }
    ]
  },
  {
    id: 'CAM-52',
    name: 'Orbital Motorway Perimeter',
    location: 'UK',
    cityId: 'uk',
    cityName: 'UK',
    zone: 'Perimeter Motorway',
    status: 'online',
    resolution: '1080p FHD',
    fps: 30,
    ip: '192.168.30.152',
    vehicleCount: 36,
    pedestrianCount: 0,
    congestionScore: 32,
    incidentType: 'Normal',
    latencyMs: 28,
    activeAiModels: ['SpeedRadar-AI', 'PlateOCR-Pro'],
    coordinates: { x: 44, y: 24 },
    videoTheme: 'highway',
    videoUrl: '/videos/cam52_perimeter_output.mp4',
    rawVideoUrl: '/videos/cam52_perimeter.mp4',
    aiVideoUrl: '/videos/cam52_perimeter_output.mp4',
    imageUrl: '/posters/cam52_perimeter.jpg',
    objects: [
      { id: 'obj-81', type: 'car', confidence: 98.9, box: { x: 35.0, y: 58.0, w: 6.0, h: 7.5 }, speed: 70, licensePlate: 'GB-71-XY' },
      { id: 'obj-82', type: 'car', confidence: 97.6, box: { x: 50.0, y: 66.0, w: 6.5, h: 8.0 }, speed: 72, licensePlate: 'GB-20-WZ' }
    ],
    recentEvents: [
      { time: '12:15:00', text: 'Perimeter orbital motorway speed steady at 70 km/h', severity: 'Low' }
    ]
  },
  {
    id: 'CAM-13',
    name: 'Waterfront Promenade Bay Bridge',
    location: 'UK',
    cityId: 'uk',
    cityName: 'UK',
    zone: 'Bay Bridge',
    status: 'online',
    resolution: '4K UltraHD',
    fps: 60,
    ip: '192.168.30.113',
    vehicleCount: 48,
    pedestrianCount: 14,
    congestionScore: 42,
    incidentType: 'Normal',
    latencyMs: 25,
    activeAiModels: ['BridgeFlowTracker', 'PedestrianTrack'],
    coordinates: { x: 46, y: 27 },
    videoTheme: 'bridge',
    videoUrl: '/videos/cam12_bay_output.mp4',
    rawVideoUrl: '/videos/cam12_bay.mp4',
    aiVideoUrl: '/videos/cam12_bay_output.mp4',
    imageUrl: '/posters/cam12_bay.jpg',
    objects: [
      { id: 'obj-91', type: 'car', confidence: 99.0, box: { x: 72.5, y: 81.0, w: 7.5, h: 8.5 }, speed: 60, licensePlate: 'UK-09-BAY' },
      { id: 'obj-92', type: 'car', confidence: 98.4, box: { x: 65.2, y: 71.8, w: 5.8, h: 6.5 }, speed: 58, licensePlate: 'UK-14-LON' }
    ],
    recentEvents: [
      { time: '12:30:00', text: 'Bay bridge electronic toll lane progression steady', severity: 'Low' }
    ]
  }
];

export const INITIAL_SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'ALT-1092',
    type: 'Traffic Accident',
    severity: 'Critical',
    location: 'India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Urban Central',
    cameraId: 'CAM-01',
    cameraName: 'Central Junction & Flyover',
    timestamp: '12:34:11 PM',
    timeAgo: '2m ago',
    aiExplanation: 'Severe lateral collision detected between two passenger sedans during junction merge. Rapid deceleration registered.',
    confidence: 98.4,
    acknowledged: false,
    vehiclesInvolved: ['Red Sedan (DL-01-FA-4921)', 'Black Sedan (DL-01-EN-8812)'],
    snapshotBg: 'accident',
    imageUrl: '/incidents/intersection_accident.jpg',
    videoUrl: '/videos/testing_output.mp4',
    datasetOrigin: 'Collision Investigation Vision Feed • India',
    collisionSpeedKmh: 58.4,
    impactGForce: 3.6,
    impactPointPercent: 42,
    anprPlates: [
      { plate: 'DL-01-FA-4921', vehicleType: 'Red Sedan', role: 'At-Fault', speedKmh: 58.4 },
      { plate: 'DL-01-EN-8812', vehicleType: 'Black Sedan', role: 'Victim', speedKmh: 24.0 }
    ],
    dispatchedStatus: 'none',
  },
  {
    id: 'ALT-1093',
    type: 'Traffic Accident',
    severity: 'Critical',
    location: 'USA',
    cityId: 'usa',
    cityName: 'USA',
    zone: 'Interstate Hub',
    cameraId: 'CAM-18',
    cameraName: 'Interstate Multi-Lane Gantry',
    timestamp: '12:35:00 PM',
    timeAgo: '3m ago',
    aiExplanation: 'Multi-vehicle highway pileup detected with emergency deceleration (4.6G impact, ΔV: -44 km/h). Trajectory lock active.',
    confidence: 98.8,
    acknowledged: false,
    vehiclesInvolved: ['Red Hatchback (NY-448-GT)', 'Blue SUV (CA-882-PL)', 'White Van (TX-901-TR)'],
    snapshotBg: 'accident',
    imageUrl: '/incidents/highway_accident.jpg',
    videoUrl: '/videos/highway_pileup_accident.mp4',
    datasetOrigin: 'Interstate Highway Vision Feed • USA',
    collisionSpeedKmh: 88.0,
    impactGForce: 4.6,
    impactPointPercent: 38,
    anprPlates: [
      { plate: 'NY-448-GT', vehicleType: 'Red Hatchback', role: 'At-Fault', speedKmh: 88.0 },
      { plate: 'CA-882-PL', vehicleType: 'Blue SUV', role: 'Victim', speedKmh: 44.0 },
      { plate: 'TX-901-TR', vehicleType: 'Commercial Van', role: 'Witness', speedKmh: 35.0 }
    ],
    dispatchedStatus: 'none',
  },
  {
    id: 'ALT-1094',
    type: 'Traffic Accident',
    severity: 'Critical',
    location: 'UK',
    cityId: 'uk',
    cityName: 'UK',
    zone: 'Tunnel Corridor',
    cameraId: 'CAM-41',
    cameraName: 'Subterranean Mountain Tunnel',
    timestamp: '12:35:45 PM',
    timeAgo: '1m ago',
    aiExplanation: 'High-speed subterranean barrier collision detected at 114 km/h (5.2G impact). Structural deformation registered.',
    confidence: 99.2,
    acknowledged: false,
    vehiclesInvolved: ['Executive Sedan (LDN-77-VX)', 'Impact Barrier (UK-04-BARR)'],
    snapshotBg: 'accident',
    imageUrl: '/incidents/tunnel_incident.jpg',
    videoUrl: '/videos/tunnel_crash_accident.mp4',
    datasetOrigin: 'Tunnel Bore Surveillance Feed • UK',
    collisionSpeedKmh: 114.2,
    impactGForce: 5.2,
    impactPointPercent: 41,
    anprPlates: [
      { plate: 'LDN-77-VX', vehicleType: 'Executive Sedan', role: 'At-Fault', speedKmh: 114.2 },
      { plate: 'UK-04-BARR', vehicleType: 'Impact Attenuator Barrier', role: 'Barrier', speedKmh: 0.0 }
    ],
    dispatchedStatus: 'none',
  },
  {
    id: 'ALT-1095',
    type: 'Traffic Accident',
    severity: 'Critical',
    location: 'India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Express Highway',
    cameraId: 'CAM-07',
    cameraName: 'Express Highway Radar Corridor',
    timestamp: '12:36:10 PM',
    timeAgo: 'Just now',
    aiExplanation: 'Severe high-speed rear-end collision detected on fast lane (4.8G impact). Kinetic transfer & spin registered.',
    confidence: 98.7,
    acknowledged: false,
    vehiclesInvolved: ['White Sedan (MH-02-EE-4190)', 'Silver SUV (KA-05-MN-9921)'],
    snapshotBg: 'accident',
    imageUrl: '/incidents/highway_accident.jpg',
    videoUrl: '/videos/expressway_rear_end_accident.mp4',
    datasetOrigin: 'Expressway Multi-Lane Vision • India',
    collisionSpeedKmh: 94.6,
    impactGForce: 4.8,
    impactPointPercent: 40,
    anprPlates: [
      { plate: 'MH-02-EE-4190', vehicleType: 'White Sedan', role: 'At-Fault', speedKmh: 94.6 },
      { plate: 'KA-05-MN-9921', vehicleType: 'Silver SUV', role: 'Victim', speedKmh: 45.0 }
    ],
    dispatchedStatus: 'none',
  }
];

export const CONGESTION_HOTSPOTS: TrafficHotspot[] = [
  {
    id: 'HOT-01',
    location: 'Highway Corridor, India',
    cityId: 'india',
    cityName: 'India',
    zone: 'Express Highway',
    congestionStatus: 'High',
    congestionScore: 78,
    averageSpeed: 38.5,
    cameraId: 'CAM-07',
    cameraName: 'Express Highway Radar Corridor',
    lastUpdated: '12:35:10 PM',
    trend: 'increasing',
    historicalVolume: [72, 78, 84, 88, 90]
  },
  {
    id: 'HOT-02',
    location: 'Interstate Hub, USA',
    cityId: 'usa',
    cityName: 'USA',
    zone: 'Interstate Hub',
    congestionStatus: 'Critical',
    congestionScore: 88,
    averageSpeed: 24.2,
    cameraId: 'CAM-18',
    cameraName: 'Interstate Multi-Lane Gantry',
    lastUpdated: '12:35:00 PM',
    trend: 'increasing',
    historicalVolume: [70, 76, 82, 86, 88]
  },
  {
    id: 'HOT-03',
    location: 'Tunnel Corridor, UK',
    cityId: 'uk',
    cityName: 'UK',
    zone: 'Tunnel Corridor',
    congestionStatus: 'Moderate',
    congestionScore: 64,
    averageSpeed: 48.0,
    cameraId: 'CAM-41',
    cameraName: 'Subterranean Mountain Tunnel',
    lastUpdated: '12:34:00 PM',
    trend: 'stable',
    historicalVolume: [60, 62, 64, 63, 64]
  }
];

export const HOURLY_TRAFFIC_DATA: HourlyTrafficData[] = [
  { hour: '00:00', volume: 18420, baseline: 16800, averageSpeed: 54 },
  { hour: '01:00', volume: 14800, baseline: 13300, averageSpeed: 58 },
  { hour: '02:00', volume: 11600, baseline: 10200, averageSpeed: 60 },
  { hour: '03:00', volume: 10100, baseline: 9400, averageSpeed: 62 },
  { hour: '04:00', volume: 12400, baseline: 11100, averageSpeed: 61 },
  { hour: '05:00', volume: 19200, baseline: 16600, averageSpeed: 58 },
  { hour: '06:00', volume: 32900, baseline: 27800, averageSpeed: 52 },
  { hour: '07:00', volume: 54500, baseline: 46800, averageSpeed: 44 },
  { hour: '08:00', volume: 82800, baseline: 71600, averageSpeed: 32 },
  { hour: '09:00', volume: 114200, baseline: 98400, averageSpeed: 24 },
  { hour: '10:00', volume: 128600, baseline: 108200, averageSpeed: 19 },
  { hour: '11:00', volume: 99400, baseline: 86000, averageSpeed: 28 },
  { hour: '12:00', volume: 92100, baseline: 82400, averageSpeed: 30 },
  { hour: '13:00', volume: 88500, baseline: 79100, averageSpeed: 32 },
  { hour: '14:00', volume: 86800, baseline: 77600, averageSpeed: 34 },
  { hour: '15:00', volume: 94900, baseline: 83900, averageSpeed: 31 },
  { hour: '16:00', volume: 108200, baseline: 94800, averageSpeed: 28 },
  { hour: '17:00', volume: 126800, baseline: 111000, averageSpeed: 22 },
  { hour: '18:00', volume: 142100, baseline: 125600, averageSpeed: 16 },
  { hour: '19:00', volume: 149500, baseline: 131200, averageSpeed: 14 },
  { hour: '20:00', volume: 131200, baseline: 115400, averageSpeed: 19 },
  { hour: '21:00', volume: 92600, baseline: 81800, averageSpeed: 29 },
  { hour: '22:00', volume: 58400, baseline: 51200, averageSpeed: 38 },
  { hour: '23:00', volume: 34200, baseline: 29800, averageSpeed: 46 },
];

export const VEHICLE_DISTRIBUTION: VehicleDistribution[] = [
  { name: 'Cars & Sedans', count: 1845200, percentage: 54.2, color: '#06b6d4' },
  { name: 'SUVs & Light Vehicles', count: 969100, percentage: 24.3, color: '#3b82f6' },
  { name: 'Commercial Freight & Trucks', count: 420000, percentage: 12.5, color: '#f59e0b' },
  { name: 'Public Transit Buses', count: 262300, percentage: 6.6, color: '#10b981' },
  { name: 'Motorcycles & Two-Wheelers', count: 159000, percentage: 2.4, color: '#ec4899' },
];

export const ZONE_SPEED_DATA: ZoneSpeedData[] = [
  { zone: 'Urban Central Corridor', avgSpeed: 34.5, congestionScore: 78, vehicleCount: 942000 },
  { zone: 'Express Highway Corridor', avgSpeed: 68.4, congestionScore: 42, vehicleCount: 1240000 },
  { zone: 'Interstate Multi-Lane Gantry', avgSpeed: 52.0, congestionScore: 74, vehicleCount: 684200 },
  { zone: 'Metro Underpass Arterial', avgSpeed: 46.0, congestionScore: 62, vehicleCount: 1420000 },
  { zone: 'Subterranean Mountain Tunnel', avgSpeed: 58.0, congestionScore: 68, vehicleCount: 512000 },
  { zone: 'Orbital Motorway Perimeter', avgSpeed: 70.0, congestionScore: 32, vehicleCount: 780000 },
];

export const WEEKLY_CONGESTION_TREND: WeeklyTrendPoint[] = [
  { day: 'Mon', peakCongestion: 94, avgCongestion: 64, incidents: 38 },
  { day: 'Tue', peakCongestion: 92, avgCongestion: 62, incidents: 34 },
  { day: 'Wed', peakCongestion: 90, avgCongestion: 60, incidents: 32 },
  { day: 'Thu', peakCongestion: 94, avgCongestion: 65, incidents: 40 },
  { day: 'Fri', peakCongestion: 98, avgCongestion: 70, incidents: 48 },
  { day: 'Sat', peakCongestion: 78, avgCongestion: 48, incidents: 22 },
  { day: 'Sun', peakCongestion: 60, avgCongestion: 36, incidents: 16 },
];

export const CITY_SECTORS = [
  { id: 'sec-all', name: 'Global Command Grid', status: 'critical', congestion: 58, activeIncidents: 12, cameras: 12 },
  { id: 'sec-india', name: 'India', status: 'warning', congestion: 52, activeIncidents: 4, cameras: 4 },
  { id: 'sec-usa', name: 'USA', status: 'critical', congestion: 64, activeIncidents: 5, cameras: 4 },
  { id: 'sec-uk', name: 'UK', status: 'normal', congestion: 48, activeIncidents: 3, cameras: 4 },
];
