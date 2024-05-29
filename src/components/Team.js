import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Team() {
  const [teamDetails, setTeamDetails] = useState({});
  const [teamResults, setTeamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverNames, setDriverNames] = useState([]);
  const { teamId } = useParams();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamResponse = await axios.get(
          `https://ergast.com/api/f1/2013/constructors/${teamId}/constructorStandings.json`
        );
        const teamStandings =
          teamResponse.data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings[0];
        setTeamDetails({
          country: teamStandings.Constructor.nationality,
          position: teamStandings.position,
          points: teamStandings.points,
        });

        const driversResponse = await axios.get(
          `https://ergast.com/api/f1/2013/constructors/${teamId}/drivers.json`
        );
        const drivers = driversResponse.data.MRData.DriverTable.Drivers.map(
          (driver) => ({
            driverId: driver.driverId,
            name: `${driver.givenName} ${driver.familyName}`,
          })
        );
        setDriverNames(drivers);

        const resultsResponse = await axios.get(
          `https://ergast.com/api/f1/2013/constructors/${teamId}/results.json`
        );
        const races = resultsResponse.data.MRData.RaceTable.Races.map(
          (race) => {
            const resultObj = {
              round: race.round,
              raceName: race.raceName,
              points: race.Results[0].points,
            };
            race.Results.forEach((result) => {
              resultObj[result.Driver.driverId] = result.position;
            });
            return resultObj;
          }
        );
        setTeamResults(races);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div>
        <h1>Team Details</h1>
        <p>Country: {teamDetails.country}</p>
        <p>Position: {teamDetails.position}</p>
        <p>Points: {teamDetails.points}</p>

        <h2>Team Results</h2>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Grand Prix</th>
              {driverNames.map((driver) => (
                <th key={driver.driverId}>{driver.name}</th>
              ))}
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {teamResults.map((race, index) => (
              <tr key={index}>
                <td>{race.round}</td>
                <td>{race.raceName}</td>
                {driverNames.map((driver) => (
                  <td key={driver.driverId}>{race[driver.driverId]}</td>
                ))}
                <td>{race.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
