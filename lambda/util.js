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

module.exports.getMatchDay = function getMatchDay(matchWeekDay, month, day) {
    let dayOfWeek = ""
   // const hour = matchHour.split("h")

    // Say 'no' or 'na' and the dayOfWeek
    if (matchWeekDay.toLocaleLowerCase().includes("sab")
        || matchWeekDay.toLocaleLowerCase().includes("sáb")
        || matchWeekDay.toLocaleLowerCase().includes("dom")) {
            dayOfWeek = 'no ' + matchWeekDay
    } else {
            dayOfWeek = 'na ' + matchWeekDay
    }
    dayOfWeek = "na Qua "
    
    // Say today, tomorrow or the date
    var todayComplete = new Date()
    var today = new Date(todayComplete.getFullYear(), todayComplete.getMonth(), todayComplete.getDate())
    var matchDay = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day))
   // var matchHour = hour[0]
   // var matchMinutes = hour[1]
   // var matchDayComplete = new Date(today.getFullYear(), parseInt("07") - 1, parseInt("22"), parseInt("20"), parseInt("00"))

    dayOfWeek = dayOfWeek + `<say-as interpret-as="date">????${month}${day}</say-as>`

    if (today.getDate() === matchDay.getDate() && today.getMonth() === matchDay.getMonth()) {
        dayOfWeek = 'hoje'
    }

    return dayOfWeek;
}

module.exports.getHour = function getHour(matchHour) {
    const hour = matchHour.split("h")
    
    if (hour[1].includes("00")) {
            return 'às ' + hour[0] + ' horas'
    } else {
            return 'às ' + hour[0] + ' e ' + hour[1] + ' minutos'
    }
}

module.exports.getLeague = function getLeague(league) {
    if (league.toLocaleLowerCase().includes("copa")) {
            return 'pela ' + league
    } else {
            return 'pelo ' + league
    }
}