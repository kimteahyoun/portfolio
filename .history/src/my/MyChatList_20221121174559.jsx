import { collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { app } from '../fireStore';
import './MyChatList.css'
const MyChatList = () => {
    const db = getFirestore(app);

    const onAppendHtml = () => {
        const li = document.createElement('li');

        li.classNameName = 'list-group-item';

        li.innerHTML = `
        <h6>채팅방1</h6>
        <h6 className="text-small">채팅방아이디</h6>
        `;

        document.getElementsByClassName('list-group chat-list')[0].appendChild(li);
    }

    const getMessages = () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            orderBy('date', 'asc'),
            limit(100)
        );

        onSnapshot(q, (snapshot) => {
            let rows = [];

            snapshot.forEach((doc) => {
                onAppendHtml();
            });
        });
    }

    useEffect(() => {
        getMessages();
    }, [])

    return (
        <li className="container p-4 detail">
            <li className="row">
                <li className="col-3 p-0">
                    <ul className="list-group chat-list">
                        <li className="list-group-item">
                            <h6>채팅방1</h6>
                            <h6 className="text-small">채팅방아이디</h6>
                        </li>
                    </ul>
                </li>
                <li className="col-9 p-0">
                    <li className="chat-room">
                        <ul className="list-group chat-content">
                            <li><span className="chat-box">채팅방1 내용</span></li>
                            <li><span className="chat-box">채팅방1 내용</span></li>
                            <li><span className="chat-box mine">채팅방1 내용</span></li>
                        </ul>
                        <li className="input-group">
                            <input className="form-control" id="chat-input" />
                            <button className="btn btn-secondary" id="send">전송</button>
                        </li>
                    </li>
                </li>
            </li>
        </li>
    )
}

export default MyChatList