'use strict';

const {
  dialogflow,
  Suggestions,
  Permission,
} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', (conv) => {
  conv.ask('Hello. I am the virtual assistant of IEEE Manipal. ' +
    'I’m here to provide you information about the IEEE Student Branch Manipal. ' +
    'First of all, are you a fresher?');
    conv.ask(new Suggestions('Yes','No'));
});

app.intent('Default Welcome Intent - yes',(conv)=>{
  conv.ask('A warm welcome to Manipal from the entire IEEE Manipal Branch! ' + 
  'We’re going to be participating in the Fresher’s Fair to introduce our club ' + 
  'and it’s members to you guys. Would you like to know more about the fair?');
  conv.ask(new Suggestions('Yes','No'));
});

app.intent('Default Welcome Intent - no', (conv)=>{
  conv.ask('Okay senior. Welcome back to Manipal! Anything I can interest you in?');
  conv.ask(new Suggestions('Upcoming Events', 'Recruitment Information', 'Contact Details'));
});

app.intent('Default Welcome Intent - yes - yes',(conv)=>{
  conv.close('The fair will start from the 1st Saturday, i.e. 27th July and ' + 
  'will continue for 4 weeks till 18th August. It’ll happen only on weekends. ' + 
  'If you’re not sure whether you’ll remember the dates, can I set up a reminder for you?');
});

app.intent('Default Welcome Intent - yes - no', (conv)=>{
  conv.ask('Sure thing. Anything else I can interest you in?');
  conv.ask(new Suggestions('Upcoming Events', 'Recruiment Information', 'Contact Details'));
});

app.intent('Contact Details', (conv, {contactDetails})=>{
  conv.close('I have no contact details at the moment. Kindly come back later.');
});

app.intent('Recruitment Information', (conv, {recruitInfo})=>{
  conv.close('I have no information regarding recruitment as of now. Kindly come back later.');
})

app.intent('Upcoming Events', (conv, {upcomingEvents})=>{
  conv.close('I have no upcoming event information as of now. Please come back later');
})

exports.yourAction = functions.https.onRequest(app);


