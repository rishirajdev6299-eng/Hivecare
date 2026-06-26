import React, { useState, useEffect } from "react";
import {
  getUserBookings,
  updateBooking,
  deleteBooking
} from "../../api/api";

function History() {

  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return;

  getUserBookings(user.id)
    .then((res) => {
      setBookings(res.data);
    })
    .catch((err) => console.error(err));
}, []);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);

      setBookings(
        bookings.filter(
          (booking) => booking.id !== id
        )
      );

      alert("Booking Deleted Successfully");
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updateBooking(
        editingBooking.id,
        editingBooking
      );

      setBookings(
        bookings.map((booking) =>
          booking.id === editingBooking.id
            ? response.data
            : booking
        )
      );

      setEditingBooking(null);

      alert("Booking Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="container py-5">

      <h2 className="text-center mb-4">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          No bookings found.
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="card mb-3 p-3"
          >
            <h5>{booking.service}</h5>

            <p>
              <strong>Name:</strong> {booking.name}
            </p>

            <p>
              <strong>Address:</strong> {booking.address}
            </p>

            {booking.course && (
              <p>
                <strong>Course:</strong> {booking.course}
              </p>
            )}

            <p>
              <strong>Price:</strong> ₹{booking.amount}
            </p>

            <p>
              <strong>Payment:</strong> {booking.paymentMethod}
            </p>

            <p>
              <strong>Date:</strong> {booking.date}
            </p>

            <div className="mt-3">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() =>
                  setEditingBooking(booking)
                }
              >
                Update
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  handleDelete(booking.id)
                }
              >
                Delete
              </button>
            </div>

          </div>
        ))
      )}

      {/* Edit Form */}

      {editingBooking && (
        <div className="card mt-4 p-4">

          <h4>Edit Booking</h4>

          <p>
            <strong>Service:</strong>{" "}
            {editingBooking.service}
          </p>

          <div className="mb-2">
            <label className="form-label">
              Name
            </label>

            <input
              className="form-control"
              value={editingBooking.name}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  name: e.target.value
                })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">
              Address
            </label>

            <input
              className="form-control"
              value={editingBooking.address}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  address: e.target.value
                })
              }
            />
          </div>

          {editingBooking.service?.toLowerCase() ===
            "tutor" && (
            <div className="mb-2">

              <label className="form-label">
                Course
              </label>

              <select
                className="form-control"
                value={
                  editingBooking.course || ""
                }
                onChange={(e) =>
                  setEditingBooking({
                    ...editingBooking,
                    course: e.target.value
                  })
                }
              >
                <option value="">
                  Select Course
                </option>

                <option value="Java">
                  Java
                </option>

                <option value="Python">
                  Python
                </option>

                <option value="React JS">
                  React JS
                </option>

                <option value="Spring Boot">
                  Spring Boot
                </option>

                <option value="Data Structures">
                  Data Structures
                </option>

              </select>

            </div>
          )}

          <div className="mb-2">
            <label className="form-label">
              Date
            </label>

            <input
              type="date"
              className="form-control"
              value={editingBooking.date}
              onChange={(e) =>
                setEditingBooking({
                  ...editingBooking,
                  date: e.target.value
                })
              }
            />
          </div>

          <div className="mt-3">

            <button
              className="btn btn-success me-2"
              onClick={handleUpdate}
            >
              Save Changes
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setEditingBooking(null)
              }
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default History;