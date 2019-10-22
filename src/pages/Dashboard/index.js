import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import sender from "../../services/sender";
import Table from 'react-bootstrap/Table';
import MaterialIcon from 'material-icons-react';
import SimpleModal from "../../components/SimpleModal/index";

export default class Dashboard extends Component {

    state = {
        tickets: [],
        modal: false,
        ticket: ''
    }

    componentDidMount() {
        this.getTickets()
    }

    toggleModal = (ticket = {}) => {
        this.setState({ modal: !this.state.modal, ticket: ticket });
    }

    getTickets = async () => {
        const response = await sender.get("/tickets");
        this.setState({ tickets: response.data.data });
    }

    render() {
        const tickets = this.state.tickets;
        const ticket = this.state.ticket;

        return (
            <>
                <Navbar expand="lg" className="mb-5">
                    <Container>
                        <Navbar.Brand>Ticketfy</Navbar.Brand>
                    </Container>
                </Navbar>
                <Container>
                    <Row className="mb-3">
                        <Col xs={12}>
                            <h1>Tickets</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket, index) => (
                                        <tr key={index}>
                                            <td>{ticket.titulo}</td>
                                            <td>{ticket.tipo}</td>
                                            <td>{ticket.status}</td>
                                            <td className="text-right">
                                                <span onClick={() => this.toggleModal(ticket)}>
                                                    <MaterialIcon icon="remove_red_eye" />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <SimpleModal show={this.state.modal}>
                    <Container>
                        <Row className="mb-5">
                            <Col xs={6} className="d-flex align-items-center">
                                <h5>Ticket - {ticket.titulo}</h5>
                            </Col>
                            <Col xs={6} className="d-flex align-items-center justify-content-end">
                                <span onClick={this.toggleModal}>
                                    <MaterialIcon icon="close" />
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6} className="mb-4">
                                <h6 className="d-flex">E-mail</h6>
                                <p>{ticket.email}</p>
                            </Col>
                            <Col xs={12} sm={6} className="mb-4">
                                <h6 className="d-flex">Status</h6>
                                <p>{ticket.status}</p>
                            </Col>
                            <Col xs={12} sm={6} className="mb-4">
                                <h6 className="d-flex">Tipo</h6>
                                <p>{ticket.tipo}</p>
                            </Col>
                            <Col xs={12} sm={6} className="mb-4">
                                <h6 className="d-flex">Categoria</h6>
                                <p>{ticket.categoria}</p>
                            </Col>
                            <Col xs={12} sm={12} className="mb-4">
                                <h6 className="d-flex">Comentários</h6>
                                <p>{ticket.descricao}</p>
                            </Col>
                        </Row>
                    </Container>
                </SimpleModal>
            </>
        );
    }

}