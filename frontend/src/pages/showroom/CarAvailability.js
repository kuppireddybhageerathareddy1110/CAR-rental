import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import { fetchCarById } from '../../api/cars';
import { editCar } from '../../redux/actions/carsActions';
import Spinner from '../../components/common/Spinner';
import { Calendar, Clock, AlertCircle, Save, ArrowLeft, Trash2, Plus } from 'lucide-react';
import { DatePicker, message, Tag } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

function CarAvailability({ match, history }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((s) => s.alertsReducer);
    const [car, setCar] = useState(null);
    const [newSlot, setNewSlot] = useState(null);

    useEffect(() => {
        fetchCarById(match.params.carid).then(res => setCar(res.data)).catch(console.error);
    }, []);

    const handleAddSlot = () => {
        if (!newSlot) return message.warning('Please select dates');
        const from = newSlot[0].format('MMM DD yyyy HH:mm');
        const to = newSlot[1].format('MMM DD yyyy HH:mm');

        const updatedSlots = [...(car.bookedTimeSlots || []), { from, to, status: 'blocked' }];
        setCar({ ...car, bookedTimeSlots: updatedSlots });
        setNewSlot(null);
        message.info('Slot added. Remember to save changes.');
    };

    const removeSlot = (index) => {
        const updatedSlots = car.bookedTimeSlots.filter((_, i) => i !== index);
        setCar({ ...car, bookedTimeSlots: updatedSlots });
    };

    const handleSave = () => {
        dispatch(editCar(car._id, car));
    };

    if (!car) return <Spinner />;

    return (
        <ShowroomLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="btn-back" onClick={() => history.goBack()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="admin-page-title">📅 Manage Availability: {car.name}</h1>
                            <p className="admin-page-sub">Block dates for maintenance or offline bookings</p>
                        </div>
                    </div>
                    <button className="btn-gradient" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Save size={18} /> {loading ? 'Saving...' : 'Save Availability'}
                    </button>
                </div>

                <div className="availability-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px' }}>
                    {/* Add New Slot */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Plus size={20} style={{ color: 'var(--accent-purple)' }} /> Block New Time Slot
                        </h3>
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label">Select Date & Time Range</label>
                            <RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                className="form-input"
                                style={{ width: '100%', height: '45px' }}
                                value={newSlot}
                                onChange={(val) => setNewSlot(val)}
                            />
                        </div>
                        <button className="btn-gradient-full" onClick={handleAddSlot} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Calendar size={18} /> Add Blocked Slot
                        </button>

                        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                <AlertCircle size={18} />
                                <span>Blocking dates will prevent customers from booking this car during the selected period.</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Slots List */}
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Clock size={20} style={{ color: 'var(--accent-blue)' }} /> Current Blocked/Booked Slots
                        </h3>
                        <div className="slots-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {(car.bookedTimeSlots || []).length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No blocked or booked slots found.</div>
                            ) : (
                                car.bookedTimeSlots.map((slot, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--glass-border)', background: slot.status === 'blocked' ? '#f8fafc' : 'white', borderRadius: '8px', marginBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '700' }}>{slot.from}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>to {slot.to}</div>
                                            <Tag color={slot.status === 'blocked' ? 'orange' : 'blue'} style={{ marginTop: '4px' }}>
                                                {slot.status === 'blocked' ? 'MANUALLY BLOCKED' : 'CUSTOMER BOOKED'}
                                            </Tag>
                                        </div>
                                        {slot.status === 'blocked' && (
                                            <button onClick={() => removeSlot(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ShowroomLayout>
    );
}

export default CarAvailability;
