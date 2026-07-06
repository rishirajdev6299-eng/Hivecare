import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBookings,
  getServices,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings
} from "../../api/api";

import "./MyBookings.css";
import { useLocation } from "react-router-dom";

function MyBookings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    date: "",
    service: location.state?.service || "",
    course: "",
    paymentMethod: "",
    amount: "",
    userId:""
  });

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    if (location.state?.service) {
      setFormData((prev) => ({
        ...prev,
        service: location.state.service,
      }));
    }
  }, [location.state]);

 useEffect(() => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (user) {
    getUserBookings(user.id)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }

}, []);
  useEffect(() => {
  if (formData.service) {
    setFormData((prev) => ({
      ...prev,
      amount: servicePrices[formData.service] || ""
    }));
  }
}, [formData.service]);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  const selectedService = services.find(
    (s) => s.name === formData.service
  );
  const courseFees = {
  Java: 5000,
  Python: 4000,
  "React JS": 6000,
  "Spring Boot": 7000,
  "Data Structures": 3500
};
const servicePrices = {
  Plumber: 500,
  Maid: 800,
  
  Babysitter: 1200,
  "Pet Sitter": 700,
  "Yoga Instructor": 1500,
  Electrician: 600,
  Carpenter: 900,
  "Gym Trainer": 2000,
  Beautician: 1000
};
 const handleChange = (e) => {

  if (e.target.name === "service") {
    setFormData({
      ...formData,
      service: e.target.value,
      amount: servicePrices[e.target.value] || "",
      course: ""
    });
    return;
  }

  if (e.target.name === "course") {
    setFormData({
      ...formData,
      course: e.target.value,
      amount: courseFees[e.target.value]
    });
    return;
  }

  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.service ||
      !formData.name ||
      !formData.address ||
      !formData.date  ||
      !formData.paymentMethod ||
      !formData.amount || (formData.service === "Tutor" && !formData.course)
    ) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      if (formData.id) {
        const response = await updateBooking(
          formData.id,
          formData
        );

        setBookings(
          bookings.map((b) =>
            b.id === formData.id
              ? response.data
              : b
          )
        );

        setMessage("Booking updated successfully");
      } else {
       const user = JSON.parse(
  localStorage.getItem("user")
);

const bookingData = {
  ...formData,
  userId: user.id
};

console.log("Booking Data:", bookingData);

const response = await createBooking(
  bookingData
);

        setBookings([
          ...bookings,
          response.data
        ]);

        setMessage("Booking successful");
        alert("Booking successful! ");
        navigate("/services");
      }

      setFormData({
        id: null,
        name: "",
        address: "",
        date: "",
        service: formData.service
      });
    } catch {
      setMessage("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);

      setBookings(
        bookings.filter(
          (booking) => booking.id !== id
        )
      );

      setMessage("Booking deleted successfully");
    } catch {
      setMessage("Failed to delete booking");
    }
  };

  return (
    <div className="page-bg">
      <div className="container py-5">

        <div className="text-center mb-5" >
          <h1 className="page-title">
            Book a Service
          </h1>

          <p className="page-subtitle">
            Choose a service and schedule
            it in just a few clicks.
          </p>
        </div>

        <div className="row justify-content-centre ">

          {/* Booking Form */}


          <div className="col-lg-12 col-md-10">

            <div className="booking-form-card">

              <div className="booking-header">
                <h4>Book Your Service</h4>

                <p>
                  Fill in your details and confirm your booking.
                </p>
              </div>
             
              <form onSubmit={handleSubmit} >

  {/* Service & Price */}

  <div className="row ">
   <div className="col-md-6 mb-3">
  <label className="form-label">Service</label>

  {location.state?.service ? (
    <input
      type="text"
      className="form-control"
      value={formData.service}
      readOnly
    />
  ) : (
    <select
      className="form-control"
      name="service"
      value={formData.service}
      onChange={handleChange}
    >
      <option value="">Choose Service</option>
      <option value="Plumber">Plumber</option>
      <option value="Maid">Maid</option>
      <option value="Tutor">Tutor</option>
      <option value="Babysitter">Babysitter</option>
      <option value="Pet Sitter">Pet Sitter</option>
      <option value="Yoga Instructor">Yoga Instructor</option>
      <option value="Electrician">Electrician</option>
      <option value="Carpenter">Carpenter</option>
      <option value="Gym Trainer">Gym Trainer</option>
      <option value="Beautician">Beautician</option>
    </select>
  )}
</div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Service Price</label>
      <input
        type="text"
        className="form-control"
        value={`₹ ${formData.amount}`}
        readOnly
      />
    </div>
  </div>

  {/* Name & Address */}

  <div className="row">
    <div className="col-md-6 mb-3">
      <label className="form-label">Full Name</label>
      <input
        type="text"
        name="name"
        className="form-control"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Service Address</label>
      <input
        type="text"
        name="address"
        className="form-control"
        value={formData.address}
        onChange={handleChange}
        placeholder="Enter service address"
      />
    </div>
  </div>

  {/* Tutor Course */}

  {formData.service === "Tutor" && (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">Select Course</label>

        <select
          className="form-control"
          name="course"
          value={formData.course}
          onChange={handleChange}
        >
          <option value="">Choose Course</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="React JS">React JS</option>
          <option value="Spring Boot">Spring Boot</option>
          <option value="Data Structures">Data Structures</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label">Course Fee</label>

        <input
          type="text"
          className="form-control"
          value={`₹ ${ formData.amount}`}
          readOnly
        />
      </div>
    </div>
  )}

  {/* Payment & Date */}

  <div className="row">
    <div className="col-md-6 mb-3">
      <label className="form-label">Payment Method</label>

      <select
        className="form-control"
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleChange}
      >
        <option value="">Select Payment Method</option>
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
        <option value="CASH">Cash</option>
      </select>
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Preferred Date</label>

      <input
        type="date"
        name="date"
        className="form-control"
        value={formData.date}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* UPI */}

  {formData.paymentMethod === "UPI" && (
    <div className="mb-3">
      <label className="form-label">UPI ID</label>

      <input
        type="text"
        className="form-control"
        placeholder="example@paytm"
      />
    </div>
  )}

  {/* Card */}

  {formData.paymentMethod === "CARD" && (
    <>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Card Number"
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Card Holder Name"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="MM/YY"
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="CVV"
          />
        </div>
      </div>
    </>
  )}

  <button
    type="submit"
    disabled={!formData.service}
    className="btn btn-primary w-100 mt-3"
  >
    {formData.id
      ? "Update Booking"
      : "Confirm Booking"}
  </button>

</form>

            </div>

          </div>

          {/* Booking History */}

          {/* <div className="col-lg-7">

            <h4 className="mb-4">
              Booking History
            </h4>

            {bookings.length === 0 ? (
              <div className="booking-card text-center empty-state">
                <h5>No Bookings Yet</h5>

                <p>
                  Your booked services will appear here.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="booking-card mb-3"
                >
                  <div className="d-flex justify-content-between align-items-start">

                    <div>
                      <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-primary me-2">
                          Service
                        </span>

                        <h5 className="mb-0">
                          {booking.service}
                        </h5>
                      </div>

                      <p className="mb-1">
                        <strong>Name:</strong>{" "}
                        {booking.name}
                      </p>

                      <p className="mb-1">
                        <strong>Address:</strong>{" "}
                        {booking.address}
                      </p>
                      {booking.course && (
  <p className="mb-1">
    <strong>Course:</strong> {booking.course}
  </p>
)}
                      <p className="mb-0 text-muted">
                        📅 {booking.date}
                      </p>
                      <p className="mb-1">
                      <strong>Price:</strong> ₹{booking.amount}
                    </p>

                    <p className="mb-1">
                      <strong>Payment:</strong> {booking.paymentMethod}
                    </p>
                    </div>

                    <div className="d-flex gap-2">

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          setFormData(booking)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleDelete(
                            booking.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))
            )}

          </div> */}

        </div>

        {message && (
          <div className="alert alert-success mt-4 text-center">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;