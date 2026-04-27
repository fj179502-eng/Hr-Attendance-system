import React, { useState, useEffect } from "react";
import "./style/style.css";
// import { generatePath } from "react-router-dom";
import { Link } from "react-router-dom";

const ViewAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch all required data in parallel
                const [attendanceRes, employeesRes, usersRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/attendance/attendance`, { headers }),
                    fetch(`http://localhost:5000/api/employee/employee`, { headers }),
                    fetch(`http://localhost:5000/api/register/users`, { headers })
                ]);

                if (!attendanceRes.ok || !employeesRes.ok || !usersRes.ok) {
                    throw new Error("Failed to fetch data from one or more sources");
                }

                const attendance = await attendanceRes.json();
                const employees = await employeesRes.json();
                const users = await usersRes.json();

                // Create helper maps for O(1) lookups
                const employeeMap = {};
                employees.forEach(emp => {
                    employeeMap[emp.emp_id] = emp;
                });

                const userMap = {};
                users.forEach(user => {
                    userMap[user.user_id] = user;
                });

                // Combine data
                const combinedData = attendance.map(att => {
                    const emp = employeeMap[att.employee_id];
                    const user = emp ? userMap[emp.user_id] : null;

                    return {
                        ...att,
                        emp_code: emp ? emp.emp_code : "N/A",
                        emp_name: user ? user.full_name : "Unknown",
                    };
                });

                setAttendanceData(combinedData);
            } catch (err) {
                console.error(err);
                setError(err.message || "Connection Error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedH = h % 12 || 12;
        return `${formattedH}:${minutes} ${ampm}`;
    };


    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString();
    };

    const deleteAttendance = async (id) => {
        if (!window.confirm("Are you sure you want to delete the attendance?")) return;
        try {
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/attendance/attendance/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            let data;
            try {
                const text = await result.text();
                if (text) data = JSON.parse(text);
            }
            catch (e) {
                console.error("JSON parse Error", e);
            }
            if (result.ok) {
                setAttendanceData((prev) => prev.filter((att) => att.att_id !== id));
                alert("Attendance Deleted Successfully");
            }
            else {
                alert(data?.message || "Delete failed")
            }
        }
        catch (err) {
            console.error(err);
            setError("Connection Error");
        }
    }

    return (
        <div className="container">
            <div className="home2">
                <h3 className="title1">View Attendance</h3>
                {loading && <div className="text-center">Loading Attendance...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Sno#</th>
                                <th>Employee</th>
                                <th>Employee Code</th>
                                <th>Date</th>
                                <th>Check IN</th>
                                <th>Check Out</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" align="center">
                                        Attendance Not Found
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map((att, index) => (
                                    <tr key={att.att_id || index}>
                                        <td>{index + 1}</td>
                                        <td>{att.emp_name}</td>
                                        <td>{att.emp_code}</td>
                                        <td>{formatDate(att.att_date)}</td>
                                        <td>{att.check_in}</td>
                                        <td>{att.check_out}</td>
                                        <td style={{ textTransform: "capitalize" }}>{att.status}</td>
                                        <td>{att.remarks}</td>
                                        <td>
                                            <Link to={`/update-attendance/${att.att_id}`} className="btn3">Update</Link>
                                            &nbsp;
                                            <button className="btn4" onClick={(e) => deleteAttendance(att.att_id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
export default ViewAttendance;