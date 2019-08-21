import React from 'react';

import './index.css'

const eventItem = props => (
    <li className="events_list-item" key={props.eventId}>
        <div> 
            <h1> {props.title} </h1> 
            <h2> $fuck.css </h2>
        </div>
        <div>
            <button class="btn"> View Details </button>
            <p> You're the owner of this event </p>
        </div>
    </li>
);

export default eventItem;