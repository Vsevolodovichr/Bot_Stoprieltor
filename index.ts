import * as express from 'express';
import { Telegraf } from 'telegraf';
import { Extra, Markup } from 'telegraf';

const botToken = 'YOUR_BOT_TOKEN';
const app = express();
const bot = new Telegraf(botToken);

const blacklistedNumbers = ['123456789', '987654321']; // Чорний список номерів

// Обробка команди /start
bot.start(ctx => {
  const message = `Привіт, ${ctx.from.first_name}!\nВиберіть опцію:`;

  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('Подати оголошення', 'submitAd'),
    Markup.button.callback('Отримати номер', 'getNumber'),
  ]);

  ctx.reply(message, Extra.markup(keyboard));
});

// Обробка кнопки "Подати оголошення"
bot.action('submitAd', ctx => {
  ctx.reply('Введіть користувача, на якого перенаправити оголошення:');
});

// Обробка кнопки "Отримати номер"
bot.action('getNumber', ctx => {
  ctx.reply('Введіть свій номер телефону для авторизації:');
});

// Обробка введення номера телефону
bot.on('text', async ctx => {
  const userId = ctx.from.id;
  const phoneNumber = ctx.message.text;

  // Перевірка чорного списку
  if (blacklistedNumbers.includes(phoneNumber)) {
    ctx.reply('Ви в чорному списку. Доступ заборонено.');
    return;
  }

  // Введення номера об'яви
  ctx.reply('Введіть номер об\'яви:');

  // Збереження інформації в базу даних або інші дії за необхідності
  // (за допомогою, наприклад, mongoose або іншої бази даних)
  // await savePhoneNumber(userId, phoneNumber);
});

// Обробка введення номера об'яви
bot.on('text', ctx => {
  const userId = ctx.from.id;
  const adNumber = ctx.message.text;

  // Відправити інформацію у приватний чат користувача
  ctx.telegram.sendMessage(userId, `Ваш номер об'яви: ${adNumber}`);
});

// Запуск бота
bot.launch();

// Запуск веб-сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
