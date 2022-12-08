import React, { useContext } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

const MyChatItem = ({ message, onDelete }) => {
    const { loginUser } = useContext(UserContext);
    const { text, date, uid, id,unickanme } = message;



    return (
        <>
                    <div>
                        <p style={{ fontSize: 20 }}>
                            {unickname}</p>
                            {loginUser.unickname !== uid && <img className='icon' src={uprofile} />}
                        <span>{JSON.stringify(date)}</span>
                    </div>
                    <div className="textbox">
                        <p style={{ textAlign: 'left' }}>
                            {text}
                        </p>
                        {uid===sessionStorage.getItem('uid') && <Button className='mt-3' onClick={() => onDelete(id)}>삭제</Button>}
                    </div>

        </>


    )
}

export default MyChatItem