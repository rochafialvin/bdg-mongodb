// API CONF
const express = require('express')
const app = express()
const port = 2099

app.use(express.json())

// MONGODB CONF
const mongodb = require('mongodb')
// Membuat koneksi ke mongodb
const MongoClient = mongodb.MongoClient

const URL = "mongodb://127.0.0.1:27017"
const databaseName = 'bdg-mongodb'

MongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if(err){
        return console.log(err)
    }

    const db = client.db(databaseName)

    // GET ALL DATA

    // POST DATA
    app.post('/users', (req, res) => {

        let {name, role, age} = req.body

        db.collection('users').insertOne({name,role,age})
            .then((resp) => {
                res.send({
                    pesan: "Data berhasil di input",
                    response: {
                        insertedData : resp.ops[0]
                    }
                })
            }).catch((err) => {
                res.send(err)
            })


    })
    
})


app.listen(port, () => {
    console.log("API berhasil running di port " + port)
})

// callback function pada listen akan di running saat berhasil menjalankan API