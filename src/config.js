const adCodeData = {
  vivo: {
    appid: 111256983,
    stimulateAd: 'd9b577f2a1c04838b27dcbdafde675d6',
    banner: '3aae67431134438f9028c1d513f48098',
    tableScreenAd: '',
    nativeAd: 'e697c56e9c234a249226909c23e83ca7',
    lotteryPageNativeAd: '7c15f38bb3dc4c2eac7810eb6b76bd38',
    fiction1: 'e68acc9426a94b66964d46798285045c', //原生小说广告页id
    fiction2: '289dbba47a8548dba15f64b9c6b39a24', //原生小说广告页id
    fiction3: '3dfe6f5b546a4f2d83135e5297f8b6df', //原生小说广告页id
    fiction4: 'a6d7b1e5c1244277acc78dd86793a880', //原生小说广告页id
  },
  xiaomi: {
    nativeAd: '3ebda492da8090a8e28b3544df52da61', //原生
    tableScreen: 'l4ai02av3y',
    stimulateAd: '182b9c7d8701f5c50a0d5f1cb9fcf2b0',
    banner: 'f25c41f2e050f7bd045186ba095b6c8c',
    lotteryPageNativeAd: '3ebda492da8090a8e28b3544df52da61',
  },
  OPPO: {
    nativeAd: '1636371', //原生
    tableScreen: '1636380',
    stimulateAd: '1636375',
    banner: '',
    lotteryPageNativeAd: '1636371',
    fiction1: '1648684', //原生小说广告页id
    fiction2: '1648688', //原生小说广告页id
    fiction3: '1648692', //原生小说广告页id
    fiction4: '1648695', //原生小说广告页id
    fiction5: '1649297', //原生小说广告页id
  },
  HUAWEI: {
    banner: 'w4brvyloy0',
    nativeAd: 'y82ss9y9f7', //原生
    tableScreen: 'l4ai02av3y',
    stimulateAd: 'o0rbevcepx',
    lotteryPageNativeAd: 'b9flx2el39',
  },
  huawei: {
    banner: 'w4brvyloy0',
    nativeAd: 'y82ss9y9f7', //原生
    tableScreen: 'l4ai02av3y',
    stimulateAd: 'o0rbevcepx',
    lotteryPageNativeAd: 'b9flx2el39',
  },
}
const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqaj0Y3k54jCyTq47t73S
cBX9uBsSScDo7/uZ+PhHYh9eQqHNW1bBjKGV4t3Y8Wokhv783krxhIqzkPf9nHeZ
2yWqoQlPa3qOUc7Wf/HpX2+eHGRjF1/RLARJmMcEgQYB3WGbdRedu0FjQSGd+OfS
S/W7Heh2ZGlF/aSHj2NYhYE4p7x4jjQIi+ueKZvVJNZpu0vhQaF45jpqQDULPL+M
kkQePmupjp/PR4Ra8BVg4DwJuI6K8jL77YWaxeQRbMrEiQ0ZbTKRQ4o8N73iIM97
E/h8PbDl5FbuNn0k8urkYnmv56AMdkVEyIOUwNEa8oU9QKz37o5Z2L7+yqx2zmLp
VwIDAQAB`
// 私钥
const privateKey = ''

const currentService = 'prod'
const appConfig = {
  prod: {
    BASEHOST: 'https://api.ihaituo.cn',
  },
  dev: {
    BASEHOST: 'http://192.168.3.48:9999',
  },
  uat: {
    BASEHOST: 'https://mini.cnyings.com',
  },
  test: {
    BASEHOST: 'https://test.ipandata.com',
  },
}

export default {
  adCodeData,
  publicKey,
  privateKey,
  BASEHOST: appConfig[currentService].BASEHOST,
}
