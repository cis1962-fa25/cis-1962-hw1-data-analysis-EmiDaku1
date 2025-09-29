[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/PA8fMuFu)
# Homework 1 AI Synthesis Activity

## Activity B: You did NOT use AI
### Part 1
> Explain some improvement you want to make within your code. Perhaps you have a code block that could be more concise, or a part of your code could be improved with a library or be performed with a more efficient algorithm.

Within my code, I follow the pattern of adding an item to an array if it doesn't exist, then finding the index of that item within the array to access it again and change the value it holds. While this works and luckily we aren't working with a very large dataset, I believe that there are better options in terms of both readability and optimization that I have not incorporated.


### Part 2
> Ask AI how to improve your code, by picking a part of your program you are interested in improving and asking something along the lines of "how can I improve this code?" This does not have to be verbatim; you could ask more specific questions for improvement, like "what JavaScript libraries could improve the efficiency of my code?" Screenshot or link the response.

I decided to ask chatGPT to improve my code for the sentimentAnalysisApp() function. My exact prompt and response that was provided is as follows:


Prompt: How would I improve this code? I feel that there is a redundancy in accessing the array elements.
(I then pasted the code with the comments for the sentimentAnalysisApp() function)


Response: You're right — the redundancy is in calling both find and findIndex.

find already gives you a reference to the matching object in the array, so you don’t need to look it up again by index. You can increment its properties directly.

Here’s a cleaner version of your function:

Writing
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

        if (sentiment === 'positive') {
            appEntry.positive++;
        } else if (sentiment === 'negative') {
            appEntry.negative++;
        } else {
            appEntry.neutral++;
        }
    });

    return sentArr;
}

Why this is better

Removes redundant findIndex call.

Directly mutates the appEntry reference returned by find.

Cleaner and easier to maintain.


### Part 3
> Evaluate the response the AI generates. You may need to do some research to do this evaluation, to see if the syntax generates correctly or if any libraries the AI suggests are appropriate for the current task. Report on whether the AI's solution fits within your project, or if it would need modifications to work properly.

Looking at the code that chatGPT responded with, it proceeded to get rid of the findIndex function call and instead directly edits the entry after it has been pushed. After replacing my code with the suggestion, the tests still pass, indicating that the edit was a success and still resulted in the expected behaviour. Using the code it returned as a template, I would then be able to go back and change the other redundant array calls that I make, meaning that the AI gave a correct response without needing any modifications to the specific function that it fixed.

*** You do NOT need to use the AI suggestion within your final submission, if your code already works properly. If the scope of your inquiry in this activity leads you to replace parts of your code, switch to the other version of this activity instead. ***