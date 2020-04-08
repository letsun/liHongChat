const app = getApp();
const common = require("../../../utils/common.js");
const api = require("../../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // memberId: 1,
    // objid: 7,
    // objType: 1,
    pageNum: 1,
    isPlay: false,

    hasNext: '',
    deliciousDetail: '',
    commentList: '',

    integral:'',
  },

  /**
   * 
   * objType 1 美味菜谱 0美味视频 2 官方视频
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    console.log(options, "30")

    that.setData({
      objid: options.objid,
      objType: options.objtype
    });

  },

  onShow() {
    let that = this;
    let objtype = that.data.objType;
    console.log(objtype)
    console.log(that.data.objType)
    if (objtype == 0) {
      common.uvpv('', '美味视频详情页') //页面访问uv信息
      that.browse(1)
      that.deliciousDetail(0) //详情
    } else if (objtype == 1) {
      common.uvpv('', '美味菜谱详情页') //页面访问uv信息
      that.browse(2)
      that.deliciousDetail(0) //详情
    } else if (objtype == 2) {
      that.browse(0) //浏览记录
    }

    let integral = that.data.integral;
    console.log(integral,'70')

    if (integral!='') {
      setTimeout(reg=>{
        common.showToast(integral, 'none', res => {
          that.setData({
            integral: ''
          })
        })
      },500)

    }
    
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    });

    that.deliciousDetail(0);
  },


  /**
   * 	0： 美味视频；1：美味菜谱
   * 
   *  详情
   * 
   * type 0 页面上拉刷新 1品论后刷新
   * 
   */

  deliciousDetail(type) {

    let that = this;
    common.requestPosts(api.deliciousDetail, {
      memberId: app.globalData.memberId,
      objId: that.data.objid,
      objType: that.data.objType,
      pageNum: that.data.pageNum
    }, res => {
      
      if (that.data.objType == 1) {
        if (that.data.deliciousDetail == '') {

          let ingredients = JSON.parse(res.data.data.ingredients); //食材组成
          let seasoning = JSON.parse(res.data.data.seasoning); //调料组成
          let labels = JSON.parse(res.data.data.labels) //菜谱标签	

          that.setData({
            ingredients: ingredients,
            seasoning: seasoning,
            labels: labels
          })
        }

        wx.setNavigationBarTitle({
          title: res.data.data.recipesName,
        })

      } else {
        wx.setNavigationBarTitle({
          title: res.data.data.videoName,
        })
      }

      //页面刷新还是评论后刷新
      if (type == 0) {
        if (that.data.deliciousDetail == '') {
          that.setData({
            deliciousDetail: res.data.data,
            commentList: res.data.data.commentInfo.commentList,
            hasNext: res.data.data.commentInfo.hasNext
          })

          var detail = '';
          var detail2 = '';
          var detail3 = '';
          var detail4 = '';
          if (that.data.deliciousDetail.mwktDesc) {
            detail = that.data.deliciousDetail.mwktDesc.replace(/\<section/gi, '<div');
            detail2 = detail.replace(/section\>/gi, 'div>');
            detail3 = detail2.replace(/\<u/gi, '<i');
            detail4 = detail3.replace(/u\>/gi, 'i>');
            that.setData({
              mwktDesc: detail4.replace(/\<img/gi, '<img style="display:block;max-width:100%;margin:0 auto;height:auto" '),
            })
          }

        } else {
          let commentList = that.data.commentList;
          if (that.data.hasNext == 'true') {
            that.setData({
              commentList: commentList.concat(res.data.data.commentInfo.commentList),
              hasNext: res.data.data.commentInfo.hasNext
            })
          }
        }

      } else {

        that.setData({
          deliciousDetail: res.data.data,
          commentList: res.data.data.commentInfo.commentList,
          hasNext: res.data.data.commentInfo.hasNext
        })

        var detail = '';
        var detail2 = '';
        var detail3 = '';
        var detail4 = '';
        if (that.data.deliciousDetail.mwktDesc) {
          detail = that.data.deliciousDetail.mwktDesc.replace(/\<section/gi, '<div');
          detail2 = detail.replace(/section\>/gi, 'div>');
          detail3 = detail2.replace(/\<u/gi, '<i');
          detail4 = detail3.replace(/u\>/gi, 'i>');
          that.setData({
            mwktDesc: detail4.replace(/\<img/gi, '<img style="display:block;max-width:100%;margin:0 auto;height:auto" '),
          })
        }
      }


    })
  },

  //获取input评论
  inputchang(e) {

    let that = this;
    let commentDesc = e.detail.value.replace(/(^\s+)|(\s+$)/g, "");
    that.setData({
      commentDesc: commentDesc
    })
  },

  /**
   * 
   * 发表评论
   * commentDesc	评论内容	str
   * memberId	会员ID	
   * objId	美味视频或菜谱ID	
   * objType 0：美味视频；1：美味菜谱
   * 
   */
  comment() {
    let that = this;
    if (app.globalData.memberId > 0) {
      if (that.data.commentDesc == '' || !that.data.commentDesc) {
        common.showToast('请输入评论', 'none',res=>{});
        return false;
      }
      common.requestPost(api.comment, {
        memberId: app.globalData.memberId,
        objId: that.data.objid,
        objType: that.data.objType,
        commentDesc: that.data.commentDesc
      }, res => {
        setTimeout(red=>{
          common.showToast(res.data.msg, 'none', reg => { })
        },500)

        that.setData({
          commentDesc: '',
          pageNum: 1
        })
        that.deliciousDetail(1) //详情

      })
    } else {
      common.login()
    }
  },


  /***
   * 0：官方视频；1：美味视频；2：美味菜谱；3：评论
   * 点赞
   */
  dianz(e) {
    let that = this;
    if (app.globalData.memberId > 0) {
      let index = e.currentTarget.dataset.index;
      let objId = e.currentTarget.dataset.objid;
      let objType = e.currentTarget.dataset.objtype;
      let deliciousDetail = that.data.deliciousDetail;

      common.requestPost(api.dianz, {
        memberId: app.globalData.memberId,
        objId: objId,
        objType: objType,
      }, res => {

        if (objType != 3) {
          deliciousDetail.isDianz = 'true';
          deliciousDetail.dianzNum = deliciousDetail.dianzNum +1;
          that.setData({
            deliciousDetail: deliciousDetail,
          })
        } else {
          let commentList = that.data.commentList;
          let dianzNum = that.data.commentList[index].dianzNum;
          commentList[index].dianzNum = dianzNum - 0 + 1;

          commentList[index].isDianz = 'true';
          that.setData({
            commentList: commentList
          })
        }
        common.showToast(res.data.msg, 'none', res => {})
      })
    } else {
      common.login()
    }
  },

  /**
   * 0：官方视频；1：美味视频；2：美味菜谱
   * 浏览记录
   */
  browse(objType) {
    let that = this;
    common.requestPost(api.browse, {
      memberId: app.globalData.memberId,
      objId: that.data.objid,
      objType: objType,
    }, res => {
      //that.deliciousDetail(0) //详情

    })
  },

  //点击播放视频
  videoPlay() {

    let that = this;
    let videoFile = that.data.deliciousDetail.videoFile;
    if (videoFile!='') {
      var videoContextCurrent = wx.createVideoContext('video');

      console.log(videoContextCurrent)
      videoContextCurrent.play();
      this.setData({
        isPlay: true,
      })
    }


  },

  sharePage() {
    let that = this;
    let title = '';
    let pic = '';
    let objType;
    if (that.data.objType == 1) {
      title = that.data.deliciousDetail.recipesName;
      pic = that.data.deliciousDetail.recipesPic;
      objType = 2;//请求参数

      var objTypea =1 //分享参数
    } else if (that.data.objType == 0) {
      title = that.data.deliciousDetail.videoName;
      pic = that.data.deliciousDetail.videoPic;
      objType = 1;

      var objTypea = 0 //分享参数
    }

    common.requestPost(api.relay, {
      memberId: app.globalData.memberId,
      objId: that.data.objid,
      objType: objType,
    }, red => {
      that.setData({
        integral:red.data.msg
      })
    });


    return {
      title: title,
      path: 'pages/delicious/deliciousDetail/deliciousDetail' + '?objid=' + that.data.objid + '&objtype=' + objTypea + '&pageNum=' + 1,
      imageUrl: pic,
    }
  },

  onShareAppMessage: function() {
  

    return this.sharePage();
  },


  // 跳转到生成海报
  toPic() {
    let that = this;
    wx.navigateTo({
      url: '../createPic/createPic?objid=' + that.data.objid + '&objtype=' + that.data.objType
    })
  },

})