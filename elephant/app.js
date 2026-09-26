const quizChoices = document.querySelectorAll(".quiz-choice");
const quizFeedback = document.querySelector("#quiz-feedback");

quizChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    quizChoices.forEach((button) => button.classList.toggle("selected", button === choice));
    const correct = choice.dataset.answer === "false";
    quizFeedback.textContent = correct
      ? "Exact. La trompe sert aussi à respirer, sentir, toucher, saisir et communiquer."
      : "Pas tout à fait. La trompe sert aussi à respirer, sentir, toucher, saisir et communiquer.";
    quizFeedback.dataset.correct = String(correct);
  });
});