# Notion-Book-Quote-Management
Complete book or podcast management system running in Notion and displaying random quotes on your iOS/iPhone home screen. The quotes are generated from Notion database while respecting rating - the 5-star quotes are used 5x more than 1-star quotes. It's is a free replacement for quite expensive applications you can purchase in App store.

You can check the following video about how to install and use the script:

[![Video](https://img.youtube.com/vi/1IDmH7ytVoE/0.jpg)](https://www.youtube.com/watch?v=1IDmH7ytVoE)



# Notion Setup

There are 3 simple steps you need to perform in the Notion.

### Create Notion Account
Fist of all you have to create [Notion](https://www.notion.so/) account. Once the account is ready, import my Notion Quote template into your workpace. Go to this [link](https://ledstripstudio.notion.site/Quotes-c6760dbb18454c2b88a017d134313698) and at the top right corner choose Duplicate. This will create your local copy of the quote database.

### Create Notion API token
Now you have to create Notion API token to be able to access this database from external scripts/applications. Select **Settings and Members** from your Notion homepage. Go to **Connections** and select **Develop and manage integrations** at the bottom. This will take you to your Notion Integration page (you can also use this [integration link](https://www.notion.so/my-integrations)).

In the Integration page use **New integration** to create new integration API. Name it e.g. 'Quote'. The important thing here is to copy the secret token.

### Enable Notion API in your database
Now go back to Quote page in your Notion workspace and on the top left corner you have 3 dots ***...***. After you click them, you can use **Add connection** and search for the 'Quote' API (or whatever name you've set in previous step). This will enable access for the 'Quote' API to read or change this database content.



# Scriptable Setup

Now you can finally use the script in [Scriptable](https://scriptable.app) app. You can do that on your iPhone or on Mac OS. 

Choose add new script using **+** button. And open my **notion quotes.js** file and copy the content to this new script. I've used 'Quote' as the name of the script.

In the script file you need to change the first two lines.

### YOUR_DATABASE_ID
This one must be replaced by your database ID. To obtain the database ID open your Notion Quote page. And in the address bar you can copy the ID between **/** and **?** signs:

![alt text](https://github.com/mystery123sk/Notion-Book-Quote-Management/blob/main/databaseID.png "Database ID in Notion")

Copy the database ID instead of YOUR_DATABASE_ID in the code.

### YOUR_SECRET_TOKEN
Use the secret token you've generated in 'Quote' API of Notion. It usually starts with 'secret_'.


# iPhone Setup

The final step is to add Scriptable widget to your iPhone home screen. That's quite easy. Just hold the finger on some of your home screen page and add new widget. Choose Scriptable. And select the 'Quote' script you've created before.

![alt text](https://github.com/mystery123sk/Notion-Book-Quote-Management/blob/main/homescreen.png "Scriptable widget on iPhone home screen")


# Coffee

And if you really like, what I do, you can invite me to a coffe/beer here :) :

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/mysterysk)


