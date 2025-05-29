import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './Components/SignUp';

import LogIn from './Components/signin';
import ExplorePakistan from './Components/userDashBoard';
import TravelHistory from './Components/TravelHistory'; // Import TravelHistory
import BudgetCalculator from './Components/budgetCalculator';
import Destinations from './Components/destinations';  // Import BudgetCalculator
import Souvenirs from './Components/souvenirs'; 
import Reports from './Components/reports';
import SafetyGuidelines from './Components/safetyGuidelines';
import AdminDashboard from './Components/adminDashBoard'; 
import AdminUsers from './Components/adminUsers';
import AdminDestinations from './Components/adminDestinations';
import AdminSouvenirs from './Components/adminSouvenirs';
import AdminSafetyGuidelines from './Components/adminSafetyGuidelines';
import React from 'react';






function HomeWrapper() {
    const navigate = useNavigate();

    const style = {
        container: {
            
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundImage:"url(background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: "white",
        },

        subContainer: {
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "1px 1px 6px rgba(255, 255, 255, 0.3) ,-1px -1px 6px rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(151, 151, 151, 0.1)",
            webkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "darkgreen",
        },

        button: {
            padding: "10px 20px",
            fontSize: "16px",
            color: "white",
            backgroundColor: "darkgreen",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            margin: "10px",
        }
    };

    return (
        <div style={style.container}>
            <div style={style.subContainer}>
                <h1 style={{margin:"0.8rem 1rem"}}>Welcome to our Explore-Pakistan</h1>
                <p style={{opacity:"0.8"}}>Please choose one of the below options</p>
                <div>
                <button style={style.button} onClick={() => navigate('/signup')}>Sign Up</button>
                <button style={style.button} onClick={() => navigate('/login')}>Log In</button>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<HomeWrapper />} />

                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/dashBoard" element={<ExplorePakistan />} />
                <Route path="/history" element={<TravelHistory />} /> {/* Add this route */}
                <Route path="/budget" element={<BudgetCalculator />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/souvenirs" element={<Souvenirs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
                <Route path="/adminDashBoard" element={<AdminDashboard  />} />
                <Route path="/adminUsers" element={<AdminUsers />} />
                <Route path="/adminDestinations" element={<AdminDestinations />} />
                <Route path="/adminSouvenirs" element={<AdminSouvenirs />} />
                <Route path="/adminSafetyGuidelines" element={<AdminSafetyGuidelines />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Router>
        
    );
}

export default App;
