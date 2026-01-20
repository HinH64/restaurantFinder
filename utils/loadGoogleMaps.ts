let loadPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (loadPromise) {
    return loadPromise;
  }

  // Check if already loaded
  if (window.google?.maps?.importLibrary) {
    return Promise.resolve();
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return Promise.reject(new Error('Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in .env.local'));
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly&callback=__googleMapsCallback`;
    script.async = true;
    script.defer = true;

    // Define callback
    (window as any).__googleMapsCallback = () => {
      delete (window as any).__googleMapsCallback;
      resolve();
    };

    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};
