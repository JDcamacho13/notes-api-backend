const express = require('express')
const loggerMiddleware = require('./loggerMiddleware')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(loggerMiddleware)

let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		date: '2019-05-30T17:30:31.098Z',
		important: true
	},
	{
		id: 2,
		content: 'Browser can execute only Javascript',
		date: '2019-05-30T18:39:34.091Z',
		important: false
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		date: '2019-05-30T19:20:35.091Z',
		important: true
	}
]

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
	res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
	const noteId = Number(req.params.id)
	const note = notes.find(note => note.id === noteId)

	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}

})

app.delete('/api/notes/:id', (req, res) => {
	const noteId = Number(req.params.id)
	notes = notes.filter(note => note.id !== noteId)
	res.status(204).end()
})

app.post('/api/notes', (req, res) => {
	const { content, important } = req.body
 
	if (!content) {
		return res.status(400).json({ error: 'content missing' })
	}

	const ids = notes.map(note => note.id)
	const id = Math.max(...ids) + 1

	const note = {
		id,
		content: content,
		date: new Date().toISOString(),
		important: typeof important === 'undefined' ? false : important
	}

	notes = [...notes, note]
	res.status(201).json(note)
})

app.use((__req, res) => {
	res.status(404).json({ error: 'Not found' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})