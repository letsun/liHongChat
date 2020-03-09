// pages/delicious/delicious.js
const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
Page({

  data: {
    arr: ['美味菜谱', '美味视频'],
    indexa: 0,
    pageNum: 1,
    mwktLista: '',
    mwktListb: '',
    mwktListc: '',
    autoplay: true,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this;
    // that.deliciousList(0)
    if (app.globalData.memberId <= 0) {
      common.login()
    }
  },

  onShow() {
    let that = this;
    that.setData({
      mwktListb: '',
      mwktListc: '',
      autoplay: true,
    })
    that.deliciousList(0);
    if (that.data.indexa == 0) {
      that.deliciousList(2);

    } else {
      that.deliciousList(1);
    }

    common.getopenid(res => {
      // console.log(res)
      app.globalData.idData.openid = res.data.result.openid
      common.uvpv('', '美味课堂首页') //页面访问uv信息
    })
  },

  // 监听轮播图
  bindchange(e) {
    let that = this;
    let index = e.detail.current;
    let mwktLista = that.data.mwktLista;
    for (var i = 0; i < mwktLista.length; i++) {
      mwktLista[i].isPlay = false;
      var videoContextCurrent = wx.createVideoContext('video' + i);
      videoContextCurrent.stop();
    }

    that.setData({
      videoid: this.data.mwktLista[index].objId,
      objName: this.data.mwktLista[index].objName,
      objPic: this.data.mwktLista[index].objPic,
      mwktLista: mwktLista,
      autoplay: true
    })
  },




  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this;
    if (that.data.indexa == 0) {
      that.setData({
        pageNum: that.data.pageNum + 1
      })
      that.deliciousList(2);
    } else {

      that.setData({
        pageNum: that.data.pageNum + 1
      })
      that.deliciousList(1);

    }
  },



  /**
   * memberId 	会员ID
   * mwktType 	美味课堂类型 0：官方视频；1：美味视频；2：美味菜谱
   * pageNum 	分页页码
   * 
   */

  deliciousList(mwktType) {
    let that = this;

    if (mwktType == 0) {
      var pageNum = 0;
    } else {
      var pageNum = that.data.pageNum;
    }

    common.requestPosts(api.deliciousList, {
      memberId: app.globalData.memberId,
      mwktType: mwktType,
      pageNum: pageNum
    }, res => {

      if (mwktType == 0) {

        var mwktLista = res.data.data.mwktList;
        for (var i in mwktLista) {
          mwktLista[i].isPlay = false
        }
        that.setData({
          mwktLista: mwktLista
        })

      } else if (mwktType == 1) {

        var mwktListc = res.data.data.mwktList;
        for (var i in mwktListc) {
          mwktListc[i].isPlays = false
        }
        if (that.data.mwktListc == '') {
          that.setData({
            mwktListc: res.data.data.mwktList,
            hasNext: res.data.data.hasNext,
          })
        } else {
          if (that.data.hasNext == 'true') {
            let mwktListc = that.data.mwktListc;
            that.setData({
              mwktListc: mwktListc.concat(res.data.data.mwktList),
              hasNext: res.data.data.hasNext,
            })
          }
        }

      } else if (mwktType == 2) {

        if (that.data.mwktListb == '') {
          that.setData({
            mwktListb: res.data.data.mwktList,
            hasNext: res.data.data.hasNext,
          })
        } else {
          if (that.data.hasNext == 'true') {
            let mwktListb = that.data.mwktListb;
            that.setData({
              mwktListb: mwktListb.concat(res.data.data.mwktList),
              hasNext: res.data.data.hasNext,
            })
          }
        }
      }

    })
  },


  /***
   * 0：官方视频；1：美味视频；2：美味菜谱；3：评论
   * 
   */
  dianz(e) {
    // debugger;
    let that = this;
    let index = e.currentTarget.dataset.index;
    let objId = e.currentTarget.dataset.objid;
    let objType = e.currentTarget.dataset.objtype;

    common.requestPost(api.dianz, {
      memberId: app.globalData.memberId,
      objId: objId,
      objType: objType,
    }, res => {
      if (objType == 0) {
        var mwktLista = that.data.mwktLista;
        var isDianz = mwktLista[index].isDianz;
        if (isDianz != 'true') {
          mwktLista[index].dianzNum = mwktLista[index].dianzNum + 1;
        }
        mwktLista[index].isDianz = 'true';
        that.setData({
          mwktLista: mwktLista,
        })

      } else if (objType == 1) {

        var mwktListc = that.data.mwktListc;
        var isDianz = mwktListc[index].isDianz;
        if (isDianz != 'true') {
          mwktListc[index].dianzNum = mwktListc[index].dianzNum + 1;
        }
        mwktListc[index].isDianz = 'true';
        that.setData({
          mwktListc: mwktListc,
        })

      } else if (objType == 2) {
        var mwktListb = that.data.mwktListb;
        var isDianz = mwktListb[index].isDianz;
        if (isDianz != 'true') {
          mwktListb[index].dianzNum = mwktListb[index].dianzNum + 1;
        }

        mwktListb[index].isDianz = 'true';
        that.setData({
          mwktListb: mwktListb,
        })
      }

      common.showToast(res.data.msg, 'none', res => {})
    })
  },


  //点击切换
  tabFunc(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.setData({
      indexa: index,
      mwktListb: '',
      mwktListc: '',
      hasNext: '',
      pageNum: 1,
    })
    if (index == 0) {
      that.deliciousList(2)
    } else {
      that.deliciousList(1)
    }
  },


  //点击轮播图播放视频
  video(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let mwktLista = that.data.mwktLista;
    if (app.globalData.memberId > 0) {

      mwktLista[index].isPlay = true;
      for (var i = 0; i < mwktLista.length; i++) {
        if (i != index) {
          mwktLista[i].isPlay = false;
          var videoContextCurrent = wx.createVideoContext('video' + i);
          videoContextCurrent.stop();
        }
      }

      this.setData({
        mwktLista: mwktLista,
        autoplay: false
      })

      var videoContextCurrent = wx.createVideoContext('video' + index);
      videoContextCurrent.play();
      var objid = e.currentTarget.dataset.objid;
      that.browse(0, objid)

    } else {
      common.login()
    }


  },


  //点击美味视频
  videos(e) {
    if (app.globalData.memberId > 0) {

      let that = this;
      let index = e.currentTarget.dataset.index;
      let mwktListc = that.data.mwktListc;

      mwktListc[index].isPlays = true;

      for (var i = 0; i < mwktListc.length; i++) {
        if (i != index) {
          mwktListc[i].isPlays = false;
          var videoContextCurrent = wx.createVideoContext('videos' + i);
          videoContextCurrent.stop();
        }
      }
      this.setData({
        mwktListc: mwktListc,
      })
      var videoContextCurrent = wx.createVideoContext('videos' + index);
      videoContextCurrent.play();

      var objid = e.currentTarget.dataset.objid;
      that.browse(1, objid)
    } else {
      common.login()
    }
  },


  /**
   * 0：官方视频；1：美味视频；2：美味菜谱
   * 浏览记录
   */
  browse(objType, objid) {
    let that = this;
    common.requestPost(api.browse, {
      memberId: app.globalData.memberId,
      objId: objid,
      objType: objType,
    }, res => {

    })
  },



  //详情
  deliciousDetail(e) {
    if (app.globalData.memberId > 0) {
      let objid = e.currentTarget.dataset.objid;
      let objtype = e.currentTarget.dataset.objtype;
      wx.navigateTo({
        url: '../deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    } else {
      common.login()
    }
  },

  //评论
  // deliciousComment() {
  //   wx.navigateTo({
  //     url: '../deliciousComment/deliciousComment',
  //   })
  // },

  //签到页面
  signIn() {

    if (app.globalData.memberId > 0) {
      wx.navigateTo({
        url: '../signIn/signIn',
      })

    } else {
      common.login()
    }
  },

  sharePage() {
    let that = this;
    common.requestPost(api.relay, {
      memberId: app.globalData.memberId,
      objId: that.data.videoid,
      objType: 0,
    }, red => {

    });
    return {
      title: that.data.objName,
      path: 'pages/delicious/deliciousList/deliciousList',
      imageUrl: that.data.objPic,
    }
  },


  onShareAppMessage: function() {
    return this.sharePage();
  },

  onHide() {
    let that = this;
    let mwktLista = that.data.mwktLista;

    for (var i = 0; i < mwktLista.length; i++) {
      mwktLista[i].isPlay = false;
      var videoContextCurrent = wx.createVideoContext('video' + i);
      videoContextCurrent.stop();
    }
    this.setData({
      mwktLista: mwktLista,
    })

  }


})