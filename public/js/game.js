// jshint esversion:6

let buttonColors = ['red', 'blue', 'green', 'yellow'];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;

function playSound(name) {
  let sound = new Audio(`sounds/${name}.mp3`);
  sound.play();
}

function nextSequence() {
  // console.log('next');
  userClickedPattern = [];
  // console.log(userClickedPattern);
  level++;
  $('#level-title').text(`LEVEL ${level}`);
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  $(`#${randomChosenColor}`).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);
  // console.log(gamePattern);
}

function animatePress(currentColor) {
  $(`.${currentColor}`).addClass('pressed');
  setTimeout(function() {
    $(`.${currentColor}`).removeClass('pressed');
  }, 100);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    // console.log('success');
    // check if user has finished the sequence
    if (userClickedPattern.length === level) {
      $('.game-btn').off('click');
      setTimeout(function() {
        nextSequence();
        enableButtonClick();
      }, 1000);
    }
  } else {
    // console.log('fail');
    $('.game-btn').off('click');
    $('.playerScore').attr('value', level);
    playSound('wrong');
    $('body').addClass('game-over');
    setTimeout(function() {
      $('body').removeClass('game-over');
    }, 200);
    setTimeout(function() {
      $('.submitScore').submit();
    }, 500);
    // $('#level-title').text('GAME OVER! Press Any Key to restart');


    // startOver();
  }
}

function startOver() {
  $('.game-btn').off('click');
  gamePattern = [];
  level = 0;
  started = false;
}

function enableButtonClick() {
  $('.game-btn').on('click', function(e) {
    let userChosenColor = $(e.target).attr('id');
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  });
}


$(document).on('click', function(e) {
  if (started === false) {
    enableButtonClick();
    nextSequence();
    started = true;
    // console.log(e.key);
  }
});
