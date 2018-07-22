// pages/user/user.js
//登陆相关函数部署在全局app页面中
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType
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