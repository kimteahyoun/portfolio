import { addDoc, collection, deleteDoc, doc, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import moment from 'moment/moment';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Row, Button, Spinner } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { app } from '../fireStore';
import './MyChatRead.css'
import MyChatItem from './MyChatItem';
import qs from 'qs';
const MyChatRead = ({ match, history, location }) => {
    const { loginUser } = useContext(UserContext);
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const pwriter_id = search.pwriter_id;
    const pcode = match.params.pcode;
    const db = getFirestore(app);
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState([]);

    //Doc element를 최초 생성
    const sendMessage = async (e) => {
        if (e.keyCode === 13) {
            if (msg === '') {
                alert('보낼 내용을 입력하세요')
                return;
            }
            if (e.ctrlKey) {
                let val = e.target.value;
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                e.target.value = val.substring(0, start) + "\n" + val.substring(end);
                setMsg(e.target.value);
                return false; //  prevent focus
            }

            const docRef = collection(db, 'chatroom');
            await addDoc(docRef, {
                who: [sessionStorage.getItem('uid'), pwriter_id],
                text: msg,
                date: moment(new Date()).format('LTS'),
            });
            setMsg('');
        }
    }

    const getMessages = () => {
        const q = query(
            collection(db, `chatroom`),
            orderBy('date', 'asc'),
            limit(100)
        );

        onSnapshot(q, (snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                rows.push({
                    id:doc.id,
                    who: [sessionStorage.getItem('uid'), pwriter_id],
                    text: doc.data().text,
                    date: doc.data().date,
                });
            });
            setMessages(rows);
        });
    }

    useEffect(() => {
        getMessages()
    }, []);



    const onDelete = async (id) => {
        if (!window.confirm(`메세지를 삭제하시겠습니까?`)) return;
        await deleteDoc(doc(db, `rooms/${sessionStorage.getItem('uid')}/room${sessionStorage.getItem('uid')}`, id));
    }

    if (!messages) return (
        <Spinner animation="border" variant="primary"
            style={{ width: '20rem', height: '20rem', marginTop: '220px' }} />
    )

    return (
        <div style={{ margin: '50px 0px' }}>
            {/*         <Button onClick={()=>onDeleteAll()}>채팅창초기화</Button> */}
            <div className="wrap">

                {messages.map(message =>
                    <div className={message.uid === loginUser.uid ? 'chat ch2' : 'chat ch1'}>
                        <MyChatItem key={message.id}
                            message={message}
                            onDelete={onDelete} />
                    </div>
                )}

            </div>

            <Row className="mt-5 justify-content-center">
                <Form className="d-flex my-3" style={{ width: '52rem' }}>
                    <Form.Control
                        as="textarea"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={sendMessage}
                        placeholder='enter를 누르세요' className="mx-2" />
                </Form>
                <div>
                    {sessionStorage.getItem('uid') !== pwriter_id &&
                        <Button onClick={() => history.push(`/my/pay/${pcode}`)}>결제창 이동</Button>}
                </div>
            </Row>
        </div>
    )
}

export default MyChatRead