import { Grid, TextField } from '@material-ui/core'
import React from 'react'
import { useState } from 'react'
import { Button, Col, Form, FormLabel, Row } from 'react-bootstrap'

const PboardInsert = () => {
    const [form, setForm] = useState({
        pprice: 0,
        ptitle: '',
        pcontent: '',
        pimage: '',
        file: null,
        fileName: '',
        uid: '',
    })

    const onChnageForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onChangeFile = (e) => {
        setForm({
            ...form,
            file: e.target.files[0]
        })
    }

    return (
        <div>

      


      <Row className='d-flex justify-content-center my-5'>
        <Card style={{ width: '30rem' }} className="p-3">
          <Form>


            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="uid"
                label="id"
                value={uid}
                name="uid"
                autoComplete="uid"
              />
            </Grid>


            <hr />


            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="upass"
                label="Password"
                value={upass}
                name="upass"
                autoComplete="upass"
                type="password"
              />
            </Grid>
            <hr />
            <Grid item xs={12}>
        
              <TextField
                value={address}
                variant="outlined"
                required
                fullWidth
                id="adresss"
                label="adresss"
                name="adresss"
                autoComplete="adresss"
              />



              <TextField
                variant="outlined"
                required
                fullWidth
                id="uname"
                label="name"
                name="uname"
                autoComplete="uemail"
              />
            </Grid>
            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="uemail"
                label="Email Address"
                name="uemail"
                autoComplete="uemail"
              />
            </Grid>

            <hr />


            <select
              variant="outlined"


              className='form-select' placeholder='??????' id="exampleSelect1">

              <option>??????</option>

              <option>??????</option>
              <option>??????</option>

            </select>

            <Form.Control className='my-3'
              onChange={onChangeFile}
              type="file" />
            <hr />


            <Button type="submit" style={{ width: '100%' }}>????????????</Button>

          </Form>
        </Card>
      </Row>
    </div>
    )
}

export default PboardInsert