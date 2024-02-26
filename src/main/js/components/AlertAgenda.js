import React from 'react';

import { Alert} from 'react-bootstrap';

export default class AlertAgenda extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.showAlert) return null;

        return (
            <Alert variant="danger" onClose={this.props.onClose} dismissible>
                <Alert.Heading>{this.props.header}</Alert.Heading>
                <p>{this.props.message}</p>
            </Alert>
        );
    }
}