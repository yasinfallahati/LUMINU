import { useMemo, useEffect, useRef } from 'react';
// @ts-ignore
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Iran cities coordinates
const CITY_COORDS: Record<string, [number, number]> = {
  'تهران': [35.6892, 51.3890],
  'مشهد': [36.2972, 59.6067],
  'اصفهان': [32.6546, 51.6680],
  'شیراز': [29.5918, 52.5836],
  'تبریز': [38.0800, 46.2919],
  'کرج': [35.8400, 50.9391],
  'قم': [34.6416, 50.8764],
  'اهواز': [31.3183, 48.6706],
  'کرمانشاه': [34.3142, 47.0650],
  'زاهدان': [29.4963, 60.8629],
};

interface Photographer {
  id: string;
  name: string;
  avatar?: string;
  city?: string;
  rating?: number;
  reviewCount?: number;
  specialties?: string[];
  lat?: number;
  lng?: number;
}

interface PhotographerMapProps {
  photographers: Photographer[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function PhotographerMap({
  photographers,
  center = [35.6892, 51.3890],
  zoom = 6,
  height = '500px',
}: PhotographerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const markers = useMemo(() => {
    return photographers.map(p => {
      const coords = p.lat && p.lng
        ? [p.lat, p.lng]
        : CITY_COORDS[p.city || ''] || [35.6892, 51.3890];
      return { ...p, coords: coords as [number, number] };
    });
  }, [photographers]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = (L as any).map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    (L as any).control.zoom({ position: 'bottomleft' }).addTo(map);

    (L as any).tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof (L as any).Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach((photographer) => {
      const icon = (L as any).divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
            border: 3px solid white;
            transform: rotate(45deg);
          ">
            <svg style="transform: rotate(-45deg); width: 18px; height: 18px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = (L as any).marker(photographer.coords, { icon }).addTo(map);

      const popupContent = `
        <div style="padding: 8px; min-width: 200px; direction: rtl; font-family: Vazirmatn, sans-serif;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <img
              src="${photographer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${photographer.id}`}"
              alt="${photographer.name}"
              style="width: 40px; height: 40px; border-radius: 10px; object-fit: cover;"
            />
            <div>
              <h3 style="font-weight: 700; font-size: 14px; color: #111827; margin: 0;">${photographer.name}</h3>
              <div style="display: flex; align-items: center; gap: 4px;">
                <svg style="width: 12px; height: 12px; color: #f59e0b; fill: #f59e0b;" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span style="font-size: 12px; font-weight: 600;">${photographer.rating?.toFixed(1) || '۰.۰'}</span>
              </div>
            </div>
          </div>
          ${photographer.specialties ? `
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
              ${photographer.specialties.slice(0, 2).map(s => `
                <span style="font-size: 11px; background: #f3f4f6; color: #6b7280; padding: 2px 8px; border-radius: 9999px;">${s}</span>
              `).join('')}
            </div>
          ` : ''}
          <a
            href="/photographer/${photographer.id}"
            style="display: block; text-align: center; font-size: 12px; font-weight: 600; color: #7c3aed; background: #f5f3ff; padding: 6px; border-radius: 8px; text-decoration: none;"
          >
            مشاهده پروفایل
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });
  }, [markers]);

  return (
    <div className="rounded-3xl overflow-hidden border border-border-light shadow-sm" style={{ height }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
