// pages/complete/complete.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickValue: '请输入',
    sex: ['女', '男'],
    index: 0,
    index1: 0,
    memJob: 0,
    birthDay: '2020-02-24',
    city:'',
    postList: [
      '服务员',
      '帮厨',
      '厨师',
      '主厨',
      '采购',
      '餐饮老板/分销老板',
      '消费者',
    ],
    
  },

  onLoad(options) {
    
    let that = this ;
    that.setData({
      type:options.type
    })

    if(that.data.type == 1) {

      wx.setNavigationBarTitle({
        title: '个人资料',
      }) 
      that.userInfo();
    } else if (that.data.type == 0) {
      wx.setNavigationBarTitle({
        title: '完善个人资料',
      }) 
    }
    
  },

  

  infoSub(e) {
    let that = this,
      birthDay = that.data.birthDay,
      buyAddr = e.detail.value.buyAddr,
      buyWho = e.detail.value.buyWho,
      city = that.data.city,
      district = that.data.district,
      postList = that.data.postList,

    memJob = that.data.postList[that.data.memJob],
      memName = e.detail.value.memName,
      memShop = e.detail.value.memShop,
      province = that.data.province,
      sex = that.data.index;

    if (memName == '') {
      common.showToast('请输入姓名', 'none', () => {

      });

      return false;
    }

    if (birthDay == '') {
      common.showToast('请选择日期', 'none', () => {

      });

      return false;
    }

    if (city == '') {
      common.showToast('请选择城市', 'none', () => {

      });

      return false;
    }

    if (memShop == '') {
      common.showToast('请输入门店名称', 'none', () => {

      });

      return false;
    }

    if (memJob == '') {
      common.showToast('请选择岗位', 'none', () => {

      });
      return false;
    }

    common.requestPosts(api.infoSub + app.globalData.memberId, {
      birthDay: birthDay,
      buyAddr: buyAddr,
      buyWho: buyWho,
      city: city,
      district: district,
      memJob: memJob,
      memName: memName,
      memShop: memShop,
      province: province,
      sex: sex,
    }, res => {
      let  data  = res.data.data
      common.showToast('提交资料成功,恭喜获得' + data +'积分', 'none', res => {})
      setTimeout(res => {
        wx.reLaunch({
          url: '../../personalCenter/personal/personal',
        })
      }, 1500)
    })
  },


  // 获取省市区
  pickchange(e) {

    let that = this;
    let pickValue = e.detail.value;
    let province = pickValue[0];
    let city = pickValue[1];
    let district = pickValue[2];
    that.setData({
      pickValue: pickValue,
      province: province,
      city: city,
      district: district,
    })
  },

  //获取男女

  sexchange(e) {
    console.log(e)
    
    let that = this;
    console.log(that.data.sex)
    that.setData({
      index: e.detail.value
    })
  },

  // 选择生日
  bindDateChange: function(e) {
    this.setData({
      birthDay: e.detail.value
    })
  },

  // 选择岗位
  postchange: function(e) {
    this.setData({
      memJob: e.detail.value
    })
  },

  //获取用户信息
  userInfo() {
    let that = this;
    common.requestPost(api.userInfo + app.globalData.memberId, {}, res => {
      for (var i = 0; i < that.data.postList.length; i++) {
        if (that.data.postList[i] == res.data.data.memJob) {
          that.setData({
            memJob: i,
          });
        }
      }
      that.setData({
        userInfo: res.data.data,
        pickValue: res.data.data.province + '-' + res.data.data.city + '-' + res.data.data.district,
        index: res.data.data.sex,
        birthDay: res.data.data.birthDay,
      })
    })
  },
})