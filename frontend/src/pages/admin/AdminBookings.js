import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import Spinner from '../../components/common/Spinner';
import { fetchAllBookings, deleteBooking, changeBookingStatus } from '../../redux/actions/bookingActions';
import moment from 'moment';
import { Trash2, Calendar, IndianRupee, CheckCircle2, XCircle } from 'lucide-react';

const statusColors = {
    confirmed: '#10b981', cancelled: '#ef4444', completed: '#4f8ef7', 'in-progress': '#f59e0b',
};

function AdminBookings() {
    const dispatch = useDispatch();
    const { bookings } = useSelector((s) => s.bookingsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);

    useEffect(() => { dispatch(fetchAllBookings()); }, []);

    const handleDelete = (id) => {
        dispatch(deleteBooking(id));
    };

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={28} /> All Bookings</h1>
                    <span className="count-badge">{bookings.length} total</span>
                </div>

                <div className="admin-table-wrap glass-card">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>User</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Hours</th>
                                <th>Amount</th>
                                <th>Driver</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id}>
                                    <td><strong>{b.car?.name}</strong></td>
                                    <td>{b.user?.username}</td>
                                    <td>{b.bookedTimeSlots?.from}</td>
                                    <td>{b.bookedTimeSlots?.to}</td>
                                    <td>{b.totalHours}h</td>
                                    <td className="gradient-text">₹{b.totalAmount}</td>
                                    <td>{b.driverRequired ? <CheckCircle2 size={16} style={{ color: '#10b981' }} /> : <XCircle size={16} style={{ color: '#ef4444' }} />}</td>
                                    <td>
                                        <select
                                            className="form-input-table"
                                            value={b.bookingStatus}
                                            onChange={(e) => dispatch(changeBookingStatus(b._id, e.target.value))}
                                            style={{
                                                background: statusColors[b.bookingStatus] + '20',
                                                color: statusColors[b.bookingStatus],
                                                border: 'none',
                                                fontWeight: '700',
                                                borderRadius: '6px',
                                                padding: '2px 8px',
                                                fontSize: '13px'
                                            }}
                                        >
                                            <option value="confirmed">confirmed</option>
                                            <option value="accepted">accepted</option>
                                            <option value="in-progress">in-progress</option>
                                            <option value="picked-up">picked-up</option>
                                            <option value="returned">returned</option>
                                            <option value="completed">completed</option>
                                            <option value="cancelled">cancelled</option>
                                        </select>
                                    </td>
                                    <td>{moment(b.createdAt).format('MMM DD, YYYY')}</td>
                                    <td>
                                        <button
                                            className="btn-icon-delete"
                                            onClick={() => handleDelete(b._id)}
                                            title="Delete Booking Record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminBookings;
