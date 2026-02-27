import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../components/layouts/DefaultLayout';
import { fetchShowrooms } from '../../api/showroom';
import Spinner from '../../components/common/Spinner';
import { MapPin, Phone, Mail, Info, Building2 } from 'lucide-react';

function Showrooms() {
    const [showrooms, setShowrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getShowrooms = async () => {
            try {
                const res = await fetchShowrooms();
                setShowrooms(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getShowrooms();
    }, []);

    return (
        <DefaultLayout>
            {loading && <Spinner />}
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Building2 size={24} /> Our Showrooms</h1>
                    <p className="page-subtitle">Visit our premium locations across the country</p>
                </div>

                <div className="showrooms-grid">
                    {showrooms.length === 0 && !loading ? (
                        <div className="empty-state glass-card" style={{ gridColumn: '1 / -1' }}>
                            <div className="empty-icon"><Building2 size={56} /></div>
                            <h3>No showrooms available</h3>
                            <p>Check back later for new locations!</p>
                        </div>
                    ) : (
                        showrooms.map((showroom) => (
                            <div key={showroom._id} className="showroom-card glass-card">
                                {showroom.image && (
                                    <img src={showroom.image} alt={showroom.name} className="showroom-img" />
                                )}
                                <div className="showroom-info">
                                    <h3 className="showroom-title">{showroom.name}</h3>
                                    <div className="showroom-meta">
                                        <div className="showroom-meta-item">
                                            <MapPin size={14} className="gradient-text" />
                                            <span>{showroom.location}</span>
                                        </div>
                                        {showroom.phone && (
                                            <div className="showroom-meta-item">
                                                <Phone size={14} className="gradient-text" />
                                                <span>{showroom.phone}</span>
                                            </div>
                                        )}
                                        {showroom.email && (
                                            <div className="showroom-meta-item">
                                                <Mail size={14} className="gradient-text" />
                                                <span>{showroom.email}</span>
                                            </div>
                                        )}
                                        {showroom.description && (
                                            <div className="showroom-meta-item" style={{ marginTop: '8px', opacity: 0.8 }}>
                                                <Info size={14} className="gradient-text" />
                                                <p style={{ fontSize: '12px', margin: 0 }}>{showroom.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Showrooms;
