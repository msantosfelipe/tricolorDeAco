// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const Scraping = require('scraping.js');
const Util = require('util.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Saudações tricolores! Posso falar qual será o próximo jogo do esquadrão, o resultado do último jogo, tocar o hino ou tocar o grito Bora Bahêa. O que você quer ouvir?';
        const repromptOutput = 'Posso dar informações do próximo ou do último jogo, tocar o hino ou gritar Bora Bahêa.'
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};
const AnthemIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnthemIntent';
    },
    handle(handlerInput) {
        const audioUrl = 'https://raw.githubusercontent.com/msantosfelipe/msantosfelipe/master/HINO_BAHIA.mp3';

        return handlerInput.responseBuilder
            .speak(`<audio src="${audioUrl}"/>`)
            .getResponse();
    }
};
const YellIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'YellIntent';
    },
    handle(handlerInput) {
        const audioUrl = 'https://raw.githubusercontent.com/msantosfelipe/msantosfelipe/master/BBMP.mp3';

        return handlerInput.responseBuilder
            .speak(`<audio src="${audioUrl}"/>`)
            .getResponse();
    }
};
const NextMatchIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextMatchIntent';
    },
    async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;    
    const persistentAttributes = attributesManager.getPersistentAttributes() || {};

    const nextMatch = await Scraping.nextMatch().then(value => value)
    
    const matchDay = nextMatch.matchDay.split(" ")
    const day = matchDay[1].split("/")[0]
    const month = matchDay[1].split("/")[1]

    const speakOutput = `O próximo jogo será ${nextMatch.teamA} contra ${nextMatch.teamB},`
        + ` ${Util.getMatchDay(matchDay[0], month, day)} ${Util.getHour(matchDay[3])},`
        + ` ${Util.getLeague(nextMatch.league)}`;

        return handlerInput.responseBuilder
            .speak(`${speakOutput}`)
            .getResponse();
    }
};
const LastMatchIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LastMatchIntent';
    },
    async handle(handlerInput) {
    const lastMatch = await Scraping.lastMatch().then(value => value)
    
    const speakOutput = `O último jogo foi ${lastMatch.teamA} ${lastMatch.teamAGoals}, ${lastMatch.teamB} ${lastMatch.teamBGoals},`
        + ` ${Util.getLeague(lastMatch.league)}`;

        return handlerInput.responseBuilder
            .speak(`${speakOutput}`)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const arr = ['Quando será o próximo jogo do Bahia?','Quanto foi o último jogo do Bahia?', 'Grita Bora Bahêa!', 'Toca o hino!'];
        const speakOutput = 'Você pode experimentar falar ' +  arr[Math.floor(Math.random() * arr.length)] + ' Para sugestões deixe um comentário na página da skill'
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Tchau!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `Você falou ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Desculpe, não consegui fazer o que você pediu, tente novamente.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NextMatchIntentHandler,
        LastMatchIntentHandler,
        YellIntentHandler,
        AnthemIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
