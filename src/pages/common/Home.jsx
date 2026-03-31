import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/public/Home.css";




const stats = [
  { title: "Total Students", value: 120 },
  { title: "Active Managers", value: 15 },
  { title: "Upcoming Events", value: 8 },
  { title: "Problems Solved", value: 350 },
];

const Home = () => {
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
   navigate("/auth/student/login");
  }

  return (
    <div className="container py-5 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-3"
      >
        Welcome to Hackathon Platform
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="lead mb-5"
      >
        Track your events, problems, certificates, and more in a single dashboard.
      </motion.p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="col"
            whileHover={{ scale: 1.05 }}
          >
            <div className="card text-white bg-primary h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{stat.title}</h5>
                <p className="display-6">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={handleDashboardRedirect}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-lg btn-outline-primary"
      >
        Go to Your Dashboard
      </motion.button>
    </div>
  );
};

export default Home;