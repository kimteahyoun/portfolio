import { addDoc, deleteDoc, doc, collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import moment from 'moment/moment';
import qs from 'qs';
import { default as React, useContext, useEffect, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { app } from '../fireStore';
import MyChatItem from './MyChatItem';
import './MyChatList.css';

const MyChatList = ({ location, history }) => {
    const db = getFirestore(app);
    const { loginUser } = useContext(UserContext);
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const pwriter_id = search.pwriter_id;
    const pcode = search.pcode;
    const [Message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [chatId, setChatId] = useState('unde');


    const getRoomList = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            limit(100)
        );

        onSnapshot(q, (snapshot) => {

            snapshot.forEach((doc) => {
                const li = document.createElement('li');

                li.className = 'list-group-item';

                li.innerHTML = `
                <h6>${sessionStorage.getItem('uid') === doc.data().who[0] ?
                        doc.data().who[1]
                        :
                        doc.data().who[0]}</h6>
                        <p class='text-small'>${doc.id}</p>
                `;

                document.getElementsByClassName('list-group chat-list')[0].appendChild(li);

                for (let i = 0; i < document.getElementsByClassName('list-group-item').length; ++i) {
                    document.getElementsByClassName('list-group-item')[i].addEventListener("click", function (e) {

                        setChatId(document.getElementsByClassName("text-small")[i].innerHTML)
                        e.stopImmediatePropagation();

                    })
                }

            });
        });
    }
    console.log(chatId);
    //Doc element??? ?????? ??????
    const sendMessage = async (e) => {
        if (e.keyCode === 13) {
            if (Message === '') {
                alert('?????? ????????? ???????????????')
                return;
            }
            if (e.ctrlKey) {
                let val = e.target.value;
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                e.target.value = val.substring(0, start) + "\n" + val.substring(end);
                setMessage(e.target.value);
                return false; //  prevent focus
            }

            const docRef = doc(db, 'chatroom', `${chatId}`);
            const colRef = collection(docRef, 'messagelist')
            await addDoc(colRef, {
                text: Message,
                date: new Intl.DateTimeFormat('kr')
                    .format(new Date().getTime()),
                uid: sessionStorage.getItem('uid'),
            });
            setMessage('');
        }
    }

    //????????????????????????.
    const getMessageList = () => {
        const q = query(
            collection(db, `chatroom/${chatId}/messagelist`),
            orderBy('date', 'asc'),
            limit(100),
        );

        onSnapshot(q, (snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                rows.push({
                    id: doc.id,
                    uid: doc.data().uid,
                    text: doc.data().text,
                    date: doc.data().date,
                });
            });
            setMessageList(rows);
        });
    }

    const onDelete = async (id) => {
        if (!window.confirm(`???????????? ?????????????????????????`)) return;
        await deleteDoc(doc(db, `chatroom/${chatId}/messagelist`, id));
    }

    useEffect(() => {
        getRoomList();
        getMessageList();
    }, []);




    return (
        <li className="container" style={{ marginTop: 100 }}>
            <li className="row">
                <li className="col-3 p-0">
                    <ul className="list-group chat-list">

                    </ul>
                </li>
                <li className="col-9 p-0">
                    {chatId.length > 5 &&
                        <li className="chat-room">
                            <div className="wrap">
                                {messageList.map(message =>
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
                                        value={Message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={sendMessage}
                                        placeholder='enter??? ????????????' className="mx-2" />
                                </Form>
                                <div>
                                    {sessionStorage.getItem('uid') !== pwriter_id &&
                                        <Button onClick={() => history.push(`/my/pay/${pcode}`)}>????????? ??????</Button>}
                                    <Button style={{ marginLeft: 80 }} onClick={() => history.go(-1)}>????????????</Button>
                                </div>
                            </Row>
                        </li>}
                </li>
            </li>
        </li>
    )
}

export default MyChatList