import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../components/layouts/DefaultLayout';
import Spinner from '../../components/common/Spinner';
import { fetchMyBookings, cancelBooking } from '../../redux/actions/bookingActions';
import { Calendar, CheckCircle2, XCircle, Flag, Inbox, IndianRupee, FileText } from 'lucide-react';
import moment from 'moment';

const statusColors = {
    confirmed: { bg: '#10b98120', color: '#10b981', icon: <CheckCircle2 size={14} />, label: 'Confirmed' },
    cancelled: { bg: '#ef444420', color: '#ef4444', icon: <XCircle size={14} />, label: 'Cancelled' },
    completed: { bg: '#4f8ef720', color: '#4f8ef7', icon: <Flag size={14} />, label: 'Completed' },
};

function UserBookings() {
    const dispatch = useDispatch();
    const { bookings } = useSelector((s) => s.bookingsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);

    useEffect(() => { dispatch(fetchMyBookings()); }, []);

    return (
        <DefaultLayout>
            {loading && <Spinner />}
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={24} /> My Bookings</h1>
                    <span className="count-badge">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
                </div>

                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Inbox size={56} /></div>
                        <h3>No bookings yet</h3>
                        <p>Browse our cars and book your first ride!</p>
                        <a href="/" className="btn-gradient mt-1">Browse Cars</a>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => {
                            const status = statusColors[booking.bookingStatus] || statusColors.confirmed;
                            return (
                                <div key={booking._id} className="booking-card glass-card">
                                    <div className="booking-card-img-wrap">
                                        <img src={booking.car?.image} alt={booking.car?.name} className="booking-card-img" />
                                    </div>
                                    <div className="booking-card-body">
                                        <div className="booking-card-header">
                                            <h3 className="booking-car-title">{booking.car?.name}</h3>
                                            <span
                                                className="status-badge"
                                                style={{ background: status.bg, color: status.color }}
                                            >
                                                {status.icon} {status.label}
                                            </span>
                                        </div>
                                        <div className="booking-card-details">
                                            <div className="booking-detail">
                                                <span className="detail-label">From</span>
                                                <span className="detail-value">{booking.bookedTimeSlots?.from}</span>
                                            </div>
                                            <div className="booking-detail">
                                                <span className="detail-label">To</span>
                                                <span className="detail-value">{booking.bookedTimeSlots?.to}</span>
                                            </div>
                                            <div className="booking-detail">
                                                <span className="detail-label">Duration</span>
                                                <span className="detail-value">{booking.totalHours}h</span>
                                            </div>
                                            <div className="booking-detail">
                                                <span className="detail-label">Driver</span>
                                                <span className="detail-value">{booking.driverRequired ? 'Yes' : 'No'}</span>
                                            </div>
                                        </div>
                                        <div className="booking-card-footer">
                                            <div className="booking-txn">
                                                <span className="txn-label">Txn:</span>
                                                <code className="txn-id">{booking.transactionId || 'N/A'}</code>
                                            </div>
                                            <div className="booking-amount">
                                                <span className="amount-label">Total</span>
                                                <span className="amount-value gradient-text">₹{booking.totalAmount}</span>
                                            </div>
                                        </div>
                                        <div className="booking-date-footer">
                                            <div className="booking-date">
                                                Booked on {moment(booking.createdAt).format('MMM DD, YYYY')}
                                            </div>
                                            {booking.bookingStatus !== 'cancelled' && (
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <Link
                                                        to={`/invoice/${booking._id}`}
                                                        className="btn-theme-mini"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                    >
                                                        <FileText size={14} /> View Invoice
                                                    </Link>
                                                    <button
                                                        className="btn-cancel-mini"
                                                        onClick={() => dispatch(cancelBooking(booking._id))}
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
}

export default UserBookings;
