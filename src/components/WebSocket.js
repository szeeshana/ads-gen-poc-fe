import React, { useEffect, useState } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket';

function WebSocketComponent() {
    const [message, setMessage] = useState('');
    const [client, setClient] = useState(null);
    const [messageStatus, setMessageStatus] = useState('');
    const [msgData, setMsgData] = useState('');

    useEffect(() => {
        const newClient = new W3CWebSocket('ws://localhost:4000');

        newClient.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newClient.onmessage = (event) => {
            const receivedMessage = event.data;
            setMsgData(receivedMessage);
            console.log(`Received message from server: ${receivedMessage}`);
            setMessageStatus('delevered');
            setTimeout(() => {
                receivedMessage === 'seen' ? setMessageStatus('seen') : setMessageStatus('delevered');
            }, 2000);
        };

        newClient.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setClient(newClient);

        // Cleanup function to close the WebSocket on component unmount
        return () => {
            if (newClient.readyState === newClient.OPEN) {
                newClient.close();
            }
        };
    }, [messageStatus]);

    const sendMessage = (text) => {
        if (client && client.readyState === client.OPEN) {
            client.send(text);
        }
    };

    const handleInputChange = (e) => {
        setMessageStatus('you are typing...');
        setMessage(e.target.value);
    };

    const handleSendClick = () => {
        setMessageStatus('sending...');
        sendMessage(message);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>WebSocket Example</h1>
            <hr />
            <p style={{ fontSize: '20px' }}>Message Status: <b>{messageStatus}</b></p>
            <br/>
            <br/>
            <input type="text" value={message} onChange={handleInputChange} />
            <button onClick={handleSendClick}>Send</button>
            <br/>
            <br/>

            <h1>{msgData}</h1>
        </div>
    );
}

export default WebSocketComponent