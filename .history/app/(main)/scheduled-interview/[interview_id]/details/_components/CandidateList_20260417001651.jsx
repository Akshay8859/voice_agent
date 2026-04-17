import React from 'react'

const CandidateList = ({ candidateList }) => {
  return (
    <div className=''>
        <h2 className='font-'>Candidates ({candidateList?.length})</h2>
        {candidateList.map((candidate, index) => (
            <div key={index} className='p-5'>
                <h2>{candidate.userName[0]}</h2>
            </div>
        ))}
    </div>
  )
}

export default CandidateList