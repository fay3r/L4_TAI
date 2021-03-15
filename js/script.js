let preQuestions ;


let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let indexv2 = document.querySelector('#”index”')
let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let results = document.querySelector('.results')
let index = 0;
let points = 0;
let list = document.querySelector('.list');
let yourScore = document.querySelector('.userScorePoint')
let averageSc = document.querySelector('.average');

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(index);
        indexv2.innerHTML = index+1;
        activateAnswers();
        next.addEventListener('click',function () {
            if(preQuestions.length-1>index) {
                index++;
                setQuestion(index);
                indexv2.innerHTML = index+1;
                activateAnswers();
            } else {
                list.style.display = 'none';
                results.style.display = 'block';

            }
        });

        previous.addEventListener('click',function (){
            if(index!=0){
                index--;
                indexv2.innerHTML = index+1;
                setQuestion(index);
                activateAnswers();
            }
        });


        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });
    });

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();

    if(index === preQuestions.length-1){
        saveToLocal();
    }
}

function setQuestion(index) {
    //clearClass();
    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
        answers[2].innerHTML = preQuestions[index].answers[2];
        answers[3].innerHTML = preQuestions[index].answers[3];
    }
}



function activateAnswers() {

    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
        answers[i].classList.remove('correct');
        answers[i].classList.remove('incorrect');
    }
}

activateAnswers();

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}


function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function saveToLocal(){
    let countGames = JSON.parse(localStorage.getItem('countGames'));
    let savedPoints = JSON.parse(localStorage.getItem('points'));
    let average = JSON.parse(localStorage.getItem('average'))

    if(countGames == null){
        countGames=0;
    }
    if(savedPoints == null){
        savedPoints=0;
    }
    if(average == null){
        average = 0;
    }
    savedPoints = savedPoints+points;
    countGames++;
    average = savedPoints/countGames;
    averageSc.innerHTML = average;
    yourScore.innerHTML = points;
    localStorage.setItem('countGames', JSON.stringify(countGames));
    localStorage.setItem('points',JSON.stringify(savedPoints));
    localStorage.setItem('average',JSON.stringify(average));

}

