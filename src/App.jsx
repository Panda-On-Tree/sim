
import "./App.css";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { QueryClient, QueryClientProvider } from "react-query";
import Serial from "./Pages/Serial/Serial";
import axios from "axios";
import { baseurl } from "./api/apiConfig";
import { useEffect } from "react";
import FilterPage from "./Pages/Serial/FilterPage";
setBasePath("https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.86/dist/");

function App() {

  let navigate = useNavigate()

  useEffect(()=>{
    verifyToken()
  })
  const verifyToken = () => {
    if (!localStorage.getItem('token')) {
      return
    }
    axios({
      method: 'post',
      url: `${baseurl.base_url}/mhere/verify-token`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(function (response) {
        console.log(response.data)
      })
      .catch(function (err) {
        console.log(err)
        localStorage.clear()
        localStorage.removeItem('employee_id')
        localStorage.removeItem('token')
        localStorage.removeItem('fullname')
        localStorage.removeItem('email')
        navigate('/login')
      })
  }
  const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            refetchOnWindowFocus:false,
            refetchOnMount:true,
            retry:false,
            refetchOnReconnect:false
        }
    }
  });

  const Dashboard = () => (
    <div>
      <Navbar />
      <div style={{ padding: "30px 20px" }}>
        <Outlet />
      </div>
    </div>
  );
  const Auth = () => (
    <div>
      <Outlet />
    </div>
  );

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<Dashboard />}>
            <Route exact path="/" element={localStorage.getItem("token") ? <FilterPage /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/combo-gen" element={localStorage.getItem("token") ? <Home /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/serial" element={localStorage.getItem("token") ? <Serial /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/filter-serial" element={localStorage.getItem("token") ? <FilterPage /> : <Navigate replace to="/login" />}></Route>
          </Route>
          <Route element={<Auth />}>
            <Route exact path="/login" element={<Login />}></Route>
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar={true} closeOnClick pauseOnHover={true} draggable theme="colored" />
      </QueryClientProvider>
    </div>
  );
}

export default App;
