import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Maximize2, Minimize2, Navigation, ShieldCheck } from 'lucide-react';
import { LiveLocationData } from '../types';

interface LeafletMapProps {
  mode: 'telecom' | 'live';
  telecomLocation?: {
    lat: number;
    lng: number;
    accuracyKm: number;
    regionName: string;
    cityName?: string;
  };
  liveLocation?: LiveLocationData;
  breadcrumbs?: LiveLocationData[];
  title?: string;
  height?: string;
}

export default function LeafletMap({
  mode,
  telecomLocation,
  liveLocation,
  breadcrumbs = [],
  title,
  height = '420px',
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [tileStyle, setTileStyle] = useState<'streets' | 'satellite' | 'topo'>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = mode === 'live' && liveLocation ? liveLocation.latitude : telecomLocation?.lat || 20;
      const initialLng = mode === 'live' && liveLocation ? liveLocation.longitude : telecomLocation?.lng || 0;
      const initialZoom = mode === 'live' ? 15 : telecomLocation?.accuracyKm ? Math.max(3, Math.min(10, Math.round(14 - Math.log2(telecomLocation.accuracyKm)))) : 4;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Standard public OpenStreetMap tiles (no API key required)
      const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = layer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle tile switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attr = '&copy; OpenStreetMap contributors';

    if (tileStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri & GIS Community';
    } else if (tileStyle === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap, SRTM | OpenTopoMap';
    }

    tileLayerRef.current = L.tileLayer(url, {
      attribution: attr,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [tileStyle]);

  // Update Markers & Layers when coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) markerRef.current.remove();
    if (circleRef.current) circleRef.current.remove();
    if (polylineRef.current) polylineRef.current.remove();

    if (mode === 'telecom' && telecomLocation) {
      const { lat, lng, accuracyKm, regionName, cityName } = telecomLocation;

      // Custom icon for registered telecom region
      const telecomIcon = L.divIcon({
        className: 'custom-telecom-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <div style="position: absolute; width: 36px; height: 36px; background: rgba(14, 165, 233, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 24px; height: 24px; background: #0284c7; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.5);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: telecomIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; color: #0f172a; padding: 4px;">
          <div style="font-weight: 700; margin-bottom: 4px; color: #0369a1;">Telecom Registered Area</div>
          <div style="font-weight: 600;">${regionName}</div>
          ${cityName ? `<div style="color: #64748b; font-size: 12px;">City: ${cityName}</div>` : ''}
          <div style="margin-top: 6px; font-size: 11px; color: #475569; background: #f0f9ff; padding: 4px 6px; border-radius: 4px; border: 1px solid #bae6fd;">
            <strong>Approx. Area Radius:</strong> ~${accuracyKm} km<br/>
            <em>(Telecom exchange allocation, not GPS)</em>
          </div>
        </div>
      `);

      // Circle indicating telecom coverage/area allocation
      const radiusMeters = Math.min(accuracyKm * 1000, 2000000);
      const circle = L.circle([lat, lng], {
        radius: radiusMeters,
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 6',
      }).addTo(map);

      markerRef.current = marker;
      circleRef.current = circle;

      // Fit bounds
      map.fitBounds(circle.getBounds(), { padding: [40, 40], maxZoom: 10 });
    } else if (mode === 'live' && liveLocation) {
      const { latitude, longitude, accuracy, speed, heading, address } = liveLocation;

      // Live GPS Pulse Icon
      const liveIcon = L.divIcon({
        className: 'custom-live-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
            <div style="position: absolute; width: 44px; height: 44px; background: rgba(34, 197, 94, 0.3); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 22px; height: 22px; background: #16a34a; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 16px rgba(34, 197, 94, 0.8);"></div>
            ${
              heading !== null && heading !== undefined
                ? `<div style="position: absolute; top: -6px; transform: rotate(${heading}deg); transform-origin: center 28px;">
                    <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 8px solid #22c55e;"></div>
                   </div>`
                : ''
            }
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([latitude, longitude], { icon: liveIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; color: #0f172a; padding: 4px;">
          <div style="font-weight: 700; color: #15803d; display: flex; align-items: center; gap: 4px;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#22c55e;"></span>
            LIVE CONSENT-BASED GPS
          </div>
          <div style="font-size: 12px; margin-top: 4px;"><strong>Lat/Lng:</strong> ${latitude.toFixed(5)}, ${longitude.toFixed(5)}</div>
          <div style="font-size: 12px;"><strong>GPS Accuracy:</strong> ±${accuracy} meters</div>
          ${speed !== null && speed !== undefined ? `<div style="font-size: 12px;"><strong>Speed:</strong> ${(speed * 3.6).toFixed(1)} km/h</div>` : ''}
          ${address ? `<div style="font-size: 11px; margin-top: 4px; color: #475569;">${address}</div>` : ''}
        </div>
      `);

      // Accuracy radius in meters
      const circle = L.circle([latitude, longitude], {
        radius: Math.max(accuracy, 10),
        color: '#16a34a',
        fillColor: '#4ade80',
        fillOpacity: 0.18,
        weight: 1.5,
      }).addTo(map);

      // Breadcrumbs trail
      if (breadcrumbs.length > 1) {
        const latLngs = breadcrumbs.map(p => [p.latitude, p.longitude] as [number, number]);
        const polyline = L.polyline(latLngs, {
          color: '#22c55e',
          weight: 3,
          opacity: 0.7,
          dashArray: '6, 8',
        }).addTo(map);
        polylineRef.current = polyline;
      }

      markerRef.current = marker;
      circleRef.current = circle;

      map.setView([latitude, longitude], Math.max(map.getZoom(), 15), { animate: true });
    }
  }, [mode, telecomLocation, liveLocation, breadcrumbs]);

  const recenter = () => {
    if (!mapInstanceRef.current) return;
    if (mode === 'live' && liveLocation) {
      mapInstanceRef.current.setView([liveLocation.latitude, liveLocation.longitude], 16, { animate: true });
    } else if (telecomLocation && circleRef.current) {
      mapInstanceRef.current.fitBounds(circleRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl transition-all ${isFullscreen ? 'fixed inset-4 z-50 h-auto' : ''}`}>
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/70 text-xs font-medium text-slate-200 shadow-md">
          {mode === 'telecom' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-cyan-300 font-semibold">Registered Telecom Region</span>
              <span className="text-slate-400 hidden sm:inline">(Exchange Area)</span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-400 font-semibold">Live GPS Broadcast</span>
              <span className="text-slate-400 hidden sm:inline">(Consent Active)</span>
            </>
          )}
        </div>

        {title && (
          <div className="hidden md:flex items-center bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300">
            {title}
          </div>
        )}
      </div>

      {/* Top Right Controls: Styles & Fullscreen */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/70 shadow-md">
        <button
          onClick={() => setTileStyle(tileStyle === 'streets' ? 'satellite' : tileStyle === 'satellite' ? 'topo' : 'streets')}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Switch Map Tiles"
          aria-label="Switch map style"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="capitalize">{tileStyle}</span>
        </button>

        <button
          onClick={recenter}
          className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Recenter Map"
          aria-label="Recenter map"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Map Canvas Container */}
      <div
        ref={mapContainerRef}
        style={{ height: isFullscreen ? 'calc(100vh - 3rem)' : height }}
        className="w-full relative z-0"
      />

      {/* Bottom Integrity Banner */}
      <div className="absolute bottom-2 left-2 right-12 z-[1000] pointer-events-none">
        <div className="inline-flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800/80 text-[11px] text-slate-400 shadow">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          {mode === 'telecom' ? (
            <span>Telecom boundary estimated via ITU prefix allocation. Exact GPS is never exposed without recipient consent.</span>
          ) : (
            <span>Live coordinates secured via browser Geolocation API. Real-time updates active.</span>
          )}
        </div>
      </div>
    </div>
  );
}
