import User from '../models/User'
import jwt from 'jsonwebtoken'

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      isAdmin: user?.isAdmin,
    },

    process.env.JWT_SECRET,
    {
      expiresIn: '365d'
    }
  )
}

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    // Bearer xxx => xxx
    const token = authorization.slice(7, authorization.length)
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not valid' })
      } else {
        const user = await User.findOne({ _id: decode._id })
        if (user) {
          req.user = user
          next()
        } else {
          res.status(401).send({ message: 'Token is not valid' })
        }
      }
    })
  } else {
    res.status(401).send({ message: 'Token is not suppiled' })
  }
}
const isAdmin = async (req, res, next) => {
  if (req.user?.isAdmin) {
    next()
  } else {
    res.status(401).send({ message: 'User is not admin', ...req.user })
  }
}

export { signToken, isAuth, isAdmin }
