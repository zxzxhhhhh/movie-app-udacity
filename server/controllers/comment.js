const DB = require('../utils/db.js')

module.exports = {

  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieID = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let voices = ctx.request.body.voices || null

    if (!isNaN(movieID)) {
      await DB.query('INSERT INTO comment_movie(user, username, avatar, content,  voices, movie_id) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, voices, movieID])
    }
    // voices内容没有 会出现sql语句中两个连着的逗号??现在又不出现了
    // if (!isNaN(movieID)) {
    //   try{
    //     await DB.query('INSERT INTO comment_movie(user, username, avatar, content, movie_id) VALUES (?, ?, ?, ?, ?);', [user, username, avatar, content, movieID])
    //   }catch(e){
    //     ctx.state.data = e
    //   }   
    //}
    ctx.state.data = {}
  },

  list: async ctx => {
    let movieID = +ctx.request.query.movie_id
    if (!isNaN(movieID)) {
      ctx.state.data = await DB.query('SELECT * FROM comment_movie where comment_movie.movie_id = ?', [movieID])
    } else {
      ctx.state.data = {}
    }
  },
  comment: async ctx =>{
    let commentID = +ctx.request.query.comment_id
    if (!isNaN(commentID)) {
      ctx.state.data = (await DB.query('SELECT * FROM comment_movie where comment_movie.id = ?', [commentID]))[0]
    } else {
      ctx.state.data = {}
    }
  },

  user: async ctx => {
    let movieID = +ctx.request.query.movie_id
    let user = ctx.state.$wxInfo.userinfo.openId
    if (!isNaN(movieID)) {
      ctx.state.data = (await DB.query('SELECT * FROM comment_movie where comment_movie.movie_id = ? AND comment_movie.user = ?', [movieID, user]))[0]
    } else {
      ctx.state.data = {}
    }

  }

}