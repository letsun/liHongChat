const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    commentList: '',
    hasNext: 'false',
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.commentList();
    common.uvpv('', '评论记录页') //页面访问uv信息
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.commentList()
  },


  commentList() {
    let that = this;
    let pageNum = that.data.pageNum;

    common.requestPosts(api.commentList+ app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let commentList = that.data.commentList;
      let hasNext = that.data.hasNext;
      if (commentList == '') {
        that.setData({
          commentList: res.data.data.commentList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            commentList: commentList.concat(res.data.data.commentList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },

  //详情
  deliciousDetail(e) {

    let objid = e.currentTarget.dataset.objid;
    let objtype = e.currentTarget.dataset.objtype;
          wx.navigateTo({
        url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    // if (e.currentTarget.dataset.objtype == 2) {

    //   var objtype = 1;
    //   wx.navigateTo({
    //     url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
    //   })
    // } else if (e.currentTarget.dataset.objtype == 1) {
    //   var objtype = 0;
    //   wx.navigateTo({
    //     url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
    //   })
    // } 


  },


})