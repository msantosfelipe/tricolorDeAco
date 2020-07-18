const AWS = require('aws-sdk');

const s3SigV4Client = new AWS.S3({
    signatureVersion: 'v4',
    region: process.env.S3_PERSISTENCE_REGION
});

module.exports.getS3PreSignedUrl = function getS3PreSignedUrl(s3ObjectKey) {

    const bucketName = process.env.S3_PERSISTENCE_BUCKET;
    const s3PreSignedUrl = s3SigV4Client.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: s3ObjectKey,
        Expires: 60*1 // the Expires is capped for 1 minute
    });
    console.log(`Util.s3PreSignedUrl: ${s3ObjectKey} URL ${s3PreSignedUrl}`);
    return s3PreSignedUrl;

}

module.exports.getMatchDay = function getMatchDay(matchWeekDay) {
    let dayOfWeek = ""
    if (matchWeekDay.toLocaleLowerCase().includes("sab")
        || matchWeekDay.toLocaleLowerCase().includes("sáb")
        || matchWeekDay.toLocaleLowerCase().includes("dom")) {
            dayOfWeek = 'no ' + matchWeekDay
    } else {
            dayOfWeek = 'na ' + matchWeekDay
    }
    return dayOfWeek;
}

module.exports.getHour = function getHour(matchHour) {
    matchHour = "20h45"
    
    const hour = matchHour.split("h")
    
    if (hour[1].includes("00")) {
            return 'às ' + hour[0] + ' horas '
    } else {
            return 'às ' + hour[0] + ' horas e ' + hour[1] + ' minutos '
    }
}