import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./style/style.css"


const Register = () => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const body = { full_name: fullName, email, role, password };
            const result = await fetch(`http://localhost:5000/api/register/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const data = await result.json();
            if (result.ok) {
                localStorage.setItem("token", data.token);
                const userData = {
                    user_id: data.user_id,
                    full_name: data.full_name,
                    email: data.email,
                    role: data.role,
                    password: data.password
                }
                localStorage.setItem("user", JSON.stringify(userData));
                login(userData);
                navigate("/Login");
            }
            else {
                setError(data || "Registration failed. Please try again");
            }
        }
        catch (err) {
            console.error(err);
            setError("Connection Error")
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="home">
                <h2 className="title">Hr And Admin Registration Page</h2>
                {error && <div className="login-error">{error}</div>}

                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="name" placeholder="Enter..." required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>User Name *</label>
                        <input type="email" name="email" placeholder="Enter..." required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Role *</label>
                        <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="HR">HR</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Password *</label>
                        <input type="password" name="password" placeholder="Enter..." required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Registering..." : "Registration"}
                        </button>
                    </div>
                    <br />
                    <h3>You are Already Account <Link to="/login" >Login</Link></h3>



                </form>

            </div>
        </div>
    )
}
export default Register;