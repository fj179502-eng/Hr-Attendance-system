import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
    const [empName, setEmpName] = useState("");
    const [postion, setPostion] = useState("");
    const [userId, setUserId] = useState("");
    const [empCode, setEmpCode] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [cnic, setCnic] = useState("");
    const [joinDate, setJoinData] = useState("");
    const [baseSalary, setBaseSalary] = useState("");
    const [deptId, setDeptId] = useState("");
    const [designation, setDesignation] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [status, setStatus] = useState("");

    const [department, setDepartment] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }

        const fetchdepartment = async (req, res) => {
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/department/department`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (result.ok) {
                    const data = await result.json();
                    setDepartment(data)
                }
            }
            catch (err) {
                console.error("Error fetching departments:", err);
            }
        }
        fetchdepartment();
    }, [])

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const finalPostion = postion || postion;
            const body = { user_id: userId, emp_code: empCode, phone: phone, address: address, gender: gender, cnic: cnic, joining_date: joinDate, base_salary: baseSalary, dept_id: deptId, designation: designation, photo_url: photoUrl, status: status };
            const result = await fetch(`http://localhost:5000/api/employee/employee`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            })
            const data = await result.json();
            if (result.ok) {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (loggedInUser && data.emp_id) {
                    loggedInUser.emp_id = data.emp_id;
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                }
                alert("Employee Add Successfully");
                navigate("/view-employee");
            }
            else {
                setError(data.error || data.message || data || "Add Employee Faild");
            }
        }
        catch (err) {
            console.error(err);
            setError("Connection Error", + err.message);
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <div className="container">
            <div className="home2">
                <h3 className="title1">Add Employee </h3>
                {error && (
                    <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>
                        {error}
                    </div>
                )}
                <form onSubmit={onSubmitForm}>
                    <div className="forms">
                        <div className="form-group1">
                            <label>Employee Name</label>
                            <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                            <input type="hidden" value={userId} />
                        </div>

                        <div className="form-group1">
                            <label>Employee Code *</label>
                            <input type="text" name="code" required placeholder="Enter..." value={empCode} onChange={(e) => setEmpCode(e.target.value)} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Mobile No *</label>
                            <input type="text" name="phone" required placeholder="Enter..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="form-group1">
                            <label>Address *</label>
                            <input type="text" name="address" required placeholder="Enter..." value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Gender *</label>
                            <select name="gender" required value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="form-group1">
                            <label>CNIC *</label>
                            <input type="text" name="cnic" required placeholder="Enter..." value={cnic} onChange={(e) => setCnic(e.target.value)} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Joining Date *</label>
                            <input type="date" name="joinDate" required placeholder="Enter..." value={joinDate} onChange={(e) => setJoinData(e.target.value)} />
                        </div>
                        <div className="form-group1">
                            <label>Base Salary *</label>
                            <input type="text" name="baseSalary" required placeholder="Enter..." value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Department *</label>
                            <select name="deptId" required value={deptId} onChange={(e) => setDeptId(e.target.value)}>
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
                            <input type="text" name="designation" required placeholder="Enter..." value={designation} onChange={(e) => setDesignation(e.target.value)} />
                        </div>
                    </div>

                    <div className="forms">
                        <div className="form-group1">
                            <label>Photo URL *</label>
                            <input
                                type="text"
                                name="photoUrl"
                                required
                                placeholder="Enter photo url..."
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                            />


                        </div>
                        <div className="form-group1">
                            <label>Status *</label>
                            <input type="text" name="status" required placeholder="Enter..." value={status} onChange={(e) => setStatus(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="btn2">Add</button>
                    </div>
                </form>

            </div>
        </div>
    )
}
export default AddEmployee;