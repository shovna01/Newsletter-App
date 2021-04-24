//jshint esversion:6

const express = require("express");
const https = require("https");
const { url } = require("inspector");
const fetch = require("node-fetch");

const app= express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // console.log(firstName, lastName, email);

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

    const url = "https://us1.api.mailchimp.com/3.0/lists/400204199d";

    const options = {
        method: "POST",
        auth: "Gudli06:9a299b6e7b0642db2669786bb8b5a15f-us1"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port (3000) ");
});



//Api key - 9a299b6e7b0642db2669786bb8b5a15f-us1
//list id - 400204199d