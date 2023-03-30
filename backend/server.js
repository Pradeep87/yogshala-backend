const app = require('./app')
const PORT = process.env.PORT
const { connectDatabase } = require("./db/coon")


connectDatabase()


app.listen(PORT, () => {
    console.log(`server in running at port ${PORT}`)
})
