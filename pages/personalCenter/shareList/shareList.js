const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    relayList: '',
    hasNext: 'false',
    img: ['https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_68.png', 'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/1_69.png']
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.relayList();
    common.uvpv('', '分享记录页') //页面访问uv信息
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.relayList()
  },


  relayList() {
    let that = this;
    let pageNum = that.data.pageNum;

    common.requestPosts(api.relayList + app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let relayList = that.data.relayList;
      let hasNext = that.data.hasNext;
      if (relayList == '') {
        that.setData({
          relayList: res.data.data.relayList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            relayList: relayList.concat(res.data.data.relayList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },


  //详情
  deliciousDetail(e) {

    let objid = e.currentTarget.dataset.objid;
    if (e.currentTarget.dataset.objtype == 2) {

      var objtype = 1;
      wx.navigateTo({
        url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    } else if (e.currentTarget.dataset.objtype == 1) {
      var objtype = 0;
      wx.navigateTo({
        url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    } else if (e.currentTarget.dataset.objtype == 0) {
      wx.switchTab({
        url: '../../delicious/deliciousList/deliciousList'
      })
    }


  },


})