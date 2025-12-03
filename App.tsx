import React, { useState } from 'react';
import { ViewState, Topic, UserStats } from './types';
import { TOPICS } from './constants';
import TopicCard from './components/TopicCard';
import ChatInterface from './components/ChatInterface';
import QuizMode from './components/QuizMode';
import StatsChart from './components/StatsChart';
import { getExplanation } from './services/geminiService';
import { Rocket, BookOpen, ChevronLeft, Award } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [initialExplanation, setInitialExplanation] = useState('');
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    topicsCompleted: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    stars: 0
  });

  const handleTopicSelect = async (topic: Topic) => {
    setLoadingTopic(true);
    setCurrentTopic(topic);
    
    // Pre-fetch an initial engaging explanation
    const expl = await getExplanation(topic.title, '');
    setInitialExplanation(expl);
    
    setViewState('lesson');
    setLoadingTopic(false);
  };

  const handleBackToDashboard = () => {
    setViewState('dashboard');
    setCurrentTopic(null);
    setInitialExplanation('');
  };

  const updateStats = (isCorrect: boolean) => {
    setUserStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        stars: isCorrect ? prev.stars + 1 : prev.stars
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-indigo-200">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={handleBackToDashboard}>
                <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-200">
                    <Rocket className="text-white h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        深圳三年级数学探险
                    </h1>
                    <p className="text-xs text-gray-400">Shenzhen Grade 3 Math Adventure</p>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                    <Award className="text-yellow-500 h-4 w-4" />
                    <span className="font-bold text-yellow-700">{userStats.stars} 星星</span>
                </div>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
        
        {viewState === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来, 小小数学家! 👋</h2>
                    <p className="text-gray-500">今天我们要探索哪颗数学星球呢？</p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-1/3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">学习战绩</h4>
                    <StatsChart stats={userStats} />
                </div>
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOPICS.map(topic => (
                <TopicCard key={topic.id} topic={topic} onClick={handleTopicSelect} />
              ))}
            </div>
            
            {loadingTopic && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Rocket className="h-12 w-12 text-indigo-600 animate-bounce" />
                        <p className="mt-4 text-indigo-600 font-bold text-lg">正在前往数学星球...</p>
                    </div>
                </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col animate-in zoom-in-95 duration-500">
            {/* Lesson Header */}
            <div className="mb-4 flex items-center">
                <button 
                    onClick={handleBackToDashboard}
                    className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center space-x-3">
                     <div className={`p-2 rounded-lg ${currentTopic?.color} text-white`}>
                        <BookOpen size={20} />
                     </div>
                     <h2 className="text-2xl font-bold text-gray-800">{currentTopic?.title}</h2>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left: AI Tutor Chat */}
                <div className="h-full min-h-[400px]">
                    {currentTopic && (
                        <ChatInterface 
                            topic={currentTopic} 
                            initialExplanation={initialExplanation}
                        />
                    )}
                </div>

                {/* Right: Quiz Area */}
                <div className="h-full min-h-[400px]">
                    {currentTopic && (
                        <QuizMode 
                            topic={currentTopic}
                            onUpdateStats={updateStats}
                        />
                    )}
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
