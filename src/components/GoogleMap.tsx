"use client";

import { useEffect, useRef, useState } from 'react';

// Use the @types/google.maps package types
declare global {
  interface Window {
    google: any;
    mapInitializers: {
      [key: string]: () => void;
    };
    googleMapsLoaded: boolean;
    googleMapsCallback: () => void;
  }
}

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function GoogleMap({ latitude, longitude, address }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapId = useRef(`map-${Math.random().toString(36).substring(2, 9)}`).current;
  
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize global containers if they don't exist
    if (!window.mapInitializers) {
      window.mapInitializers = {};
    }
    
    // Create a unique initializer for this map instance
    window.mapInitializers[mapId] = () => {
      try {
        if (!mapRef.current) return;
        
        setLoading(false);
        const location = { lat: latitude, lng: longitude };
        const map = new window.google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add a marker for the location
        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: address,
          animation: window.google.maps.Animation.DROP,
        });

        // Add an info window with the address if provided
        if (address) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="font-weight: bold; color: #ff0000; font-size: 14px; padding: 5px; text-shadow: none; background: white;">${address}</div>`,
            pixelOffset: new window.google.maps.Size(0, -5),
            ariaLabel: address
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          // Initially open the info window
          infoWindow.open(map, marker);
        }
      } catch (err) {
        console.error("Error initializing Google Maps:", err);
        setError("Failed to load Google Maps. Please try again later.");
        setLoading(false);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      window.mapInitializers[mapId]();
    } else if (document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
      // Script is loading but not ready yet, wait for global flag
      const checkIfLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkIfLoaded);
          window.mapInitializers[mapId]();
        }
      }, 100);
      
      // Clear interval after 10 seconds (timeout)
      setTimeout(() => {
        clearInterval(checkIfLoaded);
        if (loading) {
          setError("Google Maps failed to load in time");
          setLoading(false);
        }
      }, 10000);
    } else {
      // Load Google Maps script if not already loading
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=googleMapsCallback`;
      script.async = true;
      script.defer = true;
      
      // Setup global callback that will run once Maps API is loaded
      window.googleMapsCallback = () => {
        window.googleMapsLoaded = true;
        // Call all initializers
        Object.values(window.mapInitializers).forEach(init => init());
      };
      
      script.onerror = () => {
        setError("Failed to load Google Maps API");
        setLoading(false);
      };

      document.head.appendChild(script);
    }

    return () => {
      // Clean up
      if (window.mapInitializers) {
        delete window.mapInitializers[mapId];
      }
    };
  }, [latitude, longitude, address, apiKey, mapId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : null}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} className={loading ? "hidden" : ""} />
    </>
  );
} 