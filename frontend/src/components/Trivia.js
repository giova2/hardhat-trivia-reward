import React, { useEffect, useRef, useState } from "react";
import { Flex, Button } from 'antd';
import { triviaRequest } from "../utils";
import Question from "./Question";
import { NUMBER_OF_QUESTIONS } from "../constants";
import { Loading } from "./Loading";
import { motion, AnimatePresence } from 'framer-motion';
import { MyTitle } from "./MyTypography";
import MyButton from "./MyButton";

const variants = {
  enter: { opacity: 0, x: '-100%' },
  center: { opacity: 1, x: 0, zIndex: 1 },
  exit: { opacity: 0, x: "200%", zIndex: 0},
}

export function Trivia({ resetTrivia, disableClaimReward, claimReward, triviaRewardBalance }) {
  const [trivia, setTrivia] = useState();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const myCount = useRef(0);

  useEffect(() => {
    if(myCount.current === 0){
      const getTrivia = async () => {
        setShowLoading(true);
        const response = await triviaRequest();
        setShowLoading(false);
        setTrivia(response);
      }
      
      getTrivia();
    }
    myCount.current++;
  }, []);

  useEffect(() => {
    if(correctAnswers === NUMBER_OF_QUESTIONS){
      // trigger claim reward.
      console.log('Claim Reward!! TODO: add some animation!')
    }
    console.log({correctAnswers})
  }, [correctAnswers]);

  useEffect(() => {
    if(activeQuestion === NUMBER_OF_QUESTIONS){
      setShowResults(true)
    }
  }, [activeQuestion])

  useEffect(() => {
    if(resetTrivia > 0){
      reset()
    }
  }, [resetTrivia])
  
  

  const handleCorrectAnswer = () => {
    setCorrectAnswers(prevState => prevState + 1);
  }

  const handleAnswer = () => {
    setTimeout(() => {
      setActiveQuestion(prevState => prevState + 1);
    }, 2000);
  }

  
  const reset = async () => {
    setTrivia()
    setCorrectAnswers(0);
    setActiveQuestion(0);
    setShowResults(false);
    setShowLoading(true);
    const response = await triviaRequest();
    setShowLoading(false);
    setTrivia(response)
  }

  if(showLoading){
    return (
    <Flex justify="center" align="center" vertical>
      <Loading/>
    </Flex>)
  }
  
  return (
    <Flex className="trivia-container" justify="center" align="center" wrap="wrap" vertical >
      { !showResults &&
        <MyButton onClick={reset}>
          Restart
        </MyButton>
      }
      <MyTitle level={5}>Number of correct answers {correctAnswers}/{NUMBER_OF_QUESTIONS}</MyTitle>
      <div className="trivia-animation-container">
        <AnimatePresence>
          {trivia && trivia.map((question, index) => (
            index === activeQuestion && 
              <motion.div
                className="trivia-question-animation"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                key={question.question}
              >
                <Question
                  question={question} 
                  onCorrectAnswer={handleCorrectAnswer} 
                  onAnswer={handleAnswer}
                  />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      {
        showResults && correctAnswers === NUMBER_OF_QUESTIONS &&
        <>
          <MyTitle level={4}>
            There are {triviaRewardBalance} Tokens left
          </MyTitle>
          <MyButton onClick={claimReward}
            disabled={disableClaimReward}>
            Claim Reward
          </MyButton>
        </>
      }
      { showResults && correctAnswers < NUMBER_OF_QUESTIONS &&
        <>
          <MyTitle level={4}>
            There are {triviaRewardBalance} Tokens left
          </MyTitle>
          <MyButton onClick={reset}>
            Try Again
          </MyButton>
        </>
      }
    </Flex>
  );
}

