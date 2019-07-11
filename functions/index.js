'use strict';

const {
  dialogflow,
  Suggestions,
  Permission,
  BasicCard,
} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({ debug: true });

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  conv.user.storage = {};
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
    'We are participating in the Fresher’s Fair to introduce our club.' + ' ');
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
  conv.ask('The fair will begin from 27th of July and ' +
    'will continue for 4 weeks till 18th of August. It will happen only on Saturdays and Sundays. ' +
    'I\'m sorry but I can\'t set up a reminder for you. ' +
    'My developer\'s really lazy.');
  conv.ask('Would you like to know anything else?');
  conv.ask(new Suggestions('Upcoming Events', 'Recruitment Information', 'Contact Details'));
});

// Handle the Dialogflow follow up intent 'No' of the previous 'Yes' intent
// If the user is a fresher but doesn't want to know more about the fresher's week
app.intent('Default Welcome Intent - yes - no', (conv) => {
  conv.ask('Sure thing. Anything else I can interest you in?');
  conv.ask(new Suggestions('Upcoming Events', 'Recruiment Information', 'Contact Details'));
});

// Handle the Dialogflow intent 'Contact Details'
app.intent('Contact Details', (conv, { contactDetails }) => {
  //conv.close('I have no contact details at the moment. Kindly come back later.');
  conv.close(`We recommend following our facebook page for receiving quick updates.`, new BasicCard(conDetails['Facebook Page']));
});

// Handle the Dialogflow intent 'Recruitment Information'
app.intent('Recruitment Information', (conv, { recruitInfo }) => {
  if (conv.user.storage.userName) {
    conv.close(`We\'re happy to see your enthusiasm, ${conv.user.storage.userName}.`);
  } else {
    conv.close('We\'re happy to see your enthusiasm!');
  }
  conv.close('Recruitment will start after the fresher\'s ban. Follow our facebook page for quick updates',
    new BasicCard(conDetails['Facebook Page']));
});

// Handle the Dialogflow intent 'Upcoming Events'
app.intent('Upcoming Events', (conv, { upcomingEvents }) => {
  conv.close(`Here's the upcoming event`, new BasicCard(upEvents['Fresher\'s Week']));
});

const upEvents = {
  'Fresher\'s Week': {
    title: 'Fresher\'s Week',
    text: 'From 27th July to 18th August on Saturdays and Sundays',
    image: {
      url: 'https://mocah.org/thumbs/125206-crystals-material-design-colorful-minimal-4k.jpg',
      accessibilityText: 'Fresher\'s Week Image',
    },
    display: 'WHITE',
  },
};

const conDetails = {
  'Facebook Page': {
    title: 'Facebook Page',
    buttons: [{
      title: 'URL to page',
      openUrlAction: {
        url: 'https://www.facebook.com/ieeesbmanipal/?ref=br_rs',
      }
    },],
    image: {
      url: 'https://mocah.org/thumbs/125206-crystals-material-design-colorful-minimal-4k.jpg',
      accessibilityText: 'Fresher\'s Week Image',
    },
    display: 'WHITE',
  }
}

app.intent('actions_intent_CANCEL',(conv)=>{
  conv.close('Thanks for reaching out!');
});


exports.yourAction = functions.https.onRequest(app);


