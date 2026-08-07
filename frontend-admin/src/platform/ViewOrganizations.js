import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/ViewOrganizations.css";

const API = "https://eventsphere-95n2.onrender.com/api/superadmin";

const ViewOrganizations = () => {

    const [organizations, setOrganizations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {

        const result = organizations.filter(org =>
            org.organizationName
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        setFiltered(result);

    }, [search, organizations]);

    const fetchOrganizations = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/organizations`, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const data = await response.json();

            setOrganizations(data);
            setFiltered(data);

        } catch (err) {
            console.log(err);
        }

    };

    return (
        <div className="admin-page-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <div className="org-page">
                    <h1>Organizations & Events</h1>

                    <input
                        type="text"
                        className="search-box"
                        placeholder="Search Organization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {filtered.map(org => (
                        <div className="org-card" key={org._id}>
                            <h2>{org.organizationName}</h2>
                            <p>
                                <strong>Organizer :</strong> {org.name}
                            </p>
                            <p>
                                <strong>Email :</strong> {org.email}
                            </p>
                            <h3>Events</h3>
                            {org.events.length === 0 ? (
                                <p>No Events Created</p>
                            ) : (
                                <ul>
                                    {org.events.map(event => (
                                        <li key={event._id}>
                                            {event.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewOrganizations;
