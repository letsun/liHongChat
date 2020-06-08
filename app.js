const RdWXBizDataCrypt = require('utils/WXBizDataCrypt.js');
App({

  // onShow: function (options) {
  //   console.log("[onShow] 本次场景值:", options.scene)
  // },
  globalData: {
    qrtypes:'', //判断从哪里扫码进来
    memberId: 0,
    mobile: '',
    code:'',
    idData: {
      openid: '',
      //openid: 'ofjyq5bIZoFepEV22XbqTsxAtkI0',
      apipwd:'',
      token:'',
      sessionKey:'',
      unionId: "",
    },
    goodsId:'',//商品id
    companyId:'', //企业id
    nickName:'',
    addressComponent:{
      city:'',
      district:'',
      province: '',
      street: '',
      town: '',
    },

    imapath:'https://qdwzvue-1254182596.cos.ap-guangzhou.myqcloud.com/qdwzAct/liHongChat/',

    formatted_address:''
  }
})