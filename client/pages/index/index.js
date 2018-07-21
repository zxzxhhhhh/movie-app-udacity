// pages/index/index.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{
      image: 'https://movies-1256105992.cos.ap-shanghai.myqcloud.com/p2517753454.jpg',
      title: '复仇者联盟3：无限战争',
      comment_avatar: '../../images/user.png',
      comment_user:'小J'
    }
  },

  /**
   * 随即获取一个电影数据 已知总数为15个
   */
  getMovie(movieID){
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
          setTimeout(() => {
            wx.navigateBack(),
              2000
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack(),
            2000
        })
        console.log('error!' + result);
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie(2)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})