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

        onSnapshot(q, (snapshot) => {
            let rows = [];

            snapshot.forEach((doc) => {
                const li = document.createElement('li');

                li.className = 'list-group-item';

                li.innerHTML = `
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
                `;

                document.getElementsByClassName('list-group chat-list').appendChild(li);
            });
        });
    }

    useEffect(() => {
        getMessages();
    }, [])

    return (
        <li class="container p-4 detail">
            <li class="row">
                <li class="col-3 p-0">
                    <ul class="list-group chat-list">
                       
                    </ul>
                </li>
                <li class="col-9 p-0">
                    <li class="chat-room">
                        <ul class="list-group chat-content">
                            <li><span class="chat-box">채팅방1 내용</span></li>
                            <li><span class="chat-box">채팅방1 내용</span></li>
                            <li><span class="chat-box mine">채팅방1 내용</span></li>
                        </ul>
                        <li class="input-group">
                            <input class="form-control" id="chat-input" />
                            <button class="btn btn-secondary" id="send">전송</button>
                        </li>
                    </li>
                </li>
            </li>
        </li>
    )
}

export default MyChatList