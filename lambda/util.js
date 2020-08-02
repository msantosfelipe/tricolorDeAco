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

module.exports.getMatchDayOfWeek = function getMatchDayOfWeek(matchWeekDay) {
    let dayOfWeek = ""

    // Say 'no' or 'na' and the dayOfWeek
    if (matchWeekDay.toLocaleLowerCase().includes("sab")
        || matchWeekDay.toLocaleLowerCase().includes("sáb")
        || matchWeekDay.toLocaleLowerCase().includes("dom")) {
            dayOfWeek = 'no ' + convertMatchWeekDay(matchWeekDay)
    } else {
            dayOfWeek = 'na ' + convertMatchWeekDay(matchWeekDay)
    }

    return dayOfWeek;
}

module.exports.getMatchFullDate = function getMatchFullDate(day, month) {
    // Say today, tomorrow or the date
    var dateAux = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    var todayComplete = new Date(dateAux)
    var today = new Date(todayComplete.getFullYear(), todayComplete.getMonth(), todayComplete.getDate())
    var fullDate = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day))

    return fullDate
}

module.exports.getMatchDate = function getMatchDate(fullDate, day, month) {
    let date = ""
    
    date = date + `<say-as interpret-as="date">????${month}${day}</say-as>`

    var dateAux = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    var todayComplete = new Date(dateAux)
    var today = new Date(todayComplete.getFullYear(), todayComplete.getMonth(), todayComplete.getDate())

    // If today
    if (today.getDate() === fullDate.getDate() 
            && today.getMonth() === fullDate.getMonth()) {
        date = 'hoje'
    }
    
    return date;
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

module.exports.randomHello = function randomHello() {
    const arr = ['Saudações tricolores!','Bora Baêa!', 'Avante esquadrão!', 'Vamo Baêa!'];

    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports.prepareMatchDateToPersist = function prepareMatchDateToPersist(matchFullDate, completeHour) {
    var t = matchFullDate.toString().split("T")[0]
    var h = completeHour.split("h")
    
    var re = new RegExp("-", 'g');
    t = t.replace(re, "/")
    
    var d = new Date(t)
    d.setHours(h[0], h[1], 0)

    return matchFullDate
}

function convertMatchWeekDay(matchWeekDay) {
    var value = matchWeekDay.toLocaleLowerCase().split(".")[0]
    
    switch (value) {
        case "seg":
            return "Segunda feira "
        case "ter":
            return "Terça feira "
        case "qua":
            return "Quarta feira "
        case "qui":
            return "Quinta feira "
        case "sex":
            return "Sexta feira "
        case "sab":
            return "Sábado "
        case "sáb":
            return "Sábado "
        default:
            return "Domingo "
            
    }
}

