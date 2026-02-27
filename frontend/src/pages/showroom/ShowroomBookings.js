import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import Spinner from '../../components/common/Spinner';
import { fetchShowroomBookings, changeBookingStatus } from '../../redux/actions/bookingActions';
import { Calendar, Inbox, IndianRupee, FileText } from 'lucide-react';
import moment from 'moment';

const statusColors = {
    confirmed: '#10b981', accepted: '#6366f1', 'picked-up': '#f59e0b', returned: '#8b5cf6',
    cancelled: '#ef4444', completed: '#4f8ef7', 'in-progress': '#f59e0b',
};

function ShowroomBookings() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { bookings } = useSelector((s) => s.bookingsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);

    const exportToCSV = () => {
        const headers = ["Car", "Customer", "From", "To", "Hours", "Amount", "Status", "Date"];
        const rows = bookings.map(b => [
            b.car?.name,
            b.user?.username,
            b.bookedTimeSlots?.from,
            b.bookedTimeSlots?.to,
            b.totalHours,
            b.totalAmount,
            b.bookingStatus,
            moment(b.createdAt).format('MMM DD, YYYY')
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `showroom_bookings_${moment().format('YYYY_MM_DD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ShowroomLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={28} /> Showroom Bookings</h1>
                        <span className="count-badge">{bookings.length} total</span>
                    </div>
                    <button className="btn-outline" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={18} /> Export CSV
                    </button>
                </div>

                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><Inbox size={56} /></div>
                        <h3>No bookings yet</h3>
                    </div>
                ) : (
                    <div className="admin-table-wrap glass-card">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Car</th>
                                    <th>Customer</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Hours</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td><strong>{b.car?.name}</strong></td>
                                        <td>
                                            <button
                                                onClick={() => history.push(`/showroom/customer/${b.user?._id}`)}
                                                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                                            >
                                                {b.user?.username}
                                            </button>
                                        </td>
                                        <td>{b.bookedTimeSlots?.from}</td>
                                        <td>{b.bookedTimeSlots?.to}</td>
                                        <td>{b.totalHours}h</td>
                                        <td className="gradient-text">₹{b.totalAmount}</td>
                                        <td>
                                            <select
                                                className="form-input-table"
                                                value={b.bookingStatus}
                                                onChange={(e) => dispatch(changeBookingStatus(b._id, e.target.value, 'showroom'))}
                                                style={{
                                                    background: (statusColors[b.bookingStatus] || '#94a3b8') + '20',
                                                    color: statusColors[b.bookingStatus] || '#94a3b8',
                                                    border: 'none',
                                                    fontWeight: '700',
                                                    borderRadius: '6px',
                                                    padding: '2px 8px',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                <option value="confirmed">confirmed</option>
                                                <option value="accepted">accepted</option>
                                                <option value="picked-up">picked-up</option>
                                                <option value="returned">returned</option>
                                                <option value="completed">completed</option>
                                                <option value="cancelled">cancelled</option>
                                            </select>
                                        </td>
                                        <td>{moment(b.createdAt).format('MMM DD, YYYY')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </ShowroomLayout>
    );
}

export default ShowroomBookings;
