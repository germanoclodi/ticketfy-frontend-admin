import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


export default class SimpleModal extends Component {

    render() {

        return (
            <div className={"simple-modal " + (this.props.show ? 'open' : '') }>
                <Container className="mb-5">
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <Card.Body>
                                    {this.props.children}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}