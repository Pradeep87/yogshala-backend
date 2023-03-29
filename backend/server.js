const app = require('./app')
const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`server in running at port ${PORT}`)
})