//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo// 需要从网络下载的 关闭小程序不会被立马回收

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
    data:{
      locationAuthType: UNPROMPTED
    },

    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },

    login({ success, error }) {
      qcloud.login()
      wx.getSetting({
        success: (res) => {
          //如果拒绝了授权
          if (!res.authSetting['scope.userInfo']) {
            this.data.locationAuthType = UNAUTHORIZED
            // 已拒绝授权
            wx.showModal({
              title: '提示',
              content: '请授权我们获取您的用户信息',
              showCancel: false
            })
            error && error({})
          }
          else {//已授权->直接登录1）首次登录获取数据2）非首次登录调用request获取数据
            this.data.locationAuthType = AUTHORIZED
            this.doQcloudLogin({ success, error })
          }
        },
      })
    },

    doQcloudLogin({ success, error }) {
      qcloud.login({
        success: result => {
          //首次登录 直接获取用户数据
          if (result) {
            userInfo = result
            console.log('First Login: Login success, get userInfo...')
            success && success({
              userInfo
            })
          } else {
            //不是首次登录
            console.log('Not First Login: Get userInfo...')
            //通过/user获取用户数据
            this.getUserData({ success, error })
          }
        },
        fail: result => {
          console.log('fail')
          console.log(result)
          error && error()
        }
      })
    },

    checkSessionAndGetData({ success, error }) {
      //缓存中已有数据->在session中
      if (userInfo) {
        console.log("App-userInfo: Get userInfo from cache.")
        return success && success({
          userInfo
        })
      }
      //缓存中无数据-> check session 若成功则获取数据，失败不做反应
      wx.checkSession({
        success: () => {
          console.log("App-checkSession: In session, get userInfo...")
          this.getUserData({
            success: ({ userInfo }) => {
              success && success({
                userInfo
              })
            },
            error: () => { }
          })
        },
        fail: (res) => {
          console.log('App-checkSession: Out of session.')
        }
      })
    },

    getUserData({ success, error }) {
      if (userInfo) {//1）数据从缓存中直接调取
        console.log("App-userInfo: Get userInfo from cache.")
        return success && success({
          userInfo
        })
      }
      //2）数据从网络中下载
      qcloud.request({
        url: config.service.requestUrl,
        //获取用户数据需要验证登录信息
        login: true,
        success: result => {
          let data = result.data
          console.log('App-userInfo: Get userInfo online.')
          if (!data.code) {
            userInfo = data.data
            success && success({
              userInfo
            })
          } else {
            error && error()
          }
        },
        fail: (result) => {
          error && error()
        }
      })

    },
})