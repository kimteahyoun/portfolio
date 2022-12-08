import { collection, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect,useState } from 'react';
import { app } from '../fireStore';

const MyChatList = () => {
    const [messages, setMessages] = useState([]);
    const db = getFirestore(app);
    
    const getMessages = () => {
        const q = query(
            collection(db, `chatroom`),
            where('')
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
        <div style={{ marginTop: 100 }}>
            {messages}
        </div>
    )
}

export default MyChatList