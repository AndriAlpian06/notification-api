import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import bodyParser from 'body-parser';
import { error } from 'console';

const app = express()
const PORT = 3000;

// setup bot telegram
const botToken = '6364340921:AAHPBgdek2E5_qO_Bl_cmRnO0mlVyOX6Eak'
const chatIds = ['5439991685', '5243622036', '6949185570', '320063452']
const bot = new TelegramBot(botToken, {polling: false})

app.use(bodyParser.json())

function startPolling(){
    bot.getUpdates({ timeout: 10000, allowed_updates: []})
    .then(handleUpdates)
    .catch((error) => {
        console.error('Error while polling:', error);
        setTimeout(startPolling, 5000);
    })
}

function handleUpdates(updates: any){
    updates.forEach((update: any) => {
        const message = update.message
        const callbackQuery = update.callback_query

        if(message){
            const chatId = message.chat.id
            const text = message.text

            console.log(`Received message from ${chatId}: ${text}`)
        } else if (callbackQuery){
            const chatId = callbackQuery.chat.id
            const data = callbackQuery.data

            console.log(`Received callback query from ${chatId}: ${data}`)
        }
    })

    startPolling()
}

app.post('/send-notification', (req, res) => {
    const message = req.body.message || 'Default Notification Message';

    try {
        chatIds.forEach((chatId) => {
            bot.sendMessage(chatId, message)
            .then(() => {
                console.log('Send notification success')
            })
            .catch((e) => {
                console.error('Error sending notification to telegram', e)
            })
        })
    
        res.status(200).json({
            message: 'success sent Notification to Telegram'
        })
    }
    catch (error){
        console.error('Error sending notification to telegram', error)
        res.status(500).send('Error sending notification to telegram')
    }
})

app.listen(PORT, () => {
    console.log(`Server Running in PORT: ${PORT}`)
    startPolling()
})