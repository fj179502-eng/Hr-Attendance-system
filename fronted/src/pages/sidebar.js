import React, { useState } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaTachometerAlt, FaRegCircle, FaUser, FaFingerprint, FaAccessibleIcon, FaDraftingCompass, FaBalanceScale, FaAccusoft } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const closeSidebar = () => {
        if (setSidebarOpen) setSidebarOpen(false);
    };

    const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
    const [isLeaveTypeOpen, setIsLeaveTypeOpen] = useState(false);
    const [isLeaveBalanceOpen, setIsLeaveBalanceOpen] = useState(false);
    const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false);
    const [isPayrollOpen, setIsPayrollOpen] = useState(false);

    const toggleDepartment = () => {
        setIsDepartmentOpen(!isDepartmentOpen);
        setIsEmployeeOpen(false);
        setIsAttendanceOpen(false);
        setIsLeaveTypeOpen(false);
        setIsLeaveBalanceOpen(false);
        setIsLeaveRequestOpen(false);
        setIsPayrollOpen(false);
    };

    const toggleEmployee = () => {
        setIsEmployeeOpen(!isEmployeeOpen);
        setIsDepartmentOpen(false);
        setIsAttendanceOpen(false);
        setIsLeaveTypeOpen(false);
        setIsLeaveBalanceOpen(false);
        setIsLeaveRequestOpen(false);
        setIsPayrollOpen(false);
    };
    const toggleAttendance = () => {
        setIsAttendanceOpen(!isAttendanceOpen);
        setIsEmployeeOpen(false);
        setIsDepartmentOpen(false);
        setIsLeaveTypeOpen(false);
        setIsLeaveBalanceOpen(false);
        setIsLeaveRequestOpen(false);
        setIsPayrollOpen(false);
    }

    const toggleLeaveType = () => {
        setIsLeaveTypeOpen(!isLeaveTypeOpen);
        setIsAttendanceOpen(false);
        setIsEmployeeOpen(false);
        setIsDepartmentOpen(false);
        setIsLeaveBalanceOpen(false);
        setIsLeaveRequestOpen(false);
        setIsPayrollOpen(false);
    };

    const toggleLeaveBalance = () => {
        setIsLeaveBalanceOpen(!isLeaveBalanceOpen);
        setIsAttendanceOpen(false);
        setIsDepartmentOpen(false);
        setIsEmployeeOpen(false);
        setIsLeaveTypeOpen(false);
        setIsLeaveRequestOpen(false);
        setIsPayrollOpen(false);
    };

    const toggleLeaveRequest = () => {
        setIsLeaveRequestOpen(!isLeaveRequestOpen);
        setIsAttendanceOpen(false);
        setIsDepartmentOpen(false);
        setIsEmployeeOpen(false);
        setIsLeaveTypeOpen(false);
        setIsLeaveBalanceOpen(false);
        setIsPayrollOpen(false);
    };

    // const toggleLeaveBalance = () => {
    //     setIsLeaveBalanceOpen(!isLeaveBalanceOpen);
    //     setIsAttendanceOpen(false);
    //     setIsDepartmentOpen(false);
    //     setIsEmployeeOpen(false);
    //     setIsLeaveTypeOpen(false);
    //     setIsLeaveRequestOpen(false);
    //     setIsPayrollOpen(false);

    // };

    const togglePayrollOpen = () => {
        setIsPayrollOpen(!isPayrollOpen);
        setIsAttendanceOpen(false);
        setIsDepartmentOpen(false);
        setIsEmployeeOpen(false);
        setIsLeaveTypeOpen(false);
        setIsLeaveBalanceOpen(false);
        setIsLeaveRequestOpen(false);
    };

    return (
        <>
            {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

            <div className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
                <div className="sidebar-menu">

                    <div className="menu-item">
                        <Link to="/dashboard" onClick={closeSidebar}>
                            <span className="icon"><FaTachometerAlt /></span> Dashboard
                        </Link>
                    </div>

                    <div className="menu-item dropdown-toggle" onClick={toggleDepartment}>
                        <Link to="#" onClick={closeSidebar}>
                            <span className="icon"><FaSignOutAlt /></span> Department
                        </Link>
                    </div>

                    {isDepartmentOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-department" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Department
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-department" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View Department
                                </Link>
                            </div>
                        </div>
                    )}


                    <div className="menu-item dropdown-toggle" onClick={toggleEmployee}>
                        <Link to="#" onClick={closeSidebar}>
                            <span className="icon"><FaUser /></span> Employee
                        </Link>
                    </div>

                    {isEmployeeOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-employee" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Employee
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-employee" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View Employee
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="menu-item dropdown-toggle" onClick={toggleAttendance}>
                        <Link to="#" onClick={closeSidebar}>
                            <span className="icon"><FaFingerprint /></span> Attendance
                        </Link>
                    </div>

                    {isAttendanceOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-attendance" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Attendance
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-attendance" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View Attendance
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="menu-item dropdown-toggle" onClick={toggleLeaveType}>
                        <Link to="#" onClick={closeSidebar}>
                            <span className="icon"><FaDraftingCompass /></span> Leave Type
                        </Link>
                    </div>

                    {isLeaveTypeOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-LeaveType" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Leave Type
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-leaveType" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View Leave type
                                </Link>
                            </div>
                        </div>
                    )}



                    <div className="menu-item dropdown-toggle" onClick={toggleLeaveBalance}>
                        <Link to="#" onClick={closeSidebar}>
                            <span className="icon"><FaBalanceScale /></span> Leave Balance
                        </Link>
                    </div>

                    {isLeaveBalanceOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-LeaveBalance" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Leave Balance
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-leave-Balance" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View Leave Balance
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="menu-item dropdown-toggle" onClick={toggleLeaveRequest}>
                        <Link to="#" onClick={closeSidebar}> <span className="icon"><FaAccessibleIcon /> </span> Leave Request</Link>
                    </div>

                    {isLeaveRequestOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-leave-request" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Leave Request
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-leave-request" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View Leave Request
                                </Link>
                            </div>
                        </div>
                    )}



                    <div className="menu-item dropdown-toggle" onClick={togglePayrollOpen}>
                        <Link to="#" onClick={closeSidebar}> <span className="icon"><FaAccessibleIcon /> </span> Payroll</Link>
                    </div>

                    {isPayrollOpen && (
                        <div className="dropdown-context open">
                            <div className="dropdown-item">
                                <Link to="/add-payroll" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> Add Payroll
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-payroll" onClick={closeSidebar}>
                                    <span className="icon"><FaRegCircle /></span> View PayRoll
                                </Link>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </>
    );
};

export default Sidebar;
