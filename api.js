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

    app.get('/users/many', (req, res) => {
        
        let {age} = req.query

        // Jika user tidak memberikan data pada age
        if(!age){
            return res.send({error: "Tolong isi data pada proptery age"})
        }

        age = parseInt(age)

        db.collection('users').find({age}).toArray()
            .then((resp) => {
                // find akan memberikan resp dalam bentuk array
                // Jika data tidak ditemukan
                if(resp.length == 0){
                    return res.send({error: `Data dengan umur ${age} tidak di temukan`})
                }

                res.send(resp)

            }).catch((err) =>{
                res.send(err)

            })
    })

    // GET ONE DATA WITH 'QUERY'

    app.get('/users/one', (req, res) => {
        // req.query = {name, age}
        let {age, name} = req.query

        // Jika salah satu atau keduanya tidak memiliki data
        if(!name || !age){
            return res.send({error: "Mohon isi data untuk property 'name' dan 'age' "})
        }

        age = parseInt(age)

        db.collection('users').findOne({ age, name})
            .then((resp) => {
                // findOne memberikan resp dalam bentuk object
                // resp = {} / 
                if(!resp){
                    return res.send({error: `Tidak dapat menemukan user dg nama ${name} dan umur ${age}`})
                }

                res.send(resp)

            }).catch((err) => {
                res.send(err)

            })

    })


    // POST DATA

    app.post('/users', (req, res) => {

        let {name, role, age} = req.body

        if(!name || !role || !age){
            return res.send({error: "Tolong isi data 'name', 'role', 'age'"})
        }

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
    app.delete('/users/:umur', (req, res) => {
        // simpan umur dari user
        let umur = req.params.umur

        umur = parseInt(umur)

        // gunakan umur sebagai penentu user mana yang akan di hapus
        db.collection('users').deleteOne({age: umur })
            .then((resp) => {
                res.send(resp)

            }).catch((err) => {
                res.send({
                    error: err
                })
                
            })



    })
    
})


app.listen(port, () => {
    console.log("API berhasil running di port " + port)
})

