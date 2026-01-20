import { useState, useEffect } from 'react';

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation | undefined>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
        (err) => console.warn("Geolocation permission denied or error:", err)
      );
    }
  }, []);

  return location;
}
