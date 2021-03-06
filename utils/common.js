const app = getApp();
const api = require("api.js");
const utilMd5 = require("md5.js");
const RdWXBizDataCrypt = require("WXBizDataCrypt.js");
var newData = new Date().getTime();
var key = "api-HR-lihong2019!@#$%^&";



/***
 * 
 *模态框
 * content: 提示文字
 * confirm:点击确认的回调函数
 * cancel:点击取消的回调函数
 */

function showModal(title, content, confirm, cancel) {
  wx.showModal({
    title: title,
    content: content,
    showCancel: true,
    confirmColor: '#F52F20',
    success(res) {
      if (res.confirm) {
        confirm(confirm)
      } else if (res.cancel) {
        cancel(cancel)
      }
    },
  })
}



/***
 * 
 * 提示框
 * title: 提示文字
 * icon:提示图标
 * success:返回成功的回调函数
 */

function showToast(title, icon, success) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: 2000,
    mask: true,
    success: function(res) {
      success(res)
    },
    fail: function(res) {},
  })
}

/***
 * 
 * 加载框
 * title: 提示文字
 * icon:提示图标
 * success:返回成功的回调函数
 */
function showLoading() {
  wx.showLoading({
    title: '加载中',
    mask: true,
    success: res => {

    },
    fail: res => {
      wx.hideLoading()
    }
  })
}




/***
 * 
 * post请求
 *url:请求地址 
 * data:请求数据
 * res:回调
 */

function requestPost(url, data, success) {
  wx.request({
    url: url,
    method: "POST",
    header: {
      //'Content-Type': 'application/json'
      'Accept': 'application/json',
      "content-type": "application/x-www-form-urlencoded",
      'oi': app.globalData.idData.openid,
      'times': newData,
      's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase() ,
      'pwd': app.globalData.idData.apipwd,
      'tk': app.globalData.idData.token,
      // 'ui': app.globalData.unionId,
    },

    data: data,
    success: res => {
      if (res.data.code == 200) {
        success(res)
      } else {
        showToast(res.data.msg, 'none',res=>{})
      }
    },

    fail: res => {
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => {
      // wx.hideLoading();
    }

  })

}



/***
 * 带加载
 * post请求
 *url:请求地址 
 * data:请求数据
 * res:回调
 */

function requestPosts(url, data, success) {
  showLoading();
  wx.request({
    url: url,
    method: "POST",
    header: {
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      'content-type': "application/x-www-form-urlencoded",
      'oi': app.globalData.idData.openid,
      'times': newData,
      's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase(),
      'pwd': app.globalData.idData.apipwd,
      'tk': app.globalData.idData.token,
    },

    data: data,
    success: res => {

      if (res.data.code == 200) {
        success(res)
        wx.hideLoading()
      } else {
        wx.hideLoading()
        showToast(res.data.msg, 'none', res => { })
      }
    },

    fail: res => {
      wx.hideLoading();
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => {
      // wx.hideLoading();
    }

  })

}


/***
 * 带加载
 * post请求
 *url:请求地址 
 * data:请求数据
 * res:回调
 * fali:失败回调
 */

function requestPostf(url, data, success,fail) {

  wx.request({
    url: url,
    method: "POST",
    header: {
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      'content-type': "application/x-www-form-urlencoded",
      'oi': app.globalData.idData.openid,
      'times': newData,
      's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase(),
      'pwd': app.globalData.idData.apipwd,
      'tk': app.globalData.idData.token,
    },

    data: data,
    success: res => {
      if (res.data.code == 200) {
   
        success(res)
      } else {
        fail(res)
      }
    },

    fail: res => {
      wx.hideLoading();
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => {
      // wx.hideLoading();
    }

  })

}





/***
 * 
 * GET请求
 * url:请求地址
 * data:请求数据
 * res:回调
 */


function requestGet(url, data, success) {
  wx.request({
    url: url,
    method: "GET",
    header: {
      'Accept': 'application/json',
      "content-type": "application/x-www-form-urlencoded",
      'oi': app.globalData.idData.openid,
      'times': newData,
      's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase(),
      'pwd': app.globalData.idData.apipwd,
      'tk': app.globalData.idData.token,
    },

    data: data,
    success: res => {
      if (res.data.code == 200) {
        success(res)
      } else {
        showToast(res.data.msg, 'none', res => { })
      }
    },

    fail: res => {
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },

    complete: res => { }
  })

}


/***
 * 带加载
 * GET请求
 * url:请求地址
 * data:请求数据
 * res:回调
 */


function requestGets(url, data, success) {
  showLoading();
  wx.request({
    url: url,
    method: "GET",
    header: {
      'Accept': 'application/json',
      "content-type": "application/x-www-form-urlencoded",
      'oi': app.globalData.idData.openid,
      'times': newData,
      's': utilMd5.hexMD5(app.globalData.idData.openid + app.globalData.idData.apipwd + newData + key).toUpperCase(),
      'pwd': app.globalData.idData.apipwd,
      'tk': app.globalData.idData.token,
    },

    data: data,
    success: res => {
      if (res.data.code == 200) {
        success(res)
        wx.hideLoading()
      } else {
        wx.hideLoading()
        showToast(res.data.msg, 'none',res=>{})
      }
    },

    fail: res => {
      wx.hideLoading()
      showToast('网络异常，请重新刷新页面', 'none', res => { })
    },
    complete: res => {}
  })
}

/***
 * 
 * 获取openid
 * 
 */

function getopenid(callback) {
  wx.login({
    success: res => {
      requestPost(api.getOpenidByCode,{
        code: res.code
      },res=>{
        callback(res)
      })
    }
  })
}

/***
 * 
 * 是否授权登录
 * 
 */
function login(callback) {
  let that = this;
  wx.login({
    success: res => {
      wx.request({
        url:api.getOpenidByCode,
        data: {
          code: res.code
        },
        header: {
          'Accept': 'application/json',
          'content-type': "application/x-www-form-urlencoded",
        },
        method: 'POST',
        success: function (reg) {
          app.globalData.idData = reg.data.result;
          wx.getUserInfo({
            success: function (red) {
              app.globalData.headImg = red.userInfo.avatarUrl;
              app.globalData.nickName = red.userInfo.nickName;
              app.globalData.sex = red.userInfo.gender;
              var appId = 'wx92ddcbce04fc34b6';
              var encryptedData = red.encryptedData;
              var iv = red.iv;
              var pc = new RdWXBizDataCrypt(appId, app.globalData.idData.sessionKey);
              var data = pc.decryptData(encryptedData, iv);
              app.globalData.idData.unionId = data.unionId;

              wx.request({
                url: api.reginfo,
                data: {
                  headImg: app.globalData.headImg,
                  nickName: app.globalData.nickName,
                  sex: app.globalData.sex,
                  unionId: app.globalData.idData.unionId,
                  xcxOpenid: app.globalData.idData.openid,
                  mobile: app.globalData.mobile
                },
                header: {
                  'content-type': "application/x-www-form-urlencoded",
                },
                method: 'POST',
                success: function (reg) {
                  if (reg.data.code == 200) {
                    app.globalData.memberId = reg.data.data.memId;
                    if (callback) {
                      callback();
                    }
                    
                  }else {
                    showToast(reg.data.msg, 'none', res => {
                      wx.navigateTo({
                        url: '../../author/author',
                      })
                     })
                  }
                },
                fail: function (reg) { },
              })
            },
            fail: function (red) {
              wx.navigateTo({
                url: '../../author/author',
              })
            },
          })
        },
        fail: function (reg) { },
        complete: function (reg) { },
      })

    }
  })
}


/**
 * 页面访问uv信息
 * 
 */
function uvpv(activityId, pageName) {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  requestPostf(api.uvpv, {
    activityId: '',	//活动ID	number	如果是一物一码活动，需要传此ID。 可以为空
    clientType: '0',	//	客户端类型	number	0：小程序；1：H5（小程序默认传： 0）
    memberId: app.globalData.memberId,	//	会员ID	number	会员ID，如果授权登录了，需要传。否则可以为空
    nickName: app.globalData.nickName,	//	会员昵称	number	会员昵称，如果授权登录了，需要传，否则可以为空
    openId: app.globalData.idData.openid,	//	小程序openid	string	小程序openid，必须传
    pageName: pageName,	//	页面名称	string	页面名称，必须传（如：美味菜谱详情页，积分商城首页等）
    pageUrl: url,	//	页面路径	string	页面路径url，必须传（如：/ page / jifen） 
  }, res => {

  },resg=>{})
}


module.exports = {
  showModal: showModal,
  showToast: showToast,
  showLoading: showLoading,
  requestPost: requestPost,
  requestPosts: requestPosts,
  requestPostf:requestPostf,
  requestGet: requestGet,
  requestGets: requestGets,
  getopenid: getopenid,
  login: login,

  uvpv: uvpv
}