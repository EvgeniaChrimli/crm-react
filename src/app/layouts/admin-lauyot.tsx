import React from "react";
import { Outlet } from "react-router-dom";
import PageBackground from "src/shared/ui/page-background";

const AdminLauyot = () => {
  return (
    <PageBackground>
      <h1 className="text-3xl font-main underline">Hello world!</h1>
      <Outlet />
    </PageBackground>
  );
};

export default AdminLauyot;
