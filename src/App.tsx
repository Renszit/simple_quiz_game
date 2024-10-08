import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { Difficulty, fetchQuizQuestions, QuestionState } from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";
export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [totalQuestions, setTotalQuestions] = useState(TOTAL_QUESTIONS);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficulty);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper className="App">
        <h1>React Quiz</h1>
        {gameOver && (
          <>
            <label htmlFor="difficulty">Select Difficulty: </label>

            <select
              id="difficulty"
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              disabled={!gameOver}
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>

            <label htmlFor="amount">Number of Questions: </label>
            <input
              type="number"
              id="amount"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              disabled={!gameOver}
              min={1}
              max={50}
            />
          </>
        )}
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            start
          </button>
        ) : null}

        {!gameOver && <p className="score">Score: {score}</p>}

        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver && (
          <>
            <QuestionCard
              question={questions[number].question}
              answers={questions[number].answers}
              callback={checkAnswer}
              userAnswer={userAnswers ? userAnswers[number] : undefined}
              questionNr={number + 1}
              totalQuestions={TOTAL_QUESTIONS}
            />
            {userAnswers.length === number + 1 &&
              number !== TOTAL_QUESTIONS - 1 && (
                <button className="next" onClick={nextQuestion}>
                  Next Question
                </button>
              )}
          </>
        )}
      </Wrapper>
    </>
  );
};

export default App;
