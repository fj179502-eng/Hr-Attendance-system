import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

const AddAttendance = () => {
    const [empName, setEmpName] = useState("");
    const [attDate, setAttDate] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [status, setStatus] = useState("");
    const [remarks, setreMarks] = useState("");
    const [postion, setPostion] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const finalPostion = postion || postion;
            const body = { employee_id: userId, att_date: attDate, check_in: checkIn, check_out: checkOut, status: status, remarks: remarks };
            const result = await fetch(`http://localhost:5000/api/attendance/attendance`, {
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
                alert("your Attendance Add Successfully");
                navigate("/view-attendance");
            }
            else {
                setError(data.error || data.message || data || "your Attendance faild try again");
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
                        {error}</div>
                )}
                <h3 className="title1">Add Attendance</h3>

                <form onSubmit={onSubmitForm}>
                    <div className="form-group1">
                        <label>Employee Name</label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>

                    <div className="form-group1">
                        <label>Attendance Date *</label>
                        <input type="date" name="att_date" required value={attDate} onChange={(e) => setAttDate(e.target.value)} />
                    </div>


                    <div className="form-group1">
                        <label>Check In *</label>
                        <input type="time" name="checkIn" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    </div>



                    <div className="form-group1">
                        <label>Check Out *</label>
                        <input type="time" name="chcek_out" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </div>


                    <div className="form-group1">
                        <label>Status *</label>
                        <select id="status" name="status" required value={status} onChange={(e) => setStatus(e.target.value)} >
                            <option value="">Select</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>


                    <div className="form-group1">
                        <label>Remarks *</label>
                        <input type="text" name="remarks" required value={remarks} placeholder="Enter..." onChange={(e) => setreMarks(e.target.value)} />
                    </div>

                    <div align="center">
                        <button type="submit" className="btn2" >Add</button>
                    </div>

                </form>

            </div>
        </div>
    )
}
export default AddAttendance