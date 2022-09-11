//////////////////////////////////////////////////////////////////////
//Notion settings
const databaseID = `YOUR_DATABASE_ID`;
const token = `YOUR_SECRET_TOKEN`;
const notionVersion = '2022-02-22';
const notionApi = `https://api.notion.com/v1/databases/${databaseID}`;

//Notion column names
const quoteCol = 'Quote';
const createdDateCol = 'Created Date';
const ratingCol = 'Rating';
const authorCol = 'Author';

//////////////////////////////////////////////////////////////////////
//read random quote from Notion page
let quote = await readNotionQuote();
let text = extractPlainText(quote.text);
let rating = quote.rating;
let clickUrl = quote.url;

console.log(text);

let widget = await createWidget();

// Check where the script is running
if (config.runsInWidget) {
  // Runs inside a widget so add it to the homescreen widget
  Script.setWidget(widget);
} else {
  // Show the medium widget inside the app
  widget.presentMedium();
}
Script.complete();

//////////////////////////////////////////////////////////////////////
async function createWidget() {
  // Create new empty ListWidget instance
  let listwidget = new ListWidget();

  // Set new background color
  listwidget.backgroundColor = new Color("#1C1C1E");
  let nextRefresh = Date.now() + 1000 * 60 * 120; // add 2 hours
  var nextDate = new Date(Date.now());
  let hour = nextDate.getHours();
  console.log('Hour: ' + hour);

  //don't refresh during the night, next day is better
  if (hour < 7 || 21 < hour) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8);
    tomorrow.setMinutes(0);
    tomorrow.setMilliseconds(0);
    nextRefresh = tomorrow.getTime();
    console.log('Next day refresh');
  }

  console.log('Next refresh: ' + new Date(nextRefresh));
  listwidget.refreshAfterDate = new Date(nextRefresh);
  listwidget.spacing = 6;
 
  let linkStack = listwidget.addStack();
  linkStack.centerAlignContent();
  linkStack.url = clickUrl;

  let heading = linkStack.addText(text);

  // Add widget heading
  heading.centerAlignText();
  heading.font = Font.lightSystemFont(15);
  heading.textColor = new Color("#ffffff");

  //add rating
  let ratingStr = '';
  for (let i = 0; i < rating; i++) {
    ratingStr = ratingStr + '★';
  }
  let ratingGui = listwidget.addText(ratingStr);
  ratingGui.centerAlignText();
  ratingGui.font = Font.lightSystemFont(5);
  ratingGui.textColor = new Color("#ffff00");

  quote.author.trim();
  if (quote.author.length > 0){
    let authorGui = listwidget.addText(quote.author);
    authorGui.centerAlignText();
    authorGui.font = Font.italicSystemFont(10);
    authorGui.textColor = new Color("#aaaaaa");
  }

  // Return the created widget
  return listwidget;
}

function addDateText(stack, text) {
  let dateText = stack.addText(text);
  dateText.centerAlignText();
  dateText.font = Font.semiboldSystemFont(20);
  dateText.textColor = new Color("#ffffff");
}

//read qote from notion page
async function readNotionQuote() {
  let reqNotion = new Request(notionApi + '/query');
  reqNotion.method = 'post';
  reqNotion.headers = {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": notionVersion
  };

  let resNotion = await reqNotion.loadJSON();
  let quotesObjs = convertNotionQuotes(resNotion);


  if (quotesObjs.length == 0)
    return null;

  //load previous random numbers
  let fmCloud = FileManager.iCloud(); // iCloud
  let docFile = fmCloud.documentsDirectory() + '/quoteLastElems.txt';
  let lastUsedIndexes = [];
  if (fmCloud.fileExists(docFile)) {
    let randomTexts = fmCloud.readString(docFile);
    randomTexts = randomTexts.trim();
    let numberTexts = randomTexts.split(' ');
    numberTexts.forEach(n => lastUsedIndexes.push(Number(n)));
    console.log('Previous random numbers: ' + lastUsedIndexes);
  }

  let maxRand = 0;
  quotesObjs.forEach(qo => maxRand += qo.rating);
  console.log('Max rand:' + maxRand);

  //find "free" random number
  let useIndex = Math.floor(Math.random() * quotesObjs.length);
  while (lastUsedIndexes.length < quotesObjs.length) {
    let randomNumber = Math.floor(Math.random() * maxRand);
    useIndex = convertRandomToQuoteIndex(randomNumber, maxRand, quotesObjs);
    if (!lastUsedIndexes.includes(useIndex))
      break;
  }

  lastUsedIndexes.push(useIndex);
  while (lastUsedIndexes.length > 20)
    lastUsedIndexes.shift();

  let lastUsedIndexesText = '';
  lastUsedIndexes.forEach(lui => lastUsedIndexesText += lui.toString() + ' ');
  fmCloud.writeString(docFile, lastUsedIndexesText);

  console.log('Using ' + useIndex + ': ' + quotesObjs[useIndex]);
  return quotesObjs[useIndex];
}

function convertRandomToQuoteIndex(randNum, maxRand, quotesObjs){ 
  let useIndex = 0;
  let currentTotal = 0;
  while (randNum < maxRand) {
    if (useIndex >= quotesObjs.length - 1)
      break;
    let currRating = quotesObjs[useIndex].rating;
    if (currentTotal + currRating > randNum)
      break;
    useIndex++;
    currentTotal += currRating;
  }

  return useIndex;
}

function convertNotionQuotes(jsonNotion) {
  let quoteObjects = [];

  jsonNotion.results.forEach(element => {
    let newQuoteObj = {};
    let props = element['properties'];
    let text = props[quoteCol]['rich_text'];

    if (text.length == 0)
      return;

    newQuoteObj.text = text;
    let createdDate = props[createdDateCol]['created_time'];
    newQuoteObj.date = new Date(createdDate);
    newQuoteObj.rating = props[ratingCol]['select']['name'].length / 2;
    newQuoteObj.url = element.url;
    newQuoteObj.author = extractPlainText(props[authorCol]['title']);
    quoteObjects.push(newQuoteObj);
  });

  quoteObjects.sort((a, b) => (a.date > b.date) ? 1 : -1);

  return quoteObjects;
}

function extractPlainText(texts) {
  if (texts.length == 0)
    return "";

  let finalText = "";
  texts.forEach(t => finalText += t.plain_text);
  return finalText;
}
