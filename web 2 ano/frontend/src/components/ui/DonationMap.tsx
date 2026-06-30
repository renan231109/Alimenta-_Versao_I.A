import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Donation } from '../../types';
import { CATEGORY_LABELS } from '../../types';

const urgencyColors: Record<string, string> = {
  ALTA: '#ef4444',
  MEDIA: '#f59e0b',
  BAIXA: '#10b981',
};

function createIcon(urgency: string) {
  const color = urgencyColors[urgency] || '#10b981';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🍎</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface DonationMapProps {
  donations: Donation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onDonationClick?: (donation: Donation) => void;
}

export function DonationMap({
  donations,
  center = [-20.8197, -49.3794],
  zoom = 13,
  height = '500px',
  onDonationClick,
}: DonationMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation(center)
      );
    }
  }, [center]);

  const mapCenter = userLocation || center;

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl shadow-card">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />

        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-marker',
              html: '<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {donations.map((d) => (
          <Marker
            key={d.id}
            position={[d.latitude, d.longitude]}
            icon={createIcon(d.urgency)}
            eventHandlers={{
              click: () => onDonationClick?.(d),
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm text-gray-500">{CATEGORY_LABELS[d.category]}</p>
                <p className="text-sm">{d.weightKg} kg • {d.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
