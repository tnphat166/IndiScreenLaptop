import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { X } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weathercode: number;
  time: string;
}

export const WeatherBlock: React.FC<{ id: string }> = ({ id }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const removeBlock = useWorkspaceStore((state) => state.removeBlock);

  useEffect(() => {
    // Fetch weather from Open-Meteo (defaulting to a generic coordinate if location not available)
    // To make this dynamic, you'd use browser geolocation API
    const fetchWeather = async () => {
      try {
        // Fetching for a default location (e.g., Ho Chi Minh City: 10.82, 106.62)
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.823&longitude=106.6296&current_weather=true');
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
    
    // Refresh every 30 mins
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️'; // Clear
    if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
    if (code >= 51 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 95) return '⛈️'; // Thunderstorm
    return '☁️';
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex flex-col p-4 text-white shadow-lg relative overflow-hidden drag-handle cursor-grab active:cursor-grabbing group">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          removeBlock(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/20 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20"
      >
        <X size={14} />
      </button>

      {/* Decorative clouds */}
      <div className="absolute top-2 right-2 text-4xl opacity-20">☁️</div>
      <div className="absolute bottom-[-10px] left-[-10px] text-5xl opacity-20">☁️</div>

      <h3 className="text-sm font-semibold opacity-90">Ho Chi Minh City</h3>
      
      <div className="flex-1 flex items-center justify-center gap-4 relative z-10">
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : weather ? (
          <>
            <span className="text-5xl">{getWeatherIcon(weather.weathercode)}</span>
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{Math.round(weather.temperature)}°C</span>
              <span className="text-sm opacity-80 capitalize">Current</span>
            </div>
          </>
        ) : (
          <span>Error loading weather</span>
        )}
      </div>
    </div>
  );
};
