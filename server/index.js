const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const config = require('./config')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const port = 3001

app.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result, ] = await connection.execute('SELECT * FROM item')
        if (!result) result = []
        //result ? result : result = []
        res.status(200).json(result)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post('/new', async (req,res) => {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute('INSERT INTO item (description,amount) VALUES (?, ?) ',[req.body.description, req.body.amount])
        res.status(200).json({id:result.insertId})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.post('/add/:id', async (req,res) => {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute('UPDATE item SET amount = amount+1 WHERE id = ? ', [req.params.id])
        res.status(200).json({id:result.insertId})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.post('/remove/:id', async (req,res) => {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute('UPDATE item SET amount = amount-1 WHERE id = ? ', [req.params.id])
        res.status(200).json({id:result.insertId})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.delete('/delete/:id', async (req,res) => {
    try {
        const connection = await mysql.createConnection(config.db)
        //suoritetaan valmisteltu
        await connection.execute('DELETE FROM item WHERE id = ? ',[req.params.id])
        res.status(200).json({id:req.params.id})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.listen(port)