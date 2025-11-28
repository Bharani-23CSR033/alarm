class AlarmService {
    constructor() {
        this.activeAlarms = new Map();
        this.watchId = null;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    startMonitoring() {
        if (this.watchId) return;

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                
                this.activeAlarms.forEach((alarm, id) => {
                    const distance = this.calculateDistance(
                        latitude,
                        longitude,
                        alarm.destination.lat,
                        alarm.destination.lng
                    );

                    if (distance <= alarm.radius && !alarm.triggered) {
                        this.triggerAlarm(alarm);
                        alarm.triggered = true;
                    }
                });
            },
            (error) => {
                console.error('Geolocation error:', error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );
    }

    stopMonitoring() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    addAlarm(alarm) {
        const alarmId = Date.now().toString();
        this.activeAlarms.set(alarmId, {
            ...alarm,
            triggered: false,
            audio: new Audio(alarm.ringtoneUrl)
        });

        if (this.activeAlarms.size === 1) {
            this.startMonitoring();
        }

        return alarmId;
    }

    removeAlarm(alarmId) {
        const alarm = this.activeAlarms.get(alarmId);
        if (alarm) {
            if (alarm.audio) {
                alarm.audio.pause();
                alarm.audio.currentTime = 0;
            }
            this.activeAlarms.delete(alarmId);
        }

        if (this.activeAlarms.size === 0) {
            this.stopMonitoring();
        }
    }

    triggerAlarm(alarm) {
        if (alarm.audio) {
            alarm.audio.loop = true;
            alarm.audio.play().catch(error => {
                console.error('Failed to play alarm sound:', error);
            });

            // Show a notification if the page is not visible
            if (document.hidden && 'Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Location Alarm', {
                            body: `You have reached your destination!`,
                            icon: '/icons/alarm-icon.png'
                        });
                    }
                });
            }
        }
    }

    stopAlarm(alarmId) {
        const alarm = this.activeAlarms.get(alarmId);
        if (alarm && alarm.audio) {
            alarm.audio.pause();
            alarm.audio.currentTime = 0;
        }
    }
}

export default new AlarmService();