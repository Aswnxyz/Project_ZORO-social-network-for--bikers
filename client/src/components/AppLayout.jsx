import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import CreatPostModal from "./Modals/CreatePostModal";

const AppLayout = () => {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <ToastContainer />
      {userInfo ? (
        <div>
          <Sidebar
            setShowCreatePostModal={() => setShowCreatePostModal(true)}
          />
          <div className="px-4 ml-16 sm:ml-64">
            
            <div className="px-4">
              <Outlet />
              <CreatPostModal
                open={showCreatePostModal}
                onClose={() => setShowCreatePostModal(false)}
              />
            </div>
          </div>
       </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default AppLayout;
