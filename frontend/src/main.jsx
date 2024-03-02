import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.css'
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError ,
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import ErrorPage from './components/Pages/ErrorPage/ErrorPage.jsx';
import Home from './components/Pages/User/Home/Home.jsx';
import CarList from './components/Pages/User/CarList/CarList.jsx';
import CarDetail from './components/Pages/User/CarDetail/CarDetail.jsx';
import Profile from './components/Pages/User/Profile/Pages/ProfilePage/Profile.jsx';
import MyCars from './components/Pages/User/Profile/Pages/MyCarsPage/MyCars.jsx';
import Trips from './components/Pages/User/Profile/Pages/TravelPage/Trips.jsx';
import Address from './components/Pages/User/Profile/Pages/AddressPage/Address.jsx';
import ChangePw from './components/Pages/User/Profile/Pages/ChangePwPage/ChangePw.jsx';
import CarRegister from './components/Pages/User/Profile/Pages/CarRegister/CarRegister.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/find",
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carlist" element={<CarList />} />
        <Route path="/cardetail" element={<CarDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mycars" element={<MyCars />} />
        <Route path="/mytrips" element={<Trips />} />
        <Route path="/myaddress" element={<Address />} />
        <Route path="/resetpw" element={<ChangePw />} />
        <Route path="/carrregister" element={<CarRegister />} />
        {/* <Route path="/blog/" element={<BlogApp />} />
        <Route path="/users/" element={<UserApp />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
