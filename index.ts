export type CityId = 'all' | 'india' | 'usa' | 'uk' | string;

export interface CityProfile {
  id: CityId;
  name: string;
  state: string;
  tagline: string;
  badge: string;
  coordinates: { x: number; y: number }; // Percentage on India map (0-100%)
  totalCameras: number;
  congestionIndex: number;
  activeIncidents: number;
  avgSpeed: number;
  flagshipCorridor: string;
}

export type ZoneId = 
  | string;

export type CameraStatus = 'online' | 'warning' | 'offline';

export type IncidentCategory = 
  | 'Traffic Accident' 
  | 'Wrong-Way Vehicle' 
  | 'Overspeeding' 
  | 'Pedestrian in Restricted Area' 
  | 'Illegal Parking'
  | 'Traffic Congestion'
  | 'Triple Riding (No Helmet)'
  | 'Stray Animal Obstacle'
  | 'Waterlogging / Pothole';

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface DetectedObject {
  id: string;
  type: 'car' | 'bus' | 'truck' | 'pedestrian' | 'bicycle' | 'motorcycle' | 'autorickshaw' | 'cattle' | 'tempo' | string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number }; // percentages 0-100
  speed?: number; // km/h
  licensePlate?: string;
  isViolation?: boolean;
  trajectory?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    startW?: number;
    startH?: number;
    endW?: number;
    endH?: number;
    offset?: number;
  };
}

export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  cityId?: CityId;
  cityName?: string;
  zone: ZoneId;
  status: CameraStatus;
  resolution: '4K UltraHD' | '1080p FHD';
  fps: number;
  ip: string;
  vehicleCount: number;
  pedestrianCount: number;
  congestionScore: number; // 0-100
  incidentType: IncidentCategory | 'Normal';
  latencyMs: number;
  activeAiModels: string[];
  objects: DetectedObject[];
  coordinates: { x: number; y: number }; // Map coordinates (0-100%)
  videoTheme: 'highway' | 'intersection' | 'bridge' | 'crosswalk' | 'tunnel' | 'roundabout';
  recentEvents: { time: string; text: string; severity: AlertSeverity }[];
  imageUrl?: string;
  videoUrl?: string;
  rawVideoUrl?: string;
  aiVideoUrl?: string;
  isLiveSimulation?: boolean;
}

export interface SafetyAlert {
  id: string;
  type: IncidentCategory;
  severity: AlertSeverity;
  location: string;
  cityId?: CityId;
  cityName?: string;
  zone: ZoneId;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  timeAgo: string;
  aiExplanation: string;
  confidence: number;
  acknowledged: boolean;
  vehiclesInvolved: string[];
  snapshotBg: string;
  imageUrl?: string;
  videoUrl?: string;
  datasetOrigin?: string;
  collisionSpeedKmh?: number;
  impactGForce?: number;
  impactPointPercent?: number;
  anprPlates?: { plate: string; vehicleType: string; role: 'At-Fault' | 'Victim' | 'Witness' | 'Barrier' | 'Obstacle'; speedKmh?: number }[];
  dispatchedStatus?: 'none' | 'dispatching' | 'dispatched';
  dispatchedUnits?: string[];
  dispatchedAt?: string;
  etaMinutes?: number;
}

export interface TrafficHotspot {
  id: string;
  location: string;
  cityId?: CityId;
  cityName?: string;
  zone: ZoneId;
  congestionStatus: 'Critical' | 'High' | 'Moderate' | 'Normal';
  congestionScore: number; // 0 - 100
  averageSpeed: number; // km/h
  cameraId: string;
  cameraName: string;
  lastUpdated: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  historicalVolume: number[];
}

export interface HourlyTrafficData {
  hour: string;
  volume: number;
  baseline: number;
  averageSpeed: number;
}

export interface ZoneSpeedData {
  zone: ZoneId;
  avgSpeed: number;
  congestionScore: number;
  vehicleCount: number;
}

export interface VehicleDistribution {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface WeeklyTrendPoint {
  day: string;
  peakCongestion: number;
  avgCongestion: number;
  incidents: number;
}

export type ThemeMode = 'dark' | 'monochrome' | 'light';
export type NavigationTab = 'overview' | 'surveillance' | 'traffic' | 'alerts' | 'cameras' | 'reports' | 'settings';
