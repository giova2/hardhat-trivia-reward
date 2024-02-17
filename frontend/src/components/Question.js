import React, { useMemo, useState } from 'react'
import {Typography,Card, Radio, Space, Alert, Divider} from 'antd';
import { shuffleArray, parseHTML, parseHTMLForArrays } from '../utils';

const {Text} = Typography

function Question({
  question,
  onCorrectAnswer,
  onAnswer,
}) {
  const {correct_answer, incorrect_answers, question: questionTitle, category } = question
  const [disabledRadio, setdDisabledRadio] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(undefined);
  const answers = useMemo(() => shuffleArray([parseHTML(correct_answer), ...parseHTMLForArrays(incorrect_answers)]), [correct_answer, incorrect_answers]);
  
  const onChange = (e) => {
    if(e.target.value === correct_answer){
      onCorrectAnswer();
      setCorrectAnswer(true);
    }else{
      setCorrectAnswer(false);
    }
    onAnswer();
    setdDisabledRadio(true);
  };
  
  return (
    <Card 
      title={parseHTML(questionTitle)} 
      
      cover={<Text strong={true} italic={true} style={{textAlign:'center'}}>{category}</Text>} 
      styles={{title:{whiteSpace: 'break-spaces'}}}>
      <Radio.Group onChange={onChange} disabled={disabledRadio}> 
      {/* value={value}> */}
        <Space direction="vertical">
          {answers.map((answer) => (
            <Radio key={answer} value={answer}>{answer}</Radio>
          ))}
        </Space>
      </Radio.Group>
      <Divider />
      {correctAnswer === true && <Alert message="Correct!" type="success" />}
      {correctAnswer === false && <Alert message="Sorry, your answer is not correct" type="error" />}
    </Card>
  )
}

export default Question