import React from "react";
import { useRouteError } from "react-router-dom";

export default function NoPermissionPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Bạn không có ưuyaanf truy cập trang này</p>
    </div>
  );
}