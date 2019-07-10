'use strict';

const {
  dialogflow,
  Suggestions,
  Permission,
} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  const name = conv.user.storage.userName;
  if (!name) {
    conv.ask(new Permission({
      context: 'Hello. I am the virtual assistant of IEEE Manipal. ' +
        'I’m here to provide you information about the IEEE Student Branch Manipal. ' +
        'To get to know you better',
      permissions: 'NAME'
    }));
  } else {
    conv.ask(`Welcome back, ${name}. I am the virtual assistant of IEEE Manipal. ` +
      'I’m here to provide you information about the IEEE Student Branch Manipal. ' +
      'Are you a fresher?'
    );
    conv.ask(new Suggestions('Yes', 'No'));
  }

});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask(`Ok, no worries. Are you a fresher?`);
    conv.ask(new Suggestions('Yes', 'No'));
  } else {
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. Are you a fresher?`);
    conv.ask(new Suggestions('Yes', 'No'));
  }
});

//Handle the Dialogflow follow up intent 'Yes' of Default Welcome Intent
// The user says 'yes' if he/she is a fresher
app.intent('Default Welcome Intent - yes', (conv) => {
  conv.ask('A warm welcome to Manipal from the entire IEEE Manipal Branch! ' +
    'We’re going to be participating in the Fresher’s Fair to introduce our club ' +
    'and it’s members. ');
  if (conv.user.storage.userName) {
    conv.ask(`Would you like to know more about the fair, ${conv.user.storage.userName}?`);
  } else {
    conv.ask('Would you like to know more about the fair?');
  }
  conv.ask(new Suggestions('Yes', 'No'));
});

// Handle the Dialogflow follow up intent 'No' of Default Welcome Intent
// If the user is not a fresher but a senior
app.intent('Default Welcome Intent - no', (conv) => {
  if (conv.user.storage.userName) {
    conv.ask(`Okay, ${conv.user.storage.userName}. Welcome back to Manipal! Anything I can interest you in?`);
  } else {
    conv.ask('Okay senior. Welcome back to Manipal! Anything I can interest you in?');
  }
  conv.ask(new Suggestions('Upcoming Events', 'Recruitment Information', 'Contact Details'));
});

// Handle the Dialogflow follow up intent 'Yes' of the previous 'Yes' intent
// If the user is a fresher and wants to know more about the fresher's week
app.intent('Default Welcome Intent - yes - yes', (conv) => {
  conv.close('The fair will start from the 1st Saturday, i.e. 27th July and ' +
    'will continue for 4 weeks till 18th August. It’ll happen only on weekends. ' +
    'If you’re not sure whether you’ll remember the dates, can I set up a reminder for you?');
});

// Handle the Dialogflow follow up intent 'No' of the previous 'Yes' intent
// If the user is a fresher but doesn't want to know more about the fresher's week
app.intent('Default Welcome Intent - yes - no', (conv) => {
  conv.ask('Sure thing. Anything else I can interest you in?');
  conv.ask(new Suggestions('Upcoming Events', 'Recruiment Information', 'Contact Details'));
});

// Handle the Dialogflow intent 'Contact Details'
app.intent('Contact Details', (conv, { contactDetails }) => {
  conv.close('I have no contact details at the moment. Kindly come back later.');
});

// Handle the Dialogflow intent 'Recruitment Information'
app.intent('Recruitment Information', (conv, { recruitInfo }) => {
  conv.close('I have no information regarding recruitment as of now. Kindly come back later.');
})

// Handle the Dialogflow intent 'Upcoming Events'
app.intent('Upcoming Events', (conv, { upcomingEvents }) => {
  conv.close('I have no upcoming event information as of now. Please come back later');
})

exports.yourAction = functions.https.onRequest(app);


