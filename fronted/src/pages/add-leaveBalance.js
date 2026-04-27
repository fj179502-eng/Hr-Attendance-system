import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate } from "react-router-dom";
const AddLeaveBalance = () => {
    const [empName, setEmpName] = useState("");
    const [sick, setSick] = useState("");
    const [casual, setCasual] = useState("");
    const [annual, setAnnual] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [postion, setPostion] = useState("");

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }
    }, []);

    const onSumbitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const finalPostion = postion || postion;
            const body = { employee_id: userId, sick: sick, casual: casual, annual: annual };
            const result = await fetch(`http://localhost:5000/api/balance/balance`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            })
            const data = await result.json();
            if (result.ok) {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (loggedInUser && data.balance_id) {
                    loggedInUser.balance_id = data.balance_id;
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                }
                alert("Leave balance added successfully");
                navigate("/view-leave-Balance");
            }
            else {
                setError(data.error || data.message || data || "Failed to add leave balance")
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
                {error && <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>{error}  </div>}
                <h3 className="title1">Add Leave Blance</h3>

                <form onSubmit={onSumbitForm}>
                    <div className="form-group1">
                        <label>Employee </label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>

                    <div className="form-group1">
                        <label>Sick Leave *</label>
                        <input type="number" name="sick" required placeholder="Enter..." value={sick} onChange={(e) => setSick(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Casual Leave *</label>
                        <input type="number" name="casual" required placeholder="Enter..." value={casual} onChange={(e) => setCasual(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Annual Leave *</label>
                        <input type="number" name="Annual" required placeholder="Enter..." value={annual} onChange={(e) => setAnnual(e.target.value)} />
                    </div>

                    <button type="submit" className="btn2">Add</button>


                </form>

            </div>

        </div>
    )
}
export default AddLeaveBalance