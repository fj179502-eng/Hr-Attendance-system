import React, { useState,useEffect } from "react";
import "./style/style.css";
import{useNavigate,useParams} from "react-router-dom";

const UpdateLeaveBalance = () => {
    const { id } = useParams();
    const[user,setUser]=useState("");
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState(null)
    const [userId, setUserId] = useState("");
    const [postion, setPostion] = useState("");
    const [empName, setEmpName] = useState("");
    const navigate=useNavigate();

    const[editBalance,setEditBalance]=useState([]);
    const[formData,setFormData]=useState({employee_id:"",sick:"",casual:"",annual:""});

    useEffect(()=>{
        const loggedInUser=JSON.parse(localStorage.getItem("user"));
        if(loggedInUser){
            setEmpName(loggedInUser.full_name||"");
            setPostion(loggedInUser.role||"");
            setUserId(loggedInUser.user_id||"");
        }
        const fetchBalance=async()=>{
            try{
                const token=localStorage.getItem("token");
                const result=await fetch(`http://localhost:5000/api/balance/balance/${id}`,{
                    method:"GET",
                    headers:{Authorization : `Bearer ${token}`}
                })
                const data=await result.json();
                if(!result.ok){
                    throw new Error(data.message || "Faild to fatch Leave")
                }
                setEditBalance(data);
                const balance=Array.isArray(data) ? data[0] : data;
                setFormData({
                   employee_id : balance.employee_id || "",
                   sick:balance.sick || "",
                   casual :balance.casual||"",
                   annual:balance.annual || "",
                })
                setLoading(false);
            }
            catch(err){
                console.error(err);
                setError("connection Error");
            }
        }
        fetchBalance();

    },[]);

    const handleEditChange=async(e)=>{
        const{name,value}=e.target;
        setFormData((prev)=>({...prev,[name] : value}));
    }
    const handleUpdate=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            const token=localStorage.getItem("token");
            const result=await fetch(`http://localhost:5000/api/balance/balance/${id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json",Authorization : `Bearer ${token}`},
                body:JSON.stringify(formData),
            })
            const data=await result.json();
            if(result.ok){
                const loggedInUser=JSON.parse(localStorage.getItem("user"));
                if(loggedInUser && data.balance_id){
                    loggedInUser.balance_id=data.balance_id;
                    localStorage.setItem("user",JSON.stringify(loggedInUser))
                }
                alert("Your leave Balance Update uccessfully");
                navigate("/view-leave-Balance");
            }
            else{
                setError(data.error || data.message || data || "update Failed ");
            }
            
        }
        catch(err){
            console.error(err);
            setError("Connection Error");
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className="container">
         <div className="home1">
             {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <h3 className="title">Update Leave Balance </h3>

                <form onSubmit={handleUpdate}>
                    <div className="form-group1">
                        <label>Employee</label>
                        <input type="text" value={empName} readOnly style={{background:"#f0f0f0"}} />
                        <input type="hidden" value={userId} />
                    </div>

                    <div className="form-group1">
                        <label>Sick Leave *</label>
                        <input type="number" name="sick" required placeholder="Enter..." value={formData.sick} onChange={handleEditChange} />
                    </div>

                      <div className="form-group1">
                        <label>Casual Leave *</label>
                        <input type="number" name="casual" required placeholder="Enter..." value={formData.casual} onChange={handleEditChange} />
                    </div>  

                   <div className="form-group1">
                        <label>Annual Leave *</label>
                        <input type="number" name="annual" required placeholder="Enter..." value={formData.annual} onChange={handleEditChange} />
                    </div> 

                    <button type="submit" className="btn2">Update</button>

                </form>

         </div>
        </div>
    )
}
export default UpdateLeaveBalance;