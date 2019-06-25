import React, { Component } from 'react';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop'

import './Events.css'
class EventsPage extends Component {
    state = {
        creating: false,
    }

    createEventHandler = () => {
        this.setState({creating: true});
    }
    
    onCancelHandler = () => {
        this.setState({creating:false});
    }

    onConfirmHandler = () => {
        this.setState({creating:false});
        //todo
    }
    render() {
        return(
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && <Modal 
                title="Add Event"
                canCancel
                canConfirm
                onCancel={this.onCancelHandler}
                onConfirm={this.onConfirmHandler}
                > <p>Modal Content</p> </Modal>}
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

