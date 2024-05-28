import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Driver from './components/Driver';
import Drivers from './components/Drivers';
import Teams from './components/Teams';
import Team from './components/Team';
import Races from './components/Races';
import Race from './components/Race';

export default function App() {
  return (
    <div className='App'>
      <Router>
        <nav className='top-navigation'>
          <ul>
            <li>
              <Link to='/'>Drivers</Link>
              <Link to='/teams'>Teams</Link>
              <Link to='/races'>Races</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path='/' element={<Drivers />} />
          <Route path='/driverDetails/:driverId' element={<Driver />} />
          <Route path='/teams' element={<Teams />} />
          <Route path='/teamDetails/:teamId' element={<Team />} />
          <Route path='/races' element={<Races />} />
          <Route path='/raceDetails/:raceId' element={<Race />} />
        </Routes>
      </Router>
    </div>
  );
}
