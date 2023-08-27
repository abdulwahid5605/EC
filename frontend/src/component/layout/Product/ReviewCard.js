import React from "react";
import ReactStars from "react-rating-stars-component";
import Profile from "../../../images/Profile.png";

const ReviewCard = ({ reviews }) => {
  const options = {
    activeColor: "tomato",
    value: reviews.rating,
    isHalf: true,
    edit: false,
    size: window.innerWidth < 800 ? 20 : 22,
    color: "gray",
  };
  return (
    <div className="reviewCard">
      <img src={Profile} alt="Profile" />
      <h2>{reviews.name}</h2>
      <ReactStars {...options} />
      <p>{reviews.comment}</p>
    </div>
  );
};

export default ReviewCard;
