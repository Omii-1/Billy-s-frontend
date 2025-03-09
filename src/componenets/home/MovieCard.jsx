import React from "react";
import { Link } from "react-router";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

export function MovieCard({ movie }) {

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  const formatDuration = (minutes) => {
    if (!minutes || minutes < 0) return "Invalid duration";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hour ${mins} Min`;
  };
  

  return (
    <div className="w-full sm:w-[240px] lg:w-[300px] bg-zinc-800 hover:bg-zinc-700  rounded-lg p-2 sm:p-4 flex flex-col gap-2 hover:shadow-xl shadow-lg transition-all duration-300">
      <Link to={`/movie/${movie._id}`} className="flex flex-col gap-3">

        <div className="bg-zinc-900 rounded flex justify-center items-center">
          <img
            className="h-[20vh] sm:h-[35vh] py-2"
            src={movie.movieImageURL}
            alt="book_image"
          />
        </div>

        <h1 className="text-center font-bold text-base sm:text-xl text-zinc-200">
          {movie.movieName}
        </h1>
        <div className="flex justify-between text-zinc-300 text-sm">
          <p>{formatDate(movie.releaseDate)}</p>
          <p>{formatDuration(movie.duration)}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <Rating
            name="size-small"
            value={movie.rating}
            max={5}
            readOnly
            size="medium"
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </div>
      </Link>
    </div>
  );
}
