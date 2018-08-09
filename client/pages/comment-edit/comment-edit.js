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
    commentVoice:'',
    voiceLength: 0,
    playing: false // 试听声音的状态标志
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
      this.setData({
        commentVoice : tempFilePath,
        voiceLength: Math.round(res.duration/1000)
      })
    })

    this.setData({
      recordStatus: ~this.data.recordStatus
    })

  },
  /**播放预览录音 */
  onRecordPreview(){
    //console.log(this.data.commentVoice)
    this.innerAudioContext.src = this.data.commentVoice
    // 切换播放状态
    if (!this.data.playing)//没有播放
      this.innerAudioContext.play()
    else
      this.innerAudioContext.stop();

    this.innerAudioContext.onPlay(() => {
      console.log("播放");
      this.setData({
        playing: true
      })
    })
    this.innerAudioContext.onStop(() => {
      console.log("停止");
      this.setData({
        playing: false
      })
    })
    this.innerAudioContext.onEnded(() => {
      console.log("自然停止");
      this.setData({
        playing: false
      })
    })
  },
  uploadVoice(cb){
    console.log('上传录音文件')
    console.log(this.data.commentVoice)
    wx.uploadFile({
      url: config.service.uploadUrl, //仅为示例，非真实的接口地址
      filePath: this.data.commentVoice,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        var data = JSON.parse(res.data)
        //do something
        if (!data.code) {
          console.log("上传成功,并返回了COS链接")
          var url = data.data.imgUrl
          console.log(url)
          cb && cb(url)
        }
      }
    })
  },
  /** 上传语音评论信息 */
  onTapAddComment() {
    let commentVoice = this.data.commentVoice
    if (!commentVoice)
      return
    wx.showLoading({
      title: '评论上传中。。。',
    })
    this.uploadVoice(voiceUrl => {
      console.log(voiceUrl)
      console.log(this.data.voiceLength)
      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'PUT',
        data: {
          movie_id: this.data.movie.id,
          voices: voiceUrl,
          voice_length: this.data.voiceLength
        },
        success: (result) => {
          wx.hideLoading()
          if (!result.data.code) {
            wx.showToast({
              title: '评论成功',
            })
            //  评论成功后跳转到影评列表页面
            wx.navigateTo({
              url: `../comments-list/comments-list?id=${this.data.movie.id}`,
            })
          }
          else {
            wx.showToast({
              icon: 'none',
              title: '评论失败',
            })
          }

        },
        fail: result => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '评论失败了',
          })
          console.log('error!' + result);
        }
      });
    })

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

    app.getMovie({
      movieID: options.movieID,
      cb: res=>{
        this.setData({
          movie: res
        })
      }
    })

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
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.stop();
    console.log("onUnload: Stop Playing!")
  }
})