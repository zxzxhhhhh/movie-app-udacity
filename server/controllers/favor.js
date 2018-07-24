const DB = require('../utils/db.js')

module.exports = {

  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentID = +ctx.request.body.comment_id


    if (!isNaN(commentID)) {
      await DB.query('INSERT INTO favorites(user, comment_id) VALUES (?, ?)', [user, commentID])
    }

    ctx.state.data = {}
  }
}