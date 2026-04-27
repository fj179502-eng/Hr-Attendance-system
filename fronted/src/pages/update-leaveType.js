import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateLeaveType = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ type_name: "" });

    useEffect(() => {
        const fetchType = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/type/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const contentType = result.headers.get("content-type");
                let data;
                if (contentType && contentType.includes("application/json")) {
                    data = await result.json();
                } else {
                    const text = await result.text();
                    throw new Error(text || "Failed to fetch Leave Type");
                }

                if (!result.ok) {
                    throw new Error(data.message || data || "Failed to fetch Leave Type");
                }

                const ty = data.type ? data.type : data;
                setFormData({
                    type_name: ty.type_name || "",
                });
            }
            catch (err) {
                console.error(err);
                setError(err.message || "Connection Error");
            }
            finally {
                setLoading(false);
            }
        }
        fetchType();
    }, [id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            // Corrected URL: removed extra /type
            const result = await fetch(`http://localhost:5000/api/type/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const contentType = result.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await result.json();
            } else {
                const text = await result.text();
                throw new Error(text || "Failed to update Leave Type");
            }

            if (!result.ok) {
                throw new Error(data.message || data || "Failed To Update Leave");
            }

            alert("Leave updated successfully");
            navigate("/view-leaveType");

        } catch (err) {
            console.error(err);
            setError(err.message || "Connection Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="home1">
                {loading && <p>Loading...</p>}
                {error && <div style={{ color: "red", backgroundColor: "#ffebeb", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
                    <strong>Error:</strong> {error}
                </div>}
                <h3 className="title1">Update Leave Type</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group1">
                        <label>Leave Type Name</label>
                        <input type="text" name="type_name" required value={formData.type_name} onChange={handleEditChange} />
                    </div>
                    <button type="submit" className="btn2" disabled={loading}>{loading ? "Updating..." : "Update"}</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateLeaveType;