import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
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
import Login from './components/Pages/Login/Login';
import CarList from './components/Pages/User/CarList/CarList.jsx';
import CarDetail from './components/Pages/User/CarDetail/CarDetail.jsx';
import Profile from './components/Pages/User/Profile/Profile.jsx';
import Dashboard from './components/Pages/Admin/Pages/DashBoard/Dashboard.jsx';
import New from './components/Pages/Admin/Pages/New/New.jsx';
import UserListPage from './components/Pages/Admin/Pages/UserListPage/UserListPage.jsx';
import CarListPage from './components/Pages/Admin/Pages/CarListPage/CarListPage.jsx';
import VoucherListPage from './components/Pages/Admin/Pages/VoucherListPage/VoucherListPage.jsx';
import StatisticPage from './components/Pages/Admin/Pages/StatisticPage/StatisticPage.jsx';
import ConfirmInfoPage from './components/Pages/Admin/Pages/ConfirmInfoPage/ConfirmInfoPage.jsx';
import { carInputs, userInputs, voucherInputs } from './components/Pages/Admin/Pages/formSource.js';

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
        <Route path="/">
          <Route index element={<Home/>}/>
          <Route path="login">
            <Route index element={<Login/>}/>
          </Route>
          <Route path="carlist">
            <Route index element={<CarList/>}/>
          </Route>
          <Route path="cardetail">
            <Route index element={<CarDetail/>}/>
          </Route>
          <Route path="profile">
            <Route index element={<Profile/>}/>
          </Route>
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
            <Route path="new" element={<New inputs={voucherInputs} title="Thêm voucher mới"/>}/>
          </Route>
          <Route path="statistic">
            <Route index element={<StatisticPage/>}/>
          </Route>
          <Route path="confirm">
            <Route index element={<ConfirmInfoPage/>}/>
          </Route>
        </Route>
        {/*<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carlist" element={<CarList />} />
        <Route path="/cardetail" element={<CarDetail />} />
        <Route path="/profile" element={<Profile />} />*/}
        {/* <Route path="/blog/" element={<BlogApp />} />
        <Route path="/users/" element={<UserApp />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
