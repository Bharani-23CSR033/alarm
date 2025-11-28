import React, { useState } from 'react';
import api from '../../services/api';

const RINGTONE_OPTIONS = [
    { id: 'default', name: 'Default Alarm', url: '/sounds/default-alarm.mp3' },
    { id: 'bell', name: 'Bell', url: '/sounds/bell.mp3' },
    { id: 'siren', name: 'Siren', url: '/sounds/siren.mp3' }
];

const AlarmForm = ({ destination, onAlarmSet }) => {
    const [radius, setRadius] = useState(1000);
    const [ringtone, setRingtone] = useState(RINGTONE_OPTIONS[0].id);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!destination) {
            setError('Please select a destination first');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const response = await api.post('/alarms', {
                destination,
                radius,
                ringtone
            });

            // Play a preview of the selected ringtone
            const audio = new Audio(RINGTONE_OPTIONS.find(r => r.id === ringtone).url);
            audio.volume = 0.5;
            audio.play();

            onAlarmSet(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set alarm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="alarm-form">
            <h3>Set Location Alarm</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="destination">Destination</label>
                    <input
                        type="text"
                        id="destination"
                        value={destination?.name || ''}
                        disabled
                        placeholder="Select a destination on the map"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="radius">Alert Radius (meters)</label>
                    <input
                        type="range"
                        id="radius"
                        min="100"
                        max="5000"
                        step="100"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                    />
                    <span>{radius}m</span>
                </div>
                <div className="form-group">
                    <label htmlFor="ringtone">Select Ringtone</label>
                    <select
                        id="ringtone"
                        value={ringtone}
                        onChange={(e) => setRingtone(e.target.value)}
                    >
                        {RINGTONE_OPTIONS.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading || !destination}>
                    {loading ? 'Setting Alarm...' : 'Set Alarm'}
                </button>
            </form>
        </div>
    );
};

export default AlarmForm;