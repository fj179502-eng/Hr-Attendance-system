import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate } from "react-router-dom";

const AddPayroll = () => {
    const [empName, setEmpName] = useState("");
    const [userId, setUserId] = useState("");
    const [postion, setPostion] = useState("");
    const [salaryMonth, setSalaryMonth] = useState("");
    const [baseSalary, setBaseSalary] = useState("");
    const [absent, setAbsent] = useState("");
    const [deduction, setDeduction] = useState("");
    const [bonus, setBonus] = useState("");
    const [netSalary, setNetSalary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (loggedInUser) {
            setEmpName(loggedInUser.full_name || "");
            setPostion(loggedInUser.role || "");
            setUserId(loggedInUser.emp_id || loggedInUser.user_id || "");
        }
    }, []);

    useEffect(() => {
        const base = parseFloat(baseSalary) || 0;
        const ded = parseFloat(deduction) || 0;
        const bon = parseFloat(bonus) || 0;
        setNetSalary((base + bon - ded).toString());
    }, [baseSalary, deduction, bonus]);

    const onSumbitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const body = { employee_id: userId, salary_month: salaryMonth, base_salary: baseSalary, absents: absent, deductions: deduction, bonus: bonus, net_salary: netSalary };

            const result = await fetch(`http://localhost:5000/api/payroll/payroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            })
            const data = await result.json();
            if (result.ok) {
                const loggedInUser = JSON.parse(localStorage.getItem("user"));
                if (loggedInUser && data.pay_id) {
                    loggedInUser.pay_id = data.pay_id;
                    localStorage.setItem("user", JSON.stringify(loggedInUser));

                }
                alert("Add Payroll Successfully");
                navigate("/view-payroll");
            }
            else {
                setError(data.error || data.message || data || "Add Payroll Failed");
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
                <h3 className="title1">Add Payroll</h3>

                <form onSubmit={onSumbitForm}>
                    <div className="form-group1">
                        <label>Employee</label>
                        <input type="text" value={empName} readOnly style={{ background: "#f0f0f0" }} />
                        <input type="hidden" value={userId} />
                    </div>

                    <div className="form-group1">
                        <label>Salary Month *</label>
                        <input type="month" name="salary" required placeholder="Enter..." value={salaryMonth} onChange={(e) => setSalaryMonth(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Base Salary *</label>
                        <input type="number" name="base" required placeholder="Enter..." value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Absents *</label>
                        <input type="number" name="absent" required placeholder="Enter..." value={absent} onChange={(e) => setAbsent(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Deduction *</label>
                        <input type="number" name="deduction" required placeholder="Enter..." value={deduction} onChange={(e) => setDeduction(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Bonus *</label>
                        <input type="number" name="bonus" required placeholder="Enter..." value={bonus} onChange={(e) => setBonus(e.target.value)} />
                    </div>

                    <div className="form-group1">
                        <label>Net Salary *</label>
                        <input type="number" name="net" readOnly placeholder="Calculated automatically..." value={netSalary} style={{ background: "#f0f0f0" }} />
                    </div>

                    <div align="center">
                        <button type="submit" className="btn2">Add</button>
                    </div>





                </form>

            </div>
        </div>
    )
}
export default AddPayroll;