import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployee = () => {
    const { id } = useParams();
    // const [employee, setEmployee] = useState([]);
    const [department, setDepartment] = useState([]);
    const [use, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [empName, setEmpName] = useState("");
    const [postion, setPostion] = useState("");
    const [userId, setUserId] = useState("")
    const [eidtEmployee, setEditEmployee] = useState([]);
    const [formData, setFormData] = useState({ user_id: "", emp_code: "", phone: "", address: "", gender: "", cnic: "", joining_date: "", base_salary: "", dept_id: "", designation: "", photo_url: "", state: "" });

    useEffect(() => {

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }

        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/employee/employee/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await result.json();
                if (!result.ok) {
                    throw new Error(data.message || "Employee Fiald");
                }
                setEditEmployee(data);
                setFormData({
                    user_id: data.user_id || "",
                    emp_code: data.emp_code || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    gender: data.gender || "",
                    cnic: data.cnic || "",
                    joining_date: data.joining_date
                        ? data.joining_date.split("T")[0]
                        : "",
                    base_salary: data.base_salary || "",
                    dept_id: data.dept_id || "",
                    designation: data.designation || "",
                    photo_url: data.photo_url || "",
                    status: data.status || "",
                });

                setLoading(false);
            }
            catch (err) {
                console.error(err);
                setError("Connection Error");
            }
            finally {
                setLoading(false);
            }
        }
        fetchEmployee();
    }, []);

    const handleEditChange = ((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    })

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const finalPostion = postion || postion;
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/employee/employee/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await result.json();
            if (result.ok) {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (loggedInUser && data.emp_id) {
                    loggedInUser.emp_id = data.emp_id;
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                }
                alert("Employee Update Successfully");
                navigate("/view-employee");
            }
            else {
                setError(data.error || data.message || data || "Update Employee Faild");
            }
        }

        catch (err) {
            console.error(err);
            setError("Connection Error");
        }
    }

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/department/department`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (result.ok) {
                    const data = await result.json();
                    setDepartment(data);
                }
            }
            catch (err) {
                console.error("Eror Fetching Department:", err)
            }
        }
        fetchDepartment();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/register/register`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (result.ok) {
                    const data = await result.json();
                    setUser(data);
                }
            }
            catch (err) {
                console.error("Eror Fetching User:", err)
            }
        }
        fetchUser();
    }, [])



    return (
        <div className="container">
            <div className="home2">
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <h3 className="title1">Update Employee</h3>
                <form onSubmit={handleUpdate}>
                    <div className="forms">
                        <div className="form-group1">
                            <label>Employee Name</label>
                            <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                            <input type="hidden" value={userId} />
                        </div>

                        <div className="form-group1">
                            <label>Employee Code *</label>
                            <input type="text" name="code" required placeholder="Enter..." value={formData.emp_code} onChange={handleEditChange} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Mobile No *</label>
                            <input type="text" name="phone" required placeholder="Enter..." value={formData.phone} onChange={handleEditChange} />
                        </div>
                        <div className="form-group1">
                            <label>Address *</label>
                            <input type="text" name="address" required placeholder="Enter..." value={formData.address} onChange={handleEditChange} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Gender *</label>
                            <select name="gender" required value={formData.gender} onChange={handleEditChange}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="form-group1">
                            <label>CNIC *</label>
                            <input type="text" name="cnic" required placeholder="Enter..." value={formData.cnic} onChange={handleEditChange} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Joining Date *</label>
                            <input type="date" name="joining_date" required value={formData.joining_date} onChange={handleEditChange} />

                        </div>
                        <div className="form-group1">
                            <label>Base Salary *</label>
                            <input type="text" name="baseSalary" required placeholder="Enter..." value={formData.base_salary} onChange={handleEditChange} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Department *</label>
                            <select
                                name="dept_id"
                                required
                                value={formData.dept_id}
                                onChange={handleEditChange}
                            >

                                <option value="">Select Department</option>
                                {department.map((dept) => (
                                    <option key={dept.dep_id} value={dept.dep_id}>
                                        {dept.dep_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group1">
                            <label>Designation *</label>
                            <input type="text" name="designation" required placeholder="Enter..." value={formData.designation} onChange={handleEditChange} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Photo URL *</label>
                            <input type="text" name="photoUrl" required placeholder="Enter photo url..." value={formData.photo_url} onChange={handleEditChange} />


                        </div>
                        <div className="form-group1">
                            <label>Status *</label>
                            <input type="text" name="status" required placeholder="Enter..." value={formData.status} onChange={handleEditChange} />
                        </div>
                    </div>

                    <div align="center">
                        <button type="submit" style={{ width: "300px" }} className="btn3">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UpdateEmployee;