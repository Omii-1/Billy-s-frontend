import React, { useEffect, useState } from 'react'
import {useParams, Link} from "react-router-dom"
import axios from "axios"
import { useSelector } from 'react-redux'
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

import Loader from "../componenets/Loader";

import {formatDate, formatDuration} from "../utils/movie.js"
import toast from 'react-hot-toast';

function Movie() {
  const {id} = useParams()
  const [movie, setMovie] = useState({})
  const[loading, setLoading] = useState(false)
  const role = useSelector((state) => state.auth.role)
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    const fetchOutput = async() => {
      try {
        setLoading(true)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movie/${id}`, {
          withCredentials: true,
        })
        setMovie(res.data.movie)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetchOutput()
  }, [id])

  const handleFav = () => {
    toast.error("This functionality is not completed")
  }
  
  return (
    <>
      {
        loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row gap-8 md:gap-4 lg:gap-8 bg-zinc-900 px-4 md:px-12 py-8 md:items-start items-center ">
            <div className="w-full sm:w-1/2 xl:w-2/5 flex justify-center">
              <div className="flex justify-start lg:justify-around bg-zinc-800 p-4 lg:p-8 rounded flex-col lg:flex-row gap-8 lg:gap-4 w-2/3 sm:w-full">
                <img src={movie.movieImageURL} className="rounded h-[30vh] sm:h-[52vh] lg:h-[70vh] object-contain" alt={movie.movieName} />
                {isLoggedIn == true && role == "user" && (
                  <div className="flex flex-row lg:flex-col gap-4 justify-center lg:justify-start">
                    <button onClick={handleFav} className="bg-red-500 hover:bg-white rounded-full text-3xl p-2 text-white hover:text-red-500 transition-all duration-500">
                      <FaHeart />
                    </button>
                  </div>
                )}
                {isLoggedIn == true && role == "admin" && (
                  <div className="flex flex-row lg:flex-col gap-4 justify-center lg:justify-start">
                    <Link to={`/update/${movie._id}`}  className="bg-white hover:bg-amber-500 rounded-full text-2xl p-3 text-amber-500 hover:text-white transition-all duration-500">
                      <FaEdit />
                    </Link>
                    <Link to={`/update/${movie._id}`} className="bg-white hover:bg-red-500 rounded-full text-3xl p-2 text-red-500 hover:text-white transition-all duration-300">
                      <MdDeleteOutline />
                    </Link>
                </div>
                )}
              </div>
            </div>
            
            <div className="p-0 md:p-4 w-full md:w-3/5 flex flex-col gap-4">
              <h1 className="text-4xl text-zinc-300 font-semibold text-center">{movie.movieName}</h1>
              <p className="text-zinc-500 text-xl">{movie.movieDescription}</p>
              <p className='text-zinc-400 text-xl'>Release Date: <span className='text-zinc-500'>{formatDate(movie.releaseDate)}</span></p>
              <p className='text-zinc-400 text-xl'>Duration: <span className='text-zinc-500'>{formatDuration(movie.duration)}</span></p>
              <Rating
                  name="size-small"
                  value={movie.rating || 0}
                  max={5}
                  readOnly
                  size="large"
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
            </div>
          </div>
        )
      } 
    </>
  )
}

export default Movie