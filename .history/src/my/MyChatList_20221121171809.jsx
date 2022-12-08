import { collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { app } from '../fireStore';
import './MyChatList.css'
const MyChatList = () => {
    const db = getFirestore(app);

    const getMessages = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            orderBy('date', 'asc'),
            limit(100)
        );

        console.log(q);
        onSnapshot(q, (snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                document.querySelector('chat-list')
                    .append(document.createElement('li'))
                    .textContent = `<li className="list-group-item">
                <h6>${doc.data().who[1]}</h6>
                <h6 className="text-small">${doc.id}</h6>
            </li>`;
            });
        });
    }

    useEffect(() => {
        getMessages();
    }, [])

    return (
        <div className="container p-4 detail">
            <div className="row">
                <div className="col-3 p-0">
                    <ul className="list-group chat-list">

                    </ul>
                </div>
                <div className="col-9 p-0">
                    <div className="chat-room">
                        <ul className="list-group chat-content">
                            <li><span className="chat-box">채팅방1 내용</span></li>
                            <li><span className="chat-box">채팅방1 내용</span></li>
                            <li><span className="chat-box mine">채팅방1 내용</span></li>
                        </ul>
                        <div className="input-group">
                            <input className="form-control" id="chat-input" />
                            <button className="btn btn-secondary" id="send">전송</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyChatList