import React from "react";
import ReactHelmet from "react-helmet";

// passing title as a props
const MetaData = ({ title }) => {
  return <ReactHelmet title={title} />;
};

export default MetaData;
