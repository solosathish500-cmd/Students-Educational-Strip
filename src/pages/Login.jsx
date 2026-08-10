import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const destinations = [
    {
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=2000&q=90",
      image2:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=90",
      description:
        "Enjoy beautiful beaches, water sports, and sunsets.",
    },

    {
      name: "Agra",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=2000&q=90",
      image2:
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=90",
      description:
        "Visit the world-famous Taj Mahal and Mughal monuments.",
    },

    {
      name: "Manali",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000&q=90",
      image2:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=90",
      description:
        "Experience snow-covered mountains and adventure sports.",
    },

    {
      name: "Ooty",
      image:
        "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=2000&q=90",
      image2:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1000&q=90",
      description:
        "Relax in tea gardens, lakes, and cool hill station weather.",
    },

    {
      name: "Munnar",
      image:
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=2000&q=90",
      image2:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=90",
      description:
        "Explore tea plantations, waterfalls, and misty hills.",
    },

    {
      name: "Ladakh",
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=2000&q=90",
      image2:
        "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000&q=90",
      description:
        "Discover breathtaking mountains, crystal-clear lakes, monasteries, and thrilling road trips.",
    },
  ];

  /* =========================================
     HERO SLIDESHOW
  ========================================= */

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((previous) => {
        return (previous + 1) % destinations.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [destinations.length]);

  return (
    <>
      {/* =========================================
          ANIMATION CSS
      ========================================= */}

      <style>
        {`
          @keyframes backgroundZoom {
            0% {
              transform: scale(1);
            }

            100% {
              transform: scale(1.08);
            }
          }

          @keyframes exploreGlow {
            0% {
              transform: scale(1);
              text-shadow:
                0 0 5px white,
                0 0 10px rgba(0, 191, 255, 0.5);
            }

            50% {
              transform: scale(1.05);
              text-shadow:
                0 0 10px white,
                0 0 20px #00bfff,
                0 0 35px #00bfff,
                0 0 50px #00bfff;
            }

            100% {
              transform: scale(1);
              text-shadow:
                0 0 5px white,
                0 0 10px rgba(0, 191, 255, 0.5);
            }
          }

          @keyframes heroContent {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .hero-background {
            animation:
              backgroundZoom 10s ease-in-out infinite alternate;
          }

          .hero-content {
            animation:
              heroContent 1.5s ease-out;
          }

          .explore-title {
            animation:
              exploreGlow 3s ease-in-out infinite;
          }

          .hero-button {
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .hero-button:hover {
            transform: scale(1.08);
            box-shadow:
              0 8px 25px rgba(0, 0, 0, 0.4);
          }

          .destination-dot {
            transition:
              all 0.5s ease;
          }

          .destination-card {
            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          .destination-card:hover {
            transform: translateY(-8px);
            box-shadow:
              0 12px 30px rgba(0, 0, 0, 0.2) !important;
          }
        `}
      </style>

      {/* =========================================
          HERO SECTION
      ========================================= */}

      <div
        className="position-relative d-flex align-items-center justify-content-center text-white text-center"
        style={{
          height: "550px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}

        <div
          key={currentImage}
          className="hero-background position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url("${destinations[currentImage].image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            opacity: 1,
            transition: "background-image 1.5s ease-in-out",
            zIndex: 0,
          }}
        ></div>

        {/* Dark Overlay */}

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
            zIndex: 1,
          }}
        ></div>

        {/* Hero Content */}

        <div
          className="hero-content position-relative"
          style={{
            zIndex: 2,
          }}
        >
          <h1
            className="explore-title display-2 fw-bold mb-3"
            style={{
              display: "inline-block",
              letterSpacing: "2px",
            }}
          >
            Explore India
          </h1>

          <p
            className="fs-4 fw-normal"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            Educational Trips for College Students
          </p>

          {/* Booking Button */}

          <Link
            to="/booking"
            className="hero-button btn btn-warning btn-lg mt-3 px-4 py-2"
          >
            Book Your Trip
          </Link>

          {/* Destination Indicators */}

          <div className="mt-4">
            {destinations.map((place, index) => (
              <span
                key={place.name}
                className="destination-dot"
                style={{
                  display: "inline-block",
                  width:
                    currentImage === index
                      ? "28px"
                      : "10px",
                  height: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    currentImage === index
                      ? "white"
                      : "rgba(255,255,255,0.55)",
                  margin: "0 4px",
                }}
              ></span>
            ))}
          </div>

          {/* Current Destination */}

          <p
            className="mt-2 mb-0 fw-bold"
            style={{
              fontSize: "17px",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.9)",
            }}
          >
            {destinations[currentImage].name}
          </p>
        </div>
      </div>

      {/* =========================================
          POPULAR DESTINATIONS
      ========================================= */}

      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">
          Popular Destinations
        </h2>

        <div className="row g-4">
          {destinations.map((place) => (
            <div
              className="col-lg-4 col-md-6"
              key={place.name}
            >
              <Link
                to={`/booking?place=${place.name}`}
                className="text-decoration-none text-dark"
              >
                <div className="destination-card card shadow h-100">
                  {/* First Image */}

                  <img
                    src={place.image}
                    alt={place.name}
                    className="card-img-top"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Second Image */}

                  {place.image2 && (
                    <img
                      src={place.image2}
                      alt={`${place.name} view`}
                      className="card-img-top"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {/* Card Body */}

                  <div className="card-body text-center">
                    <h4>{place.name}</h4>

                    <p>{place.description}</p>

                    <button className="btn btn-success">
                      Book Now
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;