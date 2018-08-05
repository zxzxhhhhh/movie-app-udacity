// pages/user/user.js
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

    favorList: [],
    myCommentList: []
  },
  /***
   * 同时获取favorList myCommentList
   */
  getUserInterestLists(){
    wx.showLoading({
      title: '电影数据加载中',
    })
    qcloud.request({
      url: config.service.userInterestLists,
      login: true,
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          console.log(result.data.data)
          this.setData({
            favorList: result.data.data.favorList,
            myCommentList: result.data.data.myCommentList
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
    if (this.data.userInfo)
      this.getUserInterestLists()
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
        this.getUserInterestLists()
      }
    })
  }

})