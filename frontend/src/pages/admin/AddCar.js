import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { addCar } from '../../redux/actions/carsActions';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Van'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

function AddCar() {
    const dispatch = useDispatch();
    const { loading } = useSelector((s) => s.alertsReducer);
    const user = JSON.parse(localStorage.getItem('user'));
    const [form, setForm] = useState({
        name: '', brand: '', model: '', variant: '', year: new Date().getFullYear(),
        image: '', images: [], rentPerHour: '', pricePerDay: '',
        capacity: '', fuelType: 'Petrol', transmission: 'Manual', category: 'Sedan',
        registrationNumber: '', color: '', vin: '', showroomId: user?.showroomId || ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addCar({ ...form, status: 'Available' }));
    };

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title">🚗 Add New Car to Inventory</h1>
                    <p className="admin-page-sub">Enter precise vehicle details for showroom listing</p>
                </div>
                <div className="form-page-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <div className="car-form-wrap glass-card" style={{ padding: '32px' }}>
                        <form onSubmit={handleSubmit} className="car-form">
                            {/* Basic Info Section */}
                            <div className="form-section-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Basic Vehicle Info</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Car Display Name</label>
                                    <input name="name" className="form-input" placeholder="e.g. BMW 5 Series M-Sport" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Brand</label>
                                    <input name="brand" className="form-input" placeholder="e.g. BMW" value={form.brand} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Model</label>
                                    <input name="model" className="form-input" placeholder="e.g. 5 Series" value={form.model} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Variant</label>
                                    <input name="variant" className="form-input" placeholder="e.g. 530d Heritage" value={form.variant} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Specifications Section */}
                            <div className="form-section-header" style={{ marginBottom: '20px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Specifications & ID</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Year of Manufacture</label>
                                    <input name="year" type="number" className="form-input" value={form.year} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Registration Number</label>
                                    <input name="registrationNumber" className="form-input" placeholder="e.g. KA-01-MJ-1234" value={form.registrationNumber} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Color</label>
                                    <input name="color" className="form-input" placeholder="e.g. Alpine White" value={form.color} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">VIN Number (Chassis)</label>
                                    <input name="vin" className="form-input" placeholder="17-digit VIN" value={form.vin} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Fuel Type</label>
                                    <select name="fuelType" className="form-input" value={form.fuelType} onChange={handleChange}>
                                        {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Transmission</label>
                                    <select name="transmission" className="form-input" value={form.transmission} onChange={handleChange}>
                                        {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Capacity</label>
                                    <input name="capacity" type="number" className="form-input" value={form.capacity} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select name="category" className="form-input" value={form.category} onChange={handleChange}>
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="form-section-header" style={{ marginBottom: '20px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Pricing Management</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Rent Per Hour (₹)</label>
                                    <input name="rentPerHour" type="number" className="form-input" value={form.rentPerHour} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rent Per Day (₹)</label>
                                    <input name="pricePerDay" type="number" className="form-input" value={form.pricePerDay} onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Media & Docs */}
                            <div className="form-section-header" style={{ marginBottom: '20px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Media & Documents</h3>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Image URL</label>
                                <input name="image" className="form-input" placeholder="https://..." value={form.image} onChange={handleChange} required />
                            </div>

                            {!user?.showroomId && (
                                <div className="form-group">
                                    <label className="form-label">Showroom ID (optional)</label>
                                    <input name="showroomId" className="form-input" placeholder="Leave blank for fleet-wide" value={form.showroomId} onChange={handleChange} />
                                </div>
                            )}

                            <button type="submit" className="btn-gradient-full" style={{ marginTop: '32px' }} disabled={loading}>
                                ➕ Add Car to Fleet
                            </button>
                        </form>
                    </div>

                    <div className="image-preview-column">
                        {form.image && (
                            <div className="image-preview-wrap glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
                                <h3 className="preview-title" style={{ marginBottom: '16px' }}>Image Preview</h3>
                                <img src={form.image} alt="preview" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--glass-border)' }} onError={e => e.target.style.display = 'none'} />
                            </div>
                        )}

                        <div className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Operational Checklist</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                <li style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>✅ Mandatory fields completed</li>
                                <li style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>📄 RC Document available</li>
                                <li style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>🛡️ Insurance policy valid</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AddCar;
