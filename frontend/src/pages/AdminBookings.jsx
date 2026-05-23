import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("booking/all/");
      setBookings(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`booking/update/${id}/`, {
        status: status,
      });

      fetchBookings();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Admin Bookings</h1>

      {bookings.length === 0 && <p>No bookings found</p>}

      {bookings.map((b) => (
        <div key={b.id} className="border p-3 mt-2">
          <p>User: {b.user}</p>
          <p>Status: {b.status}</p>
          <p>Total: ₹{b.total_amount}</p>

          <button onClick={() => updateStatus(b.id, "approved")}>
            Approve
          </button>

          <button onClick={() => updateStatus(b.id, "cancelled")}>
            Cancel
          </button>

          <button onClick={() => updateStatus(b.id, "completed")}>
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminBookings;