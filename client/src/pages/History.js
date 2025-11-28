import React, { useState, useEffect } from 'react';
import api from '../services/api';

const History = () => {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlarms = async () => {
            try {
                const response = await api.get('/alarms');
                setAlarms(response.data);
            } catch (err) {
                setError('Failed to load alarm history');
            } finally {
                setLoading(false);
            }
        };

        fetchAlarms();
    }, []);

    if (loading) return <div>Loading history...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="history-page">
            <h2>Alarm History</h2>
            {alarms.length === 0 ? (
                <p>No alarm history found</p>
            ) : (
                <div className="alarm-list">
                    {alarms.map((alarm) => (
                        <div key={alarm._id} className="alarm-item">
                            <div className="alarm-info">
                                <h3>{alarm.destination.name}</h3>
                                <p>
                                    <strong>Radius:</strong> {alarm.radius}m
                                </p>
                                <p>
                                    <strong>Status:</strong> {alarm.isActive ? 'Active' : 'Inactive'}
                                </p>
                                <p>
                                    <strong>Created:</strong> {new Date(alarm.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;