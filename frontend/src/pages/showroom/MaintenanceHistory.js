import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import Spinner from '../../components/common/Spinner';
import axiosInstance from '../../api/axiosInstance';
import { Activity, Plus, Tool, History, IndianRupee, User, Calendar } from 'lucide-react';
import { message, Modal, Input, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

function MaintenanceHistory() {
    const { carid } = useParams();
    const [car, setCar] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRecord, setNewRecord] = useState({ reason: '', cost: 0, description: '', date: moment() });

    useEffect(() => {
        fetchData();
    }, [carid]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [carRes, histRes] = await Promise.all([
                axiosInstance.get(`/api/cars/${carid}`),
                axiosInstance.get(`/api/maintenance/car/${carid}`)
            ]);
            setCar(carRes.data);
            setHistory(histRes.data);
        } catch (err) {
            message.error('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecord = async () => {
        try {
            await axiosInstance.post('/api/maintenance', {
                ...newRecord,
                carId: carid,
                date: newRecord.date.toISOString()
            });
            message.success('Record added successfully!');
            setIsModalOpen(false);
            setNewRecord({ reason: '', cost: 0, description: '', date: moment() });
            fetchData();
        } catch (err) {
            message.error('Failed to add record.');
        }
    };

    if (loading && !car) return <Spinner />;

    return (
        <ShowroomLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <History size={28} /> Maintenance History
                        </h1>
                        <p className="admin-page-sub">{car?.name} ({car?.registrationNumber})</p>
                    </div>
                    <button className="btn-gradient" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Record
                    </button>
                </div>

                <div className="maintenance-content" style={{ marginTop: '24px' }}>
                    {history.length === 0 ? (
                        <div className="empty-state glass-card">
                            <Activity size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3>No maintenance records found</h3>
                            <p>Track your car's service history here.</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((item) => (
                                <div key={item._id} className="glass-card" style={{ padding: '20px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{moment(item.date).format('MMM DD, YYYY')}</div>
                                        <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--accent-purple)' }}>{item.reason}</div>
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                        {item.description}
                                        <div style={{ fontSize: '11px', marginTop: '6px', opacity: 0.7 }}>Performed by: {item.performedBy}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--accent-green)' }}>₹{item.cost}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Modal
                    title="Add Maintenance Record"
                    open={isModalOpen}
                    onOk={handleAddRecord}
                    onCancel={() => setIsModalOpen(false)}
                    okText="Save Record"
                    okButtonProps={{ className: 'btn-gradient', style: { border: 'none' } }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Service Reason</label>
                            <Input placeholder="e.g. Oil Change, Tyre Replacement" value={newRecord.reason} onChange={e => setNewRecord({ ...newRecord, reason: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Cost (₹)</label>
                                <InputNumber style={{ width: '100%' }} value={newRecord.cost} onChange={v => setNewRecord({ ...newRecord, cost: v })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Date</label>
                                <DatePicker style={{ width: '100%' }} value={newRecord.date} onChange={d => setNewRecord({ ...newRecord, date: d })} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Description (Optional)</label>
                            <Input.TextArea rows={3} placeholder="Add specific details..." value={newRecord.description} onChange={e => setNewRecord({ ...newRecord, description: e.target.value })} />
                        </div>
                    </div>
                </Modal>
            </div>
        </ShowroomLayout>
    );
}

export default MaintenanceHistory;
