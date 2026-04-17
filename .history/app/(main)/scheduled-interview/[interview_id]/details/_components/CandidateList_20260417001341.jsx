import React from 'react'

const CandidateList = ({ candidateList }) => {
  return (
    <div className=''>
        {candidateList.map((candidate, index) => (
            <div key={index}>
                <h2>{candidate.userName[0]}</h2>
            </div>
        ))}
    </div>
  )
}

export default CandidateList