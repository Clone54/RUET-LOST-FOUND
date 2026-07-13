import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RUET_CENTER = { lat: 24.3636, lng: 88.6280 };

interface LocationSelectorProps {
  onLocationSelect: (loc: { lat: number, lng: number, name: string }) => void;
}

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, name: 'Selected Location' });
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function LocateControl({ setPosition, onLocationSelect }: any) {
  const map = useMap();
  
  const locateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          setPosition(newPos);
          map.flyTo(newPos, 17);
          onLocationSelect({ lat: latitude, lng: longitude, name: 'My Location' });
        },
        (err) => {
          console.error(err);
          alert('Could not get your location. Please check permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ zIndex: 1000, marginTop: '80px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={locateMe} 
          className="bg-white w-[34px] h-[34px] flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
          title="Pin to my location"
          type="button"
        >
          <MapPin size={20} />
        </button>
      </div>
    </div>
  );
}

export function LocationSelector({ onLocationSelect }: LocationSelectorProps) {
  const [markerLocation, setMarkerLocation] = useState(RUET_CENTER);

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-slate-300 z-0 relative">
      <MapContainer 
        center={RUET_CENTER} 
        zoom={16} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={markerLocation} setPosition={setMarkerLocation} onLocationSelect={onLocationSelect} />
        <LocateControl setPosition={setMarkerLocation} onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
