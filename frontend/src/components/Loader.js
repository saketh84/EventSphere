import React from 'react';

function Loader({ size = 'medium', fullScreen = false, text = 'Loading...' }) {
    const sizeMap = {
        small: 30,
        medium: 50,
        large: 70
    };

    const spinnerSize = sizeMap[size] || 50;

    if (fullScreen) {
        return (
            <div className="loader-fullscreen">
                <div className="loader-container">
                    <div className="spinner" style={{ width: spinnerSize, height: spinnerSize }}></div>
                    <p className="loader-text">{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="loader-container">
            <div className="spinner" style={{ width: spinnerSize, height: spinnerSize }}></div>
            <p className="loader-text">{text}</p>
        </div>
    );
}

export default Loader;