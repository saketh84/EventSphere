import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BrowseEvents from './pages/BrowseEvents';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';
import TicketDetails from './pages/TicketDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import './App.css';

// Auth helper
const isAuthenticated = () => !!localStorage.getItem('token');
// const isVolunteer = () => localStorage.getItem('role') === 'volunteer';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/browse" element={<BrowseEvents />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/signup" element={< Signup />} />
                {/* Protected User Routes */}
                <Route path="/register/:id" element={
                    isAuthenticated() ? <Register /> : <Navigate to="/login" />
                } />
                <Route path="/my-registrations" element={
                    isAuthenticated() ? <MyRegistrations /> : <Navigate to="/login" />
                } />


                <Route path="/ticket/:regId" element={
                    isAuthenticated() ? <TicketDetails /> : <Navigate to="/login" />
                } />
                <Route path="/profile" element={
                    isAuthenticated() ? <Profile /> : <Navigate to="/login" />
                } />

                <Route
                    path="/ticket/:regId"
                    element={<TicketDetails />}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;