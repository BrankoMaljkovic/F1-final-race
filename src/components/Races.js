import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Races() {
  console.log(`races`);

  const [races, setRaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://ergast.com/api/f1/2013/results/1.json'
        );
        const raceData = response.data.MRData.RaceTable.Races;
        setRaces(raceData);
      } catch (error) {
        console.error('Error fetching the race data', error);
      }
    };
    fetchData();
  }, []);

  const handleRoundId = (round) => {
    console.log('handleRoundId', round);
    navigate(`/race/${round}`);
  };

  return (
    <div>
      <h1>Race Calendar - 2013</h1>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Grand Prix</th>
            <th>Circuit</th>
            <th>Date</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {races.map((race, index) => (
            <tr key={index} onClick={() => handleRoundId(race.round)}>
              <td>{race.round}</td>
              <td>{race.raceName}</td>
              <td>{race.Circuit.circuitName}</td>
              <td>{race.date}</td>
              <td>{race.Results[0].Driver.familyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
