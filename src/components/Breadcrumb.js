import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ breadcrumbs }) => {
    return (
        <div className='breadcrumbs fixed-top'>
            {breadcrumbs.map((breadcrumb, index) => (
                <span key={index}>
                    {index > 0 && <span className='separator'>/</span>}
                    {breadcrumb.link ? (
                        <Link to={breadcrumb.link}>{breadcrumb.label}</Link>
                    ) : (
                        <span>{breadcrumb.label}</span>
                    )}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumbs;

// staviti na svaku komponentu import Breadcrumb from './components/Breadcrumb';

// odredjujemo sta pisemo
// const breadcrumbs = [
//     {label: 'Home'},
//     { label: 'Drivers', link: '/' },
//     { label: 'Teams', link: '/teams '},
//     { label: 'Races', link: '/races' },
//     ];


// pozvati u svakom komponenti
// <Breadcrumb />

// <Breadcrumb breadcrumbs={props.breadcrumbs}/>