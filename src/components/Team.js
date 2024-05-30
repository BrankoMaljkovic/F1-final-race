import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';

export default function Team(props) {
  const [teamDetails, setTeamDetails] = useState({});
  const [teamResults, setTeamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { teamId } = useParams();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamResponse = await axios.get(
          `https://ergast.com/api/f1/2013/constructors/${teamId}/constructorStandings.json`
        );
        const resultsResponse = await axios.get(
          `https://ergast.com/api/f1/2013/constructors/${teamId}/results.json`
        );
        const teamStandings =
          teamResponse.data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings[0];
        const races = resultsResponse.data.MRData.RaceTable.Races;

        setTeamResults(races);
        setTeamDetails(teamStandings);
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

  console.log('zastavica za team ', teamDetails.Constructor.nationality);
  return (
    <div>
      <div>
        {/* Team card */}
        <div className="cards">
          <h1>Team Details</h1>
          <img
            src={require(`../img/${teamDetails.Constructor.constructorId.toLowerCase()}.png`)}
            alt=''
          />
          <Flag
            country={getFlagCode(
              props.flags,
              teamDetails.Constructor.nationality
            )}
          />
          <p>Country: {teamDetails.Constructor.nationality}</p>
          <p>Position: {teamDetails.position}</p>
          <p>Points: {teamDetails.points}</p>
          <p>
            History: <a href={teamDetails.Constructor.url}>History</a>
          </p>
        </div>


        {/* Team 1st table */}

        <div className="table">
          <h2>Team Results</h2>
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Grand Prix</th>
                <th>{teamResults[0].Results[0].Driver.familyName}</th>
                <th>{teamResults[0].Results[1].Driver.familyName}</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {teamResults.map((race, index) => (
                //race.Circuit.Location.country
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
                  <td>{race.Results[0].position}</td>
                  <td>{race.Results[1].position}</td>
                  <td>{race.Results[0].position + race.Results[1].position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
