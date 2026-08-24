import React from "react";
import { Outlet } from "react-router-dom";
import PageBackground from "src/shared/ui/page-background";

const UserLayout = () => {
  return (
    <PageBackground>
      <div>UserLayout</div>
      <Outlet />
    </PageBackground>
  );
};

export default UserLayout;
