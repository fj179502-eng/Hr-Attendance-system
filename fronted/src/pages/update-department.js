import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateDepartment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ dep_name: "" });
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("token");
                const result = await fetch(
                    `http://localhost:5000/api/department/department/${id}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}`, },
                    }
                );

                const data = await result.json();
                if (!result.ok) {
                    throw new Error(data.message || "Failed to fetch Department");
                }
                const dep = data.department ? data.department : data;
                setFormData({ dep_name: dep.dep_name || "", });
            } catch (err) {
                console.error(err);
                setError(err.message || "Connection Error");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartment();
    }, [id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const result = await fetch(
                `http://localhost:5000/api/department/department/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            }
            );

            const data = await result.json();
            if (!result.ok) {
                throw new Error(data.message || "Failed to update Department");
            }
            alert("Department Updated Successfully");
            navigate("/view-department");
        } catch (err) {
            console.error(err);
            setError(err.message || "Connection Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="home2">
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <h3 className="title1">Update Department</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group1">
                        <label>Department Name *</label>
                        <input type="text" name="dep_name" required value={formData.dep_name} onChange={handleEditChange} />
                    </div>

                    <div>
                        <button type="submit" className="btn2" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateDepartment;
