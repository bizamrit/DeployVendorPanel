import React, { lazy, Suspense } from "react";
import { Space, Spin } from "antd";

const SuspenseWrapper = (props) => {
  return <Suspense fallback={<Loading />}>{props.children}</Suspense>;
};

export default SuspenseWrapper;

const style = {
  height: "40vh",
  width: "40vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Loading = () => (
  <div style={style}>
    <Spin size="large" />
  </div>
);
