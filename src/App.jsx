
import "./App.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
setBasePath("https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.86/dist/");

function App() {
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
            <Route exact path="/" element={localStorage.getItem("token") ? <Home /> : <Navigate replace to="/login" />}></Route>
            <Route exact path="/serial" element={localStorage.getItem("token") ? <Serial /> : <Navigate replace to="/login" />}></Route>
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
