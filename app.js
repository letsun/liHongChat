const RdWXBizDataCrypt = require('utils/WXBizDataCrypt.js');
App({

  globalData: {
    memberId: '',
    mobile: '',
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

    formatted_address:''
  }
})