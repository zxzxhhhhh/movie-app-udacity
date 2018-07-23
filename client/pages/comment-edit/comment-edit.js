// pages/comment-edit/comment-edit.js
//登陆相关函数部署在全局app页面中
const app = getApp()
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    movie:{}
  },

  /**
   * 获取电影数据
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
  onTapLogin(res) {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        console.log('Page USER: lOGIN SUCCESS!')
      },
      error: () => {
        console.log('Page USER: lOGIN FAILED!')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let commentType = options.type
    let movieID = options.movieID
    this.getMovie(movieID)
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    console.log('Page USER: Check Session...')
    app.checkSessionAndGetData({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        console.log('Page USER: In Session.')
      }
    })
  }
})