import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { getAllCars, editCar } from '../../redux/actions/carsActions';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Van'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

function EditCar({ match }) {
    const dispatch = useDispatch();
    const { cars } = useSelector((s) => s.carsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (cars.length === 0) dispatch(getAllCars());
        else {
            const found = cars.find((c) => c._id === match.params.carid);
            if (found) setForm({ ...found, showroomId: found.showroomId?._id || '' });
        }
    }, [cars]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(editCar(form._id, form));
    };

    if (!form) return <AdminLayout><Spinner /></AdminLayout>;

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title">✏️ Edit Car Details</h1>
                    <p className="admin-page-sub">{form.name} | {form.registrationNumber || 'No Reg Num'}</p>
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
                                    <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Brand</label>
                                    <input name="brand" className="form-input" value={form.brand || ''} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Model</label>
                                    <input name="model" className="form-input" value={form.model || ''} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Variant</label>
                                    <input name="variant" className="form-input" value={form.variant || ''} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Specifications Section */}
                            <div className="form-section-header" style={{ marginBottom: '20px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Specifications & ID</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Year of Manufacture</label>
                                    <input name="year" type="number" className="form-input" value={form.year || ''} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Registration Number</label>
                                    <input name="registrationNumber" className="form-input" value={form.registrationNumber || ''} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Color</label>
                                    <input name="color" className="form-input" value={form.color || ''} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">VIN Number (Chassis)</label>
                                    <input name="vin" className="form-input" value={form.vin || ''} onChange={handleChange} />
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
                                    <input name="pricePerDay" type="number" className="form-input" value={form.pricePerDay || ''} onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="form-section-header" style={{ marginBottom: '20px', marginTop: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Media</h3>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Image URL</label>
                                <input name="image" className="form-input" value={form.image} onChange={handleChange} required />
                            </div>

                            <button type="submit" className="btn-gradient-full" style={{ marginTop: '32px' }} disabled={loading}>
                                💾 Save Vehicle Changes
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
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default EditCar;
