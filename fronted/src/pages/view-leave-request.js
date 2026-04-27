import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";
const ViewLeaveRequest = () => {
    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` }
                const [requestRes, empolyeeRes, userRes, leaveTypeRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/request/request`, { headers }),
                    fetch(`http://localhost:5000/api/employee/employee`, { headers }),
                    fetch(`http://localhost:5000/api/register/users`, { headers }),
                    fetch(`http://localhost:5000/api/type`, { headers }),
                ])
                if (!requestRes.ok) throw new Error("Failed to fetch leave requests");
                if (!empolyeeRes.ok) throw new Error("Failed to fetch employees");
                if (!userRes.ok) throw new Error("Failed to fetch users");
                if (!leaveTypeRes.ok) throw new Error("Failed to fetch leave types");

                const requestdata = await requestRes.json();
                const employeedata = await empolyeeRes.json();
                const userdata = await userRes.json();
                const leaveTypedata = await leaveTypeRes.json();

                const EmployeeMap = {};
                employeedata.forEach(emp => {
                    EmployeeMap[emp.emp_id] = emp;
                });

                const userMap = {};
                userdata.forEach(user => {
                    userMap[user.user_id] = user
                });
                const leaveTypeMap = {};
                leaveTypedata.forEach(type => {
                    leaveTypeMap[type.type_id] = type;
                })
                const combinedData = requestdata.map(req => {
                    const emp = EmployeeMap[req.employee_id];
                    const user = emp ? userMap[emp.user_id] : null;
                    const type = leaveTypeMap[req.leave_type_id];

                    return {
                        ...req,
                        emp_code: emp ? emp.emp_code : "N/A",
                        emp_name: user ? user.full_name : "Unknown",
                        type_name: type ? type.type_name : "N/A",
                    }
                })
                setRequest(combinedData);
            }
            catch (err) {
                console.error(err);
                setError(err.message === "Failed to fetch" ? "connection error" : err.message);
            }
            finally {
                setLoading(false);
            }

        }

        fetchRequest();
    }, []);


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this leave request?")) return;
        try {
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/request/request/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (result.ok) {
                setRequest(prev => prev.filter(r => r.request_id !== id));
                alert("Leave request record deleted successfully");
            }
            else {
                const errorData = await result.json();
                throw new Error(errorData || "Failed to delete the request");
            }
        }
        catch (err) {
            console.error(err);
            setError(err.message === "Failed to fetch" ? "Connection Error" : err.message);
        }
    }

    return (
        <div className="container">
            <div className="home2">
                {loading && <div className="text-center">Loading Leave Request...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <h2>View Leave Request</h2>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Sno#</th>
                            <th>Employee</th>
                            <th>Leave Type</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {request.length === 0 ? (
                            <tr>
                                <td colSpan="8" align="center">Leave request Not Found</td>
                            </tr>
                        ) : (
                            request.map((req, index) => (
                                <tr key={req.request_id || index}>
                                    <td>{index + 1}</td>
                                    <td>{req.emp_name}</td>
                                    <td>{req.type_name}</td>
                                    <td>{new Date(req.from_date).toLocaleDateString()}</td>
                                    <td>{new Date(req.to_date).toLocaleDateString()}</td>
                                    <td>{req.reason}</td>
                                    <td>
                                        <span className={`badge ${req.status === "Approved" ? "bg-success" : req.status === "Rejected" ? "bg-danger" : "bg-warning"}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link to={`/update-leave-request/${req.request_id}`} className="btn3">Update</Link>&nbsp;
                                        <button onClick={() => handleDelete(req.request_id)} className="btn4">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>


            </div>

        </div>
    )
}
export default ViewLeaveRequest;