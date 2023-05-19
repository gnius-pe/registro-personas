const express = require("express");
const recordSchema = require("../models/record");
const { error } = require("console");
const moment = require("moment");

const router = express.Router();


// list records
router.get('/', (req, res) => {
    recordSchema
    .find()
    .then((data) => {
    
    console.log(data);

         res.locals.moment = moment;
         
        res.render('index', {
            data: data,
            title: 'Alertas Registradas'
        });
    }
    )
    .catch((error) => res.json({message: error}));


   

});

// get record especified
router.get('/records/:id', (req, res) => {
    const { id } = req.params;

    recordSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
});

// create record
router.post('/records', (req, res) => {   
    const record = recordSchema(req.body);

    record.save().then((data) => {
        res.json(data);
    }).catch((error) => {
        res.json({
            message: error 
        });
    })

    
});

// update record *(NO USED IN THIS EXAMPLE)*
router.put('/records/:id', (req, res) => {
    const { id } = req.params;
    const {date_capture, photo} = req.body;
    recordSchema
    .updateOne({ "_id" : id }, { $set: { date_capture, photo} })
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
});

// delete record
router.delete('/records/:id', (req, res) => {
    const { id } = req.params;
    recordSchema
    .findOneAndRemove({ "_id" : id })
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
});

module.exports = router;