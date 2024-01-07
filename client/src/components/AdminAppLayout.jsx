import React, { useEffect } from "react";
import AdminNav from "./AdminNav";
import AdminSidebar from "./AdminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

const AdminAppLayout = () => {
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.adminAuth);
  useEffect(() => {
    if (!adminInfo) {
      navigate("/admin/login");
    }
  }, []);
  return (<>
    {adminInfo?(   <>
    <ToastContainer/>
      <AdminNav />
      <AdminSidebar />
      <div className="p-4 ml-16 sm:ml-64">
        <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-800 mt-14">
          <Outlet />
        </div>
      </div>
    </>):<Outlet/>}
 </>
  );
};

export default AdminAppLayout;
