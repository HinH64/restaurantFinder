import React, { useEffect, useRef, useState } from 'react';
import { PlaceResult } from '../types';
import { UIStrings } from '../constants/uiStrings';
import { MenuIcon, ListIcon } from './icons';
import { loadGoogleMapsAPI } from '../utils/loadGoogleMaps';

interface MapViewProps {
  places: PlaceResult[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: PlaceResult) => void;
  onMapReady: (map: google.maps.Map) => void;
  center: { lat: number; lng: number };
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  showResultsPane: boolean;
  onShowResults: () => void;
  t: UIStrings;
}

const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onMapReady,
  center,
  isSidebarOpen,
  onOpenSidebar,
  showResultsPane,
  onShowResults,
  t
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        // Load Google Maps API first
        await loadGoogleMapsAPI();

        const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

        const map = new Map(mapRef.current!, {
          center,
          zoom: 14,
          mapId: 'restaurant-finder-map',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        onMapReady(map);
      } catch (error: any) {
        setMapError(error.message || 'Failed to load Google Maps');
      }
    };

    initMap();
  }, []);

  // Update center when it changes (only zoom if no places, otherwise let fitBounds handle it)
  // Don't pan to city center when a place is selected - let the selection effect handle that
  useEffect(() => {
    if (mapInstanceRef.current && center && !selectedPlaceId) {
      mapInstanceRef.current.panTo(center);
      // Only set zoom when there are no places (e.g., city selection before search)
      // When places exist, fitBounds in the places effect will handle zooming
      if (places.length === 0) {
        mapInstanceRef.current.setZoom(14);
      }
    }
  }, [center, places.length, selectedPlaceId]);

  // Update markers when places change (NOT when selection changes - that's handled separately)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateMarkers = async () => {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        marker.map = null;
      });
      markersRef.current = [];

      if (places.length === 0) return;

      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        const pin = new PinElement({
          background: '#ea580c',
          borderColor: '#9a3412',
          glyphColor: 'white',
          scale: 1
        });

        const marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current,
          position: place.location,
          title: place.name,
          content: pin.element
        });

        marker.addListener('click', () => {
          onSelectPlace(place);

          // Show info window with dark mode support
          if (infoWindowRef.current) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const bgColor = isDarkMode ? '#1f2937' : '#ffffff';
            const textColor = isDarkMode ? '#f9fafb' : '#111827';
            const subtextColor = isDarkMode ? '#9ca3af' : '#666666';

            const content = `
              <div class="map-info-window" style="padding: 12px; max-width: 240px; position: relative;">
                <button onclick="this.closest('.gm-style-iw-c').style.display='none'" class="map-info-close" style="position: absolute; top: 8px; right: 8px; width: 20px; height: 20px; border: none; background: transparent; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center;">
                  <svg width="14" height="14" viewBox="0 0 14 14" class="map-info-close-icon">
                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"/>
                  </svg>
                </button>
                <h3 class="map-info-title" style="font-weight: bold; font-size: 14px; margin-bottom: 6px; line-height: 1.3; padding-right: 16px;">${place.name}</h3>
                ${place.rating ? `<div class="map-info-rating" style="font-size: 13px; margin-bottom: 6px;">★ ${place.rating} (${place.userRatingsTotal || 0})</div>` : ''}
                <p class="map-info-address" style="font-size: 12px; line-height: 1.4; margin: 0;">${place.address}</p>
              </div>
            `;
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(mapInstanceRef.current, marker);
          }
        });

        markersRef.current.push(marker);
        bounds.extend(place.location);
      });

      // Fit map to show all markers
      if (!mapInstanceRef.current) return;

      if (places.length > 1) {
        // Use smaller padding on mobile for better fit
        const isMobile = window.innerWidth < 640;
        const padding = isMobile ? 20 : 50;

        // Fit bounds and then ensure minimum zoom level after bounds are set
        mapInstanceRef.current.fitBounds(bounds, { padding });

        // Listen for idle to ensure zoom isn't too far out
        google.maps.event.addListenerOnce(mapInstanceRef.current, 'idle', () => {
          if (mapInstanceRef.current) {
            const currentZoom = mapInstanceRef.current.getZoom();
            // Minimum zoom level: 14 for mobile, 13 for desktop
            const minZoom = isMobile ? 14 : 13;
            if (currentZoom !== undefined && currentZoom < minZoom) {
              mapInstanceRef.current.setZoom(minZoom);
            }
          }
        });
      } else if (places.length === 1) {
        mapInstanceRef.current.setCenter(places[0].location);
        mapInstanceRef.current.setZoom(16);
      }
    };

    updateMarkers();
  }, [places, onSelectPlace]);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || markersRef.current.length === 0) return;

    const updateMarkerStyles = async () => {
      const { PinElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      markersRef.current.forEach((marker, index) => {
        const place = places[index];
        if (!place) return;

        const isSelected = place.placeId === selectedPlaceId;

        const pin = new PinElement({
          background: isSelected ? '#2563eb' : '#ea580c',
          borderColor: isSelected ? '#1d4ed8' : '#9a3412',
          glyphColor: 'white',
          scale: isSelected ? 1.3 : 1
        });

        marker.content = pin.element;
      });

      // Center on selected place (only on desktop to avoid jarring effect with bottom sheet on mobile)
      if (selectedPlaceId && window.innerWidth >= 1024) {
        const selectedPlace = places.find(p => p.placeId === selectedPlaceId);
        if (selectedPlace && mapInstanceRef.current) {
          mapInstanceRef.current.panTo(selectedPlace.location);
        }
      } else if (!selectedPlaceId && places.length > 1 && mapInstanceRef.current) {
        // When selection is cleared, fit all markers back into view
        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => bounds.extend(place.location));

        const isMobile = window.innerWidth < 640;
        const padding = isMobile ? 20 : 50;
        mapInstanceRef.current.fitBounds(bounds, { padding });
      }
    };

    updateMarkerStyles();
  }, [selectedPlaceId, places]);

  return (
    <main className="flex-1 relative flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 relative h-full">
        {mapError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center p-8 max-w-md">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Map Loading Error</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{mapError}</p>
              <p className="text-xs text-gray-400">
                Please check that VITE_GOOGLE_MAPS_API_KEY is set in .env.local
              </p>
            </div>
          </div>
        ) : (
          <div
            ref={mapRef}
            className="w-full h-full"
          />
        )}

        <div className="absolute top-6 left-6 flex gap-3 z-20">
          {!isSidebarOpen && (
            <button
              onClick={onOpenSidebar}
              className="p-3.5 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-white dark:border-gray-700 text-orange-500 hover:scale-110 active:scale-95 transition-all"
            >
              <MenuIcon />
            </button>
          )}
          {places.length > 0 && !showResultsPane && (
            <button
              onClick={onShowResults}
              className="px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-white dark:border-gray-700 text-gray-900 dark:text-white font-black text-sm hover:text-orange-500 dark:hover:text-orange-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <ListIcon />
              {t.mapResults}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default MapView;
