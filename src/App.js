import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Driver from "./components/Driver";
import Drivers from "./components/Drivers";
import Teams from "./components/Teams";
import Team from "./components/Team";
import Races from "./components/Races";
import Race from "./components/Race";


export default function App() {
  return (
    <div className="App">
      <Router>
                <nav className="top-navigation" >
                    <ul>
                        <li>
                            <Link to="/">Comments</Link>
                            <Link to="/driver">Comments</Link>
                            <Link to="/teams">Comments</Link>
                            <Link to="/team">Comments</Link>
                            <Link to="/races">Comments</Link>
                            <Link to="/race">Comments</Link>
                        </li>
                    </ul>
                </nav>
            <Routes>
                <Route path="/" element={<Drivers />} />
                <Route path="/driver" element={<Driver />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/team" element={<Team />} />
                <Route path="/races" element={<Races />} />
                <Route path="/race" element={<Race />} />
            </Routes>

            </Router>

    </div>
  );
}
