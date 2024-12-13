// console.log("Starting")

const exprees = require('express')


const app = exprees()


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/test', (req, res) => {
    res.end('testing')
})

app.get('/test', (req, res) => {
    res.send('testing again')
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})