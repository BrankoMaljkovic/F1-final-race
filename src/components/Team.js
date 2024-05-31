import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spin, Card, Image, Table } from 'antd';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';

const Team = (props) => {
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
    return <Spin />;
  }

  return (
    <div className='team-container'>
      {/* Team card */}
      <Card
        title='Team Details'
        className='teams-details-card'
        style={{ marginBottom: 20 }}
      >
        <Image
          src={`${
            process.env.PUBLIC_URL
          }/img/${teamDetails.Constructor.constructorId.toLowerCase()}.png`}
          alt='Driver_Image'
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
      </Card>

      {/* Team results table */}
      <Card title='Team Results'>
        <Table
          dataSource={teamResults.map((race) => ({
            key: race.round,
            round: race.round,
            grandPrix: (
              <div>
                <Flag
                  country={getFlagCode(
                    props.flags,
                    race.Circuit.Location.country
                  )}
                />
                {race.raceName}
              </div>
            ),
            driver1Position: race.Results[0].position,
            driver2Position: race.Results[1].position,
            totalPoints: race.Results[0].position + race.Results[1].position,
          }))}
          columns={[
            { title: 'Round', dataIndex: 'round', key: 'round' },
            { title: 'Grand Prix', dataIndex: 'grandPrix', key: 'grandPrix' },
            {
              title: `${teamResults[0].Results[0].Driver.familyName}`,
              dataIndex: 'driver1Position',
              key: 'driver1Position',
            },
            {
              title: `${teamResults[0].Results[1].Driver.familyName}`,
              dataIndex: 'driver2Position',
              key: 'driver2Position',
            },
            {
              title: 'Total Points',
              dataIndex: 'totalPoints',
              key: 'totalPoints',
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Team;
