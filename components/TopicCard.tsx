import React from 'react';
import { Topic } from '../types';
import * as Icons from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  // Dynamically get icon
  const IconComponent = (Icons as any)[topic.icon] || Icons.HelpCircle;

  return (
    <button
      onClick={() => onClick(topic)}
      className="group relative flex flex-col items-start p-6 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200 w-full text-left overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${topic.color} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`} />
      
      <div className={`p-3 rounded-2xl ${topic.color} text-white mb-4 shadow-md`}>
        <IconComponent size={32} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{topic.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {topic.description}
      </p>
      
      <div className="mt-4 flex items-center text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <span>开始学习</span>
        <Icons.ArrowRight size={16} className="ml-2" />
      </div>
    </button>
  );
};

export default TopicCard;
