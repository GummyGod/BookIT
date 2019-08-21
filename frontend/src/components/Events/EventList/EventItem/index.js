import React from 'react';

import './index.css'

const eventItem = props => console.log(props) || (
    <li className="events_list-item" key={props.eventId}>
        <div> 
            <h1> {props.title} </h1> 
            <h2> $fuck.css </h2>
        </div>
        <div>
            {props.userId === props.creatorId ? 
            <p> You're the owner of this event </p> :
            <button className="btn"> View Details </button>}
        </div>
    </li>
);

export default eventItem;