import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Driver from './components/Driver';
import Drivers from './components/Drivers';
import Teams from './components/Teams';
import Team from './components/Team';
import Races from './components/Races';
import Race from './components/Race';
import axios from 'axios';

export default function App() {
  const [flagsList, setFlagsList] = useState([]);

  useEffect(()=>{
    getFlagsList();
  }, []);

  const getFlagsList = async () => {
    const url = "https://raw.githubusercontent.com/Dinuks/country-nationality-list/master/countries.json";

    const response = await axios.get(url);
    setFlagsList(response.data);
  }

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
          <Route path='/race/:raceId' element={<Race />} />
        </Routes>
      </Router>
    </div>
  );
}
