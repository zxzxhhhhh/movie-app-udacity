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


  },

  onTapPlay(event){
    console.log('play')
    let commentID = event.currentTarget.dataset.id

    let commentList = this.data.commentList
    let comment
    for (let i = 0; i < commentList.length; i++){
      if(commentList[i].id == commentID)
      {
        comment = commentList[i]
        break
      }
    }
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = comment.voices
    if (this.data.playStatus == 0)//没有播放
    {
      console.log('playing')
      innerAudioContext.play()
      this.setData({
        playStatus: PLAY
      })
    }else{
      console.log('stop playing')
      innerAudioContext.pause()
      this.setData({
        playStatus: STOP
      })
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