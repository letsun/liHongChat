// pages/delicious/delicious.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  data: {
    arr: ['美味菜谱', '美味视频'],
    indexa: 0,
    isPlay: false,

    // isPlays: false,
    pageNum: 10
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // let that = this;


    // that.deliciousList()
  },

  onShow() {
    let that = this;


    that.deliciousList(0);
    that.deliciousList(2);
  },

  /**
   * memberId 	会员ID
   * mwktType 	美味课堂类型 0：官方视频；1：美味视频；2：美味菜谱
   * pageNum 	分页页码
   * 
   */

  deliciousList(mwktType) {
    let that = this;

    common.requestPost(api.deliciousList, {
      memberId: app.globalData.memberId,
      mwktType: mwktType,
      pageNum: that.data.pageNum
    }, res => {

      if (mwktType == 0) {
        that.setData({
          mwktLista: res.data.data.mwktList
        })
      } else if (mwktType == 1) {

        var mwktListc = res.data.data.mwktList;
        for (var i in mwktListc) {
          mwktListc[i].isPlays = false
        }
        that.setData({
          mwktListc: mwktListc
        })
        
      } else if (mwktType == 2) {

        that.setData({
          mwktListb: res.data.data.mwktList
        })
      }

    })
  },


  //点赞
  dianz(e) {
    // debugger;
    let that =  this;
    let index = e.currentTarget.dataset.index;
    let objId = e.currentTarget.dataset.objid;
    let objType = e.currentTarget.dataset.objtype;

    common.requestPost(api.dianz,{
      memberId: app.globalData.memberId,
      objId: objId,
      objType: objType,
    },res=>{
      if (objType == 0) {
        var mwktLista = that.data.mwktLista;
        mwktLista[index].isDianz = 'true';
        that.setData({
          mwktLista: mwktLista,
        })

      } else if (objType == 1) {

        var mwktListc = that.data.mwktListc;
        mwktListc[index].isDianz = 'true';
        that.setData({
          mwktListc: mwktListc,
        })


      } else if (objType == 2) {
        var mwktListb = that.data.mwktListb;
        mwktListb[index].isDianz = 'true';
        that.setData({
          mwktListb: mwktListb,
        })
      }


    })
  },


  //点击切换
  tabFunc(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.setData({
      indexa: index,
    })
    if (index == 0) {
      that.deliciousList(2)
    } else {
      that.deliciousList(1)
    }
  },


  //点击播放视频
  video() {
    this.setData({
      isPlay: true,
    })
    var videoContextCurrent = wx.createVideoContext('video1');
    videoContextCurrent.play();
  },



  //美味视频
  videos(e) {
    console.log(e)

    let that = this;
    let index = e.currentTarget.dataset.index;
    let mwktListc = that.data.mwktListc;

    mwktListc[index].isPlays = true;
    

    this.setData({
      mwktListc: mwktListc,
    })
    var videoContextCurrent = wx.createVideoContext('videos' + index);
    videoContextCurrent.play();
  },






  //详情
  deliciousDetail(e) {
    var objid = e.currentTarget.dataset.objid;
    
    wx.navigateTo({
      url: '../deliciousDetail/deliciousDetail?objid=' + objid,
    })
  },

  //评论
  deliciousComment() {
    wx.navigateTo({
      url: '../deliciousComment/deliciousComment',
    })
  },

  //签到页面
  signIn() {
    wx.navigateTo({
      url: '../signIn/signIn',
    })
  },


})