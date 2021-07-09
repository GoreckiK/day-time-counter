import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, Modal, FormControl, InputLabel, Input } from '@material-ui/core';
import { CardComponent } from './components/CardComponent';
import { ChartComponent } from './components/ChartComponent';
import { addItem, getCards } from './api';
import { HexColorPicker } from 'react-colorful';

export interface ICard {
  id: string,
  counterName: string,
  countTime: number,
  timeStamps: ITimeStamp[],
  color: string
}

interface ITimeStamp {
  startTime: string,
  finishTime: string
}

function App() {
  const [cards, setCards] = useState([] as ICard[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counterNames, setCounterNames] = useState([] as string[])
  const [pickedColor, setPickedColor] = useState('#aabbcc');

  useEffect(() => {
    async function getDbCards() {
      const {resources: dbCards} = await getCards();
      setCards(dbCards);
      const cardsNames = dbCards.map(card => card.counterName);
      setCounterNames(cardsNames);
    }
    console.log('getCards');
    getDbCards();
  }, []);
  
  const addCard = () => {
    setIsModalOpen(true);
  }

  const updateCards = (card: ICard) => {
    const cardsCopy = [...cards];
    const cardIndex = cardsCopy.findIndex(cardCopy => cardCopy.id === card.id);
    cardsCopy.splice(cardIndex, 1, card);
    setCards(cardsCopy);
  }

  const deleteCard = (id: string) => {
    const cardsCopy = [...cards];
    const cardIndex = cardsCopy.findIndex(cardCopy => cardCopy.id === id);
    cardsCopy.splice(cardIndex, 1);
    setCards(cardsCopy);
  }
// @ts-ignore
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const firstInputValue = e.target.form[0].value;
    const newItem = {counterName: firstInputValue, countTime: 0, timeStamps: [], color: pickedColor};
    if (!counterNames.includes(firstInputValue)) {
      //@ts-ignore
      setCards([...cards].concat(newItem));
      setIsModalOpen(false);
      await addItem(newItem);      
    }
  }

  return (
      <div className="App">
          {cards.length === 0 && <div>
              Create your first task
          </div>}
          <Button onClick={addCard}>Add</Button>
          <div className='cards-container'>
            {cards.map(card => {
              //@ts-ignore
              return <CardComponent cardData={card} key={card.counterName} updateCards={updateCards} deleteCard={deleteCard}/>
            })}
          </div>
          <div className='charts-area'>
            <ChartComponent cardsData={cards} />
          </div>
          <div>
            <Modal open={isModalOpen} style={{width: '500px'}} onClose={() => setIsModalOpen(false)}>
              <div className='modal'>
                <form style={{display: 'flex', flexDirection: 'column'}}>
                  <FormControl>
                    <InputLabel>Name for counter</InputLabel>
                    <Input></Input>
                  </FormControl>
                  <HexColorPicker color={pickedColor} onChange={setPickedColor} />
                  <button type='submit' onClick={handleSubmit}>Ok</button>
                </form>
              </div>
            </Modal>
          </div>
      </div>
  );
}

export default App;
