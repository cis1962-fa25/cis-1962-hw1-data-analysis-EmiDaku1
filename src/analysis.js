/**
 * [TODO] Step 0: Import the dependencies, fs and papaparse
 */

const fs = require('fs');
const papa = require('papaparse');

/**
 * [TODO] Step 1: Parse the Data
 *      Parse the data contained in a given file into a JavaScript object using the modules fs and papaparse.
 *      According to Kaggle, there should be 2514 reviews.
 * @param {string} filename - path to the csv file to be parsed
 * @returns {Object} - The parsed csv file of app reviews from papaparse.
 */
function parseData(filename) {
    const fileToParse = fs.readFileSync(filename, 'utf8');
    const parsedFile = papa.parse(fileToParse, {
        header: true,
        skipEmptyLines: true,
    });

    return parsedFile;
}

/**
 * [TODO] Step 2: Clean the Data
 *      Filter out every data record with null column values, ignore null gender values.
 *
 *      Merge all the user statistics, including user_id, user_age, user_country, and user_gender,
 *          into an object that holds them called "user", while removing the original properties.
 *
 *      Convert review_id, user_id, num_helpful_votes, and user_age to Integer
 *
 *      Convert rating to Float
 *
 *      Convert review_date to Date
 * @param {Object} csv - a parsed csv file of app reviews
 * @returns {Object} - a cleaned csv file with proper data types and removed null values
 */
function cleanData(csv) {
    return csv.data
        .filter((row) => {
            return (
                row.review_id &&
                row.app_name &&
                row.app_category &&
                row.review_text &&
                row.review_language &&
                row.rating &&
                row.review_date &&
                row.verified_purchase &&
                row.device_type &&
                row.num_helpful_votes &&
                row.app_version &&
                row.user_id &&
                row.user_age &&
                row.user_country
            );
        })
        .map((row) => {
            return {
                review_id: parseInt(row.review_id, 10),
                app_name: row.app_name,
                app_category: row.app_category,
                review_text: row.review_text,
                review_language: row.review_language,
                rating: parseFloat(row.rating),
                review_date: new Date(row.review_date),
                verified_purchase:
                    row.verified_purchase.toLowerCase() === 'true',
                device_type: row.device_type,
                num_helpful_votes: parseInt(row.num_helpful_votes, 10),
                app_version: row.app_version,
                user: {
                    user_id: parseInt(row.user_id, 10),
                    user_age: parseInt(row.user_age, 10),
                    user_country: row.user_country,
                    user_gender: row.user_gender || '',
                },
            };
        });
}

/**
 * [TODO] Step 3: Sentiment Analysis
 *      Write a function, labelSentiment, that takes in a rating as an argument
 *      and outputs 'positive' if rating is greater than 4, 'negative' is rating is below 2,
 *      and 'neutral' if it is between 2 and 4.
 * @param {Object} review - Review object
 * @param {number} review.rating - the numerical rating to evaluate
 * @returns {string} - 'positive' if rating is greater than 4, negative is rating is below 2,
 *                      and neutral if it is between 2 and 4.
 */
function labelSentiment({ rating }) {
    if (rating > 4) {
        return 'positive';
    } else if (rating < 2) {
        return 'negative';
    } else {
        return 'neutral';
    }
}

/**
 * [TODO] Step 3: Sentiment Analysis by App
 *      Using the previous labelSentiment, label the sentiments of the cleaned data
 *      in a new property called "sentiment".
 *      Add objects containing the sentiments for each app into an array.
 * @param {Object} cleaned - the cleaned csv data
 * @returns {{app_name: string, positive: number, neutral: number, negative: number}[]} - An array of objects, each summarizing sentiment counts for an app
 */
function sentimentAnalysisApp(cleaned) {
    const sentArr = [];

    cleaned.forEach((row) => {
        const sentiment = labelSentiment({ rating: row.rating });

        let appEntry = sentArr.find((obj) => obj.app_name === row.app_name);
        if (!appEntry) {
            appEntry = {
                app_name: row.app_name,
                positive: 0,
                neutral: 0,
                negative: 0,
            };
            sentArr.push(appEntry);
        }

        const appEntryIndex = sentArr.findIndex(
            (obj) => obj.app_name === row.app_name,
        );
        if (sentiment === 'positive') {
            sentArr[appEntryIndex].positive++;
        } else if (sentiment === 'negative') {
            sentArr[appEntryIndex].negative++;
        } else {
            sentArr[appEntryIndex].neutral++;
        }
    });

    return sentArr;
}

/**
 * [TODO] Step 3: Sentiment Analysis by Language
 *      Using the previous labelSentiment, label the sentiments of the cleaned data
 *      in a new property called "sentiment".
 *      Add objects containing the sentiments for each language into an array.
 * @param {Object} cleaned - the cleaned csv data
 * @returns {{lang_name: string, positive: number, neutral: number, negative: number}[]} - An array of objects, each summarizing sentiment counts for a language
 */
function sentimentAnalysisLang(cleaned) {
    const sentArr = [];

    cleaned.forEach((review) => {
        const sentiment = labelSentiment(review);
        review.sentiment = sentiment;

        let langEntry = sentArr.find(
            (obj) => obj.lang_name === review.lang_name,
        );
        if (!langEntry) {
            langEntry = {
                lang_name: review.lang_name,
                positive: 0,
                neutral: 0,
                negative: 0,
            };
            sentArr.push(langEntry);
        }

        const langEntryIndex = sentArr.findIndex(
            (obj) => obj.lang_name === review.lang_name,
        );
        if (sentiment === 'positive') {
            sentArr[langEntryIndex].positive++;
        } else if (sentiment === 'negative') {
            sentArr[langEntryIndex].negative++;
        } else {
            sentArr[langEntryIndex].neutral++;
        }
    });

    return sentArr;
}

/**
 * [TODO] Step 4: Statistical Analysis
 *      Answer the following questions:
 *
 *      What is the most reviewed app in this dataset, and how many reviews does it have?
 *
 *      For the most reviewed app, what is the most commonly used device?
 *
 *      For the most reviewed app, what the average star rating (out of 5.0)?
 *
 *      Add the answers to a returned object, with the format specified below.
 * @param {Object} cleaned - the cleaned csv data
 * @returns {{mostReviewedApp: string, mostReviews: number, mostUsedDevice: String, mostDevices: number, avgRating: float}} -
 *          the object containing the answers to the desired summary statistics, in this specific format.
 */
function summaryStatistics(cleaned) {
    const appCountsArr = [];
    cleaned.forEach((review) => {
        let foundApp = appCountsArr.find(
            (app) => app.app_name === review.app_name,
        );
        if (!foundApp) {
            foundApp = {
                app_name: review.app_name,
                review_count: 0,
            };
            appCountsArr.push(foundApp);
        }

        const foundAppIndex = appCountsArr.findIndex(
            (app) => app.app_name === review.app_name,
        );
        appCountsArr[foundAppIndex].review_count++;
    });

    let mostReviewedApp = '';
    let mostReviews = 0;
    appCountsArr.forEach((app) => {
        if (app.review_count > mostReviews) {
            mostReviewedApp = app.app_name;
            mostReviews = app.review_count;
        }
    });

    const mostReviewedAppReviews = cleaned.filter(
        (r) => r.app_name === mostReviewedApp,
    );

    const deviceCountsArr = [];
    let totalRating = 0;

    mostReviewedAppReviews.forEach((review) => {
        let foundDevice = deviceCountsArr.find(
            (d) => d.device_type === review.device_type,
        );
        if (!foundDevice) {
            foundDevice = {
                device_type: review.device_type,
                count: 0,
            };
            deviceCountsArr.push(foundDevice);
        }

        const foundDeviceIndex = deviceCountsArr.findIndex(
            (d) => d.device_type === review.device_type,
        );
        deviceCountsArr[foundDeviceIndex].count++;

        totalRating += review.rating;
    });

    let mostUsedDevice = '';
    let mostDevices = 0;
    deviceCountsArr.forEach((d) => {
        if (d.count > mostDevices) {
            mostUsedDevice = d.device_type;
            mostDevices = d.count;
        }
    });

    const avgRating = totalRating / mostReviewedAppReviews.length;

    return {
        mostReviewedApp,
        mostReviews,
        mostUsedDevice,
        mostDevices,
        avgRating,
    };
}

/**
 * Do NOT modify this section!
 */
module.exports = {
    parseData,
    cleanData,
    sentimentAnalysisApp,
    sentimentAnalysisLang,
    summaryStatistics,
    labelSentiment,
};
