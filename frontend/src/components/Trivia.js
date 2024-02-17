import React, { useEffect, useRef, useState } from "react";
import { Flex, Button, Typography } from 'antd';
import { triviaRequest } from "../utils";
import Question from "./Question";
import { NUMBER_OF_QUESTIONS } from "../constants";
import { Loading } from "./Loading";

const { Title } = Typography

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
    const response = await triviaRequest();
    setTrivia(response)
  }

  if(showLoading){
    return (
    <Flex justify="center" align="center" vertical>
      <Loading/>
    </Flex>)
  }
  return (
    <Flex justify="center" align="center" wrap="wrap" vertical>
      <Title level={5}>Number of correct answers {correctAnswers}/{NUMBER_OF_QUESTIONS}</Title>
      
      {trivia && trivia.map((question, index) => (
        index === activeQuestion && <Question 
          key={question.question}
          question={question} 
          onCorrectAnswer={handleCorrectAnswer} 
          onAnswer={handleAnswer}
          />
        )
      )}
    
      {
        showResults && correctAnswers === NUMBER_OF_QUESTIONS &&
        <>
          <Title level={4}>
            There are {triviaRewardBalance} Tokens left
          </Title>
          <Button type="primary"            
            onClick={claimReward}
            disabled={disableClaimReward}>
            Claim Reward
          </Button>
        </>
      }
      {showResults && correctAnswers < NUMBER_OF_QUESTIONS &&
        <>
          <Title level={4}>
            There are {triviaRewardBalance} Tokens left
          </Title>
          <Button type="primary"            
            onClick={reset}>
            Try Again!
          </Button>
        </>
      }
      
    </Flex>
  );
}

