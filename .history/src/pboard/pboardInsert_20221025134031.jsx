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

      <div>
        <button type='button' 
                onClick={()=>setIsPopupOpen(true)}>우편번호 검색</button>
        <button className='postCode_btn'
                type='button' 
                onClick={()=>setIsPopupOpen(false)} >닫기</button>
        <div className='modal-address'>
          {isPopupOpen && (
            <div>
           <DaumPostcode style={postCodeStyle} onClose={()=>setIsPopupOpen(false)} onComplete={handlePostCode} />
            </div>
          )}
        </div>
      </div>


      <Row className='d-flex justify-content-center my-5'>
        <Card style={{ width: '30rem' }} className="p-3">
          <Form onSubmit={onSubmit}>


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
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
              />



              <TextField
                variant="outlined"
                required
                fullWidth
                id="uname"
                label="name"
                name="uname"
                autoComplete="uemail"
                onChange={onChange}
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
                onChange={onChange}
              />
            </Grid>

            <hr />


            <select
              variant="outlined"


              className='form-select' placeholder='성별' id="exampleSelect1">

              <option>성별</option>

              <option>남자</option>
              <option>여자</option>

            </select>

            <Form.Control className='my-3'
              onChange={onChangeFile}
              type="file" />
            <hr />


            <Button type="submit" style={{ width: '100%' }}>회원가입</Button>

          </Form>
        </Card>
      </Row>
    </div>
    )
}

export default PboardInsert