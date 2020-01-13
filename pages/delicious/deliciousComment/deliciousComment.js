
// const common = require("../../utils/common");
// const api = require("../../utils/api");

/**
 * 公共提示弹框
 */
const commShowModal = function (msg) {
  wx.showModal({
      content: msg,
      showCancel: false,
  })
};

// pages/reviews/reviews.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,

    memberId: 0,
    objId: 0,
    objType: 0,
    pageNum: 0
  },

  playTap(){
    this.setData({
      isPlay: true,
    })
    var videoContextCurrent = wx.createVideoContext('video');
    videoContextCurrent.play();
  },

  fullscreenTap(){
    VideoContext.stop()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    let that = this;
    that.detail()
  },

  detail() {
    let that = this;
    common.requestPost(api.view,{
      memberId: that.data.memberId,
      objId: that.data.objId,
      objType: that.data.objType,
      pageNum: that.data.pageNum
    },res=>{



    })
  }
})