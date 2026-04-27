import { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePayroll = () => {
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [position, setPosition] = useState("");
    const [empName, setEmpName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ employee_id: "", salary_month: "", base_salary: "", absents: "", deductions: "", bonus: "", net_salary: "" });

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPosition(loggedInUser.role || "");
            setUserId(loggedInUser.user_id || "");
        }

        const fetchPayroll = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const result = await fetch(`http://localhost:5000/api/payroll/payroll/${id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await result.json();
                if (!result.ok) {
                    throw new Error(data.message || "Failed to fetch Payroll");
                }
                const payroll = Array.isArray(data) ? data[0] : data;
                setFormData({
                    employee_id: payroll.employee_id || "",
                    salary_month: payroll.salary_month || "",
                    base_salary: payroll.base_salary || "",
                    absents: payroll.absents || "",
                    deductions: payroll.deductions || 0,
                    bonus: payroll.bonus || "",
                    net_salary: payroll.net_salary || "",
                });
            } catch (err) {
                console.error(err);
                setError("Connection Error");
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();

    }, [id]);

    // Calculate deductions and net salary automatically
    useEffect(() => {
        if (formData.base_salary !== "" && formData.absents !== "") {
            const base = parseFloat(formData.base_salary) || 0;
            const abs = parseFloat(formData.absents) || 0;
            const bon = parseFloat(formData.bonus) || 0;

            const dailyRate = base / 30;
            const calculatedDeductions = Math.round(dailyRate * abs);
            const calculatedNet = base + bon - calculatedDeductions;

            setFormData(prev => ({
                ...prev,
                deductions: calculatedDeductions,
                net_salary: calculatedNet
            }));
        }
    }, [formData.base_salary, formData.absents, formData.bonus]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/payroll/payroll/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            const data = await result.json();
            if (result.ok) {
                alert("Update Payroll successfully");
                navigate("/view-payroll");
            } else {
                setError(data.error || data.message || "Update Failed");
            }
        } catch (err) {
            console.error(err);
            setError("Connection Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="home1">
                {error && <p style={{ color: "red" }}>{error}</p>}
                <h3 className="title1">Update Payroll</h3>

                <form onSubmit={handleUpdate}>
                    <div className="form-group1">
                        <label>Employee</label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>

                    <div className="form-group1">
                        <label>Salary Month</label>
                        <input type="month" name="salary_month" required value={formData.salary_month} onChange={handleEditChange} />
                    </div>

                    <div className="form-group1">
                        <label>Base Salary</label>
                        <input type="number" name="base_salary" required value={formData.base_salary} onChange={handleEditChange} />
                    </div>

                    <div className="form-group1">
                        <label>Absent</label>
                        <input type="number" name="absents" required value={formData.absents} onChange={handleEditChange} />
                    </div>

                    <div className="form-group1">
                        <label>Bonus</label>
                        <input type="number" name="bonus" required value={formData.bonus} onChange={handleEditChange} />
                    </div>

                    <div className="form-group1">
                        <label>Deductions (Calculated)</label>
                        <input type="number" name="deductions" readOnly value={formData.deductions} style={{ background: "#f0f0f0" }} />
                    </div>

                    <div className="form-group1">
                        <label>Net Salary *</label>
                        <input type="number" name="net_salary" readOnly placeholder="Calculated automatically..." value={formData.net_salary} style={{ background: "#f0f0f0" }} />
                    </div>

                    <button type="submit" className="btn2" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePayroll;