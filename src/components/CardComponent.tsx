import React, { useEffect, useState } from 'react';
import { deleteItem, updateItem } from '../api';
import { ICard } from '../App';

export const CardComponent = ({ cardData, updateCards, deleteCard }: {cardData: ICard, updateCards: void, deleteCard: void}) => {
    const [totalTime, setTotalTime] = useState(0);
    const [timeStructured, setTimeStructured] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const totalTimeSpent = cardData.timeStamps.reduce((acc, curr) => {
            const startTime = new Date(curr.startTime).getTime();
            const finishTime = new Date(curr.finishTime).getTime();
            acc = acc + (finishTime - startTime) / 1000;
            return acc;
        }, 0)

        setTotalTime(totalTimeSpent);
        updateItem(cardData.id, {...cardData, countTime: totalTimeSpent});
    }, [cardData]);

    useEffect(() => {
        let seconds = 0, minutes = 0, hours = 0;

        if (totalTime > 60) {
            const tempMinutes = totalTime / 60;
            if (tempMinutes > 60) {
                hours = Math.trunc(tempMinutes / 60);
                const minutesRest = (tempMinutes / 60 - hours) * 60
                minutes = Math.trunc(minutesRest);
                seconds = Math.trunc(minutesRest - minutes);
            } else {
                minutes = Math.trunc(tempMinutes);
                seconds = (tempMinutes - minutes) * 60;
            }
        } else {
            seconds = totalTime
        }

        setTimeStructured({
            hours,
            minutes,
            seconds: Math.trunc(seconds)
        })
    }, [totalTime]);

    const handleDelete = () => {
        deleteItem(cardData.id, cardData.counterName);
        //@ts-ignore
        deleteCard(cardData.id);
    }
    
    return (
        <div className='card' style={{backgroundColor: cardData.color}}>
            <h2>{cardData.counterName}</h2>
            <button onClick={handleDelete}>Delete</button>
            <div>Total time today: {timeStructured.hours} h {timeStructured.minutes} m {timeStructured.seconds} s</div>
            <Clock cardData={cardData} updateCards={updateCards}/>
        </div>
    );
}

const Clock = ({ cardData, updateCards}: { cardData: ICard, updateCards: void}) => {
    const [count, setCount] = useState(0);
    const [countId, setCountId] = useState(0);
    const [dateTime, setDateTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [isCounting, setIsCounting] = useState(false);
    useEffect(() => {
        const dateTime = new Date(count * 1000).toISOString().substr(11, 8)
        setDateTime(dateTime);
    }, [count]);

    useEffect(() => {
        
    }, [startTime, finishTime])

    const updateCard = async (finishedTime: any) => {
        const newCard = {...cardData, timeStamps: [...cardData.timeStamps, {startTime, finishTime: finishedTime}]}

        await updateItem(cardData.id, newCard);
        //@ts-ignore
        updateCards(newCard);
    }
    const clearTimeStamps = () => {
        setStartTime('');
        setFinishTime('');
        setCount(0);
    }
    const handleClick = () => {
        if (!isCounting) {
            const intervalId = window.setInterval(() => {
                setCount(prevState => prevState + 1); 
            }, 1000);
            setCountId(intervalId);
            setIsCounting(true);
            setStartTime(new Date().toISOString());
        } else {
            clearInterval(countId);
            setIsCounting(false);
            const finishTime = new Date().toISOString();
            setFinishTime(finishTime);
            updateCard(finishTime);
            clearTimeStamps();
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
