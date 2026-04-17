import React from 'react'

const CandidateList = ({ candidateList }) => {
  return (
    <div className=''>
        <h2 className='font-bold my-5'>Candidates ({candidateList?.length})</h2>
        {candidateList.map((candidate, index) => (
            <div key={index} className='p-5'>
                <h2 className='bg-primary p-3 rounded-full'>{candidate.userName[0]}</h2>
                
            </div>
        ))}
    </div>
  )
}

export default CandidateList