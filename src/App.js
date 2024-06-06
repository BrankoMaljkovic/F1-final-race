import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Driver from './components/Driver';
import Drivers from './components/Drivers';
import Teams from './components/Teams';
import Team from './components/Team';
import Races from './components/Races';
import Race from './components/Race';
import axios from 'axios';
import { useEffect, useState } from 'react';
import SeasonYear from './components/SeasonYear';
import Home from './components/Home';

export default function App() {
  const backgroundStyle = {
    backgroundcolor: 'black',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh',
  };
  const [flagsList, setFlagsList] = useState([]);

  useEffect(() => {
    getFlagsList();
  }, []);

  const getFlagsList = async () => {
    const url =
      'https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json';

    const response = await axios.get(url);
    setFlagsList(response.data);
  };

  return (
    <div className='App' style={backgroundStyle}>
      <Router>
        <nav className='top-navigation'>
          <img src='../img/Logo.jpg' alt='' />
          <div className='right-nav'>
            <ul>
              <li>
                <Link to='/drivers'>Drivers</Link>
                <Link to='/teams'>Teams</Link>
                <Link to='/races'>Races</Link>
              </li>
            </ul>
            <div className='year-select'>
              <SeasonYear />
            </div>
          </div>
        </nav>

        <div className='main-view'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/drivers' element={<Drivers flags={flagsList} />} />
            <Route
              path='/driverDetails/:driverId'
              element={<Driver flags={flagsList} />}
            />
            <Route path='/teams' element={<Teams flags={flagsList} />} />
            <Route
              path='/teamDetails/:teamId'
              element={<Team flags={flagsList} />}
            />
            <Route path='/races' element={<Races flags={flagsList} />} />
            <Route path='/race/:raceId' element={<Race flags={flagsList} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
