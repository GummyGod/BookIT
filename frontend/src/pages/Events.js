import React, { Component } from 'react';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop'

import './Events.css'
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
        
        const { title, price, date, description } = this.state;
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
                    onConfirm={this.onConfirmHandler}> 
                        <form>
                            <div class="form-control">
                                <label htmlFor="title"> Title </label>
                                <input type="text" id="title" name="title" onChange={this.handleChange}/>
                                <label htmlFor="price"> Price </label>
                                <input type="number" id="price" name="price" onChange={this.handleChange}/>
                                <label htmlFor="date"> Date </label>
                                <input type="date" id="date" name="date" onChange={this.handleChange}/>
                                <label htmlFor="description"> Description </label>
                                <textarea id="description" rows="4"  name="description" onChange={this.handleChange}/>
                            </div>
                        </form>
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

