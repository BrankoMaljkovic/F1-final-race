import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-flagkit';
import { getFlagCode } from "../helpers";

export default function Races(props) {
  console.log(`races`, props.flags);

  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://ergast.com/api/f1/2013/results/1.json'
        );
        const raceData = response.data.MRData.RaceTable.Races;
        setRaces(raceData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching the race data', error);
      }
    };
    fetchData();
  }, []);

  const handleRoundId = (round) => {
    navigate(`/race/${round}`);
  };

  if (loading) {
    return <h1>Loading....</h1>
  }




  return (
    <div>
      {/* Teams 1st table */}
      <div className="table">
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

                <td>
                  <Flag country={getFlagCode(props.flags,
                    race.Circuit.Location.country)} />
                </td>
                <td>{race.round}</td>
                <td>{race.raceName}</td>
                <td>{race.Circuit.circuitName}</td>
                <td>{race.date}</td>
                <td>
                  <Flag country={getFlagCode(props.flags, race.Results[0].Driver.nationality)} />
                  {race.Results[0].Driver.familyName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
