
const userArray = [];
console.log(process.env.requestTime);

function saveUserRequest(emailId, apiName, timestamp) {

    let isUserRequestExist = userArray.filter(function (currentElement) {
        return currentElement.email == emailId && currentElement.apiName == apiName;
    })

    if (isUserRequestExist.length == 0) {
        userArray.push({
            email: emailId,
            apiName: apiName,
            timestamp: timestamp,
            count: 1
        })
        return true
    }
    let time = new Date()
    let requestTimeDiff = time.getTime() - parseInt(isUserRequestExist[0].timestamp)

    if (isUserRequestExist.length > 0 && requestTimeDiff > process.env.requestTime) {
        let findUserIndex = userArray.findIndex(function (currentElement) {
            return currentElement.email == emailId && currentElement.apiName == apiName;
        })

        userArray.splice(findUserIndex, 1)
        userArray.push({
            email: emailId,
            apiName: apiName,
            timestamp: timestamp,
            count: 1
        })
        return true
    }
    if (isUserRequestExist.length > 0 && requestTimeDiff < process.env.requestTime) {
        let findUserIndex = userArray.findIndex(function (currentElement) {
            return currentElement.email == emailId && currentElement.apiName == apiName;
        })

        userArray.splice(findUserIndex, 1)
        userArray.push({
            email: emailId,
            apiName: apiName,
            timestamp: isUserRequestExist[0].timestamp,
            count: parseInt(isUserRequestExist[0].count) + 1
        })

        return true
    }



}

function checkUserRequestCount(emailId, apiName) {

    let findUserRequest = userArray.find(function (currentElement) {
        return currentElement.email == emailId && currentElement.apiName == apiName;
    })


    let requestTimeDiff = new Date().getTime() - findUserRequest.timestamp;
    console.log("requestTimeDiff======>⚔", requestTimeDiff);

    if (requestTimeDiff < process.env.requestTime && findUserRequest.count > process.env.requestBlockCount) {
        return false;
    }
    else {
        return true;
    }
}


module.exports.saveUserRequest = saveUserRequest
module.exports.checkUserRequestCount = checkUserRequestCount