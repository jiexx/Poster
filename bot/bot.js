//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the bot bot.

// Import Botkit's core features
const { Botkit, BotkitConversation } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');

// Import a platform-specific adapter for web.

const { WebAdapter } = require('botbuilder-adapter-web');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}


const adapter = new WebAdapter({});


const controller = new Botkit({
    webhook_uri: '/api/messages',

    adapter: adapter,

    storage
});

if (process.env.CMS_URI) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    // controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }
	// define the conversation
	const onboarding = new BotkitConversation('onboarding', controller);

	onboarding.say('Hello human!');
	// collect a value with no conditions
	onboarding.ask('What is your name?', async(answer) => { 
		// do nothing.
	}, {key: 'name'});

	// collect a value with conditional actions
	onboarding.ask('Do you like tacos?', [
		{
			pattern: 'yes',
			handler: async function(answer, convo, bot) {
				await convo.gotoThread('likes_tacos');
			}
		},
		{
			pattern: 'no',
			handler: async function(answer, convo, bot) {
				await convo.gotoThread('hates_life');
			}
		}
	],{key: 'tacos'});

	// define a 'likes_tacos' thread
	onboarding.addMessage('HOORAY TACOS', 'likes_tacos');

	// define a 'hates_life' thread
	onboarding.addMessage('TOO BAD!', 'hates_life');

	// handle the end of the conversation
	onboarding.after(async(results, bot) => {
		const name = results.name;
	});

	// add the conversation to the dialogset
	controller.addDialog(onboarding);

	// launch the dialog in response to a message or event
	controller.hears(['hello'], 'message', async(bot, message) => {
		console.log(`${message.type} ${message.user} bot(${message.reference.bot.id}) ${message.reference.conversation.id}\n\n\n`);
		await bot.beginDialog('onboarding');
	});
	controller.interrupts('quit', 'message', async(bot, message) => {
		await bot.reply(message, 'Quitting!');

		// cancel any active dialogs
		await bot.cancelAllDialogs();
	});
	controller.on('message,direct_message,identify,hello,welcome_back', async(bot, message) => {
		console.log(`${message.type} ${message.user} bot(${message.reference.bot.id}) ${message.reference.conversation.id}\n\n\n`);
		
		
		// get the reference field and store it.
	    // const saved_reference = message.reference;

		// later on...
		// let robot = await controller.spawn();
		// await robot.changeContext(saved_reference);
		await bot.reply(message, `${message.type} <div style="color:red"> humen</div>` );
		// await robot.startConversationWithUser(message.reference);

		// await robot.beginDialog('onboarding');
        
    });

});





