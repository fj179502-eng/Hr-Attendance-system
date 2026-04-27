import React,{useState,useEffect} from "react";
import "./style/style.css";
import{Link} from "react-router-dom"; 
const ViewLeaveBalance=()=>{
    const [balance, setbalance] = useState([]);
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState(null);

useEffect(() => {
    const fetchBalance = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [balanceRes, employeeRes, userRes] = await Promise.all([
                fetch(`http://localhost:5000/api/balance/balance`, { headers }),
                fetch(`http://localhost:5000/api/employee/employee`, { headers }),
                fetch(`http://localhost:5000/api/register/users`, { headers }),
            ]);

            if (!balanceRes.ok || !employeeRes.ok || !userRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const balanceData = await balanceRes.json();
            const employeeData = await employeeRes.json();
            const userData = await userRes.json();

            const employeeMap = {};
            employeeData.forEach(emp => {
                employeeMap[emp.emp_id] = emp;
            });
            const userMap = {};
            userData.forEach(u => {
                userMap[u.user_id] = u;
            });

           
            const combinedData = balanceData.map(bal => {
                const emp = employeeMap[bal.employee_id];
                const user = emp ? userMap[emp.user_id] : null; // user might be undefined if mapping fails

                return {
                    ...bal,
                    emp_code: emp ? emp.emp_code : "N/A",
                    emp_name: user ? user.full_name : "Unknown",
                };
            });

            setbalance(combinedData);

        } catch (err) {
            console.error(err);
            setError("Connection Error");
        } finally {
            setLoading(false);
        }
    };

    fetchBalance();
}, []);
    
    const handleDelete = async id => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/balance/balance/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setbalance(prev => prev.filter(b => b.balance_id !== id));
                alert("Leave Record deleted successfully");
            } else {
                throw new Error('Failed to delete');
            }
        } catch (err) {
            console.error(err);
            setError('Unable to delete record');
        }
    };

    return (
             <div className="container">
                    <div className="home2">
                        <h3 className="title1">View Leave Balance</h3>
                        {loading && <div className="text-center">Loading Leave balance...</div>}
                        {error && <div className="alert alert-danger">{error}</div>}
                        {!loading && !error && (
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sno#</th>
                                        <th>Employee</th>
                                        <th>Sick Leave</th>
                                        <th>Casual Leave</th>
                                        <th>Annual Leave</th>
                                        <th>Action</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {balance.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" align="center">
                                                Leave not found
                                            </td>
                                        </tr>
                                    ) : (
                                        balance.map((bal, index) => (
                                            <tr key={bal.balance_id || index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {bal.emp_name || 'Unknown'}
                                                    
                                                </td>
                                                <td>{bal.sick}</td>
                                                <td>{bal.casual}</td>
                                                <td>{bal.annual}</td>
                                                <td>
                                                    <Link to={`/update-leave-balance/${bal.balance_id}`} className="btn3">
                                                        Update
                                                    </Link>
                                                    &nbsp;
                                                    <button
                                                        className="btn4"
                                                        onClick={() => handleDelete(bal.balance_id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
    )
}
export default ViewLeaveBalance