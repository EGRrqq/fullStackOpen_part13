const router = require('express').Router()
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

const readinglistFinder = async (req, res, next) => {
  req.readinglistitem = await ReadingList.findByPk(req.params.id)
  next()
}

router.post('/', async (req, res) => {
    const item = await ReadingList.create(req.body)
    res.json(item)
})

router.get('/', async (req, res) => {
    const readinglists = await ReadingList.findAll()
    res.json(readinglists)
})

router.put('/:id', tokenExtractor, readinglistFinder, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.readinglistitem) {
        
      if (user.id === req.readinglistitem.userId) {
        req.readinglistitem.read = req.body.read
        await req.readinglistitem.save()
        res.json(req.readinglistitem)
      } else {
        res.status(401).send("the user can mark blogs only in his own reading list as read")
      }

    } else {
      res.status(404).end()
    }
})

module.exports = router 