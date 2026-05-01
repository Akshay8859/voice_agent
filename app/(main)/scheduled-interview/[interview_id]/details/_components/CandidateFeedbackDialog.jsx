import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ShieldAlert } from 'lucide-react'
import {
  getProctoringFromFeedback,
  proctoringAlertTotal,
  proctoringTypeLabel,
} from '@/lib/proctoring/formatProctoring'

const CandidateFeedbackDialog = ({ candidate }) => {
  const root = candidate?.feedback
  const feedback = root?.feedback ?? root
  const proctoring = getProctoringFromFeedback(root) ?? getProctoringFromFeedback(feedback)
  const proctoringTotal = proctoringAlertTotal(proctoring)
  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline' className='text-primary' >View Report</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                <DialogTitle>Feedback</DialogTitle>
                <DialogDescription asChild>
                    <div className='mt-5'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-5'>
                                <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidate.userName[0]}</h2>
                                <div>
                                    <h2 className='font-bold'>{candidate?.userName}</h2>
                                    <h2 className='text-sm text-gray-500'>{candidate?.userEmail}</h2>
                                </div>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <h2 className='text-primary text-2xl font-bold'>8/10</h2>
                            </div>
                        </div>
                        {(feedback?.aiFeedbackError || feedback?.aiFeedbackParseError) && (
                          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2 mt-2">
                            AI report incomplete: {feedback?.aiFeedbackError || feedback?.aiFeedbackParseError}
                          </p>
                        )}

                        {proctoring && (
                          <>
                            <Separator className="my-4" />
                            <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4">
                              <h2 className="font-bold flex items-center gap-2 text-amber-900">
                                <ShieldAlert className="h-5 w-5 shrink-0" />
                                Proctoring log
                              </h2>
                              <p className="text-sm text-amber-800/90 mt-1">
                                Automated checks during the interview (COCO-SSD).{" "}
                                {proctoringTotal === 0
                                  ? "No flagged incidents recorded."
                                  : `${proctoringTotal} flagged incident(s).`}
                              </p>
                              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-800">
                                {(proctoring.noFaceCount || 0) > 0 && (
                                  <li>Face not visible: <strong>{proctoring.noFaceCount}</strong></li>
                                )}
                                {(proctoring.multipleFaceCount || 0) > 0 && (
                                  <li>Multiple faces: <strong>{proctoring.multipleFaceCount}</strong></li>
                                )}
                                {(proctoring.cellPhoneCount || 0) > 0 && (
                                  <li>Cell phone: <strong>{proctoring.cellPhoneCount}</strong></li>
                                )}
                                {(proctoring.prohibitedObjectCount || 0) > 0 && (
                                  <li>Prohibited object: <strong>{proctoring.prohibitedObjectCount}</strong></li>
                                )}
                              </ul>
                              {Array.isArray(proctoring.screenshots) && proctoring.screenshots.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">Screenshots</p>
                                  <div className="flex flex-wrap gap-2">
                                    {proctoring.screenshots.map((shot, idx) => (
                                      <div key={idx} className="text-xs border rounded-md p-2 bg-white max-w-[140px]">
                                        <div className="font-medium truncate" title={shot.type}>
                                          {proctoringTypeLabel(shot.type)}
                                        </div>
                                        {shot.detectedAt && (
                                          <div className="text-gray-500 truncate">{new Date(shot.detectedAt).toLocaleString()}</div>
                                        )}
                                        {shot.url ? (
                                          <a
                                            href={shot.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary underline mt-1 inline-block"
                                          >
                                            Open image
                                          </a>
                                        ) : (
                                          <span className="text-gray-400 mt-1 block">No file URL</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        <div className='mt-5'>
                            <h2 className='font-bold'>Skills Assessment</h2>
                            <div className='mt-3 grid grid-cols-2 gap-10'>
                                <div>
                                    <h2 className='flex justify-between'>Technical Skills <span>{feedback?.rating?.technicalSkills}/10</span></h2>
                                    <Progress value={feedback?.rating?.technicalSkills * 10} className='mt-1' />
                                </div>
                                <div>
                                    <h2 className='flex justify-between'>Communication <span>{feedback?.rating?.communication}/10</span></h2>
                                    <Progress value={feedback?.rating?.communication * 10} className='mt-1' />
                                </div>
                                <div>
                                    <h2 className='flex justify-between'>Problem Solving <span>{feedback?.rating?.problemSolving}/10</span></h2>
                                    <Progress value={feedback?.rating?.problemSolving * 10} className='mt-1' />
                                </div>
                                <div>
                                    <h2 className='flex justify-between'>Experience <span>{feedback?.rating?.experience}/10</span></h2>
                                    <Progress value={feedback?.rating?.experience * 10} className='mt-1' />
                                </div>
                            </div>
                        </div>

                        <div className='mt-5'>
                            <h2 className='font-bold'>Performance Summary</h2>
                            <div className='p-5 bg-secondary'>
                                {feedback?.summary?.map((summary, index) => (
                                    <p key={index}>{summary}</p>
                                ))}
                            </div>
                        </div>

                        <div className={`p-5 flex items-center justify-between ${feedback?.recommendation == 'Not Recommended' ? 'bg-red-100' : 'bg-green-100'} mt-10 rounded-md`}>
                            <div>
                                <h2 className={`font-bold ${feedback?.recommendation == 'Not Recommended' ? 'text-red-700' : 'text-green-700'}`}>Recommendation Msg: </h2>
                                <p className={`${feedback?.recommendation == 'Not Recommended' ? 'text-red-500' : 'text-green-500'}`}>{feedback?.recommendationMsg}</p>
                            </div>
                            <Button className={`${feedback?.recommendation == 'Not Recommended' ? 'bg-red-700' : 'bg-green-700'}`}>Send Msg</Button>
                        </div>
                    </div> 
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CandidateFeedbackDialog