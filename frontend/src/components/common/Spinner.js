import React from 'react';

function Spinner() {
    return (
        <div className="spinner-overlay">
            <div className="spinner-ring">
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    );
}

export default Spinner;
