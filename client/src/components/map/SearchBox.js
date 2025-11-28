import React, { useEffect, useRef } from 'react';

const SearchBox = ({ onPlaceSelect }) => {
    const searchInputRef = useRef(null);
    const searchBoxRef = useRef(null);

    useEffect(() => {
        const initializeSearchBox = () => {
            if (!window.google) {
                console.error('Google Maps JavaScript API not loaded');
                return;
            }

            searchBoxRef.current = new window.google.maps.places.SearchBox(
                searchInputRef.current
            );

            searchBoxRef.current.addListener('places_changed', () => {
                const places = searchBoxRef.current.getPlaces();

                if (places.length === 0) return;

                const place = places[0];
                if (!place.geometry) {
                    console.error('Place contains no geometry');
                    return;
                }

                onPlaceSelect(place);
            });
        };

        // Load Google Maps Places API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = initializeSearchBox;
        document.body.appendChild(script);

        return () => {
            // Cleanup
            document.body.removeChild(script);
        };
    }, [onPlaceSelect]);

    return (
        <div className="search-box">
            <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for a location..."
                className="search-input"
            />
        </div>
    );
};

export default SearchBox;