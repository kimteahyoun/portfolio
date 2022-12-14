import React from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const PboardItem = ({ postList }) => {
  const { pcode, ptitle, pcontent, pwriter, pimage, viewcnt, regDate, updateDate } = postList;
  return (
      <Col>
        
          <Card style={{ width: '30rem', padding: 20 }}>
          <Card.Body>
            <Card.Img variant="top" src={pimage} width='200' height='200' />
            <Card.Title>{ptitle}</Card.Title>
            <Card.Text>{pcontent}</Card.Text>
            <Button variant="primary">π{/*  {s[0].likes} */}</Button>
            <Button className="ml-2" variant="primary">
              π{/*  {s[0].dislikes} */}
            </Button>
          </Card.Body>
          <Link to={`/pboard/read/${pcode}`}><Button>μμΈν λ³΄κΈ°</Button></Link>
        </Card>
      
      </Col>

  )
}

export default PboardItem