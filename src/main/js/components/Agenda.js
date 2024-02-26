import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Button, Col, Row } from 'react-bootstrap';

export default class Agenda extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.agenda);
    }

    handleEdit() {
        this.props.onEdit(this.props.agenda);
    }

    render() {
        return (
            <tr>
                <td className='text-center'>{this.props.agenda.name}</td>
                <td className='text-center'>
                    <Row>
                        <Col/>
                        <Col>
                            <Button variant='primary' onClick={this.handleEdit}><FontAwesomeIcon icon={faPenToSquare} size='xs'/></Button>
                        </Col>
                        <Col>
                            <Button variant='danger' onClick={this.handleDelete}><FontAwesomeIcon icon={faTrash} size='xs'/></Button>
                        </Col>
                        <Col/>
                    </Row>
                </td>
            </tr>
        );
    }
}