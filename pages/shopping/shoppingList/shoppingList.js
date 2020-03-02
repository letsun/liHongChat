// pages/logs/logs.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: ['全部', '饮料酒水', '粮油调味', '海产干货', '休闲零食'],
    indexa: 0,
    categoryId: '0',

    pageNum: 1,
    goodsList:'',
    hasNext:'',
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this;

    that.banner(); //轮播图
    that.shoppingcategory(); //商品分类
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1,
    })
    that.shoppingList()
  },


  //商品列表
  shoppingList() {
    let that = this;
    common.requestPost(api.shoppingList, {
      categoryId: that.data.categoryId,
      pageNum: that.data.pageNum,
      searchWord: '',
    }, res => {

      let goodsList = that.data.goodsList;
      if (goodsList=='') {
        that.setData({
          goodsList: res.data.data.goodsList,
          hasNext: res.data.data.hasNext
        })
      }else {
        if(that.data.hasNext=='true') {
          that.setData({
            goodsList: goodsList.concat(res.data.data.goodsList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },

  //商品分类
  shoppingcategory() {
    let that = this;
    common.requestPost(api.shoppingcategory, {}, res => {
      let shoppingcategory = res.data.data;
      that.setData({
        shoppingcategory: res.data.data
      })
      that.shoppingList()
    })
  },




  //切换分类
  tabFunc(e) {

    let that = this;
    let id = e.currentTarget.dataset.id;
    let categoryId = e.currentTarget.dataset.cateid;

    that.setData({
      indexa: id,
      categoryId: categoryId,
      pageNum: 1,
      goodsList: ''
    })

    that.shoppingList()
  },


  //轮播图
  banner() {
    common.requestPost(api.banner, {}, res => {

    })
  },


  //跳转到商品详情
  shoppingDetails(e) {
    // let goodsId = e.currentTarget.dataset.goodsid;
      app.globalData.goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: "../../shopping/shoppingDetails/shoppingDetails"
    })
  },


  //九宫格页面
  shoppingActivity() {
    let that = this;
    if (app.globalData.memberId > 0){
      wx.navigateTo({
        url: "../../shopping/shoppingActivity/shoppingActivity"
      })
    } else {
      common.login()
    }

  },


})