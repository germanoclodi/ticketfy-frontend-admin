import React, { Component } from "react";
import api from "../../services/api";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Logo from "../../assets/img/logo.png";

export default class Login extends Component {

    state = {
        email: '',
        password: '',
        error: false
    };

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    login = (event) => {
        event.preventDefault();
        this.setState({ error: false });
        api.post("/login", {
            email: this.state.email,
            password: this.state.password,
        })
            .then(response => {
                if (response.data.success) {
                    localStorage.setItem("TOKEN_KEY", response.data.token);
                    window.location.href = "/dashboard";
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <>
                <Navbar expand="lg" className="mb-5">
                    <Container>
                        <Navbar.Brand href="/">Ticketfy</Navbar.Brand>
                    </Container>
                </Navbar>
                <Container>
                    <Row className="mb-5">
                        <Col xs={12} className="text-center">
                            <img src={Logo} alt="" className="img-fluid" width="10%" />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Form onSubmit={this.login}>
                                <Form.Group className="pb-3">
                                    <Form.Control size="lg" type="text" placeholder="Seu e-mail" name="email" onChange={this.myChangeHandler} required />
                                </Form.Group>
                                <Form.Group className="pb-3">
                                    <Form.Control size="lg" type="password" placeholder="Sua senha" name="password" onChange={this.myChangeHandler} required />
                                </Form.Group>
                                <Row className="py-4">
                                    <Col xs={12} className="d-flex align-items-center justify-content-end">
                                        <Button type="submit" className="text-uppercase">
                                            Entrar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Navbar expand="lg" fixed="bottom" variant="light" bg="light">
                    <Container className="justify-content-center">
                        <Navbar.Text>
                            &copy; Ticketfy - Todos os direitos reservados.
                        </Navbar.Text>
                    </Container>
                </Navbar>
            </>
        );
    }

}