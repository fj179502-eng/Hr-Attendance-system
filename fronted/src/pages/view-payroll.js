import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewPayroll = () => {
    const [payroll, setPayroll] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayroll = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [payrollRes, employeeRes, userRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/payroll/payroll`, { headers }),
                    fetch(`http://localhost:5000/api/employee/employee`, { headers }),
                    fetch(`http://localhost:5000/api/register/users`, { headers }),
                ]);

                if (!payrollRes.ok || !employeeRes.ok || !userRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const payrollData = await payrollRes.json();
                const employeeData = await employeeRes.json();
                const userData = await userRes.json();

                const employeeMap = {};
                employeeData.forEach(emp => {
                    employeeMap[emp.emp_id] = emp;
                });

                const userMap = {};
                userData.forEach(u => {
                    userMap[u.user_id] = u;
                });

                const combinedData = payrollData.map(pay => {
                    const emp = employeeMap[pay.employee_id];
                    const user = emp ? userMap[emp.user_id] : null;

                    return {
                        ...pay,
                        emp_code: emp ? emp.emp_code : "N/A",
                        emp_name: user ? user.full_name : "Unknown",
                    };
                });

                setPayroll(combinedData);
            } catch (err) {
                console.error(err);
                setError("Connection Error");
            } finally {
                setLoading(false);
            }
        };

        fetchPayroll(); // ✅ You forgot to call it
    }, []);

    const deletePayroll = async (id) => {
        if (!window.confirm("Are you sure you want to delete the payroll?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const result = await fetch(
                `http://localhost:5000/api/payroll/payroll/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (result.ok) {
                setPayroll(prev => prev.filter(pay => pay.pay_id !== id));
                alert("Payroll record deleted successfully");
            } else {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            console.error(err);
            setError("Connection Error");
        }
    };

    return (
        <div className="container">
            <div className="home2">
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <h2 className="title1">View Payroll</h2>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Sno#</th>
                            <th>Employee</th>
                            <th>Salary Month</th>
                            <th>Base Salary</th>
                            <th>Absents</th>
                            <th>Deductions</th>
                            <th>Bouns</th>
                            <th>Net Salary</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payroll.length === 0 ? (
                            <tr>
                                <td colSpan="9" align="center">
                                    Payroll not found
                                </td>
                            </tr>
                        ) : (
                            payroll.map((pay, index) => (
                                <tr key={pay.pay_id || index}>
                                    <td>{index + 1}</td>
                                    <td>{pay.emp_name}</td>
                                    <td>{pay.salary_month}</td>
                                    <td>{pay.base_salary}</td>
                                    <td>{pay.absents}</td>
                                    <td>{pay.deductions}</td>
                                    <td>{pay.bonus}</td>
                                    <td>{pay.net_salary}</td>
                                    <td>
                                        <Link to={`/update-payroll/${pay.pay_id}`} className="btn3">
                                            Update</Link> &nbsp;
                                        <button className="btn4" onClick={() => deletePayroll(pay.pay_id)}>
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
    );
};

export default ViewPayroll;