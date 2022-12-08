import React, { useContext } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';

const MyChatItem = ({ message, onDelete }) => {
    const { loginUser } = useContext(UserContext);
    const { text, date, who, id } = message;



    return (
        <>
        
   
                    <div>
                        <p style={{ fontSize: 20 }}>{who[0]}</p>
                        <img className='icon' src={uprofile} />
                        <p >{date}</p>
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