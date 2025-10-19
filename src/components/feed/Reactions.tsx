'use client';

import { useState } from 'react';
import { Heart, ThumbsUp, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reaction } from '@/lib/types/database';

interface ReactionsProps {
  reactions: Reaction[];
  onReact: (reactionType: '👍' | '👏' | '❤️') => void;
  currentUserId: string;
}

export function Reactions({ reactions, onReact, currentUserId }: ReactionsProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const reactionTypes = [
    { type: '👍' as const, icon: ThumbsUp, label: 'Like' },
    { type: '👏' as const, icon: Clapperboard, label: 'Clap' },
    { type: '❤️' as const, icon: Heart, label: 'Love' },
  ];

  const getReactionCounts = () => {
    const counts = { '👍': 0, '👏': 0, '❤️': 0 };
    reactions.forEach(reaction => {
      counts[reaction.reaction_type]++;
    });
    return counts;
  };

  const getUserReaction = () => {
    const userReaction = reactions.find(r => r.user_id === currentUserId);
    return userReaction?.reaction_type;
  };

  const counts = getReactionCounts();
  const userReaction = getUserReaction();

  const handleReactionClick = (reactionType: '👍' | '👏' | '❤️') => {
    onReact(reactionType);
    setShowReactionPicker(false);
  };

  return (
    <div className="relative">
      {/* Main Reaction Button */}
      <button
        onMouseEnter={() => setShowReactionPicker(true)}
        onMouseLeave={() => setTimeout(() => setShowReactionPicker(false), 300)}
        onClick={() => handleReactionClick('👍')}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          userReaction
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        {userReaction ? (
          <span className="text-lg">{userReaction}</span>
        ) : (
          <ThumbsUp className="w-4 h-4" />
        )}
        <span>
          {reactions.length > 0 ? reactions.length : 'React'}
        </span>
      </button>

      {/* Reaction Picker */}
      {showReactionPicker && (
        <div
          className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex space-x-1 z-10"
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
        >
          {reactionTypes.map(({ type, icon: Icon, label }) => {
            const isActive = userReaction === type;
            const count = counts[type];
            
            return (
              <button
                key={type}
                onClick={() => handleReactionClick(type)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors",
                  isActive && "bg-blue-100"
                )}
                title={label}
              >
                <span className="text-2xl">{type}</span>
                {count > 0 && (
                  <span className="text-xs text-gray-600 mt-1">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Reaction Summary */}
      {reactions.length > 0 && (
        <div className="flex items-center space-x-1 mt-1">
          {reactionTypes.map(({ type }) => {
            const count = counts[type];
            if (count === 0) return null;
            
            return (
              <span
                key={type}
                className={cn(
                  "text-sm",
                  userReaction === type && "font-semibold"
                )}
              >
                {type} {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}