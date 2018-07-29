const DB = require('../utils/db.js')

module.exports = {

  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentID = +ctx.request.body.comment_id


    if (!isNaN(commentID)) {
      await DB.query('INSERT INTO favorites(user, comment_id) VALUES (?, ?)', [user, commentID])
    }
    ctx.state.data = {}
  },

  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let favorList = await DB.query('SELECT  comment_movie.id AS `comment_id`, movies.image AS `image`, movies.title AS `title` ,  comment_movie.username AS `username`,  comment_movie.avatar AS `avatar`, comment_movie.content AS `content`, comment_movie.voices AS `voices` FROM  movies LEFT JOIN comment_movie ON movies.id = comment_movie.movie_id LEFT JOIN favorites ON favorites.comment_id = comment_movie.id WHERE favorites.user = ? ORDER BY favorites.id', [user])

    let myCommentList = await DB.query('SELECT  comment_movie.id AS `comment_id`, movies.image AS `image`, movies.title AS `title`, comment_movie.content AS `content`, comment_movie.voices AS `voices` FROM  movies LEFT JOIN comment_movie ON movies.id = comment_movie.movie_id  WHERE comment_movie.user = ? ORDER BY comment_movie.id', [user])

    ctx.state.data = { favorList, myCommentList}
  }
}