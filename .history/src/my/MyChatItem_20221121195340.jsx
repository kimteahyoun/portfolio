import React, { useContext } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

const MyChatItem = ({ message, onDelete }) => {
    const { loginUser } = useContext(UserContext);
    const { text, date, who, id } = message;



    return (
        <>
                    <div>
                        <p style={{ fontSize: 20 }}>
                            {sessionStorage.getItem('uid')===who[0] ? who[0] : who[1]}</p>
                        <span>{JSON.stringify(date)}</span>
                    </div>
                    <div className="textbox">
                        <p style={{ textAlign: 'left' }}>
                            {text}
                        </p>
                        {who[0] === loginUser.uid && <Button className='mt-3' onClick={() => onDelete(id)}>삭제</Button>}
                    </div>

        </>


    )
}

export default MyChatItem