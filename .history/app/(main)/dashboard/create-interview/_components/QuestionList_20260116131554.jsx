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
      const Content = JSON.parse(result.data.Content);
      const FINAL_JSON = Content.replace('```json', '').replace('```', '');
      setQuestionList(Content);
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
    </div>
  )
}

export default QuestionList