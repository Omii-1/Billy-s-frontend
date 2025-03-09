import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import toast from "react-hot-toast";

import Loader from "../componenets/Loader";

function Create() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const[loading, setLoading] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    movieName: "",
    movieDescription: "",
    movieImageURL: "",
    hours: "",
    minutes: "",
    rating: 0,
    releaseDate: "",
  });

  useEffect(() => {
    if (!id) {
      setMovie({
        movieName: "",
        movieDescription: "",
        movieImageURL: "",
        hours: "",
        minutes: "",
        rating: 0,
        releaseDate: "",
      });
    }

    const fetchMovie = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${backendUrl}/movie/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          withCredentials: true,
        });
        console.log(res.data.message);
        const dateString = res.data.movie.releaseDate;
        const formattedDate = new Date(dateString).toISOString().split("T")[0];
        setMovie({
          movieName: res.data.movie.movieName,
          movieDescription: res.data.movie.movieDescription,
          movieImageURL: res.data.movie.movieImageURL,
          rating: res.data.movie.rating,
          hours: Math.floor(res.data.movie.duration / 60),
          minutes: res.data.movie.duration % 60,
          releaseDate: formattedDate,
        });
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching movie:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchMovie();
  }, [id, backendUrl]);

  const change = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (
        movie.movieName === "" ||
        movie.movieDescription === "" ||
        movie.movieImageURL === "" ||
        movie.rating === 0 ||
        movie.hours === 0 ||
        movie.releaseDate === ""
      ) {
        toast.error("Fill all the Inputs");
      } else {
        const date = new Date(movie.releaseDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const formatedDuration = Number(movie.hours * 60) + Number(movie.minutes);
        const { hours, minutes, ...updatedMovie } = movie;

        const res = await axios.post(
          `${backendUrl}/movie/create`,
          {
            ...updatedMovie,
            releaseDate: formattedDate,
            duration: formatedDuration,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            withCredentials: true,
          }
        );
        toast.success(res.data.message);
        setMovie({
          movieName: "",
          movieDescription: "",
          movieImageURL: "",
          rating: 0,
          duration: 0,
          releaseDate: "",
        });
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.error)
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true)
      if (!id) {
        toast.error("Invalid movie id");
      } else {
        const res = await axios.delete(`${backendUrl}/movie/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          withCredentials: true,
        });
        toast.success(res.data.message);
        navigate("/");
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.error)
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true)
      if (!id) {
        toast.error("Invalid movie id");
      } else {
        const date = new Date(movie.releaseDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const formatedDuration = Number(movie.hours * 60) + Number(movie.minutes);

        const { hours, minutes, ...updatedMovie } = movie;

        const res = await axios.put(
          `${backendUrl}/movie/update/${id}`,
          {
            ...updatedMovie,
            releaseDate: formattedDate,
            duration: formatedDuration,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            withCredentials: true,
          }
        );
        toast.success(res.data.message);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
      toast.error(error.response.data.error)
    } finally {
      setLoading(false)
    }
  };

  return (
      <div className="bg-zinc-900 p-4">
        {
        loading ? (
          <Loader />
        ) : (
          <div className="w-full flex flex-col justify-center items-center ">
            <h1 className="text-5xl sm:text-6xl font-semibold text-zinc-400  pb-4">
              Add Movie
            </h1>
            <div className="bg-zinc-800 flex flex-col gap-4 rounded ">
              <div className="p-4 flex flex-col gap-2 text-white">
                <div className="flex flex-col gap-2">
                  <label htmlFor="" className="text-2xl font-semibold">
                    Movie Name
                  </label>
                  <input
                    placeholder="Enter the URL"
                    className="bg-zinc-900 p-2 rounded text-xl"
                    name="movieName"
                    type="text"
                    value={movie.movieName}
                    onChange={change}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-2xl font-semibold" htmlFor="">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter the Description"
                    className="bg-zinc-900 p-2 rounded text-xl"
                    name="movieDescription"
                    rows="4"
                    id=""
                    value={movie.movieDescription}
                    onChange={change}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-2xl font-semibold" htmlFor="">
                    Image URL
                  </label>
                  <input
                    placeholder="Enter the Author Name"
                    className="bg-zinc-900 p-2 rounded text-xl"
                    name="movieImageURL"
                    type="text"
                    value={movie.movieImageURL}
                    onChange={change}
                  />
                </div>
                <div className="flex justify-between md:gap-6">
                  <div className="w-1/3 sm:w-1/2 flex flex-col gap-2">
                    <label className="text-2xl font-semibold" htmlFor="">
                      Rating
                    </label>
                    <Rating
                      name="rating"
                      value={movie.rating}
                      max={5}
                      onChange={change}
                      size="large"
                      emptyIcon={
                        <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                      }
                    />
                  </div>

                  <div className="w-1/3 sm:w-1/2 flex flex-col gap-2">
                    <label className="text-2xl font-semibold" htmlFor="">
                      Duration
                    </label>
                    <div className="flex gap-2 w-full">
                      <input
                        type="number"
                        className="border border-white rounded p-2 w-1/2 "
                        max={10}
                        placeholder="Hour"
                        value={movie.hours}
                        name="hours"
                        onChange={change}
                      />
                      <input
                        type="number"
                        className="border border-white rounded p-2 w-1/2 "
                        max={60}
                        placeholder="Min"
                        value={movie.minutes}
                        name="minutes"
                        onChange={change}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pb-2">
                  <label className="text-2xl font-semibold" htmlFor="">
                    Release Date
                  </label>
                  <input
                    placeholder="Enter the Title"
                    className="bg-zinc-900 p-2 rounded text-xl"
                    name="releaseDate"
                    type="date"
                    value={movie.releaseDate}
                    onChange={change}
                  />
                </div>

                {id ? (
                  <div className="flex justify-between">
                    <button
                      onClick={handleUpdate}
                      className="bg-yellow-500 hover:bg-white hover:text-black rounded p-2 text-2xl font-bold w-1/3"
                    >
                      Update
                    </button>

                    <button
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-white hover:text-black rounded p-2 text-2xl font-bold w-1/3"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-yellow-500 hover:bg-white hover:text-black rounded p-2 text-2xl font-bold w-1/3"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      }
      </div> 
  );
}

export default Create;
