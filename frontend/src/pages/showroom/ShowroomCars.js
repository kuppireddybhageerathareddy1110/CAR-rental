import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ShowroomLayout from '../../components/layouts/ShowroomLayout';
import CarCard from '../../components/common/CarCard';
import Spinner from '../../components/common/Spinner';
import { CarFront, Plus } from 'lucide-react';
import { getAllCars, deleteCar, toggleCarMaintenance } from '../../redux/actions/carsActions';

function ShowroomCars() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));
    const { loading } = useSelector((s) => s.alertsReducer);
    const allCars = useSelector((s) => s.carsReducer.cars);
    const myCars = allCars.filter(c => String(c.showroomId?._id || c.showroomId) === String(user?.showroomId));

    useEffect(() => { dispatch(getAllCars()); }, []);

    const handleDelete = (id) => {
        if (window.confirm('Delete this car?')) dispatch(deleteCar(id));
    };

    return (
        <ShowroomLayout>
            {loading && <Spinner />}
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CarFront size={28} /> My Cars</h1>
                        <p className="admin-page-sub">{myCars.length} cars in your showroom</p>
                    </div>
                    <button className="btn-gradient" onClick={() => history.push('/showroom/addcar')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Car
                    </button>
                </div>
                {myCars.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><CarFront size={56} /></div>
                        <h3>No cars in your showroom</h3>
                        <p>Add your first car to get started.</p>
                    </div>
                ) : (
                    <div className="cars-grid">
                        {myCars.map((car) => (
                            <CarCard
                                key={car._id}
                                car={car}
                                showActions
                                onEdit={() => history.push(`/showroom/editcar/${car._id}`)}
                                onDelete={() => handleDelete(car._id)}
                                onToggleStatus={() => dispatch(toggleCarMaintenance(car._id, car.maintenanceStatus))}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ShowroomLayout>
    );
}

export default ShowroomCars;
