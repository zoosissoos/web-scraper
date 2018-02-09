# web-scraper

This is an MLB Trade Rumors scraper. It searches MLBtradeumors.com and retrieves the articles and more and stores them on a nosql database. Then the user can "save" articles and comment on them.

## Getting Started

To get running locally, you will have to have MongoDB running in the background.

### Prerequisites/Technologies Used

Node.js
MongoDB
Mongoose
Express
Cheerio
Axios

### Installing

In Terminal once in root directory:

-Run "npm install" on node.js to retrieve dependencies
-run "mongod" in the background
-Run "node server.js"
-Visit localhost to visit the application



### Future development

I wish to have the functionality of the delete buttons fixed. This is an issue due to the use of a modal not displaying the new data without closing out or refreshing. This does not affect the addition of notes

## Deployment

This has been deployed via Heroku.


## Authors

* **Daniel Lewis** - *Initial work* - [zoosissoos](https://github.com/zoosissoos)

