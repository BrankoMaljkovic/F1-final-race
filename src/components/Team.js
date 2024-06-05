import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spin, Card, Image, Table } from 'antd';
import Flag from 'react-flagkit';
import { getFlagCode, getPositionColor } from '../helpers';
import Breadcrumbs from './Breadcrumb';

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
  }, [teamId]);

  if (loading) {
    return <Spin />;
  }

  const breadcrumbs = [
    {label: 'Home'},
    { label: 'Drivers', link: '/' },
    { label: 'Teams', link: '/teams '},
    { label: 'Races', link: '/races' },
    ];

  return (
    <div className='team-container'>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
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
            race: race.raceName,
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
            totalPoints: parseInt(race.Results[0].position) + parseInt(race.Results[1].position),
          }))}
          columns={[
            { title: 'Round', dataIndex: 'round', key: 'round' ,
            sorter: (a, b) => a.round - b.round,
            },
            { title: 'Grand Prix', dataIndex: 'grandPrix', key: 'grandPrix', 
            filters: [
              ...teamResults.map((race, i) => { // Spread Operator - za prikaz elemenata objekta (u suprotnom se prikazuje ceo objekat)
                  return (
                      {
                          text: `${race.raceName}`,
                          value: `${race.raceName}`
                      })
                  })
              ],
              filterMode: 'tree',
          filterSearch: true,
          onFilter: (value, record) => record.race.includes(value), // setujemo record.name
          width: '30%',
            },
            {
              title: `${teamResults[0].Results[0].Driver.familyName}`,
              dataIndex: 'driver1Position',
              key: 'driver1Position',
              sorter: (a, b) => a.driver1Position - b.driver1Position,
              render: (text) => (
                <div style={{ backgroundColor: getPositionColor(text) }}>
                {text}
                </div>
              ),
            },
            {
              title: `${teamResults[0].Results[1].Driver.familyName}`,
              dataIndex: 'driver2Position',
              key: 'driver2Position',
              sorter: (a, b) => a.driver2Position - b.driver2Position,
              render: (text) => (
                <div style={{ backgroundColor: getPositionColor(text) }}>
                {text}
                </div>
              ),
            },
            {
              title: 'Total Points',
              dataIndex: 'totalPoints',
              key: 'totalPoints',
              sorter: (a, b) => a.totalPoints - b.totalPoints,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Team;
