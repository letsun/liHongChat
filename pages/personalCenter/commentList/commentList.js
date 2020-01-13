// pages/comment/comment.js
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.commentList();
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  
  commentList() {
    let that = this;
    // debugger
    common.requestPosts(api.commentList,{
      pageNum:'1',
    },res=>{

      that.setData({
        commentList: res.data.data.commentList

      })
      
    })
  }

})