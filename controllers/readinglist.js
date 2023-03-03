const router = require('express').Router()
const { ReadingList } = require('../models')

router.post('/', async (req, res) => {
    const item = await ReadingList.create(req.body)
    res.json(item)
})

router.get('/', async (req, res) => {
    const readinglists = await ReadingList.findAll()
    res.json(readinglists)
})

module.exports = router 