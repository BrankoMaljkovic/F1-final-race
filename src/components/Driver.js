import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';

export default function Driver(props) {
  const [driverDetails, setDriverDetails] = useState({});
  const [driverRaces, setDriverRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { driverId } = useParams();

  useEffect(() => {
    const getDriverDetails = async () => {
      const url = `http://ergast.com/api/f1/2013/drivers/${driverId}/driverStandings.json`;
      const response = await axios.get(url);
      console.log(
        'response final',
        response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]
      );

      setDriverDetails(
        response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]
      );
      setLoading(false);
    };

    const getDriverRaces = async () => {
      const url = `http://ergast.com/api/f1/2013/drivers/${driverId}/results.json`;
      const response = await axios.get(url);

      console.log('albertpark', response.data.MRData.RaceTable);

      setDriverRaces(response.data.MRData.RaceTable.Races);
    };

    getDriverDetails();
    getDriverRaces();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {/* Driver card */}
      <div>
        <div className='cards'>
          <h1>Driver Details</h1>
          <img
            src={`${
              process.env.PUBLIC_URL
            }/img/${driverDetails.Driver.familyName.toLowerCase()}.jpg`}
            alt='Driver_Image'
          />
          <Flag
            country={getFlagCode(props.flags, driverDetails.Driver.nationality)}
          />
          <p>
            Name:{' '}
            {`${driverDetails.Driver.givenName} ${driverDetails.Driver.familyName} `}{' '}
          </p>
          <p>Nationality: {driverDetails.Driver.nationality}</p>
          <p>Team: {driverDetails.Constructors[0].name}</p>
          <p>Birth: {driverDetails.Driver.dateOfBirth}</p>
          <p>
            Biography: <a href={driverDetails.Driver.url}>Link to Biography</a>
          </p>
        </div>

        {/* Driver 1st table */}
        <div className='table'>
          <h2>Driver Races</h2>
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Grand Prix</th>
                <th>Team</th>
                <th>Grid</th>
                <th>Race</th>
              </tr>
            </thead>
            <tbody>
              {driverRaces.map((race, index) => (
                //console.log(`race`, driverRaces)
                <tr key={index}>
                  <td>{race.round}</td>
                  <td>
                    <Flag
                      country={getFlagCode(
                        props.flags,
                        race.Circuit.Location.country
                      )}
                    />
                    {race.raceName}
                  </td>
                  <td>{race.Results[0].Constructor.name}</td>
                  <td>{race.Results[0].grid}</td>
                  <td>{race.Results[0].position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
