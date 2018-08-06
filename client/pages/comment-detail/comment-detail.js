// pages/comment-detail/comment-detail.js
//登陆相关函数部署在全局app页面中
const app = getApp()
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
//oprBtnType: 确定未登录时跳转到登录界面登陆后的跳转逻辑
//收藏按钮 跳转回原页面；写影评按钮 跳转到编辑影评页面
const UNDEFINED = 0;
const ADD_FAVOR = 1;
const WRITE_COMMENT = 2;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comment:{},
    movie: {},
    commentUser: {},//该用户对该电影的评价

    needUserInfo: false,
    oprBtnType: UNDEFINED,
    userInfo: null,
    locationAuthType: app.data.locationAuthType,

    playing: false, //录音影评是否为播放状态
    audioLength: 15 //录音影评长度
  },

  onTapLogin(res) {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        console.log('Page COMMENT-DETAIL: lOGIN SUCCESS!')
        if (this.data.oprBtnType == ADD_FAVOR){
          console.log("Operation Add Favor")
          this.onTapAddFavor()
        } else if (this.data.oprBtnType == WRITE_COMMENT){
          console.log("Operation Write Comment")
          this.onTapWriteComment()

        }
      },
      error: () => {
        console.log('Page COMMENT-DETAIL: lOGIN FAILED!')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },
  /***
   * 获取该用户对该电影的评论
   * 登陆之后调用 
   */
  getUserComment({movie_id, cb}){
    qcloud.request({
      url: config.service.commentUser,
      login: true,
      data: { movie_id: movie_id},
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          cb & cb(result.data.data)
        }
        else {
          console.log('error!' + result);
        }
      },
      fail: result => {
        console.log('error!' + result);
      }
    });
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
  // get the specific comment
  getComment(id){
    wx.showLoading({
      title: '评论数据加载中',
    })
    qcloud.request({
      url: config.service.commentDetail,
      method: 'GET',
      data: {
        comment_id: id
      },
      success: (result) => {
        wx.hideLoading()
        console.log(result)
        if (!result.data.code) {
          this.setData({
              comment: result.data.data
          })
          // 如果有音频 获取音频长度并显示
          let comment = this.data.comment
          if (comment.voices) {
            this.innerAudioContext.src = comment.voices
            console.log(this.innerAudioContext.duration)
            this.setData({
              audioLength: this.innerAudioContext.duration
            })
          }
          
          this.getMovie(this.data.comment.movie_id)
        }
        else {
          wx.showToast({
            title: '加载失败',
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
        console.log('error!');
      }
    });
  },
  onTapWriteComment(){
    this.data.oprBtnType = WRITE_COMMENT
    if (this.data.userInfo) {
      //已有登录信息，显示原始页面
      //获取该用户对该电影的评价信息
      this.getUserComment({
        movie_id: this.data.movie.id,
        cb : res=>{
          console.log(res)
          if(res)//有评论 跳转到该评论的影评详情页面
          {
            wx.navigateTo({
              url: `../comment-detail/comment-detail?id=${res.id}`,
            })
          }else{//无评论 弹出底部菜单，添加影评，跳转到影评编辑页面
            this.showActionSheet()
          }
        }
      })

    }else{
      //没有登录信息，显示登录授权页面
      this.setData({
        needUserInfo: true
      })
    }
  },
  // 底部弹出按钮菜单
  showActionSheet() {
    let movieID = this.data.movie.id
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
        console.log("Comment Type is: " + res.tapIndex)
        wx.navigateTo({
          url: `../comment-edit/comment-edit?type=${res.tapIndex}&movieID=${movieID}`,
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 收藏影评按钮
  onTapAddFavor(){
    this.data.oprBtnType = WRITE_COMMENT
    //有登录信息
    if(this.data.userInfo){ 
      //已有登录信息，显示原始页面
      this.setData({
        needUserInfo: false
      })
      wx.showLoading({
        title: '添加收藏中。。。',
      })
      qcloud.request({
        url: config.service.addFavor,
        login: true,
        method: 'PUT',
        data: {
          comment_id: this.data.comment.id,
        },
        success: (result) => {
          wx.hideLoading()
          if (!result.data.code) {
            wx.showToast({
              title: '收藏成功',
            })
          }
          else {
            wx.showToast({
              icon: 'none',
              title: '收藏失败',
            })
          }

        },
        fail: result => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '收藏失败',
          })
          console.log('error!' + result);
        }
      });
    }else{
      //没有登录信息，显示登录授权页面
      this.setData({
        needUserInfo: true
      })
    }
  },
  /**
  * 点击播放按钮： 播放或停止播放音频
  */
  onTapPlay() {
    let comment = this.data.comment
    if (comment.voices) {
      // 获取音频长度并显示
      this.innerAudioContext.src = comment.voices
      console.log(this.innerAudioContext.duration)
      this.setData({
        audioLength: this.innerAudioContext.duration
      })
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
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let commentID = options.id 
    this.getComment(commentID)

    // 这里为什么放到函数onTapPlay中是不行的（if中可以调用，else中不行）
    this.innerAudioContext = wx.createInnerAudioContext()
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
    console.log('Page COMMENT-DETAIL: Check Session...')
    app.checkSessionAndGetData({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        console.log('Page Comment-detail: In Session.')
      }
    })
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