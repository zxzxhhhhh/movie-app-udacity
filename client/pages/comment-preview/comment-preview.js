// pages/comment-preview/comment-preview.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieInfo: {},
    userInfo: {}
  },
  // 重新编辑按钮 退回上一页重新编辑
  onTapReEdit(){
    wx.navigateBack()
  },
  // 发布评论按钮：将评论上传到数据库
  onTapAddComment(){
    let content = this.data.movieInfo.commentText
    if (!content)
      return
    wx.showLoading({
      title: '评论上传中。。。',
    })
    //    this.uploadImages(images => {
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'PUT',
      data: {
        movie_id: this.data.movieInfo.id,
        content
      },
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          wx.showToast({
            title: '评论成功',
          })
          //  评论成功后跳转到影评列表页面
          wx.navigateTo({
            url: `../comments-list/comments-list?id=${this.data.movieInfo.id}`,
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
          title: '评论失败',
        })
        console.log('error!' + result);
      }
    });
//    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieInfo = {
      id: options.movie_id,
      image: options.movie_image,
      title: options.movie_title,
      commentText: options.commentText
    }
    let userInfo = {
      avatar: options.user_avatar,
      name: options.username
    }
    this.setData({
      movieInfo,
      userInfo
    })
    console.log(movieInfo +""+ userInfo)
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