import React, { useState, useEffect } from "react";
import "./style/style.css"
import { Link, useNavigate } from "react-router-dom";

const ViewDepartment = () => {
    const [department, setDepartment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartment = async (req, res) => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/department/department`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await result.json();
                if (!result.ok) {
                    throw new Error(data.message || "Department Faild to fetch");
                }
                setDepartment(data);
                setError(null);
            }
            catch (err) {
                console.error(err);
                setError("Connection Error");
            }
            finally {
                setLoading(false);
            }
        }
        fetchDepartment();
    }, []);

    const delteDepartment = async (id) => {
        if (window.confirm("Are you sure you wentto delete the department ? ")) {
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/department/department/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }

                })
                if (result.ok) {
                    setDepartment(department.filter(dep => dep.dep_id !== id));

                    alert("Department Delete Successfully");
                }
                else {
                    const data = await result.json();
                    alert(data.message || "delete faild")
                }
            }
            catch (err) {
                console.error(err);
                setError("Connection Error");
            }
        }
    }


    return (
        <div className="container">
            <div className="home2">
                <h3 className="title1">View Department</h3>
                {loading && <div className="text-center">Loading Departments...</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Sno#</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {department.length === 0 ? (
                            <tr>
                                <td colSpan="6" align="center">
                                    Department Not Found
                                </td>
                            </tr>
                        ) : (
                            department.map((dep, index) => (
                                <tr key={dep.dep_id || index}>
                                    <td>{index + 1}</td>
                                    <td>{dep.dep_name}</td>
                                    <td> <Link to={`/update-department/${dep.dep_id}`} className="btn3" >Update</Link> &nbsp;
                                        <button onClick={() => delteDepartment(dep.dep_id)} className="btn4" >Delete</button>
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
export default ViewDepartment