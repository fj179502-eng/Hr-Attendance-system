import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateLeaveRequest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState("");
    const [postion, setPostion] = useState("");
    const [empName, setEmpName] = useState("");
    const [type, setType] = useState([]);

    const [formdata, setFormdata] = useState({
        employee_id: "",
        leave_type_id: "",
        from_date: "",
        to_date: "",
        reason: "",
        status: ""
    });

    // Helper to format date for input type="date"
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }

        const fetchLeaveTypes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:5000/api/type/`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setType(data);
                }
            } catch (err) {
                console.error("Error fetching leave types:", err);
            }
        };

        const fetchRequest = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/request/request/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await result.json();
                if (!result.ok) {
                    throw new Error("Failed to fetch Request");
                }

                const request = Array.isArray(data) ? data[0] : data;
                setFormdata({
                    employee_id: request.employee_id,
                    leave_type_id: request.leave_type_id,
                    from_date: formatDate(request.from_date),
                    to_date: formatDate(request.to_date),
                    reason: request.reason,
                    status: request.status,
                });
            } catch (err) {
                console.error(err);
                setError("Connection Error or Request not found");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveTypes();
        fetchRequest();
    }, [id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormdata((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/request/request/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formdata),
            });
            const data = await result.json();
            if (result.ok) {
                alert("Your Leave Request record updated successfully");
                navigate("/view-leave-request");
            } else {
                setError(data.error || data.message || "Failed to update request");
            }
        } catch (err) {
            console.error(err);
            setError("Connection Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="home1">
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <h3 className="title1">Update Leave Request </h3>

                <form onSubmit={handleUpdate}>
                    <div className="form-group1">
                        <label>Employee</label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>
                    <div className="form-group1">
                        <label>Leave Type *</label>
                        <select
                            id="leave_type_id"
                            name="leave_type_id"
                            required
                            value={formdata.leave_type_id}
                            onChange={handleEditChange}
                        >
                            <option value="">Select</option>
                            {type.map((t) => (
                                <option key={t.type_id} value={t.type_id}>
                                    {t.type_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group1">
                        <label>From Date *</label>
                        <input
                            type="date"
                            name="from_date"
                            required
                            value={formdata.from_date}
                            onChange={handleEditChange}
                        />
                    </div>

                    <div className="form-group1">
                        <label>To Date *</label>
                        <input
                            type="date"
                            name="to_date"
                            required
                            value={formdata.to_date}
                            onChange={handleEditChange}
                        />
                    </div>

                    <div className="form-group1">
                        <label>Reason *</label>
                        <input
                            type="text"
                            name="reason"
                            required
                            value={formdata.reason}
                            onChange={handleEditChange}
                        />
                    </div>

                    <div className="form-group1">
                        <label>Status *</label>
                        <select
                            id="status"
                            name="status"
                            required
                            value={formdata.status}
                            onChange={handleEditChange}
                        >
                            <option value="">Select</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div align="center">
                        <button type="submit" style={{ width: "300px" }} className="btn3">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateLeaveRequest;