// pages/index/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    comment:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getMovie(
      {
        movieID: Math.floor((Math.random() * 15) + 1),
        cb: res=>{
          this.setData({
            movie: res
          })
          //获取该电影的评论列表
          app.getCommentList({
            id: this.data.movie.id,
            cb: res=>{
              let commentList = res
              if (commentList.length) {
                // console.log("comment:" + commentList.length)
                this.setData({
                  comment: commentList[Math.floor((Math.random() * commentList.length))]
                })
              } else {
                // console.log("no comment")
                this.setData({
                  comment: null
                })
              }
            }
          })
        }
      })
  }
})