
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // memberId: 0,
    // objId: '',
    // objType: 1,
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    console.log(options)

    that.setData({
      objid: options.objid
    })
    //that.detail()
    that.deliciousDetail()
  },



  
  deliciousDetail() {
    let that = this;
    common.requestPost(api.deliciousDetail,{
      memberId: app.globalData.memberId,
      objId: that.data.objid,
      objType: that.data.objType,
      pageNum: that.data.pageNum
    },res=>{

    })
  },

})