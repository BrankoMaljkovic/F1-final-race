import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Spin, Card, Table } from 'antd';
import Flag from 'react-flagkit';
import { getFlagCode, getPositionColor } from '../helpers';
import Breadcrumbs from './Breadcrumb';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import F1Loader from './F1Loader';

const Race = (props) => {
  const { raceId } = useParams();
  const [qualifyingResults, setQualifyingResults] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qualifyingResponse, raceResponse] = await Promise.all([
          axios.get(`http://ergast.com/api/f1/2013/${raceId}/qualifying.json`),
          axios.get(`http://ergast.com/api/f1/2013/${raceId}/results.json`),
        ]);

        const qualifyingData =
          qualifyingResponse.data.MRData.RaceTable.Races[0];
        const raceData = raceResponse.data.MRData.RaceTable.Races[0].Results;

        setQualifyingResults(qualifyingData);
        setRaceResults(raceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };
    fetchData();
  }, []);

  const getBestTime = (result) => {
    const nizBestTime = [result.Q1, result.Q2, result.Q3];
    const sortBestTime = nizBestTime.sort();
    return sortBestTime[0];
  };

  if (loading) {
    return <F1Loader />;
  }

  // Breadcrumb - promenjiva sa detaljima
  const breadcrumbs = [
    { label: 'Home', link: '/' },
    { label: 'Races', link: '/races' },
    { label: `${qualifyingResults.raceName}` },
  ];

  let uniqueTeams = [
    ...new Set(raceResults.map((item) => item.Constructor.name)),
  ]; // UNIQUE Team list
  console.log(`unique`, uniqueTeams);

  console.log(`QualifyingResults`, qualifyingResults);

  return (
    <div>
      <div>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className='race-container'>
        {/* Race card */}
        <Card
          title='Race Details'
          className='race-details-card'
          style={{ marginBottom: 20 }}
        >
          <Flag
            size={50}
            country={getFlagCode(
              props.flags,
              qualifyingResults.Circuit.Location.country
            )}
          />
          <p>Name of Race: {qualifyingResults.raceName}</p>
          <p>Country: {qualifyingResults.Circuit.Location.country}</p>
          <p>Location: {qualifyingResults.Circuit.Location.locality}</p>
          <p>Date of Race: {qualifyingResults.date}</p>
          <p>
            <Flex gap='small' vertical>
              <Flex wrap gap='small'>
                <Button type='primary' icon={<SearchOutlined />}>
                  <a href={qualifyingResults.Circuit.url} target='blank'>
                    Race Report
                  </a>
                </Button>
              </Flex>
            </Flex>
          </p>
        </Card>

        {/* Qualifying Results Table */}
        <Card title='Qualifying Results'>
          <Table
            dataSource={qualifyingResults.QualifyingResults}
            columns={[
              { title: 'Pos', dataIndex: 'position', key: 'position' },
              {
                title: 'Driver',
                dataIndex: 'Driver',
                key: 'Driver',
                render: (driver) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Flag
                      size={50}
                      country={getFlagCode(props.flags, driver.nationality)}
                    />
                    {driver.familyName}
                  </div>
                ),
                filters: [
                  ...qualifyingResults.QualifyingResults.map((driver) => {
                    return {
                      value: `${driver.Driver.familyName}`,
                      text: `${driver.Driver.familyName}`,
                    };
                  }),
                ],
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (value, record) =>
                  record.Driver.familyName.includes(value), // setujemo record.name
                width: '30%',
              },
              {
                title: 'Team',
                dataIndex: 'Constructor',
                key: 'Constructor',
                render: (constructor) => constructor.name,
                filters: [
                  // TREBA DA SE SREDI UNIQUE
                  ...uniqueTeams.map((team) => {
                    return {
                      value: `${team}`,
                      text: `${team}`,
                    };
                  }),
                ],
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (value, record) =>
                  record.Driver.familyName.includes(value), // setujemo record.name
                width: '30%',
              },
              {
                title: 'Best Time',
                dataIndex: '',
                key: 'BestTime',
                render: (result) => getBestTime(result),
              },
            ]}
            pagination={false}
          />
        </Card>

        {/* Race Results Table */}
        <Card title='Race Results'>
          <Table
            dataSource={raceResults}
            columns={[
              { title: 'Pos', dataIndex: 'position', key: 'position' },
              {
                title: 'Driver',
                dataIndex: 'Driver',
                key: 'Driver',
                render: (driver) => (
                  <span>
                    <Flag
                      size={50}
                      country={getFlagCode(props.flags, driver.nationality)}
                    />
                    {driver.familyName}
                  </span>
                ),
                filters: [
                  ...raceResults.map((driver) => {
                    return {
                      value: `${driver.Driver.familyName}`,
                      text: `${driver.Driver.familyName}`,
                    };
                  }),
                ],
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (value, record) =>
                  record.Driver.familyName.includes(value), // setujemo record.name
                width: '30%',
              },
              {
                title: 'Team',
                dataIndex: 'Constructor',
                key: 'Constructor',
                render: (constructor) => constructor.name,
                filters: [
                  // TREBA DA SE SREDI UNIQUE
                  ...uniqueTeams.map((team) => {
                    return {
                      value: `${team}`,
                      text: `${team}`,
                    };
                  }),
                ],
                filterMode: 'tree',
                filterSearch: true,
                onFilter: (value, record) =>
                  record.Driver.familyName.includes(value), // setujemo record.name
                width: '30%',
              },
              {
                title: 'Result',
                dataIndex: 'Time',
                key: 'Result',
                render: (time) => (time ? time.time : 'N/A'),
              },
              {
                title: 'Points',
                dataIndex: 'points',
                key: 'points',
                sorter: (a, b) => a.points - b.points,
                render: (text) => (
                  <div
                    className='color'
                    style={{ backgroundColor: getPositionColor(text) }}
                  >
                    {text}
                  </div>
                ),
              },
            ]}
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
};

export default Race;
