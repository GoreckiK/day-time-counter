import React, { useState } from 'react';
import './App.css';
import { Button, Modal, FormControl, InputLabel, Input } from '@material-ui/core';
import { CardComponent } from './components/CardComponent';

export interface ICounter {
  counterName: string,
  countTime: number
}

function App() {
  const [cards, setCards] = useState([] as ICounter[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const addCard = () => {
    setIsModalOpen(true);
  }
// @ts-ignore
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const firstInputValue = e.target.form[0].value;
    // const secondInputValue = e.target.form[1].value;
    setCards([...cards].concat({counterName: firstInputValue, countTime: 0}));
    setIsModalOpen(false);
  }

  return (
      <div className="App">
          {cards.length === 0 && <div>
              Create your first task
          </div>}
          <Button onClick={addCard}>Add</Button>
          {cards.map(card => {
            return <CardComponent counter={card} key={card.counterName}/>
          })}
          <div>
            <Modal open={isModalOpen} style={{width: '500px'}} onClose={() => setIsModalOpen(false)}>
              <div className='modal'>
                <form style={{display: 'flex', flexDirection: 'column'}}>
                  <FormControl>
                    <InputLabel>Name for counter</InputLabel>
                    <Input></Input>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Name for counter 2</InputLabel>
                    <Input></Input>
                  </FormControl>
                  <button type='submit' onClick={handleSubmit}>Ok</button>
                </form>
              </div>
            </Modal>
          </div>
      </div>
  );
}

export default App;
