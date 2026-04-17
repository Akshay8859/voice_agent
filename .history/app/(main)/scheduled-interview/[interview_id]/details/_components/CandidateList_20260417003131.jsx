import React from 'react'

const CandidateList = ({ candidateList }) => {
  const safeList = Array.isArray(candidateList) ? candidateList : [];
  return (
    <div className=''>
        <h2 className='font-bold my-5'>Candidates ({safeList.length})</h2>
        {safeList.map((candidate, index) => (
            <div key={index} className='p-5 flex gap-3 items-center'>
                <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidate.userName[0]}</h2>
                <div>
                    <h2>{candidate?.userName}</h2>
                    <h2>Completed On: {moment(candidate?.created_at).}</h2>
                </div>
            </div>
        ))}
    </div>
  )
}

export default CandidateList