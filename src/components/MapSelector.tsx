import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Target, Zap } from 'lucide-react';

// Custom Premium SVG Marker
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 14px;
      height: 14px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 0 15px ${color};
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

const LocationMarker = ({ position, setPosition, onLocationSelect }: { 
  position: [number, number] | null, 
  setPosition: (pos: [number, number]) => void,
  onLocationSelect: (lat: number, lng: number) => void 
}) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
      map.flyTo(e.latlng, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={createCustomIcon('#6366f1')} />
  );
};

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 2 });
  }, [center, map]);
  return null;
};

const MapSelector = ({ onLocationSelect, initialLat, initialLng }: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLat !== 0 && initialLng && initialLng !== 0 ? [initialLat, initialLng] : [9.03, 38.74]
  );
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          onLocationSelect(latitude, longitude);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="w-full h-[250px] sm:h-[350px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-slate-950">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none z-[400]" />
      <MapContainer
        center={position || [9.03, 38.74]}
        zoom={13}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        {position && <ChangeView center={position} />}
      </MapContainer>
      
      {/* Premium Controls Overlay */}
      <div className="absolute top-6 right-6 z-[500] flex flex-col gap-3">
         <button 
           onClick={(e) => { e.preventDefault(); handleCurrentLocation(); }}
           className="w-12 h-12 rounded-2xl bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-indigo-400 hover:text-white hover:bg-indigo-500 transition-all shadow-xl"
           title="Sync Current Position"
         >
            <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
         </button>
      </div>

      {/* Coordinate Display Card */}
      <div className="absolute bottom-6 inset-x-6 z-[500] pointer-events-none">
        <div className="bg-[#0B0F19]/60 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] p-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-200 shadow-2xl overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none" />
           <div className="flex flex-col gap-1 z-10">
              <span className="text-white/30 flex items-center gap-2 tracking-[0.2em]">
                 <Target className="w-3 h-3 text-indigo-400" />
                 Geospatial Node Lock
              </span>
              <span className="text-white font-mono text-xs mt-0.5">
                {position ? `${position[0].toFixed(6)} / ${position[1].toFixed(6)}` : "Awaiting Target Acquisition..."}
              </span>
           </div>
           <div className="flex items-center gap-3 z-10">
              <div className="flex flex-col items-end gap-0.5">
                 <span className="text-emerald-500/60 leading-none">Status</span>
                 <span className="text-white">Active</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                 <Zap className="w-5 h-5 animate-pulse" />
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: #020617 !important;
        }
        .dark-map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(10%);
        }
        .leaflet-tile-container {
          background: #020617 !important;
        }
        .leaflet-vignette {
          box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default MapSelector;

