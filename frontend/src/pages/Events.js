import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import AuthContext from '../context/auth-context';

import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop'
import EventList from '../components/Events/EventList/index'

import './Events.css'

const EVENT = gql`
    mutation createEvent($eventInput: EventInput) {
        createEvent( 
            eventInput: $eventInput
        ) {
            _id
            price
            title
            description
            creator {
                _id
                email
            }
        }
    }
`;
class EventsPage extends Component {
    state = {
        creating: false,
        title: '',
        price: '',
        date: '',
        description: '',
    }

    static contextType = AuthContext

    createEventHandler = () => {
        this.setState({creating: true});
    }
    
    onCancelHandler = () => {
        this.setState({creating:false});
    }

    onConfirmHandler = (createEvent) => {
        this.setState({creating:false});
        const { title, date, description } = this.state;
        const price = +this.state.price;

        if (title.trim().length === 0 || 
            price <= 0 || 
            date.trim().length === 0 ||
            description.trim().length === 0 
        ) return;

        const event = { 
            title, 
            price, 
            date, 
            description 
        };

        createEvent({
            variables: {
                eventInput: event
            }
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        console.log(this.context.userId);
        return(
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {
                    this.state.creating && 
                    <Mutation mutation={EVENT}>
                    {(createEvent, {loading}) => {
                        if (loading) return <h1>Loading...</h1>
                        return(
                            <Modal 
                                title="Add Event"
                                canCancel
                                canConfirm
                                onCancel={this.onCancelHandler}
                                onConfirm={
                                    () => { this.onConfirmHandler(createEvent) }
                                }
                             >
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title"> Title </label>
                                    <input type="text" id="title" name="title" onChange={this.handleChange}/>
                                    <label htmlFor="price"> Price </label>
                                    <input type="number" id="price" name="price" onChange={this.handleChange}/>
                                    <label htmlFor="date"> Date </label>
                                    <input type="date" id="date" name="date" onChange={this.handleChange}/>
                                    <label htmlFor="description"> Description </label>
                                    <textarea 
                                        id="description" 
                                        rows="4"  
                                        name="description" 
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </form>
                            </Modal>
                        );
                    }}
                    </Mutation>
                }
                {this.context.token 
                ? 
                    <div className="events-control">
                        <p> Create your own events</p>
                        <button 
                            className="btn"
                            onClick={this.createEventHandler}
                        > Create Event </button>
                    </div>
                :
                    <div className="events-control">
                        <p> Please log in to create events </p>
                    </div>
                }
                <EventList authUserId={this.context.userId} />
            </React.Fragment>
        );
    }
}

export default EventsPage;

