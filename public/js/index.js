
// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");
var $sendUserIfnfo = $("#send");




//TOGGLE THE LOGIN AND SIGN UP BUTTON 
//IF THE #loginActive ID HAS A VALUE OF 1 IT MEANS THAT THE USER ALREADY HAS AN ACCOUNT
//IF VALUE IS 0 THEN USER WILL BE CREATING AN ACCOUNT
$("#toggleLogin").click(function(event) {
  event.preventDefault();
  if ($("#loginActive").val() == "1") {
      $(".toggle-name").show()
      $("#loginActive").val("0");
      $("#login-title").html("Sign Up");
      $("#send").html("Sign Up");
      $("#toggleLogin").html("Login");
      
      
      
  } else {
    $(".toggle-name").hide()
      $("#loginActive").val("1");
      $("#login-title").html("Login");
      $("#send").html("Login");
      $("#toggleLogin").html("Sign up");
    
      
  }
  
  
})

// THIS FUNCTION WILL CALL THE "/API/SIGNUP"  AND REGISTER OR LOGIN THE USER
var saveUser = function(event){
  event.preventDefault();
  let loginActive = $("#loginActive").val();
  let firstName = $("#firstName").val().trim();
  let lastName = $("#lastName").val().trim();
  let email = $("#email").val().trim();
  let password = $("#password").val().trim();
  var saveUserObjet = {
    loginActive: loginActive,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  }



    $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "/api/signup",
      type: "POST",
      data: JSON.stringify(saveUserObjet)
    }).then(function(result){
      console.log(result)
      if (result) {
       window.location.replace("/")
      }else{
        window.location.replace("/login")
      }
      
    })
  



}

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
$sendUserIfnfo.on('click', saveUser)
