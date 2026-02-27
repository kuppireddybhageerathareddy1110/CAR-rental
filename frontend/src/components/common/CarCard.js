import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Droplet, Zap, Leaf, Wind, Building2, Users, Cog, Edit3, Trash2, Activity, CalendarCheck } from 'lucide-react';

function CarCard({ car, showActions = false, onEdit, onDelete, onToggleStatus }) {
    const fuelIcons = {
        Petrol: <Fuel size={12} />, Diesel: <Droplet size={12} />, Electric: <Zap size={12} />, Hybrid: <Leaf size={12} />, CNG: <Wind size={12} />,
    };
    const categoryColors = {
        Sedan: '#4f8ef7', SUV: '#a855f7', Luxury: '#f59e0b',
        Sports: '#ef4444', Hatchback: '#10b981', Van: '#6366f1',
    };

    return (
        <div className="car-card">
            <div className="car-card-image-wrap">
                <img src={car.image} alt={car.name} className="car-card-img" />
                <span className="car-category-badge" style={{ background: categoryColors[car.category] || '#4f8ef7' }}>
                    {car.category}
                </span>
                {car.showroomId && (
                    <span className="car-showroom-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Building2 size={10} /> {car.showroomId.name}</span>
                )}
                <span className="car-maintenance-badge" style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: car.maintenanceStatus === 'Healthy' ? '#10b981' : '#f59e0b',
                    color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                    <Activity size={10} /> {car.maintenanceStatus || 'Stable'}
                </span>
            </div>
            <div className="car-card-body">
                <h3 className="car-card-name">{car.name}</h3>
                <div className="car-card-stats">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{fuelIcons[car.fuelType]} {car.fuelType}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {car.capacity}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Cog size={12} /> {car.transmission}</span>
                </div>
                <div className="car-card-footer">
                    <div className="car-rent">
                        <span className="rent-amount">₹{car.rentPerHour}</span>
                        <span className="rent-label">/hr</span>
                    </div>
                    <div className="car-card-actions">
                        {showActions ? (
                            <>
                                <button className="btn-icon-edit" onClick={onEdit} title="Edit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={16} /></button>
                                <button
                                    className="btn-icon-availability"
                                    onClick={() => window.location.href = `/showroom/availability/${car._id}`}
                                    title="Manage Availability"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'var(--accent-blue)20', color: 'var(--accent-blue)',
                                        border: 'none', padding: '6px', borderRadius: '6px'
                                    }}
                                >
                                    <CalendarCheck size={16} />
                                </button>
                                <button
                                    className="btn-icon-theme"
                                    onClick={onToggleStatus}
                                    title="Toggle Maintenance"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        background: car.maintenanceStatus === 'Healthy' ? 'var(--accent-green)20' : '#f59e0b20',
                                        color: car.maintenanceStatus === 'Healthy' ? 'var(--accent-green)' : '#f59e0b',
                                        border: 'none', padding: '6px', borderRadius: '6px'
                                    }}
                                >
                                    <Activity size={16} />
                                </button>
                                <button className="btn-icon-delete" onClick={onDelete} title="Delete" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                            </>
                        ) : (
                            <Link to={`/booking/${car._id}`} className="btn-book">Book Now</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarCard;
