import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import EventItem from './EventItem/index'
import './index.css'

const EVENTS = gql`
    query {
        events {
            _id
            title
            description
            date
            price
            creator {
                _id
            }
        }
    }
`;

const eventList = props => {
    return (
        <ul className="event_list">
            <Query query={EVENTS}>
            {({data,loading,error}) => {
                if(error) return <h1> Unable to load user info.</h1>
                if(loading) return <h1> Loading... </h1>
                return (
                    data.events.map(event => {
                        return (
                            <EventItem 
                                key={event._id} 
                                eventId={event._id} 
                                title={event.title} 
                                userId={props.authUserId}
                                creatorId={event.creator._id} 
                            />
                        );
                    })
                )
            }}     
            </Query>
        </ul>
    );
}

export default eventList;