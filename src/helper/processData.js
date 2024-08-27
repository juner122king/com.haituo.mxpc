import storage from '@system.storage'

// 优化本地存储get方法
export function localStorage(key) {
    return new Promise((resolve, reject) => {
        storage.get({
            key,
            success: function (data) {
                resolve(data)
            },
            fail: function (data, code) {
                reject(data)
            }
        })
    })
}

export function setStorage(key, value = "") {
    return new Promise((resolve, reject) => {
        storage.set({
            key,
            value: JSON.stringify(value),
            success: function (data) {
                resolve(`setStorage success`);
            },
            fail: function (data, code) {
                reject(`setStorage fail, code = ${code}`);
            }
        });
    });
}

export function getStorage(key) {
    return new Promise((resolve, reject) => {
        storage.get({
            key,
            success: function (data) {
                if (data) {
                    const res = JSON.parse(data);
                    return resolve(res);
                }
                resolve(data);
            },
            fail: function (data, code) {
                reject(`getStorage fail, code = ${code}`);
            }
        });
    });
}

export function deleteStorage(key) {
    return new Promise((resolve, reject) => {
        storage.delete({
            key,
            success: function (data) {
                resolve(`deleteStorage success`);
            },
            fail: function (data, code) {
                reject(`deleteStorage fail, code = ${code}`);
            }
        });
    });
}

export function clearStorage() {
    return new Promise((resolve, reject) => {
        storage.clear({
            success: function (data) {
                resolve(`clearStorage success`);
            },
            fail: function (data, code) {
                reject(`clearStorage fail, code = ${code}`);
            }
        });
    });
}



//检查是否需要重置广告点击次数
export function resetTodayClicksIfNeeded() {
    const currentDate = new Date().toLocaleDateString();//当天日期

    storage.get({
        key: 'lastResetDate',
        default: '-1',
        success: function (data) {
            console.log('本次检查日期：', currentDate, '--- 最后进入广告页日期：', data);
            if (data !== currentDate) { //日期不相同
                // 重置广告点击次数
                storage.set({
                    key: 'todayClicks',
                    value: '0'
                })
            }
        }
    })
}

//进入广告页时执行
export function incrementTodayClicks() {
    storage.get({
        key: 'todayClicks',
        default: '0',//默认0次
        success: function (data) {
            console.log('点击次数+1,当前次数', data);
            let todayClicks = parseInt(data) || 0;
            todayClicks = todayClicks + 1;
            storage.set({
                key: 'todayClicks',
                value: todayClicks.toString()
            })

            storage.set({
                key: 'lastResetDate',
                value: new Date().toLocaleDateString()
            })
        }
    })
}



export default {
    getStorage,
    setStorage,
    incrementTodayClicks,
    resetTodayClicksIfNeeded
}