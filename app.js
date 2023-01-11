const express = require('express');
const axios = require('axios');
const cron = require('node-cron');


const fs = require('firebase-admin');
const serviceAccount = require('./admin.json');
fs.initializeApp({
 credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();








const getNews = async () => {
    try {
      const res = await axios.get("https://cryptopanic.com/api/v1/posts/?auth_token=45182968fbd8586a5c88917798679bec118c5599&public=true");
      const data = res.data.results;
      const filteredData = data.filter(data => data.kind == "news");

      const newsData = await getNewsListfromDb();

      for (i=0; i < filteredData.length; i++) {
         for(i=0; i < newsData.length; i++) {
            if (filteredData[i].title !== newsData[i].newsTitle) {
                const id = filteredData[i].id;
                const newsJson = {
                   newsTitle: filteredData[i].title,
                   url: filteredData[i].url
                }
                const newsDb = db.collection('news');
                const response = await newsDb.doc(id).set(newsJson);
            } else {
                break
            }
         }
        
        
      }
      

    } catch (error) {
      console.log(error);
    }


}


const getNewsListfromDb = async () => {

    const newsListRaw = []
    const newsDb = db.collection('news');
    const newsList = await newsDb.get();
    newsList.forEach(doc => {
        newsListRaw.push(doc.data());
    })

    return newsListRaw;

}







const main =  () => {
       getNews();
    }

main();


















