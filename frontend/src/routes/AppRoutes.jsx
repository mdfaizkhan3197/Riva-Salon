import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Services from "../pages/Services";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Booking from "../pages/Bookings";
import MyBookings from "../pages/MyBookings";
import AdminBookings from "../pages/AdminBookings";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminInventory from "../pages/AdminInventory";
import AdminAttendance from "../pages/AdminAttendance";
import AdminStaff from "../pages/AdminStaff";
import Gallery from "../pages/Gallery";
import Reviews from "../pages/Reviews";
import POS from "../pages/POS";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/:serviceId" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        


        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="pos" element={<POS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;