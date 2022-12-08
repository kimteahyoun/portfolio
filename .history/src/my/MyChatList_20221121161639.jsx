import { collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect,useState } from 'react';
import { app } from '../fireStore';

const MyChatList = () => {
    const [messages, setMessages] = useState([]);
    const db = getFirestore(app);
    
    const getMessages = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who','array-contains',sessionStorage.getItem('uid')),
            orderBy('date', 'asc'),
            limit(100)
        );

            //field의 data만 가져올 수 있음.
        onSnapshot(q, (snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                rows.push({
                    id: doc.id
                });
            });
            setMessages(rows);
        });
    }

    useEffect(() => {
        getMessages();
    }, [])

    return (
        <div class="container p-4 detail">
        <div class="row">
          <div class="col-3 p-0">
            <ul class="list-group chat-list">
              <li class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </li>
            </ul>
          </div>
          <div class="col-9 p-0">
            <div class="chat-room">
              <ul class="list-group chat-content">
                <li><span class="chat-box">채팅방1 내용</span></li>
                <li><span class="chat-box">채팅방1 내용</span></li>
                <li><span class="chat-box mine">채팅방1 내용</span></li>
              </ul>
              <div class="input-group">
                <input class="form-control" id="chat-input">
                <button class="btn btn-secondary" id="send">전송</button>
              </div>
            </div>
          </div>
        </div>
     </div> 
    )
}

export default MyChatList