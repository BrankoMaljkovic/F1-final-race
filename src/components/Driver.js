import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Table, Card, Image } from 'antd';
import axios from 'axios';
import { getFlagCode } from '../helpers';
import Flag from 'react-flagkit';

const Driver = (props) => {
  const [driverDetails, setDriverDetails] = useState({});
  const [driverRaces, setDriverRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { driverId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverDetailsResponse = await axios.get(
          `http://ergast.com/api/f1/2013/drivers/${driverId}/driverStandings.json`
        );
        const driverRacesResponse = await axios.get(
          `http://ergast.com/api/f1/2013/drivers/${driverId}/results.json`
        );

        setDriverDetails(
          driverDetailsResponse.data.MRData.StandingsTable.StandingsLists[0]
            .DriverStandings[0]
        );
        setDriverRaces(driverRacesResponse.data.MRData.RaceTable.Races);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [driverId]);

  if (loading) {
    return <Spin />;
  }

  console.log('zastava log', driverDetails);

  return (
    <div className='driver-container'>
      <Card title='Driver Details' className='driver-details-card'>
        <Image
          src={`${
            process.env.PUBLIC_URL
          }/img/${driverDetails.Driver.familyName.toLowerCase()}.jpg`}
        />

        <Flag
          size={50}
          country={`${getFlagCode(
            props.flags,
            driverDetails.Driver.nationality
          )}`}
        />
        <p>Team: {driverDetails.Constructors[0].name}</p>
        <p>Birth: {driverDetails.Driver.dateOfBirth}</p>
        <p>
          Biography: <a href={driverDetails.Driver.url}>Link to Biography</a>
        </p>
      </Card>

      <Table
        dataSource={driverRaces.map((race) => ({
          key: race.round,
          round: race.round,
          grandPrix: (
            <div>
              <Flag
                size={50}
                country={`${getFlagCode(
                  props.flags,
                  race.Circuit.Location.country
                )}`}
                style={{ marginRight: '5px' }}
              />
              {race.raceName}
            </div>
          ),
          team: race.Results[0].Constructor.name,
          grid: race.Results[0].grid,
          racePosition: race.Results[0].position,
        }))}
        columns={[
          { title: 'Round', dataIndex: 'round', key: 'round' },
          { title: 'Grand Prix', dataIndex: 'grandPrix', key: 'grandPrix' },
          { title: 'Team', dataIndex: 'team', key: 'team' },
          { title: 'Grid', dataIndex: 'grid', key: 'grid' },
          {
            title: 'Race Position',
            dataIndex: 'racePosition',
            key: 'racePosition',
          },
        ]}
      />
    </div>
  );
};

export default Driver;
