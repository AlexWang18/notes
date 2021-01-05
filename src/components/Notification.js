import React from 'react'

const Notification = ({message}) => {
    if(message === null){
        return null; //nothing gets rendered
    }

    return (
        <div className = 'error'>
            {message}
        </div>
    )
}

export default Notification