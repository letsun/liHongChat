// pages/delicious/delicious.js
const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");
Page({

  data: {
    indexa: 0,
    pageNum: 1,
    mwktList: 0,
    autoplay: true,
    integral: '',
    // mwktType:2,
    orderType:0,
    picklist:['默认排序','最新排序','最热排序',],
    categoryList:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this;
    if (app.globalData.memberId <= 0) {
      common.login()
    }
    that.categoryList()//社区版块-社区分类接口

    //that.deliciousList(2);
  },

  onShow() {
    let that = this;
    let integral = that.data.integral;
    that.setData({
      autoplay: true,
    })

    that.banner(); //轮播图
    common.getopenid(res => {
      app.globalData.idData.openid = res.data.result.openid
      common.uvpv('', '美味课堂首页') //页面访问uv信息
    })
    if (integral != '') {
      setTimeout(reg => {
        common.showToast(integral, 'none', res => {
          that.setData({
            integral: ''
          })
        })
      }, 500)
    }
  },


  //排序下拉
  picklist (e) {
    let that = this;
 
    let index = that.data.indexa;
    that.setData({
      orderType:e.detail.value,
      mwktList: '',
      hasNext: '',
      pageNum: 1,
    })
    if (index == 0) {
      that.deliciousList(2)
    } else {
      that.deliciousList(1)
    }
  },

  //轮播图
  banner() {
    let that = this;
    common.requestPostf(api.banner, {}, res => {
      that.setData({
        banner: res.data.data
      })
    }, reg => {
      that.setData({
        banner: ''
      })
    })
  },
  //轮播图跳转  0：抽奖页面;1: 积分商品详情页；2：美味菜谱详情页；3：社区文章详情页
  bannernav(e) {
    let that = this;
    let banner = that.data.banner;
    let index = e.currentTarget.dataset.index;
    let type = banner[index].type;
    console.log(type)

    if (app.globalData.memberId > 0) {
      if (type == 0) {
        wx.navigateTo({
          url: "../../shopping/shoppingActivity/shoppingActivity"
        })
      } else if (type == 1) {
        app.globalData.goodsId = banner[index].objId;
        wx.navigateTo({
          url: "../../shopping/shoppingDetails/shoppingDetails"
        })
      } else if (type == 2) {
        wx.navigateTo({
          url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + banner[index].objId + '&objtype=' + 1,
        })
      } else if (type == 3) {
        wx.navigateTo({
          url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + banner[index].objId + '&objtype=' + 0,
        })
      }
    } else {
      common.login()
    }

  },


  //社区版块-社区分类接口
  categoryList() {
    let that = this;
    let indexa = that.data.indexa;
    common.requestPostf(api.categoryList, {}, res => {
      let categoryList = res.data.data;
      let obj = {}
      obj.cateId = '';
      obj.cateName = '美味菜谱';
      categoryList.unshift(obj);
      that.setData({
        categoryList: categoryList
      })

      if (indexa == 0) {
        var mwktType = 2;
      } else {
        var mwktType = 1;
      }
      that.deliciousList(mwktType);
    },reg=>{
      let categoryList = [];
      let obj = {}
      obj.cateId = '';
      obj.cateName = '美味菜谱';
      categoryList.unshift(obj);
      
      that.setData({
        categoryList:categoryList
      })
      that.deliciousList(2);
    })
  },


  /**
   * memberId 	会员ID
   * mwktType 	美味课堂类型 0：官方视频；1：美味视频；2：美味菜谱
   * pageNum 	分页页码
   * 
   */

  deliciousList(mwktType) {
    let that = this;
    // if (mwktType == 0) {
    //   var pageNum = 1;
    // } else {
    //   var pageNum = that.data.pageNum;
    // }

    var indexa = that.data.indexa;
    var pageNum = that.data.pageNum;
    var categoryList = that.data.categoryList;
    var orderType = that.data.orderType;

    if (categoryList!='') {
      var cateId = categoryList[indexa].cateId;
    }else {
      var cateId = 0;
    }
   
    common.requestPosts(api.deliciousList, {
      cateId: cateId,
      memberId: app.globalData.memberId,
      mwktType: mwktType,
      pageNum: pageNum,
      orderType:orderType
    }, res => {
      var mwktList = res.data.data.mwktList;

      if (mwktType == 1) {
        for (var i in mwktList) {
          mwktList[i].isPlays = false
        }
      }
      if (that.data.mwktList == '') {
        that.setData({
          mwktList: res.data.data.mwktList,
          hasNext: res.data.data.hasNext,
        })
      } else {
        if (that.data.hasNext == 'true') {
          let mwktList = that.data.mwktList;
          that.setData({
            mwktList: mwktList.concat(res.data.data.mwktList),
            hasNext: res.data.data.hasNext,
          })
        }
      }
      // wx.hideLoading({})
    })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this;

    // common.showLoading()
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


  /***
   * 0：官方视频；1：美味视频；2：美味菜谱；3：评论
   * 
   */
  dianz(e) {
    // debugger;
    let that = this;
    let index = e.currentTarget.dataset.index;
    let indexa = that.data.indexa;
    let objId = that.data.mwktList[index].objId;
    if (indexa == 0) {
      var objType = 2
    } else {
      var objType = 1
    }
    if (app.globalData.memberId > 0) {
      common.requestPost(api.dianz, {
        memberId: app.globalData.memberId,
        objId: objId,
        objType: objType,
      }, res => {
        var mwktList = that.data.mwktList;
        var isDianz = mwktList[index].isDianz;
        if (isDianz != 'true') {
          mwktList[index].dianzNum = mwktList[index].dianzNum + 1;
        }
        mwktList[index].isDianz = 'true';
        that.setData({
          mwktList: mwktList,
        })
        common.showToast(res.data.msg, 'none', res => { })
      })
    } else {
      common.login()
    }
  },


  //点击切换
  tabFunc(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.setData({
      indexa: index,
      mwktList: '',
      hasNext: '',
      pageNum: 1,
      orderType:0
    })
    if (index == 0) {
      that.deliciousList(2)
    } else {
      that.deliciousList(1)
    }
  },


  //点击美味视频
  videos(e) {
    if (app.globalData.memberId > 0) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let mwktList = that.data.mwktList;
      mwktList[index].isPlays = true;
      for (var i = 0; i < mwktList.length; i++) {
        if (i != index) {
          mwktList[i].isPlays = false;
          var videoContextCurrent = wx.createVideoContext('videos' + i);
          videoContextCurrent.stop();
        }
      }
      this.setData({
        mwktList: mwktList,
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

  //详情 0： 社区文章；1：美味菜谱
  deliciousDetail(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let indexa = that.data.indexa;
    let mwktList = that.data.mwktList;
    let objid = mwktList[index].objId;
    if (indexa == 0) {
      var objtype = 1
    } else {
      var objtype = 0
    }
    if (app.globalData.memberId > 0) {
      wx.navigateTo({
        url: '../deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    } else {
      common.login()
    }
  },



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
    let mwktLista = that.data.banner;
    if (mwktLista != '') {
      common.requestPost(api.relay, {
        memberId: app.globalData.memberId,
        objId: mwktLista[0].objId,
        objType: 0,
      }, red => {

        that.setData({
          integral: red.data.msg
        })
      });

      return {
        title: that.data.objName,
        path: 'pages/delicious/deliciousList/deliciousList',
        imageUrl: that.data.objPic,
      }
    } else {

      return {
        title: '首页',
        path: 'pages/delicious/deliciousList/deliciousList',
        // imageUrl: that.data.objPic,
      }
    }
  },


  onShareAppMessage: function () {
    return this.sharePage();
  },


  //onUnload
  onHide() {
    let that = this;
    if (that.data.indexa != 0) {
      let mwktList = that.data.mwktList;
      for (var i = 0; i < mwktList.length; i++) {
        // debugger
        mwktList[i].isPlays = false;
        var videoContextCurrent = wx.createVideoContext('videos' + i);
        videoContextCurrent.stop();
      }
      that.setData({
        autoplay: false,
        mwktList: mwktList
      })
    }
  }

})