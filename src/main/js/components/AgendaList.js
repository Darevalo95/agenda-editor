import React from 'react';
import ReactDOM from 'react-dom';

import Agenda from './Agenda';

import { Button, Table, Pagination, Form, Container, Row, Col, Stack } from 'react-bootstrap';

export default class AgendaList extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        var pageSize = e.target.value;
        if (/^[0-9]+$/.test(pageSize) || pageSize.trim().length === 0) {
            this.props.updatePageSize(pageSize);
        } else {
            e.target.value = pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render() {
        var agendas = this.props.agendas.map(agenda =>
                <Agenda key={agenda._links.self.href} agenda={agenda} onDelete={this.props.onDelete} onEdit={this.props.onEdit}/>
        );


        var navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<Pagination.First key="first" onClick={this.handleNavFirst}/>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<Pagination.Prev key="prev" onClick={this.handleNavPrev}/>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<Pagination.Next key="next" onClick={this.handleNavNext}/>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<Pagination.Last key="last" onClick={this.handleNavLast}/>);
        }

        return (
            <Container>
                <br/>
                <Row className="justify-content-center">
                    <Col xs='auto'sm='auto' md='auto' lg='auto'><h1>Agenda Editor</h1></Col>
                </Row>
                <Form.Label>Page Size:</Form.Label>
                <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                        <Form.Control type='text'name='pageSize' value={this.props.pageSize} onChange={this.handleChange}/>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        <Button onClick = {this.props.onCreate}>Create Agenda</Button>
                    </Col>
                </Row>
                <Form.Text muted>
                    Write the amount of agendas that you want to be showed.
                </Form.Text>
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center' style={{width: '70%'}}>Name</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agendas}
                    </tbody>
                </Table>
                <Pagination className="justify-content-md-center">
                    {navLinks}
                </Pagination>
            </Container>
        );
    }
}