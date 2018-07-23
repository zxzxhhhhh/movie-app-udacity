// pages/comments-list/comments-list.js

const STOP = 0
const PLAY = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [
      {
        id:12,
        avatar: '../../images/user.png',
        username: 'zx1',
        content:'hhhabababbalalalalbababablallalalababbaballalalla babababalalalbalabalbalanb'
      },{
        id:222,
        avatar: '../../images/user.png',
        username: 'zx2',
        content: 'hhhabababbalalalalbababablallalalababbaballalalla babababalalalbalabalbalanb',
        voices:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
      }
    ],
    playStatus: STOP,
    audioLength:15
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieID = options.id
    console.log(movieID)
    // 这里为什么放到函数onTapPlay中是不行的（if中可以调用，else中不行）
    this.innerAudioContext = wx.createInnerAudioContext()
  },

  onTapPlay(event){
    let commentID = event.currentTarget.dataset.id
    let commentList = this.data.commentList
    let comment

    //遍历找到该条评论 定位其声音链接
    for (let i = 0; i < commentList.length; i++){
      if(commentList[i].id == commentID)
      {
        comment = commentList[i]
        break
      }

      
      
    }
    
    if (comment.voices){
      this.innerAudioContext.src = comment.voices

      if (this.data.playStatus == 0)//没有播放
      {
        this.innerAudioContext.play()
        this.innerAudioContext.onPlay(() => {
          console.log("播放");
          this.setData({
            playStatus: PLAY
          })
        })
      } else {
        this.innerAudioContext.stop();
        this.innerAudioContext.onStop(() => {
          console.log("停止");
          this.setData({
            playStatus: STOP
          })
        })
      }
    }

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
    console.log("on show")
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
    this.innerAudioContext.stop();
    console.log("onUnload: Stop Playing!")
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