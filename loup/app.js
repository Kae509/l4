const quizButtons = document.querySelectorAll(".quiz-button");
const quizResult = document.querySelector("#quiz-result");

quizButtons.forEach((button) => {
  button.addEventListener("click", () => {
    quizButtons.forEach((choice) => choice.classList.toggle("selected", choice === button));
    const isCorrect = button.dataset.answer === "false";
    quizResult.textContent = isCorrect
      ? "Exact. Les hurlements servent surtout à communiquer avec la meute et à signaler sa présence."
      : "Pas tout à fait. Les hurlements servent surtout à communiquer avec la meute et à signaler sa présence.";
    quizResult.dataset.correct = String(isCorrect);
  });
});