# 🏙️ SmartCity Command Center
### AI-Driven Urban Surveillance, Traffic Management & Public Safety Operations Platform

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776ab.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A state-of-the-art municipal control-room dashboard and telemetry service designed for smart city operators to monitor multiple CCTV cameras, dynamic traffic congestion, vehicle movement, and AI-detected public safety incidents in real time.

---

## 📋 Table of Contents
1. [System Overview & Architecture](#-system-overview--architecture)
2. [Key Features](#-key-features)
3. [Testing Evidence & Accident Photos](#-testing-evidence--accident-photos)
4. [Project Structure](#-project-structure)
5. [Quick Start & Installation](#-quick-start--installation)
6. [Python Backend API Documentation](#-python-backend-api-documentation)
7. [Visual Themes (Dark, B&W, Light)](#-visual-themes)
8. [College Project Presentation Guide](#-college-project-presentation-guide)

---

## 🏛️ System Overview & Architecture

The platform follows a decoupled, high-performance architecture engineered for control-room command environments:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SMARTCITY COMMAND CENTER HUD                          │
│                      (React 19 + TypeScript + Tailwind)                     │
│                                                                             │
│  [ Tactical GIS Map ]     [ 2×2 Quad CCTV Feeds ]     [ Priority Alerts ]   │
│  [ Traffic Analytics ]    [ Surveillance Matrix ]     [ Camera Inventory ]  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST / Static Streaming
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PYTHON FASTAPI BACKEND SERVER                        │
│                          (FastAPI + Uvicorn + Python 3.12)                  │
│                                                                             │
│  • Edge AI Telemetry Simulation          • Optical Node Health (52 nodes)  │
│  • Real-time Incident Ingestion          • Static Evidence Vault            │
│  • Emergency Unit Dispatch Controller    • CSV / Audit Export Engine        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Web Audio API.
- **Backend**: Python 3.12, FastAPI, Uvicorn, Pydantic, Starlette StaticFiles.
- **Computer Vision Simulation**: YOLOv11-Urban multi-class object detection head (`Car`, `Bus`, `Truck`, `Pedestrian`), License Plate OCR (ANPR), and collision impact anomaly detection.

---

## 🚀 Key Features

### 1. Overview Dashboard
- **Top Emergency Warning Banner**: Persistent, dismissable alert bar for Priority-1 incidents with instant 1-click incident review and dispatch.
- **Real-Time Clock & Global Search**: Live UTC/local seconds ticker, along with instant search across all 52 cameras, zones, and incidents.
- **Four Core KPI Cards**:
  - **Active Cameras**: `48 / 52` (92.3% operational with health status indicator).
  - **Vehicles Detected Today**: `18,420` (live incrementing vehicle counter).
  - **Congestion Hotspots**: `6` active bottlenecks (2 severe).
  - **Critical Safety Alerts**: `2` unresolved alerts with pulsing visual beacon.
- **Tactical Urban GIS Vector Map**:
  - Interactive city grid, arterial highway loops, bridges, and waterways.
  - Interactive camera pins: green (normal), amber (warning), red (pulsing collision alert).
  - Dynamic congestion heatmap overlays (Downtown Core, North Tunnel, Harbour District).
  - Tactical layer toggles (*Cameras*, *Heatmap*, *Incidents*, *Boundaries*) and corner radar sweep animation.
- **Live Camera Feeds (2×2 Quad View)**:
  - 4 simultaneous CCTV streams: Grand Ave, Highway A1, Waterfront Bridge, Tech Corridor.
  - Realistic HUD overlay: Timecode running in milliseconds, CAM ID, REC icon, FPS, vehicle counter, pedestrian counter.
  - Dynamic AI Bounding Boxes with confidence percentages, speed tags, license plates, night vision toggle, and snapshot capture.
- **Priority Alerts Panel**:
  - Real-time incident stream with AI forensic explanations, location links, and action buttons: **View Feed** and **Acknowledge**.
- **Bottom Telemetry Charts (Recharts)**:
  - Hourly Traffic Volume vs. Historical baseline AreaChart.
  - Vehicle Type Distribution Donut Chart (Cars 64%, Two-Wheelers 16%, Buses 12%, Trucks 8%).
  - Congestion Index by Urban Zone BarChart.

---

### 2. Live Surveillance Matrix
- **Flexible Grid Layouts**: Switch seamlessly between **2×2 Focused Quad**, **3×2 Matrix**, and **Detailed List Table**.
- **Comprehensive Filters**: Filter by **Zone** (Downtown Core, Highway A1, Waterfront Bay, etc.), **Status** (Online, Warning, Offline), and **Incident Type** (Accidents, Wrong-Way, Overspeeding, etc.).
- **High-Definition Camera Inspection Modal**:
  - High-resolution feed with night-vision mode, snapshot capture, and AI overlay toggle.
  - Edge Inference Telemetry (Inference latency 38ms, Bitrate 4.85 Mbps, TLS 1.3 encryption).
  - Detected Objects Table with live confidence scores, speeds, and OCR plates.
  - Temporal Event Audit Trail timeline and stream reboot action.

---

### 3. Traffic Analytics & Mobility Intelligence
- **Summary Metrics**: Average Network Speed (`42.8 km/h`), Hourly Flow Rate (`2,180 veh/hr`), Total Vehicles (`18,420`), Congestion Index (`74/100`).
- **Interactive Charts**:
  - Multi-axis Hourly Volume vs Network Speed AreaChart.
  - Weekly Congestion Index and Incident Rate AreaChart.
  - Average Speed by Zone BarChart.
  - Vehicle Category Breakdown.
- **Active Hotspots Table**: Location, status badges, density score gauge, average speed, camera ID, and 1-click camera inspection.

---

### 4. Public Safety Alerts & Emergency Dispatch
- **Multi-Tier Severity Filtering**: Filter across All, Critical, High, Medium, and Acknowledged incidents.
- **Incident Types Handled**:
  - 💥 Traffic Accident
  - ⛔ Wrong-Way Vehicle
  - ⚡ Overspeeding
  - 🚶 Pedestrian in Restricted Area
  - 🚫 Illegal Parking
- **Accident Detail Modal & First Responder Dispatch**:
  - Displays authentic CCTV incident photo evidence with bounding box highlights and impact markers.
  - AI Forensic Assessment summary and temporal timeline reconstruction.
  - Response Package Selector: EMS Ambulance, Highway Patrol, Fire & Rescue, Traffic Diversion.
  - **"Dispatch Emergency Team"** action: Changes status in real time to `DISPATCHED - Units en route (ETA 4 mins)` with control room audio cues.

---

### 5. Camera Sensor Inventory
- Registry of all 52 municipal optical nodes.
- Full hardware specifications: RTSP stream URL, IP address, resolution (4K / 1080p), target FPS, active AI models (YOLOv11-Urban, PlateOCR-Pro, SpeedRadar-AI).
- Actions: Inspect Feed, Soft Reboot Stream, Calibrate AI Lens Matrix.

---

### 6. Compliance & Audit Reports
- Date range selectors: Today, Last 7 Days, Last 30 Days.
- **Export Actions**: 1-click **Export PDF Summary** and **Download CSV Data**.
- Weekly operational metric preview chart (Incidents vs Flow Efficiency).
- ISO 37120 Smart City compliance statement and cryptographic audit disclosure.

---

### 7. Settings & Edge AI Tuning
- **Theme Selection**: Dark Command (Default), Pure Monochrome B&W, and Clean White.
- **Edge AI Vision Parameters**:
  - YOLO Confidence Threshold Slider (50% - 99%).
  - Non-Maximum Suppression (NMS) Overlap Slider.
  - License Plate OCR, Pedestrian Trajectory, and GeoFence toggles.
- **Audio Synthesis**: Control-room audio chime toggle synthesized via Web Audio API.

---

## 📸 Testing Evidence & Accident Photos

The platform includes photorealistic surveillance incident photographs for testing and evaluation. These are served by both the Python backend (`/static/images/`) and the React frontend (`/incidents/`):

| Photo Filename | Incident Type | Camera Node | Location | Visual Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `intersection_accident.jpg` | **Two-Vehicle T-Bone Collision** | `CAM-01` | Grand Ave & 5th St Intersection | Multi-car collision, skid marks, debris, `[REC] CH 03 5TH & MARKET ST` HUD overlay. |
| `highway_accident.jpg` | **Highway Multi-Car Crash** | `CAM-07` | Highway A1 North Express KM 14.2 | Dusk elevated highway crash, emergency flares on asphalt, police beacon lights, `CAM 07 - I-95 N` HUD. |
| `tunnel_incident.jpg` | **Subterranean Tunnel Overspeed** | `CAM-41` | North Expressway Tunnel Portal | Sports coupe loss of traction, tire smoke, `CAM-41 TUNNEL (NORTH)` timestamp. |
| `illegal_parking_truck.jpg` | **Commercial Logistics Obstruction** | `CAM-24` | Port Terminal Logistics Gate | Heavy commercial freight hauler blocking red fire clearance corridor. |

---

## 📁 Project Structure

```
smart-city-command-center/
├── backend/                             # Python FastAPI Backend
│   ├── main.py                          # REST API Endpoints & Mock Database
│   ├── requirements.txt                 # Python Dependencies (fastapi, uvicorn, pydantic)
│   ├── run_backend.py                   # Python Startup Script
│   ├── run_backend.bat                  # 1-Click Windows Batch Launcher
│   └── static/
│       └── images/                      # Embedded Incident Testing Photos
│           ├── intersection_accident.jpg
│           ├── highway_accident.jpg
│           ├── tunnel_incident.jpg
│           └── illegal_parking_truck.jpg
├── public/                              # Static Frontend Assets
│   ├── incidents/                       # High-Res Incident Testing Photos
│   ├── favicon.svg
│   └── icons.svg
├── src/                                 # React Frontend Source Code
│   ├── components/
│   │   ├── alerts/                      # Safety Alerts & Accident Detail Modal
│   │   │   ├── AccidentDetailModal.tsx
│   │   │   └── SafetyAlertsPage.tsx
│   │   ├── cameras/                     # 52-Node Camera Inventory
│   │   │   └── CamerasPage.tsx
│   │   ├── common/                      # Reusable UI & CCTV Player
│   │   │   ├── CCTVFeedPlayer.tsx
│   │   │   └── ToastContainer.tsx
│   │   ├── layout/                      # TopBar, Sidebar, EmergencyBanner
│   │   │   ├── EmergencyBanner.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── overview/                    # Overview Dashboard
│   │   │   ├── CityMapPanel.tsx         # Tactical GIS Vector Map
│   │   │   ├── KpiOverviewCards.tsx     # 4 Core KPI Cards
│   │   │   ├── LiveCameraFeedsGrid.tsx  # 2×2 CCTV Feeds Quad View
│   │   │   ├── OverviewCharts.tsx       # Recharts Analytics
│   │   │   ├── OverviewPage.tsx
│   │   │   └── PriorityAlertsPanel.tsx
│   │   ├── reports/                     # Reports & Compliance Export
│   │   │   └── ReportsPage.tsx
│   │   ├── settings/                    # System Settings & AI Tuning
│   │   │   └── SettingsPage.tsx
│   │   └── traffic/                     # Traffic Analytics & Hotspots Table
│   │       └── TrafficAnalyticsPage.tsx
│   ├── context/
│   │   └── CommandCenterContext.tsx     # State Engine, Sound Synth, Live Tickers
│   ├── data/
│   │   └── mockData.ts                  # Mock Telemetry Data
│   ├── lib/
│   │   └── utils.ts                     # Utility helpers (cn, formatters)
│   ├── types/
│   │   └── index.ts                     # TypeScript Type Definitions
│   ├── App.tsx                          # Root App Component
│   ├── index.css                        # Tailwind CSS, Scanlines, HUD Grid
│   └── main.tsx                         # React 19 Entrypoint
├── index.html                           # HTML Root with Inter & JetBrains Mono Fonts
├── package.json                         # Node Dependencies
├── tailwind.config.js                   # Custom Control-Room Theme Palette
├── tsconfig.json                        # TypeScript Configuration
├── vite.config.ts                       # Vite Configuration with Path Aliases
└── README.md                            # Comprehensive Documentation
```

---

## 🚀 Deploying to Vercel

The project includes a pre-configured `vercel.json` and builds directly with Vite:

### Option 1: Via Vercel Web Dashboard (Recommended)
1. Push this folder to a GitHub repository (e.g. `smart-city-command-center`).
2. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel will auto-detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your command center dashboard will be live on `https://your-project.vercel.app`!

### Option 2: Via Vercel CLI
```powershell
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Deploy directly from project directory
cd smart-city-command-center
vercel --prod
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0+ or v20.0+ LTS
- **Python**: v3.10+ or v3.12+

---

### Step 1: Clone or Extract the Project
If using the packaged ZIP on Desktop:
```powershell
# Extract smart-city-command-center.zip
cd smart-city-command-center
```

---

### Step 2: Start the Python Backend Server
Open a terminal window:
```powershell
cd backend
python -m pip install -r requirements.txt
python run_backend.py
# Alternatively on Windows, just double-click: run_backend.bat
```
*Backend will start on: **`http://localhost:8000`***  
*Interactive Swagger API Docs: **`http://localhost:8000/docs`***

---

### Step 3: Start the React Frontend Dashboard
Open a second terminal window:
```powershell
npm install
npm run dev
```
*Frontend will launch on: **`http://localhost:5173/`***

---

## 🔌 Python Backend API Documentation

The FastAPI backend exposes full mock RESTful endpoints with CORS enabled:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Root status, version, and endpoint manifest. |
| `GET` | `/api/health` | Edge AI engine health, optical node status, inference latency (38ms). |
| `GET` | `/api/cameras` | List all 52 cameras (supports `?zone=` and `?status=` query filters). |
| `GET` | `/api/cameras/{id}` | Detailed telemetry and active models for a specific camera. |
| `POST`| `/api/cameras/{id}/reboot` | Soft power-cycle and RTSP stream buffer reset. |
| `GET` | `/api/alerts` | List all public safety alerts with high-res photo URLs (supports `?severity=`). |
| `GET` | `/api/alerts/{id}` | Inspect single incident details. |
| `POST`| `/api/alerts/{id}/acknowledge` | Acknowledge active incident by operator. |
| `POST`| `/api/alerts/{id}/dispatch` | Dispatch emergency units (Ambulance, Highway Patrol, Fire & Rescue). |
| `POST`| `/api/alerts/simulate` | Ingest a new simulated live collision alert. |
| `GET` | `/api/traffic/kpis` | Summary KPI telemetry (active cameras, vehicles detected, hotspots). |
| `GET` | `/api/traffic/hourly` | 24-hour traffic volume vs. average speed profile. |
| `GET` | `/api/traffic/hotspots` | Active congestion bottlenecks table with scores and average speeds. |
| `GET` | `/api/reports/export-csv` | Direct CSV file download of all logged incidents. |

---

## 🎨 Visual Themes

The dashboard supports three purpose-built control room themes:

1. **Dark Command (Default)**:
   - Charcoal/near-black background (`#0a0d14`), slate panels (`#161f33`), cyan/blue accents (`#06b6d4`), warning amber, and critical red.
   - Designed for low-light command-center environments.
2. **Pure Monochrome B&W**:
   - High-contrast stark black & white surveillance aesthetic.
   - Pitch black (`#000000`), white borders, and pure monochrome telemetry.
3. **Clean White Light**:
   - Clean white background (`#ffffff`) and slate cards for daylight control rooms.

*Switch themes instantly via the theme dropdown icon in the top-right header or in the **Settings** page.*

---

## 🎓 College Project Presentation Guide

If demonstrating this project for a college, university, or technical evaluation:

### 1. Introduction (1 minute)
- *"Good morning/afternoon. Today I am presenting the SmartCity Command Center, an AI-driven urban surveillance, traffic management, and public safety analytics platform."*
- Mention that it addresses modern urban challenges: automated accident detection, arterial congestion forecasting, and rapid emergency response.

### 2. Live Overview Demo (2 minutes)
- Point out the **4 KPI Cards**: `48 / 52` active cameras, `18,420` vehicles detected today, `6` hotspots, and `2` critical alerts.
- Showcase the **Tactical GIS Vector Map**: Toggle layers (*Cameras*, *Heatmap*, *Incidents*), zoom in/out, and hover on pins.
- Showcase the **2×2 CCTV Feeds**: Point out the live timecodes, AI bounding boxes (`CAR 97%`, `BUS 94%`), and switch to Night Vision mode.

### 3. Emergency Incident & Dispatch Workflow (2 minutes)
- Click **"Inspect & Dispatch"** on the Grand Ave collision alert.
- Show the **Accident Detail Modal**: Highlight the authentic CCTV accident evidence photo (`intersection_accident.jpg`), collision reconstruction, involved vehicles, and 97.4% AI confidence score.
- Click **"Dispatch Emergency Team"**: Demonstrate the real-time status change to `DISPATCHED - Units en route (ETA 4 mins)` with control room audio cues.

### 4. Technical Architecture (1 minute)
- Highlight the **FastAPI Python Backend** running on port 8000 (show `/docs` interactive Swagger page).
- Highlight the **React 19 + TypeScript** frontend with Tailwind CSS and Recharts visualizations.
- Show the **Theme Switcher** (toggle to **Pure Monochrome B&W** to prove design versatility).

---

## 📄 License
This project is open-source under the MIT License.
