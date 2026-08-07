import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/ManageAdmin.css";

const API = "${process.env.REACT_APP_API_URL}/api/superadmin";

const ManageAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        organizationName: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    useEffect(() => {
        const filtered = admins.filter((admin) => {
            return (
                admin.name.toLowerCase().includes(search.toLowerCase()) ||
                admin.organizationName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                admin.email.toLowerCase().includes(search.toLowerCase())
            );
        });

        setFilteredAdmins(filtered);
    }, [search, admins]);

    //-------------------------------------
    // Fetch All Organizers
    //-------------------------------------

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/admins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            setAdmins(data);
            setFilteredAdmins(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    //-------------------------------------
    // Handle Form Change
    //-------------------------------------

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    //-------------------------------------
    // Create Organizer
    //-------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/admins`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                alert("Unable to create organizer");
                return;
            }

            alert("Organizer Created Successfully");

            setFormData({
                name: "",
                organizationName: "",
                email: "",
                password: "",
            });

            fetchAdmins();
        } catch (err) {
            console.log(err);
        }
    };

    //-------------------------------------
    // Delete Organizer
    //-------------------------------------

    const deleteAdmin = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this organizer?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await fetch(`${API}/admins/${id}`, {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchAdmins();
        } catch (err) {
            console.log(err);
        }
    };

    //-------------------------------------

    if (loading) {
        return (
            <div className="admin-page-layout">
                <AdminSidebar />
                <div className="admin-main-content">
                    <h2 style={{ padding: "30px" }}>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <div className="manage-admin-page">
                    <h1>Manage Organizations</h1>

                    {/* ---------- Create Organizer Form ---------- */}
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Admin Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Organization Name"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            Create Organization
                        </button>
                    </form>

                    {/* ---------- Search ---------- */}
                    <input
                        className="search-box"
                        type="text"
                        placeholder="Search Organization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* ---------- Table Starts Here ---------- */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Organization</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                        No Organizations Found
                                    </td>
                                </tr>
                            ) : (
                                filteredAdmins.map((admin) => (
                                    <tr key={admin._id}>
                                        <td>{admin.name}</td>
                                        <td>{admin.organizationName}</td>
                                        <td>{admin.email}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteAdmin(admin._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageAdmin;
