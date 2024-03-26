import React from 'react';
import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from './Context/AuthProvider.jsx';

import ErrorPage from './components/Pages/ErrorPage/ErrorPage.jsx';
import Home from './components/Pages/User/Home/Home.jsx';
import CarList from './components/Pages/User/CarList/CarList.jsx';
import CarDetail from './components/Pages/User/CarDetail/CarDetail.jsx';
import Map from './components/Pages/User/Map/Map.jsx';
import Profile from "./components/Pages/User/Profile/Pages/ProfilePage/Profile.jsx";
import Transaction from './components/Pages/User/Profile/Pages/TransactionPage/Transaction.jsx';
import Trips from './components/Pages/User/Profile/Pages/TravelPage/Trips.jsx';
import MyCars from './components/Pages/User/Profile/Pages/MyCarsPage/MyCars.jsx';
import PendingCars from './components/Pages/User/Profile/Pages/PendingCarsPage/PendingCars.jsx';
import ChangePw from './components/Pages/User/Profile/Pages/ChangePwPage/ChangePw.jsx';
import CarRegister from './components/Pages/User/Profile/Pages/CarRegister/CarRegister.jsx';

import Dashboard from './components/Pages/Admin/Pages/DashBoard/Dashboard.jsx';
import UserListPage from './components/Pages/Admin/Pages/UserListPage/UserListPage.jsx';
import CarListPage from './components/Pages/Admin/Pages/CarListPage/CarListPage.jsx';
import VoucherListPage from './components/Pages/Admin/Pages/VoucherListPage/VoucherListPage.jsx';
import StatisticPage from './components/Pages/Admin/Pages/StatisticPage/StatisticPage.jsx';
import ConfirmInfoPage from './components/Pages/Admin/Pages/ConfirmInfoPage/ConfirmInfoPage.jsx';
import { carInputs, userInputs, voucherInputs } from './components/Pages/Admin/Pages/formSource.js';


function App(){
  
  const { auth, roleUserId } = useAuth();
 
  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="car">
            <Route path="carlist" element={<CarList />} />
            <Route path="cardetail/:carId" element={<CarDetail />} />
          </Route>
          <Route path="map" element={<Map />} />
          {!auth && <Route path="login" element={<LoginForm />} />}
          {auth && roleUserId === 1 && (
            <>
              <Route path="user">
                <Route path="profile" element={<Profile />} />
                <Route path="mycars" element={<MyCars />} />
                <Route path="pendingcars" element={<PendingCars />} />
                <Route path="mytrips" element={<Trips />} />
                <Route path="resetpw" element={<ChangePw />} />
                <Route path="transaction" element={<Transaction />} />
              </Route>
              <Route path="car">
                <Route path="carregister" element={<CarRegister />} />
              </Route>
            </>
          )}
          {auth && roleUserId !== 1 && (
            <Route path="admin">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UserListPage />} />
              <Route path="cars" element={<CarListPage />} />
              <Route path="voucher" element={<VoucherListPage />} />
              <Route path="statistic" element={<StatisticPage />} />
              <Route path="confirm" element={<ConfirmInfoPage />} />
            </Route>
          )}
          {!auth && <Navigate to="/login" />}
        </Route>
      </Routes>
    </div>
  )
}

export default App