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
    movie:{},
    // commentType: 0: 文字；1：录音
    commentType: 0,
    // recordStatus: 区分正在录音还是未在录音
    recordStatus: false,
    commentText:'',
    commentVoice:''
  },

  /***输入的文字评论 */
  onInput(event) {
    this.setData({
      commentText: event.detail.value.trim()
    })
  },

  /*** 输入的录音评论*/
  onRecord(){

    const recorderManager = wx.getRecorderManager()
    // 录音时长1min 
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    if (!this.data.recordStatus)
      recorderManager.start(options)
    else
      recorderManager.stop()


    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res

      this.innerAudioContext.src = tempFilePath
      this.innerAudioContext.play()
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
    
    this.setData({
      recordStatus: ~this.data.recordStatus
    })

  },
  /** 上传评论信息 */
  addComment() {


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
        console.log('Page COMMENT-EDIT: lOGIN SUCCESS!')
      },
      error: () => {
        console.log('Page COMMENT-EDIT: lOGIN FAILED!')
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
    this.setData({
      commentType
    })

    let movieID = options.movieID
    this.getMovie(movieID)

    // 这里为什么放到函数onTapPlay中是不行的（if中可以调用，else中不行）
    this.innerAudioContext = wx.createInnerAudioContext()
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    console.log('Page COMMENT-EDIT: Check Session...')
    app.checkSessionAndGetData({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        console.log('Page COMMENT-EDIT: In Session.')
      }
    })
  }
})