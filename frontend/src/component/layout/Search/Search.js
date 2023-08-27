import React, { useState } from "react";
import "./Search.css";
import MetaData from "../../MetaData";

const Search = ({ history }) => {
  // default value of keyword will be empty
  // when someone will write something in the input tag the using setkeyword we will change the value of keyword
  const [keyword, setkeyword] = useState("");
  const submitFunction = () => {
    // .trim()
    if (keyword) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };
  return (
    <>
      <MetaData title="Search A Product -- ECOMMERECE" />
      <form className="searchForm" onSubmit={submitFunction}>
        {/* onChange means during typing */}
        {/* we have to store the value in the keyword */}
        <input
          type="text"
          placeholder="Search Here..."
          onChange={(e) => setkeyword(e.target.value)}
        />
        <input type="submit" />
      </form>
    </>
  );
};

export default Search;
