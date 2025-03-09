import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import toast from 'react-hot-toast';


import { MovieCard } from "../componenets/home/MovieCard";
import { Pagination } from "../componenets/home/Pagination";
import Loader from "../componenets/Loader";

function Home() {
  const [allMovies, setAllMovies] = useState([]);
  const[loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(8);
  const [filter, setFilter] = useState({
    searchInput: "",
    rating: "",
    releaseDate: "",
    hours: "",
    minutes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/movie/all`
        );
        setAllMovies(res.data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, []);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = allMovies.slice(firstPostIndex, lastPostIndex);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/movie?movieInput=${
          filter.searchInput
        }`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.movies);
      setAllMovies(res.data.movies);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formattedDate = new Date(filter.releaseDate).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/movie/sorted`,
        {
          rating: Number(filter.rating),
          duration: Number(filter.hours) * 60 + Number(filter.minutes),
          releaseDate: filter.releaseDate === "" ? "" : formattedDate,
        },
        {
          withCredentials: true,
        }
      );
      setAllMovies(res.data.movies);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      {
        loading ? (
          <Loader />
        ) : (
          <div className="bg-zinc-900 p-4 w-full min-h-[83vh]">
            <div className="flex p-7 w-full justify-center">
              <input
                className="w-full xl:w-[60%] outline-none rounded-l-full p-2 px-4 shadow-md border-zinc-600 bg-white text-black"
                type="text"
                name="searchInput"
                value={filter.searchInput}
                onChange={handleChange}
              />
              <div
                onClick={handleSearch}
                className="border border-zinc-600 rounded-r-full sm:w-[7%] lg:w-[4%] bg-zinc-800 hover:bg-zinc-900 cursor-pointer p-2 text-white shadow-md flex justify-center"
              >
                {" "}
                <FaSearch className="h-6 w-6" />
              </div>
            </div>

            <div className="w-full">
              <form
                onSubmit={handleFilter}
                className="grid items-center md:justify-items-center sm:grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-800 p-4 text-white mb-6 w-full xl:w-[60%] mx-auto rounded-md"
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="">Release Date</label>
                  <input
                    type="date"
                    className="border border-white rounded p-2"
                    value={filter.releaseDate}
                    name="releaseDate"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="">Duration</label>
                  <div className="flex gap-2 w-full">
                    <input
                      type="number"
                      className="border border-white rounded p-2 w-1/2 md:w-full lg:w-1/2"
                      max={10}
                      placeholder="Hour"
                      value={filter.hours}
                      name="hours"
                      onChange={handleChange}
                    />
                    <input
                      type="number"
                      className="border border-white rounded p-2 w-1/2 md:w-full lg:w-1/2"
                      max={60}
                      placeholder="Min"
                      value={filter.minutes}
                      name="minutes"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="">Rating</label>
                  <Rating
                    name="rating"
                    value={filter.rating}
                    max={5}
                    onChange={handleChange}
                    size="large"
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                </div>

                <div className="flex">
                  <button
                    className="bg-amber-500 px-5 py-2 text-2xl font-bold rounded cursor-pointer m-auto"
                    type="submit"
                  >
                    Filter
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
              {currentPosts &&
                currentPosts.map((movie, i) => <MovieCard key={i} movie={movie} />)}
            </div>

            <div>
              <Pagination
                totalPosts={allMovies.length}
                postsPerPage={postPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          </div>
        )
      }
    </>
  );
}

export default Home;
