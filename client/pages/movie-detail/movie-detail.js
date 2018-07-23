// pages/movie-detail/movie-detail.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },
  showActionSheet(){
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
        console.log("Comment Type is: " + res.tapIndex)
        wx.navigateTo({
          url: `../comment-edit/comment-edit?type=${res.tapIndex}`,
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 随即获取一个电影数据 已知总数为15个
   */
  getMovie(movieID) {
    wx.showLoading({
      title: '电影数据加载中',
    })
    qcloud.request({
      url: config.service.movieDetail + movieID,
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            movie: result.data.data
          })
        }
        else {
          wx.showToast({
            icon: 'none',
            title: '加载失败',
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '加载失败',
        })
        console.log('error!' + result);
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieID = options.id
    this.getMovie(movieID)
  },
})