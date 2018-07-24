// pages/comment-detail/comment-detail.js
//登陆相关函数部署在全局app页面中
const app = getApp()
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:{},
    movie: {},
    needUserInfo: false,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let commentID = options.id 
    this.getComment(commentID)
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
        console.log('Page USER: In Session.')
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