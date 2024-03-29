
import "./App.css";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import Serial from "./Pages/Serial/Serial";
import axios from "axios";
import { baseurl } from "./api/apiConfig";
import { useEffect } from "react";
import FilterPage from "./Pages/Serial/FilterPage";
import Scanning from "./Pages/Scanning/Scanning";
import Appbar from "./Components/Appbar/appbar";
import { ProductiveView } from "./Pages/charts/ProductiveView";


function App() {

  let navigate = useNavigate()

  useEffect(()=>{
    //verifyToken()
  },[])
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
      <Appbar/>
      {/* <Navbar /> */}
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
            <Route exact path="/" element={localStorage.getItem("token") ? <ProductiveView /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/combo-gen" element={localStorage.getItem("token") ? JSON.parse(localStorage.getItem("module_access")).sim_combo ?  <Home /> :<Navigate replace to="/filter-serial" />: <Navigate replace to="/login" />}></Route>
            <Route exact path="/serial" element={localStorage.getItem("token") ? JSON.parse(localStorage.getItem("module_access")).sim_generation? <Serial /> :<Navigate replace to="/filter-serial" />: <Navigate replace to="/login" />}></Route>
            <Route exact path="/filter-serial" element={localStorage.getItem("token") ? <FilterPage /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/scanning" element={localStorage.getItem("token") ? JSON.parse(localStorage.getItem("module_access")).sim_scanning?<Scanning />:<Navigate replace to="/filter-serial" /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/productive-view" element={localStorage.getItem("token") ? JSON.parse(localStorage.getItem("module_access")).sim_scanning?<ProductiveView />:<Navigate replace to="/filter-serial" /> : <Navigate replace to="/login" />}></Route>
          </Route>
          <Route element={<Auth />}>
            <Route exact path="/login" element={<Login />}></Route>
          </Route>
        </Routes>
        <ToastContainer limit={1} position="top-right" autoClose={2000} hideProgressBar={true} closeOnClick pauseOnHover={true} draggable theme="colored" />
      </QueryClientProvider>
    </div>
  );
}

export default App;
