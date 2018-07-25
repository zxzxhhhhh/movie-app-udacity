// pages/index/index.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    comment:{}
  },
  //获取评论详情
  getCommentList(id) {
    wx.showLoading({
      title: '评论数据加载中',
    })
    qcloud.request({
      url: config.service.comment,
      method: 'GET',
      data: {
        movie_id: id
      },
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          let commentList = result.data.data
          if (commentList.length){
            // console.log("comment:" + commentList.length)
            this.setData({
              comment: commentList[Math.floor((Math.random() * commentList.length))]
            })
          }else{
            // console.log("no comment")
            this.setData({
              comment: null
            })
          }

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
          this.getCommentList(this.data.movie.id)
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
    this.getMovie(Math.floor((Math.random() * 15) + 1))
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