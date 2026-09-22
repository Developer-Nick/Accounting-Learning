// Load all quizzes from the database and display them on the page
let totalScore = 0;
let totalQuestions = 0;

//Create a div that shows each quizzes name and previous score compared to the amount of questions
for (let i = 0; i < Quizzes.length; i++) {
    let quiz = Quizzes[i][0];
    let score = Quizzes[i][1];
    let id = Quizzes[i][3];
    totalScore += score;
    totalQuestions += Quizzes[i][2];
    //Creation of div
    let quizDiv = document.createElement("div");
    quizDiv.className = "quizblock";
    quizDiv.innerHTML = `<p class="quizname">${quiz}</p><a href="http://127.0.0.1:5000/quizpage?id=${id}">Play</a><p class="quizscore">Score: ${score}</p>`;
    //Appending it
    document.querySelector(".AllQuizzes").appendChild(quizDiv);
}

//Calculating and displaying average score.
AverageScore = totalScore / totalQuestions * 100;
AverageScore = AverageScore.toFixed(2);
document.querySelector("#AverageScore").innerHTML = `Average Score: ${AverageScore}%`;
