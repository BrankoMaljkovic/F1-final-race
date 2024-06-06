import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';
import { Table, Input, Space, Select } from 'antd';
import Breadcrumbs from './Breadcrumb';
import F1Loader from './F1Loader';

const { Option } = Select;

export default function Races(props) {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRaces, setFilteredRaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await axios.get(
          'http://ergast.com/api/f1/2013/results/1.json'
        );
        const raceData = response.data.MRData.RaceTable.Races;
        setRaces(raceData);
        setFilteredRaces(raceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching race data:', error);
      }
    };
    fetchRaces();
  }, []);

  const handleRacesId = (id) => {
    // TODO dodati u tabelu ofu funkciju
    console.log(`Constructor clicked: ${id}`);
    navigate(`/race/${id}`);
  };

  // const handleRaceId = (round) => {
  //   navigate(`/race/${round}`);
  // };

  // const handleGrandPrixFilter = (value) => {
  //   const filteredData = races.filter((race) =>
  //     race.raceName.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredRaces(filteredData);
  // };

  // const handleCircuitFilter = (value) => {
  //   const filteredData = races.filter((race) =>
  //     race.Circuit.circuitName.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredRaces(filteredData);
  // };

  if (loading) {
    return < F1Loader />;
  }

  // Breadcrumb - promenjiva sa detaljima
  const breadcrumbs = [
    { label: 'Home', link: '/' },
    { label: 'Races'},
    ];

  let uniqueWiner = [
    ...new Set(races.map((item) => item.Results[0].Driver.familyName)),
  ]; // UNIQUE Team list
  console.log(`uniqueWiner`, uniqueWiner);

  const columns = [
    {
      title: 'Round',
      dataIndex: 'round',
      key: 'round',
    },
    {
      title: 'Grand Prix',
      dataIndex: 'grandPrix',
      key: 'circuitName',
      filters: [
        ...races.map((driver, i) => {
          return {
            text: `${driver.raceName}`,
            value: `${driver.raceName}`,
          };
        }),
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.raceName.includes(value), // setujemo record.name
      width: '30%',
    },
    {
      title: 'Circuit',
      dataIndex: 'circuitName',
      key: 'circuit',
      align: 'center',
      filters: [
        ...races.map((driver, i) => {
          return {
            text: `${driver.Circuit.circuitName}`,
            value: `${driver.Circuit.circuitName}`,
          };
        }),
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.circuitName.includes(value), // setujemo record.name
      width: '30%',
    },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 200, align: 'center',
      render: (text) => <span style={{ width: '200px', display: 'inline-block' }}>{text}</span>, },
    {
      title: 'Winner',
      dataIndex: 'winner',
      key: 'winner',
      filters: [
        ...uniqueWiner.map((driver, i) => {
          return {
            text: `${driver}`,
            value: `${driver}`,
          };
        }),
      ],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (
        value,
        record // console.log(`records`, record),
      ) => record.winner.props.children[1].includes(value),
      width: '30%',
    },
  ];

  const data = races.map((race) => ({
    round: race.round,
    circuitName: race.Circuit.circuitName,
    date: race.date,
    raceName: race.raceName,
    grandPrix: (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Flag
          size={50}
          country={getFlagCode(props.flags, race.Circuit.Location.country)}
        />
        {race.raceName}
      </div>
    ),
    winner: (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Flag
          size={50}
          country={getFlagCode(props.flags, race.Results[0].Driver.nationality)}
        />
        {race.Results[0].Driver.familyName}
      </div>
    ),
  }));

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className='table'>
        <h1></h1>

        <Table
          columns={columns}
          dataSource={data}
          rowClassName={(record, index) => index % 2 === 0 ? 'odd-row' : ''}
          onRow={(record) => ({
            // onRow za svaki red funkcija
            onClick: () => handleRacesId(record.round), // record podaci iz objekta, id je driverId
          })}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
