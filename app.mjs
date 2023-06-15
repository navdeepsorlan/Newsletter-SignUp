import express from "express";
import https from "node:https";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.MAILCHIMP_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', function(req, res) {
     res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res) {
     const firstName = req.body.first;
     const lastName = req.body.last;
     const email = req.body.email;

     const data = {
          members: [
               {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                         FNAME: firstName,
                         LNAME: lastName
                    }
               }
          ]
     };

     const jsonData = JSON.stringify(data);
     const url = "https://us21.api.mailchimp.com/3.0/lists/bfafb280d9";
     const options = {
          method: "POST",
          auth: "navdeep:" + apiKey
     }
     const request = https.request(url, options, function(response) {
          if(response.statusCode === 200) {
               res.sendFile(__dirname + "/success.html");
          }
          else {
               res.sendFile(__dirname + "/failure.html");
          }
          response.on("data", function(data) {
               console.log(JSON.parse(data));
          })
     })
     request.write(jsonData);
     request.end();
});

app.post("/failure", function(req, res) {
     res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
     console.log("server is running");
});

//audience id: bfafb280d9
