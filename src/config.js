const adCodeData = {
  vivo: {
    appid: 111256983,

    lotteryPageNativeAd: '3bd89b5814dc4a2fbe372aa7955c5dc9',//场景-转盘弹出层
    nativeAd: '9856466221f1477aaf352f3b829f0b43',//原生//记账小管家-原生-在用-开红包
    stimulateAd: '92067659aed0471ebd21f89a14f81d4f',//幸运大转盘-激励视频
    tableScreen: '1100b60d285547c6a2bf5f01935c428b',//插屏广告
    fiction1: 'fc84629faee349be8613cb6adefe766f', //原生小说广告页id
    fiction2: '42294ef0f3684d4dbf761d1b058f3c76', //原生小说广告页id
    fiction3: '208313808c11462f873dcf20c1faa18f', //原生小说广告页id
    fiction4: 'a623e39a11bf48b6b31e36ee9a7691b5', //原生小说广告页id
    banner: '3aae67431134438f9028c1d513f48098',
    nativeAd_cfd: '56c08fb035f84e91a5d33a3c1de6b584',
  },
  xiaomi: {
    nativeAd: '3ebda492da8090a8e28b3544df52da61', //原生
    tableScreen: 'l4ai02av3y',
    stimulateAd: '182b9c7d8701f5c50a0d5f1cb9fcf2b0',
    banner: 'f25c41f2e050f7bd045186ba095b6c8c',
    lotteryPageNativeAd: '3ebda492da8090a8e28b3544df52da61',
    nativeAd_cfd: 'y82ss9y9f7',
  },
  OPPO: {
    lotteryPageNativeAd: '1686568',//场景-转盘弹出层
    nativeAd: '1686569', //原生//记账小管家-原生-在用-开红包
    stimulateAd: '1686570',//幸运大转盘-激励视频
    tableScreen: '1686571',//插屏广告
    fiction1: '1686573', //原生小说广告页id
    fiction2: '1686575', //原生小说广告页id
    fiction3: '1686577', //原生小说广告页id
    fiction4: '1686578', //原生小说广告页id
    fiction5: '1686579', //原生512 2.0自渲染512x512
    banner: '1686581',//1080*171
    nativeAd_cfd: '1686583',//拆福袋原生//2.0自渲染1280x720

  },
  HUAWEI: {
    banner: 'w4brvyloy0',
    nativeAd: 'y82ss9y9f7', //原生
    tableScreen: 'l4ai02av3y',
    stimulateAd: 'o0rbevcepx',
    lotteryPageNativeAd: 'b9flx2el39',
    nativeAd_cfd: 'y82ss9y9f7',
  },
  huawei: {
    banner: 'w4brvyloy0',
    nativeAd: 'y82ss9y9f7', //原生
    nativeAd_cfd: 'y82ss9y9f7',
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
