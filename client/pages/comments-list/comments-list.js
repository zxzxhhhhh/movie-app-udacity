// pages/comments-list/comments-list.js
const app = getApp()
const _ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieID = options.id
    app.getCommentList({
      id:movieID,
      cb:res=>{
        this.setData({
          commentList: res.map(item => {
            let itemDate = new Date(item.create_time)
            item.createTime = _.formatTime(itemDate)
            return item
          })
        })
      }
    })

  },
})