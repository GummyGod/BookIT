import React from 'react';

import './index.css'

const eventItem = props => (
    <li className="events_list-item" key={props.eventId}>
        <div> 
            <h1> {props.title} </h1> 
            <h2> $fuck.css </h2>
        </div>
        <div>
            <button> View Details </button>
        </div>
    </li>
);

export default eventItem;