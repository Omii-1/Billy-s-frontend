import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";

function Create() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate()
  const [movie, setMovie] = useState({
    movieName: "",
    movieDescription: "",
    movieImageURL: "",
    rating: 0,
    duration: 0,
    releaseDate: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
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
          duration: res.data.movie.duration,
          releaseDate: formattedDate,
        });
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [id, backendUrl]);

  const change = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
    console.log(movie);
  };

  const handleSubmit = async () => {
    try {
      if (
        movie.movieName === "" ||
        movie.movieDescription === "" ||
        movie.movieImageURL === "" ||
        movie.rating === 0 ||
        movie.duration === 0 ||
        movie.releaseDate === ""
      ) {
        alert("Fill all the Inputs");
      } else {
        const date = new Date(movie.releaseDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const res = await axios.post(
          `${backendUrl}/movie/create`,
          { ...movie, releaseDate: formattedDate },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            withCredentials: true,
          }
        );
        alert(res.data.message);
        setMovie({
          movieName: "",
          movieDescription: "",
          movieImageURL: "",
          rating: 0,
          duration: 0,
          releaseDate: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) {
        alert("Invalid movie id");
      } else {
        const res = await axios.delete(
          `${backendUrl}/movie/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            withCredentials: true,
          }
        );
        alert(res.data.message);
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!id) {
        alert("Invalid movie id");
      } else {
        const date = new Date(movie.releaseDate);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const res = await axios.put(
          `${backendUrl}/movie/update/${id}`,
          { ...movie, releaseDate: formattedDate },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            withCredentials: true,
          }
        );
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-zinc-900 p-4">
      <div className="w-full flex flex-col justify-center items-center ">
        <h1 className="text-6xl font-semibold text-zinc-400  pb-4">
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
                <input
                  placeholder="Enter the Language"
                  className="bg-zinc-900 p-2 rounded text-xl"
                  name="rating"
                  type="text"
                  value={movie.rating}
                  onChange={change}
                />
              </div>
              <div className="w-1/3 sm:w-1/2 flex flex-col gap-2">
                <label className="text-2xl font-semibold" htmlFor="">
                  Duration
                </label>
                <input
                  placeholder="Enter the Price"
                  className="bg-zinc-900 p-2 rounded text-xl"
                  name="duration"
                  type="text"
                  value={movie.duration}
                  onChange={change}
                />
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
    </div>
  );
}

export default Create;
