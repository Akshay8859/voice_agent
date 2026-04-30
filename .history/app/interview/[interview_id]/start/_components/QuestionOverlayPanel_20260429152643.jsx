// Overlay for displaying current question and all questions
import { useState } from "react";
import { ChevronRight, ChevronLeft, List } from "lucide-react";

const QuestionOverlayPanel = ({ interviewInfo }) => {
  const [showAll, setShowAll] = useState(false);
  const [current, setCurrent] = useState(0);
  const questions = interviewInfo?.interviewContent?.questionList || [];

  if (!questions.length) return null;

  return (
    <div>
      {/* Overlay for all questions */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAll(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">
              All Questions
            </h3>
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              {questions.map((item, idx) => (
                <div key={idx} className="border-b pb-2">
                  <span className="font-semibold text-green-700">
                    Question {idx + 1} of {questions.length}
                  </span>
                  <p className="text-gray-700 mt-1">{item.question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Current question card */}
      <div className="bg-gray-50 rounded-xl p-5 shadow flex flex-col gap-2 relative w-[340px]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-700">
            Question {current + 1} of {questions.length}
          </span>
          <button
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowAll(true)}
            aria-label="Show all questions"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-gray-700 font-medium min-h-[48px]">
          {questions[current]?.question}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
            disabled={current === 0}
            aria-label="Previous question"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() =>
              setCurrent((prev) => Math.min(prev + 1, questions.length - 1))
            }
            disabled={current === questions.length - 1}
            aria-label="Next question"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionOverlayPanel;
