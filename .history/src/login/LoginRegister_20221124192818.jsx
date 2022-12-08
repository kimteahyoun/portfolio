import { Grid, MenuItem, TextField } from '@material-ui/core';
import axios from 'axios';
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import React, { useState } from 'react';
import { Alert, Button, Card, Form, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DaumPostcode from "react-daum-postcode";
import Swal from 'sweetalert2';

const years = range(1930, getYear(new Date()) + 1, 1);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LoginRegister = ({ history }) => {
  const [ubirth, setUbirth] = useState(new Date());
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [address, setAddress] = useState('');
  const [pass1, setPass1] = useState('');

  const onCheckPassword = (form) => {
    var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,10}$/
    const result = regExp.test(form);
    if (!result) {
      Swal.fire({
        text: "비밀번호 양식을 준수해 주세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
    }
    return result;
  }

  const onCheckPhonenumber = (form) => {
    var regExp = /^\d{3}-\d{3,4}-\d{4}$/;
    const result = regExp.test(form);
    if (!result) {
      Swal.fire({
        text: "전화번호 양식을 준수해 주세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
    }
    return result;
  }

  const onCheckEmail = (form) => {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    const result = regExp.test(form);
    if (!result) {
      Swal.fire({
        text: "이메일 양식을 준수해 주세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
    }
    return result;
  }

  const onCheckUnickanme = async (e) => {
    e.preventDefault();

    if (form.unickname === '') {
      Swal.fire({
        text: "닉네임을 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
      return;
    }

    const result = await axios.get(`/api/user/check?unickname=${form.unickname}`);
    result.data === 1 ?
      Swal.fire({
        text: "사용 가능한 닉네임입니다",
        icon: 'success',
        confirmButtonColor: '#3085d6',
      })
      :
      Swal.fire({
        text: "닉네임이 중복되었습니다",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
  }

  const onConfirmPassword = () => {
    upass !== pass1 ?
      setMessage('비밀번호가 일치하지 않습니다.')
      :
      setMessage('비밀번호가 일치합니다.');
  }

  const onCheckUid = async (e) => {
    e.preventDefault();

    if (form.uid === '') {
      Swal.fire({
        text: "아이디를 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
      return;
    }

    const result = await axios.get(`/api/user/read/${form.uid}`);
    result.data === '' ?
      Swal.fire({
        text: "사용 가능한 아이디입니다",
        icon: 'success',
        confirmButtonColor: '#3085d6',
      })
      :
      Swal.fire({
        text: "중복된 아이디라서 사용할 수 없습니다",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
  }

  const [form, setForm] = useState({
    uid: '',
    upass: '',
    uname: '',
    unickname: '',
    uemail: '',
    utel: '',
    uaddress: '',
    ucondition: '1',
    ugender: '',
    file: null
  })

  const { uid, upass, uname, unickname, uemail, ucondition, utel, ugender,  file } = form;

  const onChangeForm = (e) => {
    setForm(prev=>({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onRegister = async (e) => {
    e.preventDefault();

    if (uid === '' || upass === '') {
      Swal.fire({
        text: "아이디나 비밀번호를 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
      return;
    }

    else if (ugender === "" || ugender === "성별") {
      Swal.fire({
        text: "성별을 선택하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
      return;
    }

    else if (uname === '') {
      Swal.fire({
        text: "이름을 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
      return;
    }

    else if (pass1 === '') {
      Swal.fire({
        text: "확인용 비밀번호를 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      })
      return;
    }

    else if (upass !== pass1) {
      Swal.fire({
        text: "확인용 비밀번호와 변경하고자 하는 비밀번호가 일치하지 않습니다",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
      return;
    }

    else if (onCheckPassword(form.upass) === false) {
      return;
    }

    else if (onCheckPhonenumber(form.utel) === false) {
      return;
    }

    else if (!onCheckEmail(form.uemail)) {
      return;
    }


    Swal.fire({
      text: "회원으로 등록하시겠습니까?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '등록',
      cancelButtonText: '취소'
    }).then(async (result) => {

      //identification process
      if (result.isConfirmed) {
        const result = await axios.get(`/api/user/sendAuthSMS?utel=${form.utel}`)

        const authnum = prompt('인증번호를 입력하세요.');
        
        if (authnum !== String(result.data)) {
          Swal.fire({
            text: "인증번호가 올바르지 않습니다.",
            icon: 'warning',
            confirmButtonColor: '#3085d6',
          })
          return;
        } 

        const formData = new FormData();
        formData.append('uid', uid);
        formData.append('upass', upass);
        formData.append('uname', uname);
        formData.append('unickname', unickname);
        formData.append('uemail', uemail);
        formData.append('utel', utel);
        formData.append('uaddress', address);
        formData.append('file', file);
        formData.append('ucondition', ucondition);
        formData.append('ugender', ugender);
        formData.append('ubirth', ubirth);

        try {
          await axios.post('/api/user/insert', formData);
          Swal.fire({
            text: "등록을 완료하였습니다!",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          })
          history.push('/login/form')
        } catch (e) {
          if (e.message === 'Request failed with status code 500') {
            Swal.fire({
              text: "이미지 파일의 확장자는 jpg, png만 가능합니다.",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            })
          }
        }

      }
    })





  }



  const onChangeFormFile = (e) => {
    setForm({
      ...form,
      file: e.target.files[0],
    })
    setImage(URL.createObjectURL(e.target.files[0]))

  }


  //주소 받는 API
  const handlePostCode = (data) => {

    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    setAddress(fullAddress)
  }

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    width: "600px",
    height: "600px",
    padding: "7px",
  };


  return (

    <div>

      <div className='modal-address'>
        {isPopupOpen && (
          <div>
            <DaumPostcode
              style={postCodeStyle} onClose={() => setIsPopupOpen(false)} onComplete={handlePostCode} />
          </div>
        )}
      </div>

      <Row className='d-flex justify-content-center my-5'>
        <Card style={{ width: '30rem' }} className="p-3">
          <Form>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="id"
                value={uid}
                name="uid"
                helperText="15자 이하로 기입"
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                onChange={onChangeForm}
              />
            </Grid>

            <Button onClick={onCheckUid} className='mt-3'>아이디 중복 확인</Button>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                helperText="8-10자 영문대소문자와 숫자를 조합"
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                value={upass}
                name="upass"
                autoComplete="upass"
                type="password"
                onChange={onChangeForm}
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="upass"
                label="confirm Password"
                value={pass1}
                name="upass"
                autoComplete="upass"
                type="password"
                onChange={(e) => setPass1(e.target.value)}
              />
            </Grid>
            {message && <Alert>{message}</Alert>}
            <Button onClick={onConfirmPassword} className='mt-3'>패스워드 일치 확인</Button>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="uname"
                value={uname}
                name="uname"
                autoComplete="uname"
                onChange={onChangeForm}
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
            <ReactDatePicker
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    style={{
                      margin: 10,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                      {"<"}
                    </button>
                    <select
                      value={getYear(date)}
                      onChange={({ target: { value } }) => changeYear(value)}
                    >
                      {years.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={months[getMonth(date)]}
                      onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                      }
                    >
                      {months.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                      {">"}
                    </button>
                  </div>
                )}
                selected={ubirth}
                maxDate={new Date()}
                onChange={date => setUbirth(date)}
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="unickname"
                value={unickname}
                name="unickname"
                onChange={onChangeForm}
              />
            </Grid>

            <Button className='mt-3' onClick={onCheckUnickanme}>닉네임 중복확인</Button>

            <hr />
            <Grid item xs={12}>
              <TextField
                value={address}
                variant="outlined"
                required
                fullWidth
                id="adresss"
                helperText="주소는 직접 입력이 불가능합니다"
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                name="uaddress"
                autoComplete="uaddress"
                onChange={onChangeForm}
              />
            </Grid>

            <Button type='button'
              style={{ marginRight: 60, marginTop: 25 }}
              onClick={() => setIsPopupOpen(true)}>우편번호 검색</Button>
            <Button className='postCode_btn'
              style={{ marginLeft: 60, marginTop: 25 }}
              type='button'
              onClick={() => setIsPopupOpen(false)} >닫기</Button>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="utel"
                label="utel"
                value={utel}
                helperText='010-0000-0000 or 010-000-0000'
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                name="utel"
                autoComplete="utel"
                onChange={onChangeForm}
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
              <TextField

                variant="outlined"
                required
                fullWidth
                id="uemail"
                label="이메일 주소"
                helperText="실제 이메일과 다를 시 비밀번호를 재발급 받는 데 지장이 있습니다"
                value={uemail}
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                name="uemail"
                autoComplete="uemail"
                onChange={onChangeForm}
              />
            </Grid>

            <hr />
            <TextField
              select
              label='성별을 선택하세요'
              fullWidth
              value={ugender}
              name='ugender'
              onChange={onChangeForm}>
              <MenuItem value='성별'>성별</MenuItem>
              <MenuItem value='남자'>남자</MenuItem>
              <MenuItem value='여자'>여자</MenuItem>
            </TextField>
            프로필 사진등록
            <br />

            <img src={image} width={100} />
            <Form.Control className='my-3'
              onChange={onChangeFormFile}
              type="file" />
            <hr />
            <Button onClick={onRegister} type="submit" style={{ width: '100%' }}>회원가입</Button>
          </Form>
        </Card>
      </Row>
    </div>
  )
}

export default LoginRegister