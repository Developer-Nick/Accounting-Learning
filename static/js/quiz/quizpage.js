//Initilize variables
let CorrectAnswers = 0;
let CurrentQuestion = 0;
let TotalQuestions = 0;

// Get the amount of questions
for (let i = 0; i < Questions.length; i++) {
    TotalQuestions++;
}

//This function will clear the answer box and put the question in the the question box
function LoadQuestion(question) {
    document.getElementById("Question").innerHTML = Questions[question];
    document.getElementById("Answer").value = "";
}

// Load the first question
LoadQuestion(CurrentQuestion);

// Gets the answer from the user and stores it in the answer variable
document.addEventListener('DOMContentLoaded', (event) => {
    //Get forms
    const form = document.querySelector('form');
    const answerInput = document.getElementById('Answer');
    const ResultHeader = document.getElementById('NumCorrectAnswers');
    let answer = '';

    //When answer is submitted
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        //Get answer in form into variable 
        answer = answerInput.value; 
        
        //Correct answer found.
        if (answer.toLowerCase() === Answers[CurrentQuestion].toLowerCase()) {
            CorrectAnswers++;
            console.log("Correct Answer");
        }

        //To next question
        CurrentQuestion++;

        //Check if quiz is done
        if (CurrentQuestion === TotalQuestions) {
            // Quiz is complete, load results:
            console.log("Quiz Complete");
            console.log("Correct Answers: " + CorrectAnswers);
            document.getElementById('Result').style.visibility = 'visible';
            document.getElementById('testing').style.visibility = 'hidden';
            ResultHeader.innerHTML = "You got " + CorrectAnswers + " out of " + TotalQuestions + " correct!";
        } else {
            //If ongoing, load the next question
            LoadQuestion(CurrentQuestion);
        }
    });
});



document.getElementById('Next').addEventListener('click', function() {
    //get the quiz id from the url
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    const newUrl = `/quizupdatescore?id=${quizId}&NewScore=${CorrectAnswers}`;
    window.location.href = newUrl;
});

