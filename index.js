const { Logger, transports } = require('winston');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request = require('request');
const { API_URL, SENDER, RECEIVER, AUTH } = process.env;
const bikeURL = 'https://www.yt-industries.com/en/detail/index/sArticle/236';


const failLimit = 10;
let counter = 0;

const logger = new Logger({
    level: 'info',
    transports: [
        new (transports.Console)({ timestamp: true }),
    ]
});

const find_it = () => {
    return new Promise((resolve, reject) => {
        JSDOM.fromURL(bikeURL)
            .then(
                dom => {
                    let soldOutButton = dom.window.document.querySelector('button#nobasketButton.noaddButton.new-buttons');
                    if (soldOutButton && soldOutButton.innerHTML == 'Sold Out') {
                        resolve({ available: false });
                    }
                    else {
                        resolve({ available: true })
                    }
                }
            )
            .catch(
                err => reject(err.message)
            );
    })
};

const check = () => {
    find_it()
        .then(
            res => {
                let msg = res.available ? 'found!' : 'better luck next day';
                logger.info(`Finding First Love... ${msg}`);
                if (!res.available) {
                    send_sms(SENDER, RECEIVER, AUTH, API_URL);
                }
            }
        )
        .catch(
            err => {
                logger.error(err);
                if (counter++ < failLimit) {
                    logger.info(`Checking again, retries remaining: ${counter}`);
                    check();
                }
                else {
                    logger.error('Could not find First Love today.');
                }
            }
        )
};

const send_sms = (sender, receiver, auth, api_url) => {
    if (sender && receiver && auth && api_url) {
        let options = {
            url: api_url,
            headers: {
                'Authorization': auth
            },
            method: 'POST',
            json: {
                from: sender,
                to: receiver,
                text: `First Love is available! Order now: ${bikeURL}`
            }
        };

        request(options, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                logger.info(`SMS sent to ${receiver}`);
            }
            else {
                logger.error(`Cannot send sms message: ${JSON.stringify(body)}`);
            }
        });
    }
    else {
        logger.error('SMS sending failed - environment is not configured')
    }
};

check();


