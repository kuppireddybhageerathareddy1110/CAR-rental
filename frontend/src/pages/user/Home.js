import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DefaultLayout from '../../components/layouts/DefaultLayout';
import CarCard from '../../components/common/CarCard';
import Spinner from '../../components/common/Spinner';
import { getAllCars } from '../../redux/actions/carsActions';
import { DatePicker } from 'antd';
import moment from 'moment';
import { CarFront, Frown, Compass, Star, Diamond, Zap, Mountain, Warehouse } from 'lucide-react';

const { RangePicker } = DatePicker;

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Van'];
const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const TRANSMISSIONS = ['All', 'Manual', 'Automatic'];
const BRANDS = ['All', 'Toyota', 'Honda', 'Ford', 'Tesla', 'Mercedes', 'BMW', 'Audi', 'Other'];
const CAPACITIES = ['All', '2', '4', '5', '7', '8+'];

function Home() {
    const dispatch = useDispatch();
    const { cars } = useSelector((s) => s.carsReducer);
    const { loading } = useSelector((s) => s.alertsReducer);
    const [filtered, setFiltered] = useState([]);

    // Filter states
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchKey, setSearchKey] = useState('');
    const [sort, setSort] = useState('');
    const [fuelType, setFuelType] = useState('All');
    const [transmission, setTransmission] = useState('All');
    const [dateRange, setDateRange] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [brand, setBrand] = useState('All');
    const [capacity, setCapacity] = useState('All');

    useEffect(() => { dispatch(getAllCars()); }, []);

    // Unified Filtering Function
    useEffect(() => {
        let tempCars = [...cars];

        // 1. Search filter
        if (searchKey) {
            tempCars = tempCars.filter(c => c.name.toLowerCase().includes(searchKey.toLowerCase()));
        }

        // 2. Category filter
        if (activeCategory !== 'All') {
            tempCars = tempCars.filter(c => c.category === activeCategory);
        }

        // 3. Fuel Type filter
        if (fuelType !== 'All') {
            tempCars = tempCars.filter(c => c.fuelType === fuelType);
        }

        // 4. Transmission filter
        if (transmission !== 'All') {
            tempCars = tempCars.filter(c => c.transmission === transmission);
        }

        // 5. Date filters
        if (dateRange && dateRange.length === 2) {
            const from = moment(dateRange[0]);
            const to = moment(dateRange[1]);
            tempCars = tempCars.filter((car) => {
                if (car.bookedTimeSlots.length === 0) return true;
                return car.bookedTimeSlots.every((slot) => {
                    const sf = moment(slot.from, 'MMM DD yyyy HH:mm');
                    const st = moment(slot.to, 'MMM DD yyyy HH:mm');
                    return !(from.isBetween(sf, st) || to.isBetween(sf, st) ||
                        sf.isBetween(from, to) || st.isBetween(from, to));
                });
            });
        }

        // 6. Price Range filter
        tempCars = tempCars.filter(c => c.rentPerHour >= priceRange[0] && c.rentPerHour <= priceRange[1]);

        // 7. Brand filter
        if (brand !== 'All') {
            tempCars = tempCars.filter(c => c.name.toLowerCase().includes(brand.toLowerCase()));
        }

        // 8. Capacity filter
        if (capacity !== 'All') {
            const capVal = parseInt(capacity);
            if (capacity === '8+') {
                tempCars = tempCars.filter(c => c.capacity >= 8);
            } else {
                tempCars = tempCars.filter(c => c.capacity === capVal);
            }
        }

        // 9. Sorting
        if (sort === 'low-high') {
            tempCars.sort((a, b) => a.rentPerHour - b.rentPerHour);
        } else if (sort === 'high-low') {
            tempCars.sort((a, b) => b.rentPerHour - a.rentPerHour);
        }

        setFiltered(tempCars);
    }, [cars, activeCategory, searchKey, fuelType, transmission, dateRange, sort, priceRange, brand, capacity]);

    const handleDateChange = (values) => setDateRange(values);


    return (
        <DefaultLayout>
            {loading && <Spinner />}

            {/* Hero */}
            <section className="hero-section glass-card" style={{ margin: '20px', padding: '60px', textAlign: 'center', background: 'var(--gradient)', color: 'white' }}>
                <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '16px', color: 'white' }}>Drive Your <span style={{ color: '#f59e0b' }}>Dream Car</span> Today</h1>
                    <p className="hero-sub" style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '32px' }}>Experience the ultimate freedom with our premium fleet. Instant booking, no hidden fees.</p>
                    <div className="hero-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn-gradient" style={{ padding: '12px 32px', borderRadius: '12px', fontWeight: '600' }}>Explore Fleet</button>
                        <button className="btn-secondary" style={{ padding: '12px 32px', borderRadius: '12px', fontWeight: '600', background: 'rgba(255,255,255,0.1)', border: '1px solid white', color: 'white' }}>How it Works</button>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="categories-featured" style={{ padding: '40px 20px' }}>
                <div className="section-header" style={{ marginBottom: '24px' }}>
                    <h2 className="section-title">Browse by Category</h2>
                </div>
                <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <div
                            key={cat}
                            className="category-card glass-card"
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '24px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: activeCategory === cat ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
                                transform: activeCategory === cat ? 'translateY(-5px)' : 'none'
                            }}
                        >
                            <div className="category-icon" style={{ fontSize: '2rem', marginBottom: '12px', display: 'flex', justifyContent: 'center', color: 'var(--accent-blue)' }}>
                                {cat === 'Luxury' ? <Diamond size={40} /> : cat === 'Sports' ? <Zap size={40} /> : cat === 'SUV' ? <Mountain size={40} /> : cat === 'Van' ? <CarFront size={40} /> : cat === 'Hatchback' ? <CarFront size={40} /> : <Warehouse size={40} />}
                            </div>
                            <h4 style={{ margin: 0 }}>{cat}</h4>
                        </div>
                    ))}
                </div>
            </section>

            <section className="top-rated-section" style={{ padding: '40px 20px', background: 'var(--bg-secondary)', borderRadius: '24px', margin: '20px' }}>
                <div className="section-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Star size={24} style={{ color: '#f59e0b' }} /> Top Rated Fleet</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Most loved by our community</p>
                    </div>
                    <button className="btn-link" style={{ color: 'var(--accent-blue)', fontWeight: '600', cursor: 'pointer' }}>View All →</button>
                </div>
                <div className="top-rated-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {cars.slice(0, 3).map(car => (
                        <div key={car._id} className="top-rated-card glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <img src={car.image} alt={car.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h4 style={{ margin: 0 }}>{car.name}</h4>
                                    <span style={{ color: '#f59e0b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} fill="#f59e0b" /> 4.9/5</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Includes insurance & GPS</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>₹{car.rentPerHour}<small style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>/hr</small></span>
                                    <Link to={`/booking/${car._id}`} className="btn-gradient" style={{ padding: '8px 20px', fontSize: '0.8rem', borderRadius: '8px' }}>Quick Book</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="home-content-wrap" style={{ display: 'flex', gap: '30px', padding: '0 20px', marginBottom: '40px' }}>
                {/* ADVANCED SIDEBAR */}
                <aside className="filter-sidebar glass-card" style={{ width: '300px', flexShrink: 0, padding: '24px', alignSelf: 'flex-start', position: 'sticky', top: '100px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Compass size={20} /> Filters</h3>
                        <button
                            className="btn-link"
                            style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}
                            onClick={() => {
                                setBrand('All'); setCapacity('All'); setPriceRange([0, 5000]); setFuelType('All'); setTransmission('All'); setActiveCategory('All'); setSearchKey('');
                            }}
                        >Clear All</button>
                    </div>

                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Search Fleet</label>
                        <input type="text" className="form-input" placeholder="Search by name..." value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
                    </div>

                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Price per Hour (₹0 - ₹{priceRange[1]})</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="number" className="form-input" style={{ padding: '8px' }} value={priceRange[0]} onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} placeholder="Min" />
                            <span style={{ color: 'var(--text-secondary)' }}>-</span>
                            <input type="number" className="form-input" style={{ padding: '8px' }} value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])} placeholder="Max" />
                        </div>
                    </div>

                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Vehicle Brand</label>
                        <select className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)}>
                            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Seating Capacity</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {CAPACITIES.map(cap => (
                                <button
                                    key={cap}
                                    className={`cap-chip ${capacity === cap ? 'cap-active' : ''}`}
                                    onClick={() => setCapacity(cap)}
                                    style={{
                                        padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                                        background: capacity === cap ? 'var(--accent-blue)' : 'transparent',
                                        color: capacity === cap ? 'white' : 'var(--text-primary)',
                                        fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >{cap}</button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Fuel Type</label>
                        <select className="form-input" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                            {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Transmission</label>
                        <select className="form-input" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                            {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Sort Order</label>
                        <select className="form-input" value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="">Default Sorting</option>
                            <option value="low-high">Price: Low to High</option>
                            <option value="high-low">Price: High to Low</option>
                        </select>
                    </div>
                </aside>

                <main className="cars-grid-main" style={{ flex: 1 }}>
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h2 className="section-title">Available Fleet</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Found {filtered.length} cars matching your criteria</p>
                        </div>
                        <div style={{ width: '300px' }}>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="MMM DD yyyy HH:mm"
                                onChange={handleDateChange}
                                className="date-picker-styled"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state glass-card" style={{ padding: '80px 40px', textAlign: 'center' }}>
                            <div className="empty-icon" style={{ marginBottom: '20px', color: 'var(--text-muted)' }}><Frown size={64} /></div>
                            <h3>No matches found</h3>
                            <p>Try adjusting your filters or search keywords to find more cars.</p>
                            <button className="btn-theme mt-1" onClick={() => {
                                setBrand('All'); setCapacity('All'); setPriceRange([0, 5000]); setFuelType('All'); setTransmission('All'); setActiveCategory('All'); setSearchKey('');
                            }}>Reset Filters</button>
                        </div>
                    ) : (
                        <div className="cars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {filtered.map((car) => (
                                <CarCard key={car._id} car={car} />
                            ))}
                        </div>
                    )}
                </main>
            </section>
        </DefaultLayout>
    );
}

export default Home;
