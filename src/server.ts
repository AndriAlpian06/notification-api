import express from 'express'
import TelegramBot from 'node-telegram-bot-api'
import bodyParser from 'body-parser';

const app = express()
const PORT = 3000;

// setup bot telegram
const botToken = '6364340921:AAHPBgdek2E5_qO_Bl_cmRnO0mlVyOX6Eak'
const chatIds = ['5439991685', '5243622036', '6949185570']
const bot = new TelegramBot(botToken, {polling: true})

app.use(bodyParser.json())

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
})