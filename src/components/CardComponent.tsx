import React, { useEffect, useState } from 'react';
import { ICounter } from '../App';

export const CardComponent = ({ counter }: {counter: ICounter}) => {
    return (
        <div className='card'>
            <h2>{counter.counterName}</h2>
            <Clock/>

        </div>
    );
}

const Clock = () => {
    const [count, setCount] = useState(0);
    const [countId, setCountId] = useState(0);
    const [dateTime, setDateTime] = useState('');
    const [isCounting, setIsCounting] = useState(false);
    useEffect(() => {
        const dateTime = new Date(count * 1000).toISOString().substr(11, 8)
        setDateTime(dateTime);
    }, [count]);
    const handleClick = () => {
        if (!isCounting) {
            const intervalId = window.setInterval(() => {
                setCount(prevState => prevState + 1); 
            }, 1000);
            setCountId(intervalId);
            setIsCounting(true);
        } else {
            clearInterval(countId);
            setIsCounting(false);
        }
    };
    
    return (
        <button onClick={handleClick}>
            <div>
                Time measured: {dateTime}
            </div>
        </button>
    )
    
}
