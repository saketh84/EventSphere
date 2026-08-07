import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { User, Mail, Shield, Clock, Edit3, Camera } from "lucide-react"; 
import "../styles/dashboard.css";
import "./ViewUsers.css";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/profile`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (res.ok && data) {
          setUsers([data]);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (loading) return <div className="loading-screen">Preparing Dashboard...</div>;

  // We take the first user from the array for the profile view
  const adminData = users[0];

  return (
    <div className="dashboard-wrapper">
      <AdminSidebar />

      <main className="main-content">
        {/* TOP HEADER */}
        <header className="dashboard-header">
          <div className="header-left">
            
            <h1 className="page-title">Admin Profile</h1>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <div className="pulse-dot"></div>
              System Active
            </div>
            <img 
              src={`https://ui-avatars.com/api/?name=${adminData?.name}&background=6366f1&color=fff`} 
              alt="Avatar" 
              className="top-avatar" 
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
          </div>
        </header>

        <section className="profile-container">
          <div className="glass-card fade-in">
            <div className="card-header">
              <div className="title-group">
                <Shield size={20} className="accent-icon" />
                <h2>Identity Details</h2>
              </div>
              <span className="role-tag">Administrator</span>
            </div>

            {adminData ? (
              <>
                <div className="avatar-upload-section">
                  <div className="profile-img-container">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${adminData.name}&size=128&background=4f46e5&color=fff`} 
                      alt="Profile" 
                    />
                    <button className="edit-img-btn"><Camera size={16} /></button>
                  </div>
                  <div className="login-meta">
                    <p><Clock size={14} /> Last Login: {new Date().toLocaleDateString()}</p>
                    
                  </div>
                </div>

                <div className="modern-form">
                  <div className="input-row">
                    <div className="input-field-group">
                      <label>Full Name</label>
                      <div className="input-wrapper">
                        <User className="input-icon" size={18} />
                        <input 
                          type="text" 
                          defaultValue={adminData.name} 
                          placeholder="Loading name..." 
                        />
                      </div>
                    </div>

                    <div className="input-field-group">
                      <label>Email Address</label>
                      <div className="input-wrapper">
                        <Mail className="input-icon" size={18} />
                        <input 
                          type="email" 
                          defaultValue={adminData.email} 
                          readOnly 
                          style={{ cursor: 'not-allowed', opacity: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="action-footer">
                    <button className="btn-secondary">
                      <Edit3 size={18} /> Edit Profile
                    </button>
                    <button className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data">No admin profile found.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewUsers;
