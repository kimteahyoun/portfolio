import { addDoc, collection, deleteDoc, doc, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import qs from 'qs';
import { default as React, useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { app } from '../fireStore';
import MyChatItem from './MyChatItem';
import './MyChatList.css';

const MyChatList = ({ location, history }) => {
    const db = getFirestore(app);
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const pwriter_id = search.pwriter_id;
    const pcode = search.pcode;
    const [Message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [chatId, setChatId] = useState('unde');
    const { loginUser } = useContext(UserContext);
    const imageRef = useRef();

    const [files, setFileList] = useState([]); // 파일 리스트
    const [isUploading, setUploading] = useState(false); // 업로드 상태
    const [photoURL, setPhotosURL] = useState([]); // 업로드 완료된 사진 링크들
    const [progress, setProgress] = useState(0); // 업로드 진행상태


    const handleImageChange = (e) => {
        for (const image of e.target.files) {
          setFileList((prevState) => [...prevState, image]);
        }
      };
    
      // 업로드시 호출될 함수
      const handleImageUpload = async (e, fileList) => {
        e.preventDefault();
        try {
          setUploading(true);
          // 업로드의 순서는 상관없으니 Promise.all로 이미지 업로드후 저장된 url 받아오기
          const urls = await Promise.all(
            fileList?.map((file) => {
             // 스토리지 어디에 저장되게 할껀지 참조 위치를 지정. 아래와 같이 지정해줄시 images 폴더에 파일이름으로 저장
              const storageRef = ref(Storage, `images/${file.name}`);
              
              // File 또는 Blob 타입일 경우 uploadBytes 또는 uploadBytesResumable 메소드를 사용
              // 만약 base64 또는 data_url 문자열로 업로드를 진행할 경우는 uploadString 사용
              // 자세한 내용은 https://firebase.google.com/docs/storage/web/upload-files 공식문서 참고
              const task = uploadBytesResumable(storageRef, file);
              
              // 업로드 진행률을 모니터링, 업로드 진행률 퍼센트로 상태 지정
              task.on("state_changed", (snapshot) => {
                setProgress(
                  Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  )
                );
              });
              return getDownloadURL(storageRef);
            })
          );
          // 업로드된 이미지 링크 상태로 지정 (보통은 해당 링크를 데이터베이스(파이어스토어)에 저장)
          setPhotosURL(urls);
          alert("성공적으로 업로드 되었습니다");
        } catch (err) {
          console.error(err);
        }
        // 초기화
        setProgress(0);
        setUploading(false);
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

    const onClickref = () => {
        imageRef.current.onClick()
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

                    <li className="chat-room">
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
                                <Form.Control type="file" name='firebaseImage' style={{ display: 'none' }} />
                                <img src="../image/attach.png" ref={imageRef} />
                            </Form>
                            <div>
                                {sessionStorage.getItem('uid') !== pwriter_id &&
                                    <Button onClick={() => history.push(`/my/pay/${pcode}`)}>결제창 이동</Button>}
                                <Button style={{ marginLeft: 80 }} onClick={() => history.go(-1)}>뒤로가기</Button>
                            </div>
                        </Row>
                    </li>
                </li>
            </li>
        </li>
    )
}

export default MyChatList