import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        let watchId;

        const onSuccess = (position) => {
            if (mounted) {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setError(null);
            }
        };

        const onError = (error) => {
            if (mounted) {
                setError(error.message);
            }
        };

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
        } else {
            // Get initial position
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

            // Watch position
            watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
        }

        return () => {
            mounted = false;
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [options]);

    return { location, error };
};

export default useGeolocation;