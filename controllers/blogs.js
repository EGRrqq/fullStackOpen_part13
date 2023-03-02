const router = require('express').Router()
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where ={}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    }
  }

  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    res.json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog) {
    if (user.id===req.blog.userId) {    
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(401).send("deleting a blog is only possible for the user who added the blog").end()
    }
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router