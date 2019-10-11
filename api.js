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

    // INIT DATA
    app.get('/initdata', (req, res) => {
        db.collection('users').insertMany([
            { name: 'Jhonny', age: 28 },
            { name: 'Deep', age: 38 },
            { name: 'Bean', age: 19 },
            { name: 'Dora', age: 22 },
            { name: 'Marvel', age: 32 },
            { name: 'Benjamin', age: 32 },
        ]).then((resp) => {
            res.send("<h1>Data Init berhasil di tambahkan</h1>")

        }).catch(() => {
            res.send("Gagal init data")

        })
    })

    // HOME
    app.get('/', (req, res) => {
        
        res.send('<h1>API Running di port 2099</h1>')
    })

    // GET ALL DATA
    app.get('/users', (req, res) => {

        db.collection('users').find({}).toArray()
            .then((resp) => {
                // resp = [{}, {}, {}]
                if(resp.length === 0){
                   return res.send({message: "Data kosong"})
                } 

                res.send(resp)

            }).catch((err) => {
                res.send(err)

            })

    })

    // GET ALL DATA WITH 'QUERY'

    /*
        1. Kirim pesan error ketika age kosong / tidak di isi data
        2. Jika data tidak ditemukan maka kirim respon dalam bentuk object yang memiliki propert 'err'
            templat pesan err = Data dengan umur ... tidak di temukan
    */
    app.get('/users/many', (req, res) => {

        let {age} = req.query

        age = parseInt(age)

        db.collection('users').find({age}).toArray()
            .then((resp) => {
                res.send(resp)

            }).catch((err) =>{
                res.send(err)

            })
    })

    // GET ONE DATA WITH 'QUERY'

    /*
        1. Kirim pesan error jika user tidak memberikan salah satu atau kedua data (name, age)
            template err = Mohon isi data untuk properti 'name', 'age'
        
        2. Jika data tidak ditemukan, kirim object dg property 'err'
            templat err = Tidak dapat menemukan user dengan nama ... dan umur ...
    */
    app.get('/users/one', (req, res) => {
        // req.query = {name, age}
        let {age, name} = req.query

        age = parseInt(age)

        db.collection('users').findOne({ age, name})
            .then((resp) => {
                res.send(resp)

            }).catch((err) => {
                res.send(err)

            })

    })


    // POST DATA

    /*
        1. Kirim pesan error jika name, role , age kosong
            template err = Tolong isi data 'name', 'role', 'age'
    */
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

    // PUT (EDIT) DATA
    app.put('/users/:name', (req, res) => {
        //req.params.nama , KRITERIA

        //req.body.name, DATA
        //req.body.age
        db.collection('users').updateOne({
            name : req.params.name
        }, {
            $set: {
                name: req.body.name,
                age: req.body.age
            }

        }).then((resp) => {
            res.send(resp)

        }).catch((err) => {
            res.send(err)

        })
        
    })

    // DELETE ONE USER BY AGE
    
})


app.listen(port, () => {
    console.log("API berhasil running di port " + port)
})

