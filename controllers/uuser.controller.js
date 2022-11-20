const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const Uuser = require('../models/user')

const getUusers = async (req = request, res = response) => {
  let { from = 0, lot = 5 } = req.query
  from = from <= 0 || isNaN(from) ? 0 : from - 1

  const query = { status: true }

  const [uusers, total] = await Promise.all([
    Uuser.find(query).skip(from).limit(lot),
    Uuser.countDocuments(query),
  ])

  const quantity = uusers.length
  const pagination = {
    from: Number(from + 1),
    lot: Number(lot),
  }

  res.json({
    total,
    quantity,
    pagination,
    uusers,
  })
}

const createUuser = async (req = request, res = response) => {
  const { name, lastName, typeId, id, email, password, role } = req.body
  const uuser = new Uuser({ name, lastName, typeId, id, email, password, role })

  uuser.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
  await uuser.save()

  res.status(201).json({
    uuser,
  })
}

module.exports = { getUusers, createUuser }
