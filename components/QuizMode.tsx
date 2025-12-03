import React, { useState, useEffect } from 'react';
import { Difficulty, QuizQuestion, Topic } from '../types';
import { generateQuiz } from '../services/geminiService';
import { CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight, Star, Bot } from 'lucide-react';

interface QuizModeProps {
  topic: Topic;
  onUpdateStats: (correct: boolean) => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ topic, onUpdateStats }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [streak, setStreak] = useState(0);

  const fetchQuestions = async (diff: Difficulty) => {
    setLoading(true);
    setQuestions([]);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    
    const newQuestions = await generateQuiz(topic.title, diff);
    setQuestions(newQuestions);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions(difficulty);
  }, [topic, difficulty]);

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = index === questions[currentQIndex].correctAnswer;
    onUpdateStats(isCorrect);
    
    if (isCorrect) {
        setStreak(s => s + 1);
    } else {
        setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
       // Completed set
       fetchQuestions(difficulty);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-indigo-100 p-8 shadow-lg">
        <RefreshCw size={48} className="text-indigo-500 animate-spin" />
        <p className="text-indigo-800 font-medium">正在生成题目...</p>
        <p className="text-xs text-indigo-400">AI老师正在翻阅题库</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
       <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-red-100">
           <p>哎呀，生成题目失败了，请重试。</p>
           <button onClick={() => fetchQuestions(difficulty)} className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-full">重试</button>
       </div>
    )
  }

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden relative">
      {/* Quiz Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Trophy size={20} className="text-yellow-300" />
            <span className="font-bold">闯关挑战</span>
        </div>
        <div className="flex space-x-2 text-xs">
          {Object.values(Difficulty).map((d) => (
            <button
              key={d}
              onClick={() => d !== difficulty && setDifficulty(d)}
              className={`px-3 py-1 rounded-full transition-all ${
                difficulty === d ? 'bg-white text-indigo-600 font-bold' : 'bg-indigo-700 text-indigo-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2">
        <div 
            className="bg-yellow-400 h-2 transition-all duration-500" 
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg text-sm font-bold">
                第 {currentQIndex + 1} 题
            </span>
            {streak > 1 && (
                <span className="flex items-center text-orange-500 font-bold text-sm animate-pulse">
                    <Star size={16} className="fill-current mr-1"/> {streak} 连对!
                </span>
            )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ";
            
            if (showResult) {
              if (idx === currentQuestion.correctAnswer) {
                btnClass += "bg-green-50 border-green-500 text-green-700";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-700";
              } else {
                btnClass += "bg-gray-50 border-gray-100 opacity-50";
              }
            } else {
              btnClass += "bg-white border-gray-100 hover:border-indigo-300 hover:bg-indigo-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={btnClass}
              >
                <span className="font-medium text-lg">{option}</span>
                {showResult && idx === currentQuestion.correctAnswer && <CheckCircle className="text-green-500" />}
                {showResult && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button */}
        {showResult && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
              <h4 className="font-bold text-blue-800 mb-1 flex items-center">
                <Bot size={16} className="mr-2"/> 老师解析：
              </h4>
              <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
            </div>
            
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex justify-center items-center transition-transform active:scale-95"
            >
              {currentQIndex < questions.length - 1 ? '下一题' : '完成本轮'} <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;