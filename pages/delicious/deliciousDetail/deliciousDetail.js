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
    commentList:''
  },

  /**
   * 
   * objType 1 美味菜谱 0美味视频 2 官方视频
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    console.log(options)

    that.setData({
      objid: options.objid,
      objType: options.objtype
    });

    if (options.objtype == 0) {
      that.browse(1)
    } else if (options.objtype == 1) {
      that.browse(2)
    } else if (options.objtype == 2) {
      that.browse(0) //浏览记录
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

      }


      if(type==0) {
        if (that.data.deliciousDetail == '') {
          that.setData({
            deliciousDetail: res.data.data,
            commentList: res.data.data.commentInfo.commentList,
            hasNext: res.data.data.commentInfo.hasNext
          })
        } else {
          let commentList = that.data.commentList;
          if (that.data.hasNext == 'true') {
            that.setData({
              commentList: commentList.concat(res.data.data.commentInfo.commentList),
              hasNext: res.data.data.commentInfo.hasNext
            })
          }
        }

      }else {

        that.setData({
          deliciousDetail: res.data.data,
          commentList: res.data.data.commentInfo.commentList,
          hasNext: res.data.data.commentInfo.hasNext
        })
      }


    })
  },

  //获取input评论
  inputchang(e) {

    let that = this;
    let commentDesc  = e.detail.value;

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
    common.requestPost(api.comment, {
      memberId: app.globalData.memberId,
      objId: that.data.objid,
      objType: that.data.objType,
      commentDesc: that.data.commentDesc
    }, res => {
      that.setData({
        // deliciousDetail:'',
        // commentList:'',
        commentDesc:'',
        pageNum:1
      })

      that.deliciousDetail(1) //详情

    })
  },



  /***
   * 0：官方视频；1：美味视频；2：美味菜谱；3：评论
   * 点赞
   */
  dianz(e) {
    let that = this;
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

        that.setData({
          deliciousDetail: deliciousDetail,
        })

      } else {

        let dianzNum = that.data.deliciousDetail.commentInfo.commentList[index].dianzNum;
        deliciousDetail.commentInfo.commentList[index].dianzNum = dianzNum - 0 + 1;
        that.setData({
          deliciousDetail: deliciousDetail
        })

      }


    })

  },

  /**
   * 0：官方视频；1：美味视频；2：美味菜谱
   * 浏览记录
   */
  browse(objType) {
    console.log(app.globalData.memberId);
    let that = this;
    common.requestPost(api.browse, {
      memberId: app.globalData.memberId,
      objId: that.data.objid,
      objType: objType,
    }, res => {
      that.deliciousDetail() //详情

    })
  },


  //点击播放视频
  videoPlay() {
    var videoContextCurrent = wx.createVideoContext('video');
    // debugger
    videoContextCurrent.play();
    this.setData({
      isPlay: true,
    })
  },


    sharePage () {
        let that = this;
        let title = '';
        let pic = '';
        if (that.data.objType == 1) {
            title = that.data.deliciousDetail.recipesName;
            pic = that.data.deliciousDetail.recipesPic;
        } else {
            title = that.data.deliciousDetail.videoName;
            pic = that.data.deliciousDetail.videoPic;
        }

        common.requestPost(api.relay, {
            memberId: app.globalData.memberId,
            objId: that.data.objid,
            objType: that.data.objType,
        }, red => {

        });
        return {
            title: title,
            path: 'pages/delicious/deliciousDetail/deliciousDetail' + '?objid=' + that.data.objid + '&objtype=' + that.data.objType,
            imageUrl: pic,
        }
    },


    onShareAppMessage: function() {
        return this.sharePage();
    },


    // 跳转到生成海报
    toPic () {
        let that = this;
        wx.navigateTo({
            url: '../createPic/createPic?objid=' + that.data.objid + '&objtype=' + that.data.objType
        })
    },

})