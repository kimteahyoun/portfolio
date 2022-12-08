import { collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { app } from '../fireStore';
import './MyChatList.css'
const MyChatList = () => {
    const db = getFirestore(app);

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
                pcode:pcode
            });
            setMsg('');
        }
    }

    const getMessages = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            orderBy('date','asc'),
            limit(100),
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


    const getRooms = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            orderBy('date', 'asc'),
            limit(100)
        );

        onSnapshot(q, (snapshot) => {
            let rows = [];

            snapshot.forEach((doc) => {
                const li = document.createElement('li');

                li.className = 'list-group-item';

                li.innerHTML = `
                <h6>${sessionStorage.getItem('uid') === doc.data().who[0] ?
                        doc.data().who[1]
                        :
                        doc.data().who[0]}</h6>
                        <p className='text-small'>${doc.id}</p>
                `;

                document.getElementsByClassName('list-group chat-list')[0].appendChild(li);

                document.getElementsByClassName('list-group-item').addEventListener("click", function () {

                });
            });
        });
    }

    useEffect(() => {
        getMessages();
    }, [])

    return (
        <li className="container" style={{ marginTop: 100 }}>
            <li className="row">
                <li className="col-3 p-0">
                    <ul className="list-group chat-list">

                    </ul>
                </li>
                <li className="col-9 p-0">
                    <li className="chat-room">
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
                    </li>
                </li>
            </li>
        </li>
    )
}

export default MyChatList