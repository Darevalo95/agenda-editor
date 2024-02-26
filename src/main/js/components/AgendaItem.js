import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Draggable } from "react-beautiful-dnd";
import { Button, Col, Row } from 'react-bootstrap';

export default class AgendaItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.agendaItem);
    }

    handleEdit() {
        this.props.onOpenModal(true, this.props.agendaItem);
    }

    render() {
        return (
            <Draggable
                    key={this.props.agendaItem.itemOrder}
                    draggableId={this.props.agendaItem.itemOrder.toString()}
                    index={this.props.index}
                  >
                      {(provider) => (
                            <tr {...provider.draggableProps} ref={provider.innerRef}>
                                <td {...provider.dragHandleProps}> = </td>
                                <td>{this.props.agendaItem.itemOrder}</td>
                                <td>{this.props.agendaItem.phase}</td>
                                <td>{this.props.agendaItem.content}</td>
                                <td>{this.props.agendaItem.objectives}</td>
                                <td>{this.props.agendaItem.duration} min</td>
                                <td>{this.props.agendaItem.creditable && "Yes"}</td>
                                <td className='text-center'>
                                    <Row>
                                        <Col>
                                            <Button variant='primary' onClick={this.handleEdit}><FontAwesomeIcon icon={faPenToSquare}/></Button>
                                        </Col>
                                        <Col>
                                            <Button variant='danger' onClick={this.handleDelete}><FontAwesomeIcon icon={faTrash}/></Button>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                      )}
            </Draggable>
        );
    }
}