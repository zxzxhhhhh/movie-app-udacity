/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

//获取电影
router.get('/movie/:id', controllers.movie.detail)

//获取电影
router.get('/movie', controllers.movie.list)

// 上传商品评价
router.put('/comment', validationMiddleware, controllers.comment.add)

// 获取商品评价
router.get('/comment',  controllers.comment.list)

// 获取特定商品评价详情
router.get('/comment-detail', controllers.comment.comment)

// 获取特定用户对特定电影的评价
router.get('/comment-user', validationMiddleware, controllers.comment.user)

// 上传收藏评价
router.put('/favor', validationMiddleware, controllers.favor.add)

// 获取我的收藏 我的发布
router.get('/user-interest', validationMiddleware, controllers.favor.list)

// 获取某条影评是否被收藏的信息
router.get('/isfavorite', validationMiddleware, controllers.favor.isfavorite)


module.exports = router
