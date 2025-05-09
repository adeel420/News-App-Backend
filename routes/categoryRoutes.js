const express = require('express')
const Category = require('../models/category')
const router = express.Router()

router.post('/create', async (req, res) => {
    try{
        const data = req.body
        const newData = new Category(data)
        const response = await newData.save()
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.get('/', async (req, res) => {
    try{
        const response = await Category.find()
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.put('/update/:id', async (req, res) => {
    try{
        const id = req.params.id
        const data = req.body
        const response = await Category.findByIdAndUpdate(id, data)
        res.status(200).json(response)
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id
        const response = await Category.findByIdAndDelete(id)
        res.status(200).json(response)
    }catch(err){ 
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})
module.exports = router