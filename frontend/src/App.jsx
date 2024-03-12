import React from 'react';
import './App.css';
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
import Map from './components/Pages/User/Map/Map.jsx';
import Profile from "./components/Pages/User/Profile/Pages/ProfilePage/Profile.jsx";
import Transaction from './components/Pages/User/Profile/Pages/TransactionPage/Transaction.jsx';
import Trips from './components/Pages/User/Profile/Pages/TravelPage/Trips.jsx';
import MyCars from './components/Pages/User/Profile/Pages/MyCarsPage/MyCars.jsx';
import Address from './components/Pages/User/Profile/Pages/AddressPage/Address.jsx';
import ChangePw from './components/Pages/User/Profile/Pages/ChangePwPage/ChangePw.jsx';
import CarRegister from './components/Pages/User/Profile/Pages/CarRegister/CarRegister.jsx';

import Dashboard from './components/Pages/Admin/Pages/DashBoard/Dashboard.jsx';
import New from './components/Pages/Admin/Pages/New/New.jsx';
import UserListPage from './components/Pages/Admin/Pages/UserListPage/UserListPage.jsx';
import CarListPage from './components/Pages/Admin/Pages/CarListPage/CarListPage.jsx';
import VoucherListPage from './components/Pages/Admin/Pages/VoucherListPage/VoucherListPage.jsx';
import StatisticPage from './components/Pages/Admin/Pages/StatisticPage/StatisticPage.jsx';
import ConfirmInfoPage from './components/Pages/Admin/Pages/ConfirmInfoPage/ConfirmInfoPage.jsx';
import { carInputs, userInputs, voucherInputs } from './components/Pages/Admin/Pages/formSource.js';

import LoginForm from './components/Pages/Login/LoginForm/LoginForm.jsx';

function App(){
  return (
    <div>
        <Routes>
          <Route path="/">
            {/* user */}
            <Route index element={<Home/>}/>
            <Route path="login">
              <Route index element={<LoginForm/>}/>
            </Route>
            <Route path="carregister">
              <Route index element={<CarRegister/>}/>
            </Route>
            <Route path="carlist">
              <Route index element={<CarList/>}/>
            </Route>
            <Route path="cardetail">
              <Route index element={<CarDetail/>}/>
            </Route>
            <Route path="map">
              <Route index element={<Map/>}/>
            </Route>
            <Route path="user">
              <Route path="profile">
                <Route index element={<Profile/>}/>
              </Route>
              <Route path="mycars">
                <Route index element={<MyCars/>}/>
              </Route>
              <Route path="mytrips">
                <Route index element={<Trips/>}/>
              </Route>
              <Route path="myaddress">
                <Route index element={<Address/>}/>
              </Route>
              <Route path="resetpw">
                <Route index element={<ChangePw/>}/>
              </Route>
              <Route path="transaction">
                <Route index element={<Transaction/>}/>
              </Route>
            </Route>
            {/* admin */}
            <Route path="dashboard">
              <Route index element={<Dashboard/>}/>
            </Route>
            <Route path="users">
              <Route index element={<UserListPage/>}/>
              <Route path="new" element={<New inputs={userInputs} title="Thêm người dùng mới"/>}/>
            </Route>
            <Route path="cars">
              <Route index element={<CarListPage/>}/>
              <Route path="new" element={<New inputs={carInputs} title="Thêm xe mới"/>}/>
            </Route>
            <Route path="voucher">
              <Route index element={<VoucherListPage/>}/>
              {/* <Route path="new" element={<New inputs={voucherInputs} title="Thêm voucher mới"/>}/> */}
            </Route>
            <Route path="statistic">
              <Route index element={<StatisticPage/>}/>
            </Route>
            <Route path="confirm">
              <Route index element={<ConfirmInfoPage/>}/>
            </Route>
          </Route>
        </Routes>
    </div>
  )
}

export default App
{/*<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/carlist" element={<CarList />} />
<Route path="/cardetail" element={<CarDetail />} />
<Route path="/profile" element={<Profile />} />*/}
{/* <Route path="/blog/" element={<BlogApp />} />
<Route path="/users/" element={<UserApp />} /> */}