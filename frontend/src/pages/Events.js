import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop'

import './Events.css'

const EVENT = gql`
    mutation {
        createEvent( eventInput:{
            title: $title
            price: $price
            date: $date
            description: $description
        }) {
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

    createEventHandler = () => {
        this.setState({creating: true});
    }
    
    onCancelHandler = () => {
        this.setState({creating:false});
    }

    onConfirmHandler = () => {
        this.setState({creating:false});
        const { title, date, description } = this.state;
        const price = +this.state.price;

        if (
            title.trim().length === 0 || 
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
        console.log(event);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return(
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {
                    this.state.creating && 
                    <Modal 
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.onCancelHandler}
                        onConfirm={this.onConfirmHandler}
                    > 
                        <Mutation mutation={EVENT}>
                        {(createEvent, {loading}) => {
                            if (loading) return <h1>Loading...</h1>
                            return(
                                <form onSubmit={ 
                                    e => {
                                        e.preventDefault();
                                        createEvent({
                                            variables: {
                                                title: this.state.title,
                                                price: this.state.price,
                                                date: this.state.date,
                                                description: this.state.description,
                                            }
                                        })
                                    }
                                }>
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
                            );
                        }}
                        </Mutation>
                    </Modal>
                }
                <div className="events-control">
                    <p> Create your own events</p>
                    <button 
                        className="btn"
                        onClick={this.createEventHandler}
                    > Create Event </button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;

