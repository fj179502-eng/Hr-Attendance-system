import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./auth/PrivateRoute";
import AuthProvider from "./auth/AuthContext";
import Sidebar from "./pages/sidebar";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AddDepartment from "./pages/add-department";
import ViewDepartment from "./pages/view-department";
import UpdateDepartment from "./pages/update-department";
import AddEmployee from "./pages/add-employee";
import ViewEmployee from "./pages/view-employee";
import UpdateEmployee from "./pages/update-employee";
import AddAttendance from "./pages/add-attendance";
import ViewAttendance from "./pages/view-attendance";
import UpdateAttendance from "./pages/update-attendance";
import AddLeaveType from "./pages/add-leaveType";
import ViewLeaveType from "./pages/view-leaveType";
import UpdateLeaveType from "./pages/update-leaveType";
import AddLeaveBalance from "./pages/add-leaveBalance";
import ViewLeaveBalance from "./pages/view-leave-Balance";
import UpdateLeaveBalance from "./pages/update-leave-balance";
import AddLeaveRequest from "./pages/add-leave-request";
import ViewLeaveRequest from "./pages/view-leave-request";
import UpdateLeaveRequest from "./pages/update-leave-request";

import AddPayroll from "./pages/add-payroll";
import ViewPayroll from "./pages/view-payroll";
import UpdatePayroll from "./pages/update-payroll";

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname.toLocaleLowerCase());
  return (

    <AuthProvider>
      {!shouldHideSidebar && <Sidebar sidebarOpen={sidebarOpen} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-department" element={<ProtectedRoute><AddDepartment /> </ProtectedRoute>} />
        <Route path="/view-department" element={<ProtectedRoute><ViewDepartment /> </ProtectedRoute>} />
        <Route path="/update-department/:id" element={<ProtectedRoute><UpdateDepartment /> </ProtectedRoute>} />
        <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /> </ProtectedRoute>} />
        <Route path="/view-employee" element={<ProtectedRoute><ViewEmployee /> </ProtectedRoute>} />
        <Route path="/update-employee/:id" element={<ProtectedRoute><UpdateEmployee /> </ProtectedRoute>} />
        <Route path="/add-attendance" element={<ProtectedRoute><AddAttendance /> </ProtectedRoute>} />
        <Route path="/view-attendance" element={<ProtectedRoute><ViewAttendance /> </ProtectedRoute>} />
        <Route path="/update-attendance/:id" element={<ProtectedRoute><UpdateAttendance /> </ProtectedRoute>} />
        <Route path="/add-leaveType" element={<ProtectedRoute><AddLeaveType /> </ProtectedRoute>} />
        <Route path="/view-leaveType" element={<ProtectedRoute><ViewLeaveType /> </ProtectedRoute>} />
        <Route path="/update-leaveType/:id" element={<ProtectedRoute><UpdateLeaveType /> </ProtectedRoute>} />
        <Route path="/add-leaveBalance" element={<ProtectedRoute><AddLeaveBalance /> </ProtectedRoute>} />
        <Route path="/view-leave-Balance" element={<ProtectedRoute><ViewLeaveBalance /> </ProtectedRoute>} />
        <Route path="/update-leave-balance/:id" element={<ProtectedRoute><UpdateLeaveBalance /> </ProtectedRoute>} />
        <Route path="/add-leave-request" element={<ProtectedRoute><AddLeaveRequest /> </ProtectedRoute>} />
        <Route path="/view-leave-request" element={<ProtectedRoute><ViewLeaveRequest /> </ProtectedRoute>} />
        <Route path="/update-leave-request/:id" element={<ProtectedRoute><UpdateLeaveRequest /> </ProtectedRoute>} />

        <Route path="/add-payroll" element={<ProtectedRoute>< AddPayroll /> </ProtectedRoute>} />
        <Route path="/view-payroll" element={<ProtectedRoute><ViewPayroll /> </ProtectedRoute>} />
        <Route path="/update-payroll/:id" element={<ProtectedRoute><UpdatePayroll /></ProtectedRoute>} />

      </Routes>
    </AuthProvider>

  );
}

export default App;
