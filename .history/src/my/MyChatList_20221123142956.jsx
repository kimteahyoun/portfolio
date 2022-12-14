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

    const db = getFirestore(app);
    const storage = getStorage();
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const pwriter_id = search.pwriter_id;
    const pcode = search.pcode;
    const [Message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [chatId, setChatId] = useState('unde');
    const { loginUser } = useContext(UserContext);
    /*    const [file, setFile] = useState("");
       const [previewURL, setPreviewURL] = useState("");
       const [preview, setPreview] = useState(null);
       const fileRef = useRef(); */


    /*     useEffect(() => {
            if (file !== "") {
                setPreview(
                    <img className="img_preview" src={previewURL} alt="previewImage" />
                );
            }
            return () => { };
        }, [file, previewURL]); */

    /*     const handleFileOnChange = event => {
            event.preventDefault();
            const file = event.target.files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setFile(file);
                setPreviewURL(reader.result);
    
                saveToFirebaseStorage(file);
            };
            if (file) reader.readAsDataURL(file);
        }; */

    /*     const handleFileButtonClick = e => {
            e.preventDefault();
            fileRef.current.click();
        }; */

    // ????????? upload ???????????????.
    /*    const saveToFirebaseStorage = file => {
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
                       console.log(`?????? url: ${downloadUrl}`);
                   });
               }
           );
       }; */

    // ????????? delete ???????????????.
    /*     const deleteFile = () => {
            const desertRef = sRef(storage, "Images/??????????????????????????????");
    
            deleteObject(desertRef)
                .then(() => {
                    console.log(`delete success`);
                })
                .catch(error => {
                    console.log(`delete ${error}`);
                });
        }; */

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

                //same chatId onclick ???> duplicate x
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
            <h1 class='no-chatroom'>????????? ???????????? ????????????</h1>`
                ;

            //no chatId ???>  guidance
            if (!document.querySelector(".list-group-item"))
                document.getElementsByClassName('row')[0].append(li);




        });

    }

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
        if (!window.confirm(`???????????? ?????????????????????????`)) return;
        await deleteDoc(doc(db, `chatroom/${chatId}/messagelist`, id));
    }

    useEffect(() => {
        getRoomList();
        getMessageList();
    }, [chatId]);

    const handleImageChange = (e) => {
        for (const image of e.target.files) {
          setFileList((prevState) => [...prevState, image]);
        }
      };
    
      // ???????????? ????????? ??????
      const handleImageUpload = async (e, fileList) => {
        e.preventDefault();
        try {
          setUploading(true);
          // ???????????? ????????? ??????????????? Promise.all??? ????????? ???????????? ????????? url ????????????
          const urls = await Promise.all(
            fileList?.map((file) => {
             // ???????????? ????????? ???????????? ????????? ?????? ????????? ??????. ????????? ?????? ??????????????? images ????????? ?????????????????? ??????
              const storageRef = ref(storage, `images/${file.name}`);
              
              // File ?????? Blob ????????? ?????? uploadBytes ?????? uploadBytesResumable ???????????? ??????
              // ?????? base64 ?????? data_url ???????????? ???????????? ????????? ????????? uploadString ??????
              // ????????? ????????? https://firebase.google.com/docs/storage/web/upload-files ???????????? ??????
              const task = uploadBytesResumable(storageRef, file);
              
              // ????????? ???????????? ????????????, ????????? ????????? ???????????? ?????? ??????
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
          // ???????????? ????????? ?????? ????????? ?????? (????????? ?????? ????????? ??????????????????(??????????????????)??? ??????)
          setPhotosURL(urls);
          alert("??????????????? ????????? ???????????????");
        } catch (err) {
          console.error(err);
        }
        // ?????????
        setProgress(0);
        setUploading(false);
      };



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
                                    placeholder='enter??? ????????????' className="mx-2" />
                                <div>
                                    <form onSubmit={(e) => handleImageUpload(e, files)}>
                                        {/* rc-progress??? Line ??????????????? ?????? ????????? ?????? ?????? */}
                                        <Line percent={progress} strokeWidth={4} strokeColor="#ff567a" />
                                        <label>
                                            ??????:
                                            <input
                                                multiple
                                                accept="image/*"
                                                type="file"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <button type="submit">{isUploading ? "????????????..." : "?????????"}</button>
                                    </form>
                                    {photoURL?.length > 0 && (
                                        <ul>
                                            {photoURL.map((url, index) => (
                                                <li key={index}>
                                                    <img
                                                        src={url}
                                                        alt="????????? ?????? ?????????"
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <img src="../image/attach.png" />
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