import { useState } from "react";
import { Link } from "react-router-dom";

function TripExplorer() {
  const trips = [
    {
      name: "Goa",
      price: 7000,
      duration: 3,
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200",
      description:
        "Enjoy beautiful beaches, water sports, nightlife, and amazing sunsets.",
      room: "Included",
      food: "Included",
    },
    {
      name: "Agra",
      price: 9000,
      duration: 4,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200",
      description:
        "Visit the world-famous Taj Mahal and explore Mughal history and culture.",
      room: "Included",
      food: "Included",
    },
    {
      name: "Manali",
      price: 6000,
      duration: 3,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
      description:
        "Experience beautiful mountains, adventure activities, and peaceful valleys.",
      room: "Included",
      food: "Included",
    },
    {
      name: "Ooty",
      price: 7000,
      duration: 4,
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200",
      description:
        "Relax in tea gardens, lakes, waterfalls, and cool hill-station weather.",
      room: "Included",
      food: "Included",
    },
    {
      name: "Munnar",
      price: 7000,
      duration: 5,
      image:
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200",
      description:
        "Explore tea plantations, waterfalls, misty hills, and beautiful nature.",
      room: "Included",
      food: "Included",
    },
    {
      name: "Ladakh",
      price: 10000,
      duration: 4,
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200",
      description:
        "Discover breathtaking mountains, crystal-clear lakes, monasteries, and road trips.",
      room: "Included",
      food: "Included",
    },
  ];

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("10000");
  const [duration, setDuration] = useState("All");
  const [sort, setSort] = useState("default");

  // Filter trips
  let filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPrice = trip.price <= Number(maxPrice);

    const matchesDuration =
      duration === "All" ||
      trip.duration === Number(duration);

    return matchesSearch && matchesPrice && matchesDuration;
  });

  // Sort trips
  if (sort === "low") {
    filteredTrips.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filteredTrips.sort((a, b) => b.price - a.price);
  }

  if (sort === "duration") {
    filteredTrips.sort((a, b) => a.duration - b.duration);
  }

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setMaxPrice("10000");
    setDuration("All");
    setSort("default");
  };

  // Trip details
  const showDetails = (trip) => {
    alert(
      `${trip.name}

Price: ₹${trip.price.toLocaleString("en-IN")}
Duration: ${trip.duration} Days
Room: ${trip.room}
Food: ${trip.food}

${trip.description}`
    );
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-5">

          <h1 className="fw-bold text-success">
            Explore Trips
          </h1>

          <p className="text-muted fs-5">
            Find the perfect educational trip for your college
          </p>

        </div>

        {/* ================= FILTER CARD ================= */}
        <div className="card shadow-sm p-4 mb-4">

          <div className="row g-3">

            {/* Search */}
            <div className="col-lg-4 col-md-6">

              <label className="form-label fw-bold">
                Search Destination
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search Goa, Agra, Manali..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* Price */}
            <div className="col-lg-3 col-md-6">

              <label className="form-label fw-bold">
                Maximum Price
              </label>

              <select
                className="form-select"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >

                <option value="10000">
                  All Prices
                </option>

                <option value="6000">
                  Up to ₹6,000
                </option>

                <option value="7000">
                  Up to ₹7,000
                </option>

                <option value="9000">
                  Up to ₹9,000
                </option>

              </select>

            </div>

            {/* Duration */}
            <div className="col-lg-2 col-md-6">

              <label className="form-label fw-bold">
                Duration
              </label>

              <select
                className="form-select"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >

                <option value="All">
                  All
                </option>

                <option value="3">
                  3 Days
                </option>

                <option value="4">
                  4 Days
                </option>

                <option value="5">
                  5 Days
                </option>

              </select>

            </div>

            {/* Sort */}
            <div className="col-lg-3 col-md-6">

              <label className="form-label fw-bold">
                Sort By
              </label>

              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >

                <option value="default">
                  Recommended
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

                <option value="duration">
                  Shortest Duration
                </option>

              </select>

            </div>

          </div>

          {/* Reset Button */}
          <div className="text-end mt-3">

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearFilters}
            >
              Reset Filters
            </button>

          </div>

        </div>

        {/* ================= RESULT COUNT ================= */}
        <div className="mb-4">

          <h5>
            {filteredTrips.length} Trip
            {filteredTrips.length !== 1 ? "s" : ""} Found
          </h5>

        </div>

        {/* ================= TRIP CARDS ================= */}
        <div className="row g-4">

          {filteredTrips.length > 0 ? (

            filteredTrips.map((trip) => (

              <div
                className="col-xl-4 col-lg-4 col-md-6"
                key={trip.name}
              >

                <div className="card shadow h-100 border-0">

                  {/* Image */}
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="card-img-top"
                    style={{
                      height: "230px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">

                    {/* Destination */}
                    <h3 className="card-title fw-bold">
                      {trip.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted">
                      {trip.description}
                    </p>

                    {/* Trip Information */}
                    <div className="mb-3">

                      <div className="mb-2">
                        <strong>💰 Price:</strong>{" "}

                        <span className="text-success fw-bold">
                          ₹{trip.price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="mb-2">
                        <strong>📅 Duration:</strong>{" "}
                        {trip.duration} Days
                      </div>

                      <div className="mb-2 text-success">
                        <strong>🏨 Room:</strong>{" "}
                        {trip.room}
                      </div>

                      <div className="mb-2 text-success">
                        <strong>🍽 Food:</strong>{" "}
                        {trip.food}
                      </div>

                    </div>

                    {/* Price Information */}
                    <div className="alert alert-info py-2">

                      <small>
                        Price includes room and food.
                      </small>

                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-2 mt-auto">

                      <Link
                        to={`/booking?place=${encodeURIComponent(
                          trip.name
                        )}`}
                        className="btn btn-success flex-grow-1"
                      >
                        Book Now
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => showDetails(trip)}
                      >
                        Details
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))

          ) : (

            /* ================= NO RESULTS ================= */
            <div className="col-12">

              <div className="card shadow-sm p-5 text-center">

                <h3 className="text-danger">
                  No Trips Found
                </h3>

                <p className="text-muted">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  className="btn btn-secondary mx-auto"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default TripExplorer;