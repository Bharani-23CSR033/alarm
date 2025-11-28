import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocation } from '../../hooks/useGeolocation';
import SearchBox from './SearchBox';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = () => {
    const { location } = useGeolocation();
    const map = useMap();

    useEffect(() => {
        if (location) {
            map.flyTo(location, map.getZoom());
        }
    }, [location, map]);

    return location ? (
        <Marker position={location}>
            <Popup>You are here</Popup>
        </Marker>
    ) : null;
};

const Map = () => {
    const { location } = useGeolocation();
    const [destination, setDestination] = useState(null);

    const handlePlaceSelect = (place) => {
        const newDestination = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.formatted_address
        };
        setDestination(newDestination);
    };

    if (!location) {
        return <div>Loading location...</div>;
    }

    return (
        <div className="map-container">
            <SearchBox onPlaceSelect={handlePlaceSelect} />
            <MapContainer
                center={location}
                zoom={13}
                style={{ height: '500px', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
                {destination && (
                    <Marker position={[destination.lat, destination.lng]}>
                        <Popup>{destination.name}</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default Map;