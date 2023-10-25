import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const URL = 'http://localhost:3001/'

function App() {
  const [items, setItems] = useState([])
  const [item, setItem] = useState()
  const [amount, setAmount] = useState()

  function fetchData () {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
      }).catch (error => {
        alert(error.response.data.error)
      })
  }

  function save() {
    const json = JSON.stringify({description: item, amount: amount})
    const newURL = URL + 'new' + json

    axios.post(URL + 'new',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const addedObject = JSON.parse(json)
      addedObject.id = response.data.id
      setItems(items => [...items, addedObject])
      setItem('')
      setAmount('')
    }).catch(error => {
      alert(error.response.data.error)
    })
  }
  
  function add1(id) {
    axios.post(`${URL}add/${id}`)
    .then (() => {
      fetchData()
    }, (error) => {
      alert(error.response.data.error)
    })
  }

  function remove1(id) {
    axios.post(`${URL}remove/${id}`)
    .then (() => {
      fetchData()
    }, (error) => {
      alert(error.response.data.error)
    })
  }

  function remove(id) {
    axios.delete(`${URL}delete/${id}`)
    .then(() => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id)
      setItems(newListWithoutRemoved)
    }).catch (error => {
      alert(error.response.data.error)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  
  return (
    <div>
      <h3>shoppinglist</h3>
      <form>
        <label>Add new</label>
        <input value={item} onChange={e => setItem(e.target.value)} />
        <br />
        <label>Montako laitetaan?</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} />
        <br />
        <button type='button' onClick={save}>Save</button>
      </form>
      <table>
        <tr>
          <th>ID</th><th>Itemi</th><th>Määrä</th><th>Lisää 1</th><th>Vähennä 1</th><th>Poista</th>
        </tr>
        {items.map(item => (
          <tr>
            <td>{item.id}</td>
            <td>{item.description}</td>
            <td>{item.amount}</td>
            <td><a href="#" onClick={() => add1(item.id)}>Add 1</a></td>
            <td><a href="#" onClick={() => remove1(item.id)}>Remove 1</a></td>
            <td><a href="#" onClick={() => remove(item.id)}>Delete item</a></td>
          </tr>
        ))}
        
      </table>
    </div>
  );
}

export default App;
