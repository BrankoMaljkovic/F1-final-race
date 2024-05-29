import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Teams() {
  const [constructors, setConstructors] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState (true);

  useEffect(() => {
    axios
      .get('http://ergast.com/api/f1/2013/constructorStandings.json')
      .then((response) => {
        console.log('Fetched constructor standings:', response.data);
        setConstructors(
          response.data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings
        );

        setLoading(false);

      })
      .catch((error) => {
        console.error('Error fetching constructor standings:', error);
      });
  }, []);

  const handleConstructorClick = (id) => {
    console.log(`Constructor clicked: ${id}`);
    navigate(`/teamDetails/${id}`);
  };

  

  if(loading){
    return <h1>Loading...</h1>
  }

  return (
    <div className='App'>
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
                <td
                onClick={() =>
                  handleConstructorClick(
                    constructor.Constructor.constructorId
                  )
                }
                >{index + 1}</td>
                <td
                  onClick={() =>
                    handleConstructorClick(
                      constructor.Constructor.constructorId
                    )
                  }
                >
                  {constructor.Constructor.name}
                </td>
                <td
                onClick={() =>
                  handleConstructorClick(
                    constructor.Constructor.constructorId
                  )
                }
                >{constructor.points}</td>
                <td>
                  <a
                    href={constructor.Constructor.url}
                    target='blank'
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
    </div>
  );
}
