// pages/delicious/delicious.js
const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
Page({

  data: {
    arr: ['美味菜谱', '美味视频'],
    indexa: 0,
    isPlay: false,

    // isPlays: false,
    pageNum: 1,
    mwktLista: '',
    mwktListb: '',
    mwktListc: '',

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // let that = this;


    // that.deliciousList()

    let that = this;
    if (app.globalData.memberId <= 0) {
      common.login()
    }
  },

  onShow() {
    let that = this;
    that.setData({
      mwktLista: '',
      mwktListb: '',
      mwktListc: '',
      isPlay:'',
    })
    that.deliciousList(0);
    if (that.data.indexa==0) {
      that.deliciousList(2);

    }else {
      that.deliciousList(1);
    } 
  },

    // 监听轮播图
    bindchange (e) {
        let index = e.detail.current;
        this.setData({
            videoid: this.data.mwktLista[index].objId,
            objName: this.data.mwktLista[index].objName,
            objPic: this.data.mwktLista[index].objPic,
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
        that.setData({
          mwktLista: res.data.data.mwktList
        })
      } else if (mwktType == 1) {

        var mwktListc = res.data.data.mwktList;
        for (var i in mwktListc) {
          mwktListc[i].isPlays = false
        }
        // that.setData({
        //   mwktListc: mwktListc
        // })


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


  //点击播放视频
  video() {
    if (app.globalData.memberId > 0) {
      this.setData({
        isPlay: true,
      })
      var videoContextCurrent = wx.createVideoContext('video1');
      videoContextCurrent.play();
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

    } else {
      common.login()
    }
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

    sharePage () {
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


})