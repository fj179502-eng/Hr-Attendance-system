import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./style/style.css"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const body = { email, password };
            const result = await fetch(`http://localhost:5000/api/register/login`, {
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
                navigate("/dashboard");
            }

            else {
                setError(data || "login faild.please try again");
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
                <h2 className="title">Hr And Admin Login Page</h2>
                {error && <div className="login-error">{error}</div>}

                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>User Name *</label>
                        <input type="email" name="email" placeholder="Enter..." required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Password *</label>
                        <input type="password" name="password" placeholder="Enter..." required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div>
                        <button type="submit" className="btn" >Login</button>
                    </div>

                    <div align="center">
                        <Link to="#" className="btn1">Forget Password</Link>
                    </div>

                    <div align="center">
                        <Link to="/register" className="btn2">Registration</Link>
                    </div>

                </form>

            </div>
        </div>
    )
}
export default Login;