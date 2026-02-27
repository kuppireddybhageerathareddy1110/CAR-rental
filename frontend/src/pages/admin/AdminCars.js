import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../../components/layouts/AdminLayout';
import CarCard from '../../components/common/CarCard';
import Spinner from '../../components/common/Spinner';
import { getAllCars, deleteCar } from '../../redux/actions/carsActions';
import { CarFront, Plus } from 'lucide-react';
import { useHistory } from 'react-router-dom';

function AdminCars() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { cars } = useSelector((s) => s.carsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);

    useEffect(() => { dispatch(getAllCars()); }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            dispatch(deleteCar(id));
        }
    };

    return (
        <AdminLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CarFront size={28} /> Cars Management</h1>
                        <p className="admin-page-sub">{cars.length} cars in fleet</p>
                    </div>
                    <button className="btn-gradient" onClick={() => history.push('/admin/addcar')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add New Car
                    </button>
                </div>

                {cars.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><CarFront size={56} /></div>
                        <h3>No cars in fleet</h3>
                        <p>Add your first car to get started.</p>
                    </div>
                ) : (
                    <div className="cars-grid">
                        {cars.map((car) => (
                            <CarCard
                                key={car._id}
                                car={car}
                                showActions
                                onEdit={() => history.push(`/admin/editcar/${car._id}`)}
                                onDelete={() => handleDelete(car._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminCars;
