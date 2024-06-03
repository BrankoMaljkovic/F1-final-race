import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from '../helpers';
import { Table, Input, Space, Select } from 'antd';

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
    return <h1>Loading...</h1>;
  }

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
    },
    {
      title: 'Circuit',
      dataIndex: 'circuitName',
      key: 'circuit',
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Winner',
      dataIndex: 'winner',
      key: 'winner',
    },
  ];

  const data = filteredRaces.map((race) => ({
    round: race.round,
    circuitName: race.Circuit.circuitName,
    date: race.date,
    grandPrix: (
      <div>
        <Flag
          country={getFlagCode(props.flags, race.Circuit.Location.country)}
        />
        {race.raceName}
      </div>
    ),
    winner: (
      <div>
        <Flag
          country={getFlagCode(props.flags, race.Results[0].Driver.nationality)}
        />
        {race.Results[0].Driver.familyName}
      </div>
    ),
  }));

  return (
    <div>
      <div className='table'>
        <h1></h1>

        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}
