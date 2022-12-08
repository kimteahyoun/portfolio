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
                <h6>${sessionStorage.getItem('uid') === doc.data().who[0] ?
                        doc.data().who[1]
                        :
                        doc.data().who[0]}</h6>
                        <p className='text-small'>${doc.id}</p>
                `;

                document.getElementsByClassName('list-group chat-list')[0].appendChild(li);

                document.getElementsByClassName('list-group-item').addEventListener("click", ()=>{
                    
                });
            });
        });
    }

    useEffect(() => {
        getMessages();
    }, [])

    return (
        <li className="container" style={{marginTop:100}}>
            <li className="row">
                <li className="col-3 p-0">
                    <ul className="list-group chat-list">

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