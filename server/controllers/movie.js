const DB = require('../utils/db.js')
module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movie;")
  },

  detail: async ctx => {
    let movieID = + ctx.params.id
    let movie
    if (!isNaN(movieID)) {
      //这个数组只可能有一个元素 添上 [0]，获取数组的第一个项
      movie = (await DB.query("SELECT * FROM movies where movies.id=?;", [movieID]))[0]
    } else {
      movie = {}
    }
    // movie.commentCount = (await DB.query('SELECT COUNT(id) AS comment_count FROM comment WHERE comment.product_id = ?', [movieID]))[0].comment_count || 0
    // movie.firstComment = (await DB.query('SELECT * FROM comment WHERE comment.product_id = ? LIMIT 1 OFFSET 0', [movieID]))[0] || null

    ctx.state.data = movie
  }

}