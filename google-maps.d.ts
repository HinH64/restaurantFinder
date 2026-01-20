/// <reference types="@types/google.maps" />

declare namespace google.maps {
  interface MapsLibrary {
    Map: typeof google.maps.Map;
  }

  interface MarkerLibrary {
    AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
    PinElement: typeof google.maps.marker.PinElement;
  }
}
