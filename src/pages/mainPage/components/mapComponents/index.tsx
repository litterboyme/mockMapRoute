// MapComponent.tsx
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import React from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 22.372081,
  lng: 114.107877,
};

const MapComponent = ({ pathCoords }: { pathCoords: Array<{ lat: number; lng: number }> }) => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
      >
        {/* Draw path if any */}
        {pathCoords.length > 1 && (
          <>
            <Polyline
              path={pathCoords}
              options={{
                strokeColor: '#000',
                strokeWeight: 4,
              }}
            />
            {/* Optional: start and end markers */}
            <Marker position={pathCoords[0]} label="A" />
            <Marker position={pathCoords[pathCoords.length - 1]} label="B" />
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
