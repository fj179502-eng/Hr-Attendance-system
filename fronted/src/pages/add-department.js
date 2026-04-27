import React, { useState } from "react";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

const Department = () => {
    const [depName, setDepName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const body = { dep_name: depName };
            const result = await fetch(`http://localhost:5000/api/department/department`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            let Data;
            const ContentType = result.headers.get("content-type");
            if (ContentType && ContentType.includes("application/json")) {
                Data = await result.json();
            }
            else {
                Data = await result.text();
            }
            if (result.ok) {
                navigate("/view-department")
            }
            else {
                setError(Data?.message || Data || "Add Department Faild");
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
                {error && <div className="Server-error">{error}</div>}
                <h3 className="title1">Add Department</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group1">
                        <label>Department Name *</label>
                        <input type="text" name="department" required placeholder="Enter..." value={depName} onChange={(e) => setDepName(e.target.value)} />
                    </div>

                    <div>
                        <button type="submit" className="btn2">Add</button>
                    </div>

                </form>
            </div>
        </div>
    )

}
export default Department;