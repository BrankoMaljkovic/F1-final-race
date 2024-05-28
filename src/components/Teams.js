import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Teams() {
  console.log(`teams`);
  const [view, setView] = useState('constructors');
  const [constructorId, setConstructorId] = useState(null);
  const [constructors, setConstructors] = useState([]);
  const [races, setRaces] = useState([]);

  useEffect(() => {
    axios
      .get('http://ergast.com/api/f1/2013/constructorStandings.json')
      .then((response) => {
        console.log('Fetched constructor standings:', response.data);
        setConstructors(
          response.data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings
        );
      })
      .catch((error) => {
        console.error('Error fetching constructor standings:', error);
      });
  }, []);

  useEffect(() => {
    if (constructorId) {
      console.log(`Fetching races for constructor: ${constructorId}`);
      axios
        .get(
          `https://ergast.com/api/f1/2013/constructors/${constructorId}/results.json`
        )
        .then((response) => {
          console.log('Fetched races for constructor:', response.data);
          setRaces(response.data.MRData.RaceTable.Races);
        })
        .catch((error) => {
          console.error('Error fetching races for constructor:', error);
        });
    }
  }, [constructorId]);

  const handleConstructorClick = (id) => {
    console.log(`Constructor clicked: ${id}`);
    setConstructorId(id);
    setView('teamRaces');
  };

  return (
    <div className='App'>
      {view === 'constructors' && (
        <div>
          <h1>Constructor Championship Table - 2013</h1>
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {constructors.map((constructor, index) => (
                <tr key={constructor.Constructor.constructorId}>
                  <td>{index + 1}</td>
                  <td
                    onClick={() =>
                      handleConstructorClick(
                        constructor.Constructor.constructorId
                      )
                    }
                  >
                    {constructor.Constructor.name}
                  </td>
                  <td>{constructor.points}</td>
                  <td>
                    <a
                      href={constructor.Constructor.url}
                      onClick={() =>
                        console.log(`Details clicked for:
                        ${constructor.Constructor.constructorId}`)
                      }
                    >
                      {' '}
                      Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {view === 'teamRaces' && (
        <div>
          <h1>Races for {constructorId} in 2013</h1>
          <ul>
            {races.map((race) => (
              <li key={race.round}>
                {race.raceName} - {race.date}
              </li>
            ))}
          </ul>
          <button onClick={() => setView('constructors')}>
            Back to Constructor Table
          </button>
        </div>
      )}
    </div>
  );
}
