import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useParams, useNavigate } from "react-router-dom";
const UpdateAttendance = () => {
    const { id } = useParams();
    const [use, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userId, setUserid] = useState("");
    const [postion, setPostion] = useState("");
    const [empName, setEmpName] = useState("");
    const [editAttendance, setEditAttendance] = useState([]);
    const [formData, setFormData] = useState({ employee_id: "", att_date: "", check_in: "", check_out: "", status: "", remarks: "" })
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserid(loggedInUser.user_id || "");
        }
        const fetchAttendance = async (req, res) => {
            try {
                const token = localStorage.getItem("token");
                const reuslt = await fetch(`http://localhost:5000/api/attendance/attendance/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await reuslt.json();
                if (!reuslt.ok) {
                    throw new Error(data.message || "faild to fetch Attandence");
                }
                setEditAttendance(data);
                const attendance = Array.isArray(data) ? data[0] : data;

                setFormData({
                    employee_id: attendance?.employee_id || "",
                    att_date: attendance?.att_date
                        ? attendance.att_date.split("T")[0]
                        : "",
                    check_in: attendance?.check_in
                        ? attendance.check_in.slice(0, 5)
                        : "",
                    check_out: attendance?.check_out
                        ? attendance.check_out.slice(0, 5)
                        : "",
                    status: attendance?.status || "",
                    remarks: attendance?.remarks || "",
                });
                setLoading(false);
            }
            catch (err) {
                console.error(err);
                setError("connection Error");
            }
            finally {
                setLoading(false);
            }
        }
        fetchAttendance();
    }, []);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const finalPostion = postion || postion;
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/attendance/attendance/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            })
            const data = await result.json();
            if (result.ok) {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (loggedInUser && data.att_id) {
                    loggedInUser.att_id = data.att_id;
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                }
                alert("Your attendance Upddate Successfully");
                navigate("/view-attendance");
            }
            else {
                setError(data.error || data.message || data || "update Failed");
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
                <h3 className="title1">Update Attendance</h3>

                <form onSubmit={handleUpdate}>
                    <div className="form-group1">
                        <label>Employee</label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>

                    <div className="form-group1">
                        <label>Attendance Date *</label>
                        <input type="date" name="att_date" required value={formData.att_date} onChange={handleEditChange} />
                    </div>

                    <div className="form-group1">
                        <label>Check In *</label>
                        <input type="time" name="check_in" required value={formData.check_in} onChange={handleEditChange} />
                    </div>

                    <div className="form-group1">
                        <label>Check Out *</label>
                        <input type="time" name="check_out" required value={formData.check_out} onChange={handleEditChange} />
                    </div>



                    <div className="form-group1">
                        <label>Status *</label>
                        <select id="status" name="status" required value={formData.status} onChange={handleEditChange} >
                            <option value="">Select</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>

                    <div className="form-group1">
                        <label>Remarks *</label>
                        <input type="text" name="remarks" required value={formData.remarks} onChange={handleEditChange} />
                    </div>


                    <div align="center">
                        <button type="submit" style={{ width: "300px" }} className="btn3">Update</button>
                    </div>

                </form>

            </div>

        </div>
    );
};
export default UpdateAttendance;