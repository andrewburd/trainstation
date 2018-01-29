/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
//const config = {
  //<Firebase Config data>
//};

//firebase.initializeApp(config);


  var config = {
    apiKey: "AIzaSyAdaw8lJ3UhMBi9Y0d7reNCB3q8apqr5Uc",
    authDomain: "trainstation-aadc9.firebaseapp.com",
    databaseURL: "https://trainstation-aadc9.firebaseio.com",
    projectId: "trainstation-aadc9",
    storageBucket: "trainstation-aadc9.appspot.com",
    messagingSenderId: "156977276833"
  };
  firebase.initializeApp(config);

  const dbRef = firebase.database().ref();


// 2. Button for adding Employees
$("#add-employee-btn").click(function(event) {
  
  // prevent form submisson
  event.preventDefault();

  // Creates local "temporary" object for holding employee data
  const newEmp = {
    name: $("#employee-name-input").val().trim(),
    role: $("#role-input").val().trim(),
    start: moment($("#start-input").val().trim(), "hh:mm").format("X"),
    rate: $("#rate-input").val().trim()
  };

  // Uploads employee data to the database
  dbRef.push(newEmp);

  // Logs everything to console (as an object)
  console.log(newEmp);
  
  // Alert
  alert("Employee successfully added");
  resetInputs();
  
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
dbRef.on("child_added", function(childSnapshot, prevChildKey) {

  // Employee Info
  const newEmp = childSnapshot.val();
  console.log(newEmp);
  
  // Calculate the months worked using hardcore math
  // To calculate the months worked
  newEmp.months = moment().diff(moment.unix(newEmp.start, "X"), "months");
  console.log(newEmp.months);
  
  // Prettify the employee start (after using it to calculate months...)
  newEmp.start = moment.unix(newEmp.start).format("hh:mm");

  // Calculate the total billed rate
  newEmp.billed = newEmp.months * newEmp.rate;
  console.log(newEmp.billed);

  // Add each employee's data into the table
  $("#employee-table > tbody").append(createEmployeeRow(newEmp));
});

function createEmployeeRow(emp) {
  const trow = $('<tr>');
  trow.append(`<td>${emp.name}</td>`)
      .append(`<td>${emp.role}</td>`)
      .append(`<td>${emp.start}</td>`)
      .append(`<td>${emp.months}</td>`)
      .append(`<td>${emp.rate}</td>`)

  return trow;
}

function resetInputs() {
  // Selector particular to our HTML, not generically applicable 
  $("form input:not([submit])").val('');
  $("#employee-name-input").focus();
}

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use mets this test case
