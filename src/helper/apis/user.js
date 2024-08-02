import request from '../ajax.js';

// 获取用户信息
const getUserInfo = (data) => {
    return request({
        method: "GET",
        url: `/qa/mini/user/info`,
        data
    });
}


// 金币
const getDailySignDay = (data) => {
    return request({
        method: "GET",
        url: `/qa/mini/basic/goldExchangeRule/daily/sign/day`,
        data
    });
}
//签到
const goSianIn = (data) => {
    return request({
        method: "GET",
        url: `/qa/mini/basic/goldExchangeRule/daily/sign`,
        data
    });
}

// 反馈
const postUserFeedback = (data) => {
    return request({
        method: "POST",
        url: `/qa/mini/user/feedback`,
        data
    });
}


// 用户余额记录
const getUserCashRecord = (data) => {
    return request({
        method: "GET",
        url: `/qa/mini/user/cash/record`,
        data
    });
}

// 用户金币记录

const getUserGoldRecord = (data) => {
    return request({
        method: "GET",
        url: `/qa/mini/user/gold/record`,
        data
    });
}
// 发送验证码
const postSendCode = (data) => {
    return request({
        method: "POST",
        url: `/qa/mini/basic/user/sendCode/${data.phone}`,
        data
    });
}

// 设置支付宝账号
const putAlipayAccount = (data) => {
    return request({
        method: "PUT",
        url: `/qa/mini/user/alipay/account`,
        data
    });
}


// 提现
const postWithdraw = (data) => {
    return request({
        method: "POST",
        url: `/qa/mini/user/withdraw`,
        data
    });
}



// 注销账户
const putForeverLogout = (data) => {
    return request({
        method: "PUT",
        url: `/qa/mini/user/forever/logout`,
        data
    });
}

//兑换金币
const putExchangeGoldCash = (data) => {
    return request({
        method: "PUT",
        url: `/qa/mini/basic/goldExchangeRule/exchange/cash?gold=${data.gold}`,
        data,
    });
};


let user = {
    getUserInfo,
    getDailySignDay,
    goSianIn,
    postUserFeedback,
    getUserCashRecord,
    getUserGoldRecord,
    postSendCode,
    putAlipayAccount,
    postWithdraw,
    putForeverLogout,
    putExchangeGoldCash
}

export default user