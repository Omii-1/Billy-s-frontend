import './App.css'

import Navbar from './componenets/Navbar'
import Footer from './componenets/Footer'
import Home from './pages/Home'
import Create from './pages/Create'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Movie from './pages/Movie'

import { authActions } from "./store/auth"
import { useDispatch, useSelector } from "react-redux"
import {Routes, Route} from "react-router-dom"
import { useEffect } from "react"
import Cookies from "js-cookie";

function App() {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)

  useEffect(() => {
    const id = Cookies.get("id");
    const token = Cookies.get("jwt");
    const role = Cookies.get("role");

    if (id && token && role) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));
    }
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        {
          role === "admin" ?
            <>
            <Route path='/create' element={<Create />} />
            <Route path='/update/:id' element={<Create />} />
            </>
          : null
        }
      </Routes>
      <Footer />
    </div>
  )
}

export default App
