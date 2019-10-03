// initializing firebase
var firebaseConfig = {
    apiKey: "AIzaSyDvMUSMjpqMupxYUv_QKn_iJEzEk_9MP0M",
    authDomain: "trainscheduler-ee589.firebaseapp.com",
    databaseURL: "https://trainscheduler-ee589.firebaseio.com",
    projectId: "trainscheduler-ee589",
    storageBucket: "",
    messagingSenderId: "525665946610",
    appId: "1:525665946610:web:0edef019c06b94d936b96b",
    measurementId: "G-3VZFW51M1V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database()

// TODO
// 1. initialize firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the database.
// 4. Create a way to calculate the shizzle. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.



// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21



// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    // Employee Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(trainFrequency);

    // Assumptions
    var tFrequency = trainFrequency;

    // Time is 3:30 AM
    var firstTime = trainStart;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");;
    console.log("epoch time: " + trainStart + " converted: " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrain2 = moment(nextTrain).format("hh:mm")
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrain2),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
});