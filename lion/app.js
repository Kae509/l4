const quizChoices = document.querySelectorAll(".quiz-choice");
const quizFeedback = document.querySelector("#quiz-feedback");

quizChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    quizChoices.forEach((button) => button.classList.toggle("selected", button === choice));
    const correct = choice.dataset.answer === "false";
    quizFeedback.textContent = correct
      ? "Exact. La crinière varie selon l’âge et l’individu ; elle ne fait pas du lion un chef de troupe."
      : "Pas tout à fait. La crinière varie selon l’âge et l’individu ; elle ne fait pas du lion un chef de troupe.";
    quizFeedback.dataset.correct = String(correct);
  });
});