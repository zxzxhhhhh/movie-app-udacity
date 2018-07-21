// pages/hots/hots.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: []
  },

  /**
   * 获取电影数据列表 已知总数为15个
   */
  getMovie() {
    wx.showLoading({
      title: '电影数据加载中',
    })
    qcloud.request({
      url: config.service.movieList,
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            movieList: result.data.data
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
    this.getMovie()
  },

})