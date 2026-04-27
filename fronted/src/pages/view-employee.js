import React, { useEffect, useState } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewEmployee = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch all data in parallel
                const [employeesRes, departmentsRes, usersRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/employee/employee`, { headers }),
                    fetch(`http://localhost:5000/api/department/department`, { headers }),
                    fetch(`http://localhost:5000/api/register/users`, { headers })
                ]);

                if (!employeesRes.ok || !departmentsRes.ok || !usersRes.ok) {
                    throw new Error("Failed to fetch data from one or more sources");
                }

                const employees = await employeesRes.json();
                const departments = await departmentsRes.json();
                const users = await usersRes.json();

                // Create maps for quick lookup
                const deptMap = {};
                departments.forEach(dept => {
                    deptMap[dept.dep_id] = dept.dep_name;
                });

                const userMap = {};
                users.forEach(user => {
                    userMap[user.user_id] = user.full_name;
                });

                // Combine data
                const combinedData = employees.map(emp => ({
                    ...emp,
                    emp_name: userMap[emp.user_id] || "Unknown",
                    dept_name: deptMap[emp.dept_id] || "Unknown"
                }));

                setEmployeeData(combinedData);
            } catch (err) {
                console.error(err);
                setError(err.message || "Connection Error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const token = localStorage.getItem("token");

            const result = await fetch(`http://localhost:5000/api/employee/employee/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            let data = {};
            // Attempt to parse JSON response, handle empty body gracefully
            try {
                const text = await result.text();
                if (text) data = JSON.parse(text);
            } catch (e) {
                console.error("JSON Parse error", e);
            }

            if (result.ok) {
                setEmployeeData((prev) => prev.filter((emp) => emp.emp_id !== id));
                alert("Employee Deleted Successfully");
            } else {
                alert(data.message || "Delete Failed");
            }
        } catch (err) {
            console.error(err);
            alert("Connection Error: " + err.message);
        }
    };

    return (
        <div className="container">
            <div className="home2">
                <h3 className="title1">View Employee</h3>

                {loading && <div className="text-center">Loading Employee...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Sno#</th>
                                <th>Employee</th>
                                <th>Employee Code</th>
                                <th>Mobile No</th>
                                <th>Cnic</th>
                                <th>Department</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {employeeData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" align="center">Employee Not Found</td>
                                </tr>
                            ) : (
                                employeeData.map((emp, index) => (
                                    <tr key={emp.emp_id || index}>
                                        <td>{index + 1}</td>
                                        <td>{emp.emp_name}</td>
                                        <td>{emp.emp_code}</td>
                                        <td>{emp.phone}</td>
                                        <td>{emp.cnic}</td>
                                        <td>{emp.dept_name}</td>
                                        <td>
                                            <Link to={`/update-employee/${emp.emp_id}`} className="btn3">Update</Link> &nbsp;
                                            <button onClick={() => deleteEmployee(emp.emp_id)} className="btn4">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
export default ViewEmployee;