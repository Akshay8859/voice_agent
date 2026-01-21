import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const QuestionList = ({formData}) => {

  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState();
  useEffect(() => {
    if(formData) {
      GenerateQuestionList();
    }
  }, [formData]);
  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formData
      })
      // console.log(result.data);
      const Content = result.data?.content;
      const FINAL_CONTENT = Content.replace('```json', '').replace('```', '');
      console.log(FINAL_CONTENT);
      setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
      setLoading(false);
    }
    catch (e) {
      toast('Server Error, Try Again Later');
      setLoading(false);
    }

  }
  return (
    <div>
      {loading && <div className='p-5 bg-primary/10 rounded-xl border border-primary flex gap-5 items-center'>
          <Loader2Icon className='animate-spin' />
          <div>
            <h2 className='font-medium'>Generating Interview Questions</h2>
            <p className='text-primary'>Our AI is crafting personalized questions bases on your job position.</p>
          </div>

        </div>
      }
      {questionList?.length > 0 && 
        <div className='p-5 border border-gray-300 rounded-xl'>
          {questionList.map((item, index) => (
            <div key={index} className='p-3 border border-gray-200 rounded-xl'>
              <h2 className='font-medium'>{item.question}</h2>
              <h2>Type : {item?.type}</h2>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default QuestionList