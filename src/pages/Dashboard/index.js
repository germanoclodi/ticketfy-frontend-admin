import React, { Component } from "react";
// import { Link } from "react-router-dom";
import api from "../../services/api";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import sender from "../../services/sender";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import MaterialIcon from 'material-icons-react';
import SimpleModal from "../../components/SimpleModal/index";
import Form from 'react-bootstrap/Form';

export default class Dashboard extends Component {

    state = {
        tickets: [],
        modal: false,
        modalEdit: false,
        modalLog: false,
        ticket: {},
        ticketObs: [],
        logs: []
    }

    componentDidMount() {
        this.getTickets()
    }

    toggleModal = (ticket = {}) => {

        const a = [];
        if (ticket.descricao !== undefined) {
            const desc = ticket.descricao.split(" |!| ");
            desc.forEach(item => {
                a.push(item);
            });
        }
        this.setState({ modal: !this.state.modal, ticket: ticket, ticketObs: a });
    }

    toggleModalEdit = (ticket = {}) => {
        this.setState({ modalEdit: !this.state.modalEdit, ticket: ticket });
    }

    toggleModalLog = async (ticket) => {
        this.setState({ modalLog: !this.state.modalLog, ticket: ticket });
        const response = await api.get(`/log/${ticket.id}`)
        this.setState({ logs: response.data });
    }

    getTickets = async () => {
        const response = await sender.get("/tickets");
        this.setState({ tickets: response.data.data });
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({
            ticket: {
                ...this.state.ticket,
                [nam]: val
            }
        });
    }

    updateTicket = async (event) => {
        event.preventDefault();
        let ticket = this.state.ticket;
        if (ticket.obs !== "" && ticket.obs !== undefined) {
            ticket.descricao = ticket.descricao + " |!| " + ticket.obs;
        }
        await sender.put(`/tickets/${this.state.ticket.id}`, { ticket: this.state.ticket })
            .then(response => {
                api.post("/log", { ticketId: this.state.ticket.id, description: "Status alterado para " + this.state.ticket.status + "." })
                    .then(res => {
                        this.getTickets();
                        this.toggleModalEdit();
                        document.getElementsByTagName("textarea")[0].value = "";
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }).catch(error => {
                console.log(error);
            });
    }

    render() {
        const tickets = this.state.tickets;
        const ticket = this.state.ticket;
        const ticketObs = this.state.ticketObs;
        const logs = this.state.logs;

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
                                                <span onClick={() => this.toggleModal(ticket)} className="mr-2">
                                                    <MaterialIcon icon="remove_red_eye" />
                                                </span>
                                                <span onClick={() => this.toggleModalEdit(ticket)} className="mr-2">
                                                    <MaterialIcon icon="settings" />
                                                </span>
                                                <span onClick={() => this.toggleModalLog(ticket)}>
                                                    <MaterialIcon icon="insert_drive_file" />
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
                            <Col xs={8} className="d-flex align-items-center">
                                <h5>Ticket - {ticket.titulo}</h5>
                            </Col>
                            <Col xs={4} className="d-flex align-items-center justify-content-end">
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
                                <h6 className="d-flex mb-2">Comentários</h6>
                                {ticketObs.map((desc, index) => (
                                    <p key={index} className="mb-2">{desc}</p>
                                ))}
                            </Col>
                        </Row>
                    </Container>
                </SimpleModal>
                <SimpleModal show={this.state.modalEdit}>
                    <Container>
                        <Row className="mb-5">
                            <Col xs={8} className="d-flex align-items-center">
                                <h5>Ticket - {ticket.titulo}</h5>
                            </Col>
                            <Col xs={4} className="d-flex align-items-center justify-content-end">
                                <span onClick={this.toggleModalEdit}>
                                    <MaterialIcon icon="close" />
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Form onSubmit={this.updateTicket}>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control as="select" name="status" value={this.state.ticket.status} onChange={this.myChangeHandler} required>
                                            <option></option>
                                            {["Aberto", "Bloqueado", "Concluído", "Em andamento",].map((s, index) => (
                                                <option key={index} value={s}>{s}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Comentários</Form.Label>
                                        <Form.Control as="textarea" rows="3" name="obs" onChange={this.myChangeHandler} />
                                    </Form.Group>
                                    <div className="text-right mt-5">
                                        <Button variant="primary" type="submit">
                                            Atualizar
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </SimpleModal>
                <SimpleModal show={this.state.modalLog}>
                    <Container>
                        <Row className="mb-5">
                            <Col xs={8} className="d-flex align-items-center">
                                <h5>Ticket - {ticket.titulo}</h5>
                            </Col>
                            <Col xs={4} className="d-flex align-items-center justify-content-end">
                                <span onClick={this.toggleModalLog}>
                                    <MaterialIcon icon="close" />
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={6} className="mb-4">
                                {logs.map((log, index) => (
                                    <p key={index}>{index + 1} - {log.description}</p>
                                ))}
                                {(logs.length === 0) ? <p>Nenhuma alteração realizada.</p> : <></>}
                            </Col>
                        </Row>
                    </Container>
                </SimpleModal>
            </>
        );
    }

}