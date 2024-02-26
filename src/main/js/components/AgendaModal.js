import React from 'react';
import { Button, Container, FloatingLabel, Form, Modal, Row } from 'react-bootstrap';

export default class AgendaModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.props.agendaItem
        this.handleSave = this.handleSave.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open != this.props.open) {
            this.setState(this.props.agendaItem);
        }
    }

    handleSave() {
        if (this.state.phase.trim().length === 0 || this.state.duration <= 0 || (this.state.creditable && this.state.content.trim().length === 0)) {
            return null
        } else {
            this.props.onSaveAgendaItem(this.state);
        }
    }

    handleChange(e) {
        const name = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({
            [name]: value
        });
    }

    render() {
        if (!this.props.open) return null;

        return(
            <>
                <Modal show={this.props.open} onHide={this.props.onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title> Create/Edit Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <FloatingLabel controlId="floatingItemOrder" label="Order" className="mb-3">
                                <Form.Control type='text' name='itemOrder' value={this.state.itemOrder} disabled readOnly/>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPhase" label="Phase" className="mb-3">
                                <Form.Control type='text' name='phase' value={this.state.phase} onChange={this.handleChange}/>
                                {!this.state.phase || this.state.phase.trim().length === 0 ? <Form.Text muted><p style={{ color: 'red' }}>The field Phase is required</p></Form.Text> : ''}
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingContent" label="Content" className="mb-3">
                                <Form.Control as='textarea' style={{ height: '100px' }} name="content" value={this.state.content} onChange={this.handleChange}/>
                                {this.state.creditable && !this.state.content && this.state.content.trim().length === 0 ? <Form.Text muted><p style={{ color: 'red' }}>The field Content is required</p></Form.Text> : ''}
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingObjectives" label="Objectives" className="mb-3">
                                <Form.Control as='textarea' style={{ height: '100px' }} name="objectives" value={this.state.objectives} onChange={this.handleChange}/>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingDuration" label="Duration" className="mb-3">
                                <Form.Control type="number" name="duration" value={this.state.duration} onChange={this.handleChange}/>
                                {this.state.duration <= 0 ? <Form.Text muted><p style={{ color: 'red' }}>The field Duration is required</p></Form.Text> : ''}
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingCreditable" className="mb-3">
                                <Form.Check type="switch" name="creditable" label='Creditable' checked={this.state.creditable} onChange={this.handleChange}/>
                            </FloatingLabel>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={this.props.onClose}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={this.handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

}