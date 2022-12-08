import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Card, FormControl, Grid, TextField } from '@material-ui/core'
import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { Button, Col, Form, FormLabel, Row } from 'react-bootstrap'
import { UserContext } from '../context/UserContext'

const PboardInsert = () => {
    const {loginUser}=useContext(UserContext);
    const [image, setImage] = useState('');
    const [form, setForm] = useState({
        pwriter: '',
        pprice: '',
        ptitle: '',
        pcontent: '',
        file: null,
        fileName: '',
        pimage: '',
        uid: sessionStorage.getItem('uid'),
    })

    const { pprice, ptitle, pcontent, pimage, file, pwriter, uid } = form;

    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onChangeFile = (e) => {
        setForm({
            ...form,
            file: e.target.files[0],
        })
        setImage(URL.createObjectURL(e.target.files[0]))
    }


    //pwriter(nickname)도 중복안되게 해야할듯.
    const onSubmit_Insert = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pcontent", pcontent);
        formData.append("ptitle", ptitle);
        formData.append("pprice", pprice);
        formData.append("pwriter", pwriter);
        formData.append("pimage", pimage);
        await axios.post('/api/pboard/insert', formData);
        alert('등록완료')
    }

    return (
        <div>

            <Row className='d-flex justify-content-center my-5'>
                <Card style={{ width: '30rem' }} className="p-3">
                    <Form><Grid item xs={12}>
                               <p style={{float:'left', marginTop:140}}>메인이미지</p>
                            <img src={image || 'https://dummyimage.com/100x100'} alt="빈이미지" title='메인이미지' width={300} height={300} />
                            </Grid>
                            <Form.Control className='my-3'
                                type="file"
                                onChange={onChangeFile} />
                            <hr />
                            
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={ptitle}
                                    onChange={onChangeForm}
                                    label="제목"
                                    name="ptitle"
                                    autoComplete="ptitle"
                                />
                            </Grid>

                            <Grid item xs={12}>
                            <TextField multiline
                            minRows={12}
                                variant="outlined"
                                required
                                fullWidth
                                value={pcontent}
                                onChange={onChangeForm}
                                label="내용은 300자 제한"
                                name="pcontent"
                                autoComplete="pcontent"
                            />
{/*                             <Grid>
                                <input type='hidden' name={pwriter}  value={pwriter}  />
                            </Grid> */}
                            <hr />
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="가격"
                                    value={pprice}
                                    onChange={onChangeForm}
                                    name="pprice"
                                    type='number'
                                    autoComplete="pprice"
                                />
                            </Grid>
                            <hr />
                        </Grid>
                        <div style={{ marginTop: 30 }}>
                            <Button onClick={onSubmit_Insert} style={{ width: '100%', margintTop: 300 }}>상품 등록</Button>
                        </div>
                    </Form>
                </Card>
            </Row>
        </div>
    )
}

export default PboardInsert