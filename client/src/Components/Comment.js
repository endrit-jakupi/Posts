import { Card } from 'antd'
import React from 'react'

function Comment(props) {
    return (
        <div style={{border: "1px solid rgba(219, 219, 219)", padding:"0.5rem"}}>
            <p>{props.text}</p>
            <p>Author: <em><b>{props.author}</b></em></p>
        </div>
    )
}

export default Comment