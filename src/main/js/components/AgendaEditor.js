import React from 'react';

import client from '../client';
import follow from '../follow';

import AgendaList from './AgendaList';
import AgendaItems from './AgendaItems';

const root = '/api';

export default class AgendaEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {agendas: [], attributes: [], pageSize: 2, links: {}, isAgendaEdit: false, agenda: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCreateAgenda = this.handleCreateAgenda.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleNavigate = this.handleNavigate.bind(this);
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'agendas', params: {size: pageSize}}]
        ).then(agendaList => {
            return client({
                method: 'GET',
                path: agendaList.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return agendaList;
            });
        }).done(agendaList => {
            this.setState({
                agendas: agendaList.entity._embedded.agendas,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: agendaList.entity._links,
                isAgendaEdit: false,
                agenda: {}
            });
        });
    }

    handleNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(agendaList => {
            this.setState({
                agendas: agendaList.entity._embedded.agendas,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: agendaList.entity._links,
                isAgendaEdit: false,
                agenda: {}
            });
        });
    }

    handleDelete(agenda) {
        client({method: 'DELETE', path: agenda._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize);
        });
    }

    handleEdit(agenda) {
        this.setState({
            agendas: this.state.agendas,
            attributes: this.state.attributes,
            pageSize: this.state.pageSize,
            links: this.state.links,
            isAgendaEdit: true,
            agenda: agenda
        });
    }

    handleCreateAgenda() {
        this.setState({
            agendas: this.state.agendas,
            attributes: this.state.attributes,
            pageSize: this.state.pageSize,
            links: this.state.links,
            isAgendaEdit: true,
            agenda: {name: ""}
        });
    }

    handleBack() {
        this.loadFromServer(this.state.pageSize);
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    render() {
        return (
            <div>
                { !this.state.isAgendaEdit && 
                    <AgendaList agendas={this.state.agendas}
                                links={this.state.links}
                                pageSize={this.state.pageSize}
                                onNavigate={this.handleNavigate}
                                onDelete={this.handleDelete}
                                onEdit={this.handleEdit}
                                onCreate={this.handleCreateAgenda}
                                updatePageSize={this.updatePageSize}/> }

                { this.state.isAgendaEdit && 
                    <AgendaItems agenda={this.state.agenda}
                                 onBack={this.handleBack}/> }
            </div>
        );
    }
}