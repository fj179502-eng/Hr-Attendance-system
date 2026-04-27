import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/style.css";
const AddLeaveRequest = () => {
    const [empName, setEmpName] = useState("");
    const [leaveType, setLeaveType] = useState("");
    const [postion, setPostion] = useState("");
    const [userId, setUserId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setreason] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState([]);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }

        const fetchtype = async (req, res) => {
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/type`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (result.ok) {
                    const data = await result.json();
                    setType(data)
                }
            }
            catch (err) {
                console.error("Error fetching Leave:", err);
            }
        }
        fetchtype();
    }, [])

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const body = { employee_id: userId, leave_type_id: leaveType, from_date: fromDate, to_date: toDate, reason: reason, status: status };
            const result = await fetch(`http://localhost:5000/api/request/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            })
            const data = await result.json();
            if (result.ok) {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (loggedInUser && data.request_id) {
                    loggedInUser.request_id = data.request_id;
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                }
                alert("Add Leave request Successully ");
                navigate("/view-leave-request");
            }
            else {
                setError(data.err || data.message || data || "Add Leave Request Faild");
            }
        }
        catch (err) {
            console.error(err);
            setError("Connection Error");
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <div className="container">
            <div className="home1">
                {error && (
                    <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </div>
                )}
                <h3 className="title1">Add Leave Request</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group1">
                        <label>Employee</label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>
                    <div className="form-group1">
                        <label>Leave Type *</label>
                        <select id="leaveType" name="leaveType" required value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
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
                        <input type="date" name="from " required value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>To Date *</label>
                        <input type="date" name="to" required value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Reason *</label>
                        <input type="text" name="reason" required value={reason} onChange={(e) => setreason(e.target.value)} placeholder="Enter..." />
                    </div>

                    <div className="form-group1">
                        <label>Status *</label>
                        <select id="status" name="status" required value={(status)} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Select</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div align="center">
                        <button type="submit" className="btn2">Add</button>
                    </div>


                </form>
            </div>
        </div>
    )
}
export default AddLeaveRequest;