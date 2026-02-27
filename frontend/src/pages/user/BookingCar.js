import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DefaultLayout from '../../components/layouts/DefaultLayout';
import Spinner from '../../components/common/Spinner';
import { getAllCars } from '../../redux/actions/carsActions';
import { bookCar } from '../../redux/actions/bookingActions';
import { DatePicker, Checkbox } from 'antd';
import moment from 'moment';

import { Building2, Users, Settings, IndianRupee, Calendar, User, CarFront, AlertTriangle, Droplets, Zap, Leaf, Wind, Gauge, Activity, Star } from 'lucide-react';
import API from '../../api/axiosInstance';
import { message, Rate } from 'antd';
const { RangePicker } = DatePicker;

function BookingCar({ match }) {
    const dispatch = useDispatch();
    const { cars } = useSelector((s) => s.carsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);
    const [car, setCar] = useState({});
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [totalHours, setTotalHours] = useState(0);
    const [driver, setDriver] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        if (cars.length === 0) dispatch(getAllCars());
        else {
            const currentCar = cars.find((c) => c._id === match.params.carid);
            setCar(currentCar || {});
            if (currentCar) fetchReviews(currentCar._id);
        }
    }, [cars]);

    const fetchReviews = async (carId) => {
        try {
            const res = await API.get(`/reviews/car/${carId}`);
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewSubmit = async () => {
        if (!newReview.comment) return message.warning('Please enter a comment.');
        try {
            await API.post('/reviews', { carId: car._id, ...newReview });
            message.success('Review added!');
            setNewReview({ rating: 5, comment: '' });
            fetchReviews(car._id);
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to add review.');
        }
    };

    useEffect(() => {
        let amount = totalHours * (car.rentPerHour || 0);
        if (driver) amount += 30 * totalHours;
        setTotalAmount(amount);
    }, [driver, totalHours, car]);

    const handleDateChange = (values) => {
        if (!values) return;
        setFrom(moment(values[0]).format('MMM DD yyyy HH:mm'));
        setTo(moment(values[1]).format('MMM DD yyyy HH:mm'));
        setTotalHours(values[1].diff(values[0], 'hours'));
    };

    const handleBook = () => {
        if (!from || !to) return alert('Please select a time slot first.');
        const user = JSON.parse(localStorage.getItem('user'));
        dispatch(bookCar({
            carId: car._id,
            bookedTimeSlots: { from, to },
            totalHours,
            totalAmount,
            driverRequired: driver,
            user: user.id,
        }));
    };

    const fuelIcons = {
        Petrol: <Droplets size={20} />,
        Diesel: <Droplets size={20} />,
        Electric: <Zap size={20} />,
        Hybrid: <Leaf size={20} />,
        CNG: <Wind size={20} />
    };

    return (
        <DefaultLayout>
            {loading && <Spinner />}
            <div className="booking-page">
                <div className="booking-container">
                    {/* Left: Car Image */}
                    <div className="booking-left">
                        <div className="booking-car-wrap">
                            <img src={car.image} alt={car.name} className="booking-car-img" />
                            {car.showroomId && (
                                <div className="booking-showroom-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Building2 size={14} /> {car.showroomId.name}</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Details + Form */}
                    <div className="booking-right">
                        <h1 className="booking-car-name">{car.name}</h1>
                        <div className="booking-specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: 'var(--accent-blue)' }}>{fuelIcons[car.fuelType] || <Droplets size={20} />}</span>
                                <span className="spec-label">Fuel</span>
                                <span className="spec-value">{car.fuelType}</span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: 'var(--accent-purple)' }}><Users size={20} /></span>
                                <span className="spec-label">Capacity</span>
                                <span className="spec-value">{car.capacity} Seats</span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: 'var(--accent-green)' }}><Gauge size={20} /></span>
                                <span className="spec-label">Brand</span>
                                <span className="spec-value">{car.brand || 'Premium'}</span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: '#f59e0b' }}><Activity size={20} /></span>
                                <span className="spec-label">Mileage</span>
                                <span className="spec-value">{car.mileage || '15'} km/l</span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: 'var(--accent-blue)' }}><Settings size={20} /></span>
                                <span className="spec-label">Transmission</span>
                                <span className="spec-value">{car.transmission}</span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: 'var(--accent-green)' }}><Activity size={20} /></span>
                                <span className="spec-label">Health</span>
                                <span className="spec-value" style={{ color: car.maintenanceStatus === 'Healthy' ? 'var(--accent-green)' : '#f59e0b' }}>
                                    {car.maintenanceStatus || 'Stable'}
                                </span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: 'var(--accent-purple)' }}><IndianRupee size={20} /></span>
                                <span className="spec-label">Rent</span>
                                <span className="spec-value">₹{car.rentPerHour}/hr</span>
                            </div>
                            <div className="spec-card">
                                <span className="spec-icon" style={{ color: '#f59e0b' }}><Star size={20} /></span>
                                <span className="spec-label">Rating</span>
                                <span className="spec-value">4.8/5</span>
                            </div>
                        </div>

                        <div className="booking-form-card glass-card">
                            <h3 className="booking-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Select Time Slot</h3>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="MMM DD yyyy HH:mm"
                                onChange={handleDateChange}
                                className="date-picker-styled w-full"
                            />

                            {from && to && (
                                <div className="booking-summary">
                                    <div className="summary-row">
                                        <span>Duration</span>
                                        <strong>{totalHours} hours</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Car Rent (₹{car.rentPerHour} × {totalHours}h)</span>
                                        <strong>₹{totalHours * car.rentPerHour}</strong>
                                    </div>
                                    <div className="driver-option">
                                        <Checkbox
                                            onChange={(e) => setDriver(e.target.checked)}
                                            className="driver-checkbox"
                                        >
                                            <span className="driver-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> Add Driver (+₹30/hr)</span>
                                        </Checkbox>
                                        {driver && (
                                            <span className="driver-cost">+₹{30 * totalHours}</span>
                                        )}
                                    </div>
                                    <div className="summary-total">
                                        <span>Total Amount</span>
                                        <span className="total-amount gradient-text">₹{totalAmount}</span>
                                    </div>
                                    <button className="btn-gradient-full mt-1" onClick={handleBook} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <CarFront size={18} /> Confirm Booking
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Booked Slots */}
                        {car.bookedTimeSlots?.length > 0 && (
                            <div className="booked-slots-wrap">
                                <h4 className="booked-slots-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} style={{ color: '#f59e0b' }} /> Already Booked Slots</h4>
                                <div className="booked-slots-list">
                                    {car.bookedTimeSlots.map((slot, i) => (
                                        <span key={i} className="booked-slot-tag">
                                            {slot.from} → {slot.to}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="reviews-section glass-card" style={{ marginTop: '40px', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}><Star size={24} style={{ color: '#f59e0b' }} /> Customer Reviews</h2>
                        <span className="count-badge">{reviews.length} Total</span>
                    </div>

                    <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                        <div className="reviews-list">
                            {reviews.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '16px' }}>
                                    <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to share your experience!</p>
                                </div>
                            ) : (
                                reviews.map(rev => (
                                    <div key={rev._id} className="review-item" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <strong style={{ fontSize: '1.1rem' }}>{rev.user?.username}</strong>
                                            <Rate disabled defaultValue={rev.rating} style={{ fontSize: '14px' }} />
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{rev.comment}</p>
                                        <small style={{ color: 'var(--text-muted)' }}>{moment(rev.createdAt).fromNow()}</small>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="add-review-form glass-card" style={{ padding: '24px', alignSelf: 'flex-start', background: 'var(--bg-secondary)' }}>
                            <h4 style={{ marginBottom: '16px' }}>Write a Review</h4>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Rating</label>
                                <Rate value={newReview.rating} onChange={val => setNewReview({ ...newReview, rating: val })} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Feedback</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Tell others about your drive..."
                                    value={newReview.comment}
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                />
                            </div>
                            <button className="btn-gradient" style={{ width: '100%' }} onClick={handleReviewSubmit}>Submit Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default BookingCar;
