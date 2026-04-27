import React, { useState, useEffect } from "react"
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewLeaveType = () => {
    const [type, setType] = useState([]); // FIXED
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchType = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("token");

                const result = await fetch("http://localhost:5000/api/type", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });

                const data = await result.json();

                if (!result.ok) {
                    throw new Error(data.message || "Failed to fetch Leave");
                }

                setType(data);
            } catch (err) {
                console.error(err);
                setError("Connection Error");
            } finally {
                setLoading(false);
            }
        };

        fetchType(); // IMPORTANT ✅
    }, []);

    const deleteType = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to Delete the Leave?")) return;

            const token = localStorage.getItem("token");

            const result = await fetch(`http://localhost:5000/api/type/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (result.ok) {
                setType(type.filter(ty => ty.type_id !== id));
                alert("Delete Leave Successfully");
            } else {
                const data = await result.json();
                alert(data.message || "Delete failed");
            }
        } catch (err) {
            console.error(err);
            setError("Connection Error");
        }
    };

    return (
        <div className="container">
            <div className="home2">
                <h3 className="title1">View Leave Type</h3>

                {loading && <div className="text-center">Loading Leave Types...</div>}
                {error && <div className="text-danger text-center">{error}</div>}

                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Sno#</th>
                            <th>Leave Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {type.length === 0 ? (
                            <tr>
                                <td colSpan="3" align="center">
                                    Leave not found
                                </td>
                            </tr>
                        ) : (
                            type.map((ty, index) => (
                                <tr key={ty.type_id}>
                                    <td>{index + 1}</td>
                                    <td>{ty.type_name}</td>
                                    <td>
                                        <Link to={`/update-leaveType/${ty.type_id}`} className="btn3" >Update</Link> &nbsp;
                                        <button
                                            onClick={() => deleteType(ty.type_id)}
                                            className="btn4"
                                        >
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

export default ViewLeaveType;