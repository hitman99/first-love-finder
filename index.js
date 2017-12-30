const { Logger, transports } = require('winston');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const failLimit = 10;

const logger = new Logger({
    level: 'info',
    transports: [
        new (transports.Console)({ timestamp: true }),
    ]
});

const find_it = () => {
    return new Promise((resolve, reject) => {
        JSDOM.fromURL('https://www.yt-industries.com/en/detail/index/sArticle/236')
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

let counter = 0;

const check = () => {
    find_it()
        .then(
            res => {
                let msg = res.available ? 'found!' : 'better luck next day';
                logger.info(`Finding First Love... ${msg}`);
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

check();


