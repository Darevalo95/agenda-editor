import React from 'react';
import ReactDOM from 'react-dom';

import client from '../client';
import follow from '../follow';

import AgendaItem from './AgendaItem';
import AgendaModal from './AgendaModal';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button, Table, Form, Container, Row, Col, Stack } from 'react-bootstrap';
import AlertAgenda from './AlertAgenda';

const root = '/api';

export default class AgendaItems extends React.Component {

    constructor(props) {
        super(props);
        this.state = {agendaItems: [], links: {}, totalDuration: 0, totalCreditable: 0, agenda: this.props.agenda, modalIsOpen: false, agendaItem: {}, agendaItemsToDelete: [], showAlert: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleSaveAgendaItem = this.handleSaveAgendaItem.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this);
    }

    componentDidMount() {
        this.loadFromServer();
    }

    componentDidUpdate(prevProps) {
        if (this.props.agenda._links && this.props.agenda._links.self && (this.props.agenda._links.self.href !== prevProps.agenda._links.self.href)) {
            this.loadFromServer();
        }
    }

    loadFromServer() {
        if (this.props.agenda._links && this.props.agenda._links.agendaItemList && this.props.agenda._links.agendaItemList.href) {
            client({method: 'GET', path: this.props.agenda._links.agendaItemList.href})
            .done(agendaItemList => {
                var agendaItems = agendaItemList.entity._embedded.agendaItems;
                agendaItems.sort(
                    (item1, item2) => item1.itemOrder < item2.itemOrder ? -1 : item1.itemOrder > item2.itemOrder ? 1 : 0
                );
                this.setState({
                    agendaItems: agendaItems,
                    links: agendaItemList.entity._links,
                    totalDuration: agendaItems.reduce((acum, agendaItem) => acum + Number(agendaItem.duration), 0),
                    totalCreditable: agendaItems.filter(agendaItem => agendaItem.creditable).reduce((acum, agendaItem) => acum + Number(agendaItem.duration), 0),
                    agenda: this.state.agenda,
                    modalIsOpen: this.state.modalIsOpen,
                    agendaItem: this.state.agendaItem,
                    agendaItemsToDelete: this.state.agendaItemsToDelete,
                    showAlert: this.state.showAlert
                });
            });
        }
    }

    handleChange(e) {
        e.preventDefault();
        var agenda = this.state.agenda
        agenda.name = e.target.value
        this.setState({
            agendaItems: this.state.agendaItems,
            links: this.state.links,
            totalDuration: this.state.totalDuration,
            totalCreditable: this.state.totalCreditable,
            agenda: agenda,
            modalIsOpen: this.state.modalIsOpen,
            agendaItem: this.state.agendaItem,
            agendaItemsToDelete: this.state.agendaItemsToDelete,
            showAlert: this.state.showAlert
        });
    }

    handleSave(e) {
        e.preventDefault();
        if (!this.state.agenda.name || this.state.agenda.name.trim().length === 0) return null 
        var agenda = this.state.agenda;
        var agendaItems = this.state.agendaItems;
        var method = agenda._links && agenda._links.self && agenda._links.self.href ? 'PUT' : 'POST';
        var path = agenda._links && agenda._links.self && agenda._links.self.href ? agenda._links.self.href : null;

        follow(client, root, ['agendas']).then(agendaList => {
            return client({
                method: method,
                path: path ? path : agendaList.entity._links.self.href,
                entity: agenda,
                headers: {'Content-Type': 'application/json'}
            });
        }).then(response => {
            if (response.status.code === 200 || response.status.code === 201) {
                agendaItems.forEach(agendaItem => {
                    if (agendaItem._links.self && agendaItem._links.self.href) {
                        client({
                            method: 'PUT',
                            path: agendaItem._links.self.href,
                            entity: agendaItem,
                            headers: {'Content-Type': 'application/json'}
                        });
                    } else {
                        agendaItem.agenda = response.entity._links.self.href;
                        follow(client, root, ['agendaItems']).then(items => {
                            return client({
                                method: 'POST',
                                path: items.entity._links.self.href,
                                entity: agendaItem,
                                headers: {'Content-Type': 'application/json'}
                            });
                        })
                    }
                })
            }
        }).then(() => {
            var agendaItemsToDelete = this.state.agendaItemsToDelete.filter(item => item._links.self && item._links.self.href)
            agendaItemsToDelete.forEach(agendaItem => {
                client({method: 'DELETE', path: agendaItem._links.self.href});
            });
        }).done(() => {
            this.loadFromServer();
            this.props.onBack();
        });
    }

    handleCancel(e) {
        e.preventDefault();
        this.props.onBack();
    }

    handleDelete(agendaItem) {
        var agendaItems = this.state.agendaItems.filter(item => item.itemOrder != agendaItem.itemOrder);
        agendaItems.forEach(item => {
            if (item.itemOrder > agendaItem.itemOrder) item.itemOrder = item.itemOrder - 1;
        });
        this.state.agendaItemsToDelete.push(agendaItem);
        this.setState({
            agendaItems: agendaItems,
            links: this.state.links,
            totalDuration: agendaItems.reduce((acum, agendaItem) => acum + Number(agendaItem.duration), 0),
            totalCreditable: agendaItems.filter(agendaItem => agendaItem.creditable).reduce((acum, agendaItem) => acum + Number(agendaItem.duration), 0),
            agenda: this.state.agenda,
            modalIsOpen: this.state.value,
            agendaItem: this.state.agendaItem,
            agendaItemsToDelete: this.state.agendaItemsToDelete,
            showAlert: this.state.showAlert
        });
    }

    handleOpenModal(value, agendaItem) {
        if (!agendaItem.itemOrder) {
            agendaItem.itemOrder = this.state.agendaItems.length + 1;
            agendaItem.phase = "";
            agendaItem.content = "";
            agendaItem.objectives = "";
            agendaItem.duration = "";
            agendaItem.creditable = false;
            agendaItem._links = {}
        }
        this.setState({
            agendaItems: this.state.agendaItems,
            links: this.state.links,
            totalDuration: this.state.totalDuration,
            totalCreditable: this.state.totalCreditable,
            agenda: this.state.agenda,
            modalIsOpen: value,
            agendaItem: agendaItem,
            showAlert: this.state.showAlert
        });
    }

    handleSaveAgendaItem(agendaItem) {
        var agendaItems = this.state.agendaItems;
        var indexItem = agendaItems.findIndex(item => item.itemOrder === agendaItem.itemOrder);
        if (indexItem >= 0) {
            agendaItems[indexItem] = agendaItem
        } else {
            agendaItems.push(agendaItem)
        }
        var totalCreditable = agendaItems.filter(agendaItem => agendaItem.creditable).reduce((acum, agendaItem) => acum + Number(agendaItem.duration), 0);
        this.setState({
            agendaItems: agendaItems,
            links: this.state.links,
            totalDuration: agendaItems.reduce((acum, agendaItem) => acum + Number(agendaItem.duration), 0),
            totalCreditable: totalCreditable,
            agenda: this.state.agenda,
            modalIsOpen: this.state.value,
            agendaItem: this.state.agendaItem,
            agendaItemsToDelete: this.state.agendaItemsToDelete,
            showAlert: totalCreditable < 15
        });
    }

    handleDragEnd(e) {
        if (!e.destination) return;
        let tempData = Array.from(this.state.agendaItems);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        tempData.forEach((item, index) => item.itemOrder = index + 1);
        this.setState({
            agendaItems: tempData,
            links: this.state.links,
            totalDuration: this.state.totalDuration,
            totalCreditable: this.state.totalCreditable,
            agenda: this.state.agenda,
            modalIsOpen: this.state.value,
            agendaItem: this.state.agendaItem,
            agendaItemsToDelete: this.state.agendaItemsToDelete,
            showAlert: this.state.showAlert
        });
    }

    handleAlertClose() {
        this.setState({
            agendaItems: this.state.agendaItems,
            links: this.state.links,
            totalDuration: this.state.totalDuration,
            totalCreditable: this.state.totalCreditable,
            agenda: this.state.agenda,
            modalIsOpen: this.state.modalIsOpen,
            agendaItem: this.state.agendaItem,
            showAlert: false
        });
    }

    render() {
        var totalDurationHours = Math.floor(this.state.totalDuration / 60);
        var totalDurationMinutes = this.state.totalDuration  % 60;
        var totalCreditableHours = Math.floor(this.state.totalCreditable / 60);
        var totalCreditableMinutes = this.state.totalCreditable  % 60;

        var agendaItems = this.state.agendaItems.map((agendaItem, index) => 
            <AgendaItem key={agendaItem.itemOrder} agendaItem={agendaItem} onDelete={this.handleDelete} onOpenModal={this.handleOpenModal} index={index}/>
        );

        return (
            <>
                <Container>
                    <br/>
                    <AlertAgenda showAlert={this.state.showAlert} onClose={this.handleAlertClose} header='Attention!' message='Creditable items are less than 15 minutes!'/>
                    <Row className="justify-content-center">
                        <Col xs='auto'sm='auto' md='auto' lg='auto'><h1>Create/Edit Agenda</h1></Col>
                    </Row>
                    <Form.Label>Name:</Form.Label>
                    <Row>
                        <Col xs={10} sm={10} md={10} lg={10}>
                            <Form.Control type='text'name='agendaName' value={this.state.agenda.name} onChange={this.handleChange}/>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2}>
                            <Button className="me-auto" onClick = {() => this.handleOpenModal(true, {})}>Create Agenda Item</Button>
                        </Col>
                    </Row>
                    {!this.state.agenda.name || this.state.agenda.name.trim().length === 0 ? <Form.Text muted><p style={{ color: 'red' }}> The Name of the Agenda is required </p></Form.Text>: ''}
                    <br/>
                    <DragDropContext onDragEnd={this.handleDragEnd}>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th />
                                    <th>#</th>
                                    <th>Phase</th>
                                    <th>Content</th>
                                    <th>Objectives</th>
                                    <th>Duration (min)</th>
                                    <th>Creditable</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <Droppable droppableId="droppable-1">
                                {(provider) => (
                                    <tbody
                                        className="text-capitalize"
                                        ref={provider.innerRef}
                                        {...provider.droppableProps}>
                                            {agendaItems}
                                            {provider.placeholder}
                                    </tbody>
                                )}
                            </Droppable>
                        </Table>
                    </DragDropContext>
                    <p>Total Duration: {totalDurationHours > 0 && totalDurationHours + " h"} {totalDurationMinutes >= 0 && totalDurationMinutes + " min"}</p>
                    <p>Total Creditable Duration: {totalCreditableHours > 0 && totalCreditableHours + " h"} {totalCreditableMinutes >= 0 && totalCreditableMinutes + " min"}</p>
                    <Stack gap={2} className="col-md-5 mx-auto">
                        <Button variant='success' onClick={this.handleSave}>Save Changes</Button>
                        <Button variant='outline-danger' onClick={this.handleCancel}>Cancel</Button>
                    </Stack>
                </Container>
                <AgendaModal open={this.state.modalIsOpen} onClose={() => this.handleOpenModal(false, {})} agendaItem={this.state.agendaItem} onSaveAgendaItem={this.handleSaveAgendaItem}/>
            </>
        );
    }
}