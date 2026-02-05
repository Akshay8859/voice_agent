// import axios from 'axios';
// import { Loader2Icon } from 'lucide-react';
// import React, { useEffect, useState } from 'react'
// import { toast } from 'sonner';

// const QuestionList = ({formData}) => {

//   const [loading, setLoading] = useState(true);
//   const [questionList, setQuestionList] = useState();
//   useEffect(() => {
//     if(formData) {
//       GenerateQuestionList();
//     }
//   }, [formData]);
//   const GenerateQuestionList = async () => {
//     setLoading(true);
//     try {
//       const result = await axios.post('/api/ai-model', {
//         ...formData
//       })
//       // console.log(result.data);
//       const Content = result.data?.content;
//       const FINAL_CONTENT = Content.replace('```json', '').replace('```', '');
//       console.log(FINAL_CONTENT);
//       setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
//       setLoading(false);
//     }
//     catch (e) {
//       toast('Server Error, Try Again Later');
//       setLoading(false);
//     }

//   }
//   return (
//     <div>
//       {loading && <div className='p-5 bg-primary/10 rounded-xl border border-primary flex gap-5 items-center'>
//           <Loader2Icon className='animate-spin' />
//           <div>
//             <h2 className='font-medium'>Generating Interview Questions</h2>
//             <p className='text-primary'>Our AI is crafting personalized questions bases on your job position.</p>
//           </div>

//         </div>
//       }
//       {questionList?.length > 0 && 
//         <div className='p-5 border border-gray-300 rounded-xl'>
//           {questionList.map((item, index) => (
//             <div key={index} className='p-3 border border-gray-200 rounded-xl'>
//               <h2 className='font-medium'>{item.question}</h2>
//               <h2>Type : {item?.type}</h2>
//             </div>
//           ))}
//         </div>
//       }
//     </div>
//   )
// }

// export default QuestionList


import { useUserDetail } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import axios from 'axios';
import { Loader2, Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import QuestionListCotainer from './QuestionListCotainer';

const QuestionList = ({ formData , onCreateLink}) => {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const {user} = useUserDetail();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', formData);

      const rawContent = result.data?.content;

      if (!rawContent) {
        throw new Error("No content returned from AI");
      }

      // Remove markdown safely
      const cleaned = rawContent
        .replace('```json', '')
        .replace('```', '')
        .trim();

      const parsed = JSON.parse(cleaned);

      setQuestionList(parsed?.interviewQuestions || []);
    } catch (e) {
      console.error(e);
      toast('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();
    const {data, error} = await supabase
      .from('interviews')
      .insert([
        {
          ...formData,
          questionList:questionList,
          userEmail: user?.email,
          interview_id: interview_id,
        }
      ])
      .select();
    setSaveLoading(false);
    
    onCreateLink(interview_id);
  }
  return (
    <div>
      {loading && (
        <div className="p-5 bg-primary/10 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions based on your job position.
            </p>
          </div>
        </div>
      )}

      {questionList.length > 0 && (
        <div>
          <QuestionListCotainer questionList={questionList} />
        </div>
      )}

      <div className='flex justify-end mt-10'>
        <Button onClick={() => onFinish()} disabled={saveLoading || loading}>
          {saveLoading && <Loader2 className="animate-spin" />}
          Create Interview Link
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;
