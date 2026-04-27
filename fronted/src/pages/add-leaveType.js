import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/style.css";
const AddLeaveType = () => {
    const [typeName, setTypeName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            const result = await fetch("http://localhost:5000/api/type", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ type_name: typeName })
            });

            let Data;
            const contentType = result.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                Data = await result.json();
            } else {
                Data = await result.text();
            }

            if (result.ok) {
                navigate("/view-leaveType");
            } else {
                setError(Data.error || Data.message || Data || "Add Leave Type Failed");
            }

        } catch (err) {
            console.error(err);
            setError("Connection Error - Backend not running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="home1">
                {error && <div className="Server-error">{error}</div>}
                <h3 className="title1">Add Leave Type</h3>

                <form onSubmit={onSubmitForm}>
                    <div className="form-group1">
                        <label>Type Name</label>
                        <input type="text" name="type_name" required placeholder="Enter..." value={typeName} onChange={(e) => setTypeName(e.target.value)} />
                    </div>
                    <div align="center">
                        <button type="submit" className="btn2">Add</button>
                    </div>
                </form>

            </div>
        </div>
    );
};
export default AddLeaveType