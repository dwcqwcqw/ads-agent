"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Target, Sparkles, MessageCircle, TrendingUp } from 'lucide-react';

const FEATURE_CARDS = [
  {
    title: '画像分析智能体',
    description: '基于学习行为与对话数据，实时建模用户认知水平、兴趣偏好与潜在需求。',
    tags: ['行为数据', '对话理解', '实时画像'],
    gradientFrom: '#a855f7',
    gradientTo: '#ec4899',
    icon: Brain,
  },
  {
    title: '数据补全智能体',
    description: '融合购物、App操作、社媒兴趣等外部数据，增强用户模型的完整性与商业可用性。',
    tags: ['数据融合', '用户标签', '价值评估'],
    gradientFrom: '#3b82f6',
    gradientTo: '#06b6d4',
    icon: Database,
  },
  {
    title: '广告匹配智能体',
    description: '实时识别用户意图与转化信号，从多行业广告主中匹配最优商业机会。',
    tags: ['CTR', 'CVR', '多目标优化'],
    gradientFrom: '#22c55e',
    gradientTo: '#14b8a6',
    icon: Target,
  },
  {
    title: '创意生成智能体',
    description: '自动生成个性化广告文案与图片素材，实现千人千面的动态广告表达。',
    tags: ['文案生成', '图像生成', '创意优化'],
    gradientFrom: '#f97316',
    gradientTo: '#ef4444',
    icon: Sparkles,
  },
  {
    title: '销售对话智能体',
    description: '匹配海量不同技能的AI销售智能体，完成需求引导、价值传递与成交转化。',
    tags: ['对话销售', '用户引导', '成交闭环'],
    gradientFrom: '#ec4899',
    gradientTo: '#f97316',
    icon: MessageCircle,
  },
  {
    title: '优化分析智能体',
    description: '基于曝光、点击、注册、付费等全链路数据，自我迭代广告策略与商业收益。',
    tags: ['数据闭环', 'A/B测试', '持续迭代'],
    gradientFrom: '#06b6d4',
    gradientTo: '#22c55e',
    icon: TrendingUp,
  },
];

const GradientCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center w-full px-4">
      {FEATURE_CARDS.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative w-full max-w-[340px] h-[340px] sm:h-[360px] transition-all duration-500"
          >
            {/* Skewed gradient panels */}
            <span
              className="absolute top-0 left-[40px] sm:left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[15px] sm:group-hover:left-[20px] group-hover:w-[calc(100%-80px)] sm:group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${card.gradientFrom}, ${card.gradientTo})`,
              }}
            />
            <span
              className="absolute top-0 left-[40px] sm:left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[15px] sm:group-hover:left-[20px] group-hover:w-[calc(100%-80px)] sm:group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${card.gradientFrom}, ${card.gradientTo})`,
              }}
            />

            {/* Animated blurs */}
            <span className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-white/20 backdrop-blur-[10px] transition-all duration-500 animate-blob group-hover:top-[-40px] sm:group-hover:top-[-50px] group-hover:left-[40px] sm:group-hover:left-[50px] group-hover:w-[80px] sm:group-hover:w-[100px] group-hover:h-[80px] sm:group-hover:h-[100px] group-hover:opacity-100" />
              <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-white/20 backdrop-blur-[10px] transition-all duration-500 animate-blob animation-delay-1000 group-hover:bottom-[-40px] sm:group-hover:bottom-[-50px] group-hover:right-[40px] sm:group-hover:right-[50px] group-hover:w-[80px] sm:group-hover:w-[100px] group-hover:h-[80px] sm:group-hover:h-[100px] group-hover:opacity-100" />
            </span>

            {/* Content */}
            <div className="relative z-20 left-0 p-4 sm:p-6 md:p-[20px_40px] h-full bg-black/60 backdrop-blur-xl shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-20px] sm:group-hover:left-[-25px] group-hover:p-4 sm:group-hover:p-6 flex flex-col">
              {/* Icon */}
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${card.gradientFrom}60, ${card.gradientTo}60)`,
                  border: `1px solid ${card.gradientFrom}80`,
                }}
              >
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: card.gradientFrom }} />
              </div>
              
              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: '#ffffff' }}>
                {card.title}
              </h2>
              
              {/* Description */}
              <p className="text-sm text-white/90 leading-relaxed mb-3 sm:mb-4 flex-1">
                {card.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {card.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="text-xs px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${card.gradientFrom}50, ${card.gradientTo}50)`,
                      border: `1px solid ${card.gradientFrom}70`,
                      color: '#ffffff',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GradientCards;
