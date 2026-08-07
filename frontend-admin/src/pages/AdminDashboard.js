import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/dashboard.css";

function AdminDashboard() {

    const [form, setForm] =
        useState({

            title: "",
            description: "",
            date: "",
            venue: "",
            organizer: "",

            category: "",

            capacity: "",

            price: "",
            image: null
        });

    const handleChange = (e) => {

        const { name, value, files }
            = e.target;

        setForm({

            ...form,

            [name]:
                files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const data =
            new FormData();

        data.append(
            "title",
            form.title
        );

        data.append(
            "description",
            form.description
        );

        data.append(
            "date",
            form.date
        );

        data.append(
            "venue",
            form.venue
        );
        data.append(
            "organizer",
            form.organizer
        );

        data.append(
            "category",
            form.category
        );

        data.append(
            "capacity",
            form.capacity
        );

        data.append(
            "price",
            form.price
        );

        data.append(
            "image",
            form.image
        );

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/events/manage`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: data
                }
            );

            const resData = await response.json();
            if (response.ok) {
                alert("Event Added Successfully!");
                // Clear the form state
                setForm({
                    title: "",
                    description: "",
                    date: "",
                    venue: "",
                    organizer: "",
                    category: "",
                    capacity: "",
                    price: "",
                    image: null
                });
            } else {
                alert(`❌ Failed to add event: ${resData.error || resData.message || "Server rejected the request"}`);
            }
        } catch (err) {
            console.error(err);
            alert("❌ Failed to connect to backend server. Make sure it is running on port 5000.");
        }
    };

    return (

        <div className="admin-page-layout">

            <AdminSidebar />

            <div className="admin-main-content">

                <h1>Add Event</h1>

                <form
                    className="event-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        name="title"
                        placeholder="Title"
                        className="modern-input"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        className="modern-input"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <input
                        type="datetime-local"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="modern-input"
                        required
                    />

                    <input
                        name="venue"
                        placeholder="Venue"
                        className="modern-input"
                        value={form.venue}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="organizer"
                        placeholder="Organizer"
                        className="modern-input"
                        value={form.organizer}
                        onChange={handleChange}
                    />
                    <input
                        name="category"
                        value={form.category}
                        placeholder="Category"
                        onChange={handleChange}
                        className="modern-input"
                    >

                    </input>

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="modern-input"
                        value={form.price}
                        onChange={handleChange}
                    />
                    <input
                        name="capacity"
                        value={form.capacity}
                        placeholder="Capacity"
                        onChange={handleChange}
                        className="modern-input"
                    >

                    </input>




                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Publish Event
                    </button>

                </form>

            </div>

        </div >
    );
}

export default AdminDashboard;
