// pages/comments-list/comments-list.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const _ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
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
        //console.log(result)
        if (!result.data.code) {

          this.setData({
            commentList: result.data.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.createTime = _.formatTime(itemDate)
              return item
            })
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
    let movieID = options.id
    this.getCommentList(movieID)
    //
    // // 这里为什么放到函数onTapPlay中是不行的（if中可以调用，else中不行）
    // this.innerAudioContext = wx.createInnerAudioContext()
  },
  // /**
  //  * 点击播放按钮： 播放或停止播放音频
  //  */
  // onTapPlay(event){
  //   let commentID = event.currentTarget.dataset.id
  //   let commentList = this.data.commentList
  //   let comment

  //   //遍历找到该条评论 定位其声音链接
  //   for (let i = 0; i < commentList.length; i++){
  //     if(commentList[i].id == commentID)
  //     {
  //       comment = commentList[i]
  //       break
  //     }
  //   }
    
  //   if (comment.voices){
  //     // 获取音频长度并显示
  //     this.innerAudioContext.src = comment.voices
  //     console.log(this.innerAudioContext.duration)
  //     this.setData({
  //       audioLength: this.innerAudioContext.duration
  //     })
  //     // 切换播放状态
  //     if (!this.data.playing)//没有播放
  //       this.innerAudioContext.play()
  //     else
  //       this.innerAudioContext.stop();

  //     this.innerAudioContext.onPlay(() => {
  //       console.log("播放");
  //       this.setData({
  //         playing: true
  //       })
  //     })
  //     this.innerAudioContext.onStop(() => {
  //       console.log("停止");
  //       this.setData({
  //         playing: false
  //       })
  //     })
  //     this.innerAudioContext.onEnded(() => {
  //       console.log("自然停止");
  //       this.setData({
  //         playing: false
  //       })
  //     })
  //   }

  // },
  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {
  //   this.innerAudioContext.stop();
  //   console.log("onUnload: Stop Playing!")
  // },

})