import { addDoc, collection, deleteDoc, doc, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import qs from 'qs';
import { default as React, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { app } from '../fireStore';
import MyChatItem from './MyChatItem';
import './MyChatList.css';
import {
    getStorage,
    ref as sRef,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    ref
} from "firebase/storage";

const MyChatList = ({ location, history }) => {
    const [file, setFile] = useState("");
    const [previewURL, setPreviewURL] = useState("");
    const [preview, setPreview] = useState(null);
    const fileRef = useRef();
    const db = getFirestore(app);
    const storage = getStorage();
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const pwriter_id = search.pwriter_id;
    const pcode = search.pcode;
    const [Message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [chatId, setChatId] = useState('unde');
    const { loginUser } = useContext(UserContext);
    const imageRef = useRef();


    useEffect(() => {
        if (file !== "") {
            setPreview(
                <img className="img_preview" src={previewURL} alt="previewImage" />
            );
        }
        return () => { };
    }, [file, previewURL]);

    const handleFileOnChange = event => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setFile(file);
            setPreviewURL(reader.result);

            saveToFirebaseStorage(file);
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleFileButtonClick = e => {
        e.preventDefault();
        fileRef.current.click();
    };

    // 여기가 upload 함수입니다.
    const saveToFirebaseStorage = file => {
        const uniqueKey = new Date().getTime();
        const newName = file.name
            .replace(/[~`!#$%^&*+=\-[\]\\';,/{}()|\\":<>?]/g, "")
            .split(" ")
            .join("");

        const metaData = {
            contentType: file.type
        };

        const storageRef = sRef(storage, "Images/" + newName + uniqueKey);
        const UploadTask = uploadBytesResumable(storageRef, file, metaData);
        UploadTask.on(
            "state_changed",
            snapshot => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            error => {
                alert(`error: image upload error ${JSON.stringify(error)}`);
            },
            () => {
                getDownloadURL(UploadTask.snapshot.ref).then(downloadUrl => {
                    console.log(`완료 url: ${downloadUrl}`);
                });
            }
        );
    };

    // 여기가 delete 코드입니다.
    const deleteFile = () => {
        const desertRef = sRef(storage, "Images/파일이름을넣어주세요");

        deleteObject(desertRef)
            .then(() => {
                console.log(`delete success`);
            })
            .catch(error => {
                console.log(`delete ${error}`);
            });
    };

    const getRoomList = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            limit(100)
        );

        //chatroom fetch
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

                //same chatId onclick ㅡ> duplicate x
                if ((doc.id !== chatId) && (chatId.includes('unde'))) {
                    document.getElementsByClassName('list-group chat-list')[0].append(li);
                }
            });


            for (let i = 0; i < document.getElementsByClassName('list-group-item').length; ++i) {
                document.getElementsByClassName('list-group-item')[i].addEventListener("click", function (e) {
                    setChatId(document.getElementsByClassName("text-small")[i].innerHTML)
                })
            }
            //if no chatroom
            const li = document.createElement('div');

            li.innerHTML = `
            <h1 class='no-chatroom'>개설된 채팅방이 없습니다</h1>`
                ;

            //no chatId ㅡ>  guidance
            if (!document.querySelector(".list-group-item"))
                document.getElementsByClassName('row')[0].append(li);




        });

    }

    //Doc element를 최초 생성
    const sendMessage = async (e) => {
        if (e.keyCode === 13) {
            if (Message === '') {
                alert('보낼 내용을 입력하세요')
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
                date: new Date().getTime(),
                uid: sessionStorage.getItem('uid'),
                unickname: loginUser.unickname,
                uprofile: loginUser.uprofile
            });
            setMessage('');
        }
    }

    const getMessageList = () => {
        const q = query(
            collection(db, `chatroom/${chatId}/messagelist`),
            orderBy('date', 'asc'),
            limit(100)
        );

        onSnapshot(q, (snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                rows.push({
                    id: doc.id,
                    uid: doc.data().uid,
                    text: doc.data().text,
                    date: doc.data().date,
                    unickname: doc.data().unickname,
                    uprofile: doc.data().uprofile
                });
            });
            setMessageList(rows);
        });
    }

    const onDelete = async (id) => {
        if (!window.confirm(`메세지를 삭제하시겠습니까?`)) return;
        await deleteDoc(doc(db, `chatroom/${chatId}/messagelist`, id));
    }

    useEffect(() => {
        getRoomList();
        getMessageList();
    }, [chatId]);





    return (
        <li className="container" style={{ marginTop: 100 }}>
            <li className="row" style={{ margin: '150px 0px' }}>

                <li className="col-3 p-0">

                    <ul className="list-group chat-list">
                    </ul>

                </li>
                <li className="col-9 p-0">

                    {chatId.length > 5 && <li className="chat-room">
                        <div className="wrap">
                            {messageList.map(message =>
                                <div className={message.uid === sessionStorage.uid ? 'chat ch2' : 'chat ch1'}>
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
                                    placeholder='enter를 누르세요' className="mx-2" />
                                <div className="priveiw-rapping">{preview}</div>
                                <div style={{ padding: 10 }}>
                                    <input
                                        ref={fileRef}
                                        hidden={true}
                                        id="file"
                                        type="file"
                                        onChange={handleFileOnChange}
                                    ></input>

                                    <button onClick={handleFileButtonClick}>UPLOAD</button>
                                    <button onClick={deleteFile}>DELETE</button>
                                </div>
                                <Form.Control type="file" name='firebaseImage' style={{ display: 'none' }} />
                                <img src="../image/attach.png" ref={imageRef} />
                            </Form>
                            <div>
                                {sessionStorage.getItem('uid') !== pwriter_id &&
                                    <Button onClick={() => history.push(`/my/pay/${pcode}`)}>결제창 이동</Button>}
                                <Button style={{ marginLeft: 80 }} onClick={() => history.go(-1)}>뒤로가기</Button>
                            </div>
                        </Row>
                    </li>}
                </li>
            </li>
        </li>
    )
}

export default MyChatList