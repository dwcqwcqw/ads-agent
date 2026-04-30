import React, { useState, useEffect } from 'react'

// Agent Icons
const AgentIcons = {
  profile: '👤',
  enrich: '🔗',
  match: '🎯',
  creative: '🎨',
  sales: '💬',
  optimization: '📊'
}

// Sample data
const sampleData = {
  user: {
    // 书籍信息放在最前面
    currentBook: {
      name: '《小学数学思维训练五年级》',
      publisher: '人民教育出版社',
      price: 68.00,
      category: '数学辅导',
      edition: '2024年版',
      isbn: '978-7-107-34521-8'
    },
    name: '王小明',
    grade: '小学五年级',
    age: 11,
    phone: '138****1234',
    weakPoints: ['应用题', '分数运算', '几何图形'],
    scores: [68, 72, 75],
    parent: '企业管理者',
    educationInvestment: '2000-3000元/月',
    target: '重点初中'
  },
  
  agents: [
    {
      id: 'profile',
      name: '用户画像分析',
      description: '基于学习数据生成用户认知模型',
      output: {
        cognitiveLevel: '中等偏弱',
        learningStage: '五年级关键提升期',
        coreProblem: '应用题理解与数量关系建模',
        shortTermNeed: '快速提升考试成绩',
        conversionIntent: 8,
        analysis: '该学生处于小学高年级数学关键提升阶段，当前成绩处于中等偏下到中等水平，基础知识存在局部漏洞，尤其在应用题理解、分数运算和几何图形分析方面表现较弱。家长对成绩提升和小升初较为关注，教育投入意愿较强。'
      }
    },
    {
      id: 'enrich',
      name: '数据补全与增强',
      description: '基于手机号多维度数据融合与画像增强',
      output: {
        // 基础信息补全
        basicInfo: {
          phonePrefix: '138',
          carrier: '中国移动',
          networkDuration: '8年',
          userLevel: '钻石会员',
          location: '广东深圳南山区',
          registrationArea: '广东省深圳市'
        },
        // 设备信息
        deviceInfo: {
          device: 'iPhone 14 Pro',
          devicePrice: '8000+元',
          screenTime: '日均6.5小时',
          learningAppTime: '日均45分钟',
          socialAppTime: '日均2.5小时',
          apps: ['微信', '抖音', '小红书', '淘宝', '作业帮', '猿辅导']
        },
        // 家庭背景
        familyBackground: {
          familyType: '核心家庭（三口之家）',
          childCount: 1,
          residence: '自购房120㎡',
          annualIncome: '50-80万',
          parentCareer: {
            father: '技术管理',
            mother: '企业管理'
          },
          parentEducation: {
            father: '本科',
            mother: '硕士'
          },
          car: '宝马5系'
        },
        // 消费能力
        consumptionAbility: {
          monthlySpend: '8000-12000元',
          educationSpend: '2000-3000元/月',
          diningLevel: '中高（人均150-300元）',
          brandPreference: '中高端品牌',
          creditLimit: '8万',
          hasMortgage: '有（15000元/月）',
          hasCarLoan: '有（5000元/月）'
        },
        // 兴趣爱好
        interests: {
          sports: ['健身房', '跑步', '瑜伽'],
          food: ['网红餐厅', '咖啡厅', '烘焙'],
          travel: ['亲子游', '每年2次长途'],
          shopping: ['品质生活', '智能家居', '儿童用品'],
          reading: ['育儿', '管理', '心理']
        },
        // 教育投入
        educationInvestment: {
          currentSpend: '2800元/月',
          onlineCourse: '1500元/月',
          offlineTraining: '1000元/月',
          tools: '500元/月',
          expectations: {
            short: '期中前进前15名',
            medium: '小升初进重点初中',
            long: '考入深圳四大名校'
          }
        },
        // 行为特征
        behaviorData: {
          searchKeywords: ['小学应用题技巧', '深圳重点初中', '小升初政策', '一对一辅导价格'],
          browsingHistory: ['数学提分班', '有道精品课', '深圳外国语', '护眼台灯'],
          interactionBehavior: ['观看数学视频', '参与打卡', '家委会讨论']
        },
        // 心理画像
        psychologicalProfile: {
          educationAnxiety: '中高',
          decisionStyle: '理性但易受环境影响',
          technologyAttitude: '开放，愿意尝试AI产品',
          timeWithChild: '每天1.5-2小时'
        },
        // 置信度评分
        confidenceScore: 0.94,
        // 标签
        tags: {
          behaviorTags: ['高消费能力', '教育重视', '科技接受度高', '活跃社交'],
          interestTags: ['品质生活', '亲子游', '健身运动', '网红美食'],
          consumptionTags: ['中高端消费', '品牌导向', '理性购买', '愿为教育付费'],
          riskTags: ['信息泄露敏感', '注重隐私', '需要信任建立']
        }
      }
    },
    {
      id: 'match',
      name: '广告匹配',
      description: '从广告库筛选最匹配的商业机会',
      output: {
        matchedAds: [
          {
            id: 1,
            advertiser: '小米',
            industry: '智能硬件-学习设备',
            product: '小米学习灯Pro',
            price: 699,
            matchScore: 96,
            image: '💡',
            recommended: true,
            features: ['护眼无频闪', '智能调光', 'APP监控学习'],
            description: '智能护眼台灯，为孩子提供最佳学习光线，保护视力从现在开始'
          },
          {
            id: 2,
            advertiser: 'Keep',
            industry: '运动健身-儿童体育',
            product: '儿童体适能课',
            price: 299,
            matchScore: 88,
            image: '🏃',
            recommended: false,
            features: ['专业教练指导', '趣味训练', '增高增强'],
            description: '帮助孩子科学运动，增强体质，缓解学习压力'
          },
          {
            id: 3,
            advertiser: '有道精品课',
            industry: '教育-学科培训',
            product: '应用题解题技巧专项课',
            price: 399,
            matchScore: 94,
            image: '📚',
            recommended: false,
            features: ['专项突破应用题', '审题四步法', '7天见效'],
            description: '针对应用题理解困难，提供系统化解题技巧训练'
          },
          {
            id: 4,
            advertiser: '奥佳华',
            industry: '健康产品-个护',
            product: '儿童护眼仪',
            price: 599,
            matchScore: 85,
            image: '👀',
            recommended: false,
            features: ['AI热敷按摩', '眼部放松', '可爱外观'],
            description: '缓解学习疲劳，保护孩子视力健康'
          },
          {
            id: 5,
            advertiser: '得力文具',
            industry: '文具用品-学习工具',
            product: '错题打印机套装',
            price: 299,
            matchScore: 82,
            image: '🖨️',
            recommended: false,
            features: ['蓝牙连接', '高清打印', '海量题库'],
            description: '快速整理错题，提高复习效率，让学习更高效'
          },
          {
            id: 6,
            advertiser: '学而思网校',
            industry: '教育-系统课程',
            product: '数学思维训练营',
            price: 2999,
            matchScore: 91,
            image: '🎓',
            recommended: false,
            features: ['清华名师授课', 'AI个性化学习', '提分显著'],
            description: '系统提升数学思维能力和解题技巧'
          }
        ]
      }
    },
    {
      id: 'creative',
      name: '广告创意生成',
      description: '为匹配的广告主生成个性化Banner',
      output: {
        // 示例图片
        exampleImage: {
          url: 'example_ad_creative.jpg',
          description: '广告创意实际例图'
        },
        adBanners: [
          {
            advertiser: '小米',
            adId: 1,
            recommended: true,
            banner: {
              headline: '护眼台灯选对了吗？',
              subheadline: '小米学习灯Pro，智能护眼新体验',
              body: '孩子每天学习数小时，视力保护刻不容缓！小米学习灯Pro，无频闪护眼，智能调光，让孩子在最佳光线下学习。',
              cta: '立即购买',
              image: '💡'
            },
            features: ['无频闪护眼', '智能调光', 'APP监控', '让孩子学习更专注']
          },
          {
            advertiser: 'Keep',
            adId: 2,
            recommended: false,
            banner: {
              headline: '学习累了？来运动一下吧！',
              subheadline: 'Keep儿童体适能课，科学运动促学习',
              body: '研究表明，运动后学习效率更高！Keep专业教练带孩子科学运动，增强体质，缓解学习压力，提升专注力！',
              cta: '免费体验',
              image: '🏃'
            },
            features: ['专业教练', '趣味训练', '增高增强', '缓解压力']
          },
          {
            advertiser: '有道精品课',
            adId: 3,
            recommended: false,
            banner: {
              headline: '轻松破解五年级数学难题！',
              subheadline: '有道精品课，专业解决应用题困难',
              body: '您的孩子是否为应用题发愁？参加零元体验课，掌握审题技巧，提升数学成绩！',
              cta: '立即体验',
              image: '📖'
            },
            features: ['0元试用', '独家技巧', '提升自信', '专家指导']
          },
          {
            advertiser: '奥佳华',
            adId: 4,
            recommended: false,
            banner: {
              headline: '保护孩子视力，从现在开始！',
              subheadline: '奥佳华儿童护眼仪，缓解学习疲劳',
              body: '孩子每天盯着书本，眼睛酸涩疲劳？奥佳华护眼仪，AI热敷按摩，15分钟缓解眼部疲劳，保护视力健康！',
              cta: '点击购买',
              image: '👀'
            },
            features: ['AI热敷', '眼部放松', '可爱外观', '安全材质']
          },
          {
            advertiser: '得力文具',
            adId: 5,
            recommended: false,
            banner: {
              headline: '错题整理神器！效率提升3倍！',
              subheadline: '得力错题打印机套装',
              body: '还在手动抄错题？太OUT了！得力错题打印机，一键打印整理错题，海量题库支持，让复习效率提升3倍！',
              cta: '查看详情',
              image: '🖨️'
            },
            features: ['蓝牙连接', '高清打印', '海量题库', '快速整理']
          },
          {
            advertiser: '学而思网校',
            adId: 6,
            recommended: false,
            banner: {
              headline: '清华名师带路，数学思维飞跃！',
              subheadline: '学而思网校，系统提升解题能力',
              body: '清华名师团队打造，AI个性化学习路径，让您的孩子数学成绩突飞猛进！',
              cta: '免费试听',
              image: '🎓'
            },
            features: ['清华名师', 'AI个性化', '无限回放', '班主任督学']
          }
        ]
      }
    },
    {
      id: 'sales',
      name: 'AI销售对话',
      description: '多轮对话完成销售转化',
      output: {
        // 销售风格设定
        salesStyle: {
          primaryStyle: '咨询式销售（Consultative Selling）',
          description: '以专业顾问身份，通过深度了解客户需求，提供个性化解决方案',
          tone: '专业、真诚、有耐心',
          approach: '先建立信任，再挖掘需求，最后推荐产品'
        },
        // 销售技能
        salesSkills: [
          {
            skill: '需求挖掘（Needs Discovery）',
            application: '通过开放式问题了解家长教育焦虑点和孩子具体问题'
          },
          {
            skill: '痛点共鸣（Pain Points）',
            application: '认同家长焦虑，分享相似案例，建立情感连接'
          },
          {
            skill: '方案展示（Solution Presentation）',
            application: '针对性介绍课程如何解决具体问题，强调效果'
          },
          {
            skill: '信任建立（Trust Building）',
            application: '展示师资背景、学员案例、口碑评价'
          },
          {
            skill: '异议处理（Objection Handling）',
            application: '理性回应价格、效果、时间等问题'
          },
          {
            skill: '促成技巧（Closing）',
            application: '强调0元试用降低决策门槛，适时促成'
          }
        ],
        // 基于客户画像的销售策略
        customerStrategy: {
          customerProfile: '企业中高管/高学历/高收入，注重品质和效果，价格敏感度中等',
          recommendedTactics: [
            '强调清华名师和名校背景，满足身份认同',
            '展示学员提分数据，满足效果需求',
            '提供0元试用，降低决策风险',
            '强调AI个性化学习，满足科技接受度高的特点',
            '避免过度推销，以专业顾问姿态沟通'
          ],
          talkingPoints: [
            '师资团队来自清华、北大等名校',
            '已帮助超过10万学生提升成绩',
            'AI精准诊断孩子薄弱点',
            '先体验再付费，不满意可退款'
          ]
        },
        conversation: [
          { speaker: 'AI', text: '王妈妈您好！我是您的一对一学习顾问。看到您关注孩子的应用题学习，我们这边有专门的课程可以帮助孩子快速提升。请问孩子现在几年级了呢？' },
          { speaker: 'User', text: '五年级，应用题特别差，考试总是丢很多分。' },
          { speaker: 'AI', text: '五年级确实是数学提升的关键期。请问孩子做应用题时，主要是读不懂题意，还是能读懂但不知道怎么列式计算呢？' },
          { speaker: 'User', text: '主要是读完题不知道怎么列式，尤其是行程问题、工程问题，一看到就懵。' },
          { speaker: 'AI', text: '我明白了！这其实是典型的数量关系建模能力不足。我们课程专门针对这个年龄段的应用题问题，有独特的"审题四步法"。您家孩子平时有用过其他学习APP吗？' },
          { speaker: 'User', text: '用作业帮，但就是直接给答案，孩子抄完还是不会。' },
          { speaker: 'AI', text: '您说得很对！作业帮主要解决"不会做"的问题，但我们课程是教孩子"怎么做"，培养解题思维。我们清华名师的课程已经帮助超过10万学生提升成绩了。而且现在有0元试听机会，我可以帮您预约一节体验课，您可以先感受一下再决定。' }
        ],
        estimatedConversion: '38-48%'
      }
    },
    {
      id: 'optimization',
      name: '优化分析',
      description: '全链路数据建模与反馈优化',
      output: {
        funnel: {
          impressions: 10000,
          clicks: 2500,
          landing: 1800,
          registration: 450,
          consultation: 320,
          payment: 125
        },
        kpis: {
          ctr: '25.00%',
          landingRate: '72.00%',
          registrationRate: '25.00%',
          consultationRate: '71.11%',
          conversionRate: '39.06%',
          overallCvr: '1.25%',
          cpa: '¥1200',
          roi: '149.92%'
        },
        suggestions: [
          '优化落地页加载速度，提升访问体验',
          '简化注册流程，减少用户流失',
          '增加咨询环节的话术培训，提升转化率'
        ],
        detailedAnalysis: {
          funnelAnalysis: {
            biggestDrop: '注册环节，流失率75%',
            reason: '注册流程繁琐，需要填写信息过多',
            recommendation: '简化注册流程，支持手机号一键登录'
          },
          userSegmentation: {
            highIntent: '已完成在线课程体验的用户，转化率45%',
            mediumIntent: '浏览过课程详情但未注册的用户，转化率15%',
            lowIntent: '仅曝光未点击的用户，转化率2%'
          },
          optimizationStrategy: {
            shortTerm: ['优化落地页', '简化注册流程', '提升咨询转化'],
            mediumTerm: ['A/B测试不同创意', '用户分层运营', '个性化推荐'],
            longTerm: ['建立用户生命周期管理', '优化整体转化路径', '提升用户LTV']
          }
        }
      }
    }
  ]
}

function App() {
  const [executedAgents, setExecutedAgents] = useState([])
  const [currentAgent, setCurrentAgent] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [generatedImages, setGeneratedImages] = useState({})

  useEffect(() => {
    if (isRunning && currentAgent === null) {
      setCurrentAgent('profile')
    }
  }, [isRunning])

  useEffect(() => {
    if (currentAgent && isRunning) {
      const agentIndex = sampleData.agents.findIndex(a => a.id === currentAgent)
      
      // Simulate agent execution
      const timer = setTimeout(() => {
        setExecutedAgents(prev => [...prev, currentAgent])
        
        // Move to next agent
        const nextIndex = agentIndex + 1
        if (nextIndex < sampleData.agents.length) {
          setCurrentAgent(sampleData.agents[nextIndex].id)
        } else {
          setCurrentAgent(null)
          setIsRunning(false)
        }
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [currentAgent, isRunning])

  const handleStartWorkflow = () => {
    setExecutedAgents([])
    setIsRunning(true)
    setCurrentAgent('profile')
  }

  const renderAgentOutput = (agent) => {
    switch (agent.id) {
      case 'profile':
        return (
          <div className="agent-output">
            <div className="output-section">
              <div className="output-title">📊 用户画像分析结果</div>
              <div className="output-grid">
                <div className="output-item">
                  <div className="output-item-label">认知水平</div>
                  <div className="output-item-value">{agent.output.cognitiveLevel}</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">学习阶段</div>
                  <div className="output-item-value">{agent.output.learningStage}</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">核心问题</div>
                  <div className="output-item-value">{agent.output.coreProblem}</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">短期需求</div>
                  <div className="output-item-value">{agent.output.shortTermNeed}</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">转化意向</div>
                  <div className="output-item-value">{agent.output.conversionIntent}/10</div>
                </div>
              </div>
              <div style={{marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                <div style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-purple)', marginBottom: '0.5rem'}}>详细分析</div>
                <div style={{fontSize: '0.875rem', lineHeight: '1.8', color: 'var(--text-primary)'}}>{agent.output.analysis}</div>
              </div>
            </div>
          </div>
        )
      
      case 'enrich':
        return (
          <div className="agent-output">
            <div className="output-section">
              <div className="output-title">🔗 多维度数据补全结果</div>
              <div className="output-grid">
                <div className="output-item">
                  <div className="output-item-label">运营商</div>
                  <div className="output-item-value">{agent.output.basicInfo.carrier} {agent.output.basicInfo.phonePrefix}号段</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">用户等级</div>
                  <div className="output-item-value">{agent.output.basicInfo.userLevel}</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">入网时长</div>
                  <div className="output-item-value">{agent.output.basicInfo.networkDuration}</div>
                </div>
                <div className="output-item">
                  <div className="output-item-label">地区</div>
                  <div className="output-item-value">{agent.output.basicInfo.location}</div>
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                <div className="output-title">📱 设备与行为</div>
                <div className="output-grid">
                  <div className="output-item">
                    <div className="output-item-label">设备</div>
                    <div className="output-item-value">{agent.output.deviceInfo.device}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">屏幕使用</div>
                    <div className="output-item-value">{agent.output.deviceInfo.screenTime}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">学习APP使用</div>
                    <div className="output-item-value">{agent.output.deviceInfo.learningAppTime}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">社交APP使用</div>
                    <div className="output-item-value">{agent.output.deviceInfo.socialAppTime}</div>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                <div className="output-title">👨‍👩‍👧 家庭背景</div>
                <div className="output-grid">
                  <div className="output-item">
                    <div className="output-item-label">家庭类型</div>
                    <div className="output-item-value">{agent.output.familyBackground.familyType}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">年收入</div>
                    <div className="output-item-value">{agent.output.familyBackground.annualIncome}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">居住情况</div>
                    <div className="output-item-value">{agent.output.familyBackground.residence}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">家长职业</div>
                    <div className="output-item-value">父{agent.output.familyBackground.parentCareer.father}/母{agent.output.familyBackground.parentCareer.mother}</div>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                <div className="output-title">💰 消费能力</div>
                <div className="output-grid">
                  <div className="output-item">
                    <div className="output-item-label">月均消费</div>
                    <div className="output-item-value">{agent.output.consumptionAbility.monthlySpend}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">教育支出</div>
                    <div className="output-item-value">{agent.output.consumptionAbility.educationSpend}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">信用额度</div>
                    <div className="output-item-value">{agent.output.consumptionAbility.creditLimit}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">品牌偏好</div>
                    <div className="output-item-value">{agent.output.consumptionAbility.brandPreference}</div>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                <div className="output-title">🎯 教育投入</div>
                <div className="output-grid">
                  <div className="output-item">
                    <div className="output-item-label">当前教育投入</div>
                    <div className="output-item-value">{agent.output.educationInvestment.currentSpend}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">短期目标</div>
                    <div className="output-item-value">{agent.output.educationInvestment.expectations.short}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">中期目标</div>
                    <div className="output-item-value">{agent.output.educationInvestment.expectations.medium}</div>
                  </div>
                  <div className="output-item">
                    <div className="output-item-label">长期目标</div>
                    <div className="output-item-value">{agent.output.educationInvestment.expectations.long}</div>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                <div className="output-title">🏷️ 用户标签</div>
                <div className="card-tags" style={{marginBottom: '0.75rem'}}>
                  <span className="tag tag-blue">高消费能力</span>
                  <span className="tag tag-purple">教育重视</span>
                  <span className="tag tag-green">科技接受度高</span>
                  <span className="tag tag-orange">活跃社交</span>
                </div>
                <div className="card-tags" style={{marginBottom: '0.75rem'}}>
                  <span style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginRight: '0.5rem'}}>兴趣:</span>
                  {agent.output.tags.interestTags.map((tag, idx) => (
                    <span key={idx} className="tag tag-purple">{tag}</span>
                  ))}
                </div>
                <div className="card-tags">
                  <span style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginRight: '0.5rem'}}>消费:</span>
                  {agent.output.tags.consumptionTags.map((tag, idx) => (
                    <span key={idx} className="tag tag-green">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div style={{marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', borderRadius: '8px', border: '2px solid var(--accent-green)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-green)'}}>置信度评分</div>
                    <div style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-green)'}}>{(agent.output.confidenceScore * 100).toFixed(0)}%</div>
                  </div>
                  <div style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>基于12个维度数据融合</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'match':
        return (
          <div className="agent-output">
            <div className="output-section">
              <div className="output-title">🎯 广告匹配结果 ({agent.output.matchedAds.length}个广告机会)</div>
              <div className="ad-grid">
                {agent.output.matchedAds.map((ad) => (
                  <div key={ad.id} className={`ad-card ${ad.recommended ? 'recommended' : ''}`}>
                    <div className="ad-image-container" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                      <div style={{fontSize: '4rem', opacity: 0.8}}>{ad.image}</div>
                      <div className="ad-industry-badge">{ad.industry}</div>
                    </div>
                    <div className="ad-content">
                      <div className="ad-advertiser">{ad.advertiser}</div>
                      <div className="ad-title">{ad.product}</div>
                      <div className="ad-description">{ad.description}</div>
                      <div className="ad-features">
                        {ad.features.map((feature, idx) => (
                          <div key={idx} className="ad-feature">
                            <span className="feature-icon">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="ad-match-score">
                        <div className="match-score">
                          <span className="score-value">{ad.matchScore}</span>
                          <span className="score-label">匹配度</span>
                        </div>
                        {ad.price > 0 && <div className="ad-price">¥{ad.price}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'creative':
        return (
          <div className="agent-output">
            {/* 示例图片展示 */}
            <div className="output-section">
              <div className="output-title">📷 广告创意实际例图</div>
              <div style={{
                marginTop: '1rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05))',
                borderRadius: '12px',
                border: '2px solid var(--accent-blue)',
                textAlign: 'center'
              }}>
                <div style={{marginBottom: '1rem'}}>
                  <img 
                    src={`/${agent.output.exampleImage.url}`} 
                    alt="广告创意示例图"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem',
                    background: 'white',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🖼️</div>
                    <div style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem'}}>
                      请将图片文件放置到 frontend/public 目录
                    </div>
                    <div style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
                      文件名: {agent.output.exampleImage.url}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginTop: '1rem'
                }}>
                  <strong>点击查看:</strong> {agent.output.exampleImage.url}
                </div>
              </div>
            </div>

            <div className="output-section">
              <div className="output-title">🎨 广告创意Banner生成</div>
              <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                {agent.output.adBanners.map((banner, idx) => (
                  <div key={idx} style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    border: banner.recommended ? '2px solid var(--accent-green)' : '1px solid var(--border-light)',
                    overflow: 'hidden',
                    boxShadow: banner.recommended ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'var(--shadow-sm)'
                  }}>
                    {banner.recommended && (
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textAlign: 'center'
                      }}>
                        🏆 推荐广告
                      </div>
                    )}
                    
                    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem', padding: '1.5rem'}}>
                      {/* Banner 图片 */}
                      <div style={{
                        width: '200px',
                        height: '150px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '5rem',
                        flexShrink: 0
                      }}>
                        {banner.banner.image}
                      </div>
                      
                      {/* Banner 文案 */}
                      <div style={{flex: 1}}>
                        <div style={{marginBottom: '0.75rem'}}>
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent-blue)',
                            fontWeight: '600',
                            marginBottom: '0.25rem'
                          }}>
                            {banner.advertiser}
                          </div>
                          <div style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem'
                          }}>
                            {banner.banner.headline}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.75rem'
                          }}>
                            {banner.banner.subheadline}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-primary)',
                            lineHeight: '1.6',
                            marginBottom: '1rem'
                          }}>
                            {banner.banner.body}
                          </div>
                          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem'}}>
                            {banner.features.map((feature, fIdx) => (
                              <span key={fIdx} style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(102, 126, 234, 0.1)',
                                color: 'var(--accent-purple)',
                                borderRadius: '12px',
                                fontWeight: '500'
                              }}>
                                {feature}
                              </span>
                            ))}
                          </div>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.625rem 1.5rem',
                            background: banner.recommended ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                          }}>
                            {banner.banner.cta}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'sales':
        return (
          <div className="agent-output">
            <div className="output-section">
              <div className="output-title">💬 AI销售对话策略</div>
              
              <div style={{marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05))', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '1rem'}}>
                <div style={{fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '0.5rem'}}>🎯 销售风格设定</div>
                <div style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem'}}>{agent.output.salesStyle.primaryStyle}</div>
                <div style={{fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>{agent.output.salesStyle.description}</div>
                <div style={{fontSize: '0.875rem', color: 'var(--text-primary)'}}>
                  <strong>沟通风格：</strong>{agent.output.salesStyle.tone} | <strong>沟通方式：</strong>{agent.output.salesStyle.approach}
                </div>
              </div>
              
              <div style={{marginTop: '1rem'}}>
                <div style={{fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.75rem'}}>🛠️ 销售技能库</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem'}}>
                  {agent.output.salesSkills.map((skill, idx) => (
                    <div key={idx} style={{padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                      <div style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--accent-green)', marginBottom: '0.25rem'}}>{skill.skill}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5'}}>{skill.application}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border-light)'}}>
                <div style={{fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.75rem'}}>👤 客户画像与销售策略</div>
                <div style={{marginBottom: '0.75rem'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem'}}>客户特征</div>
                  <div style={{fontSize: '0.875rem', color: 'var(--text-primary)'}}>{agent.output.customerStrategy.customerProfile}</div>
                </div>
                <div style={{marginBottom: '0.75rem'}}>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>推荐策略</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {agent.output.customerStrategy.recommendedTactics.map((tactic, idx) => (
                      <div key={idx} style={{fontSize: '0.875rem', color: 'var(--text-primary)', paddingLeft: '1rem', position: 'relative'}}>
                        <span style={{position: 'absolute', left: 0, color: 'var(--accent-blue)'}}>→</span>
                        {tactic}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>核心话术</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                    {agent.output.customerStrategy.talkingPoints.map((point, idx) => (
                      <span key={idx} style={{fontSize: '0.75rem', padding: '0.375rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="output-section">
              <div style={{fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.75rem'}}>💬 对话示例</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                {agent.output.conversation.map((msg, idx) => (
                  <div key={idx} className={`conversation-item ${msg.speaker.toLowerCase()}`}>
                    <div className="conversation-speaker">{msg.speaker === 'AI' ? '🤖 AI销售顾问' : '👤 家长'}</div>
                    <div className="conversation-text">{msg.text}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop: '1rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', borderRadius: '8px', border: '2px solid var(--accent-green)'}}>
                <div style={{fontSize: '1rem', fontWeight: '700', color: 'var(--accent-green)'}}>
                  📊 预估成交率: {agent.output.estimatedConversion}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'optimization':
        return (
          <div className="agent-output">
            <div className="output-section">
              <div className="output-title">📊 关键绩效指标</div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.ctr}</div>
                  <div className="kpi-label">点击率</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.landingRate}</div>
                  <div className="kpi-label">落地率</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.registrationRate}</div>
                  <div className="kpi-label">注册率</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.consultationRate}</div>
                  <div className="kpi-label">咨询率</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.conversionRate}</div>
                  <div className="kpi-label">成交率</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.overallCvr}</div>
                  <div className="kpi-label">整体转化率</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.cpa}</div>
                  <div className="kpi-label">获客成本</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-value">{agent.output.kpis.roi}</div>
                  <div className="kpi-label">投资回报率</div>
                  <div className="kpi-trend trend-up">📈 +15%</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            广告流量智能系统
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-value">{sampleData.agents.length}</div>
              <div className="stat-label">智能体</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{executedAgents.length}</div>
              <div className="stat-label">已完成</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{isRunning ? '⚡' : '✅'}</div>
              <div className="stat-label">{isRunning ? '运行中' : '就绪'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* User Info Section */}
        <div className="user-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">👤</span>
              用户信息
            </div>
          </div>
          
          <div className="user-grid">
            {/* 书籍信息放在最前面 */}
            <div className="user-card book-card">
              <div className="card-label">当前学习书籍</div>
              <div className="card-value">{sampleData.user.currentBook.name}</div>
              <div className="book-meta">
                <div className="book-meta-item">
                  <span className="book-meta-icon">🏢</span>
                  <span>{sampleData.user.currentBook.publisher}</span>
                </div>
                <div className="book-meta-item">
                  <span className="book-meta-icon">📖</span>
                  <span>{sampleData.user.currentBook.category} · {sampleData.user.currentBook.edition}</span>
                </div>
                <div className="book-meta-item">
                  <span className="book-meta-icon">📚</span>
                  <span>ISBN: {sampleData.user.currentBook.isbn}</span>
                </div>
              </div>
              <div className="book-price">¥{sampleData.user.currentBook.price}</div>
            </div>
            
            <div className="user-card">
              <div className="card-label">学生姓名</div>
              <div className="card-value">{sampleData.user.name}</div>
              <div className="card-tags">
                <span className="tag tag-blue">{sampleData.user.grade}</span>
                <span className="tag tag-purple">{sampleData.user.age}岁</span>
              </div>
            </div>
            
            <div className="user-card">
              <div className="card-label">薄弱知识点</div>
              <div className="card-tags">
                {sampleData.user.weakPoints.map((point, idx) => (
                  <span key={idx} className="tag tag-orange">{point}</span>
                ))}
              </div>
              <div className="card-label" style={{marginTop: '0.75rem'}}>近期成绩</div>
              <div className="card-value">{sampleData.user.scores.join(' → ')}</div>
            </div>
            
            <div className="user-card">
              <div className="card-label">家庭背景</div>
              <div className="card-value">{sampleData.user.parent}</div>
              <div className="card-tags">
                <span className="tag tag-green">{sampleData.user.educationInvestment}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Flow */}
        <div className="user-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">🔄</span>
              多智能体协作工作流
            </div>
            <button 
              className="action-button"
              onClick={handleStartWorkflow}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <span className="loading-spinner"></span>
                  执行中...
                </>
              ) : (
                <>
                  ▶ 开始执行
                </>
              )}
            </button>
          </div>
          
          <div className="agent-flow">
            {sampleData.agents.map((agent, index) => {
              const isExecuted = executedAgents.includes(agent.id)
              const isCurrent = currentAgent === agent.id
              
              return (
                <div key={agent.id} className={`agent-node ${isCurrent ? 'running' : ''} ${isExecuted ? 'completed' : ''}`}>
                  <div className="agent-header">
                    <div className="agent-info">
                      <div className="agent-icon">{AgentIcons[agent.id]}</div>
                      <div className="agent-details">
                        <h3>Agent {index + 1}: {agent.name}</h3>
                        <p>{agent.description}</p>
                      </div>
                    </div>
                    <div className={`agent-status ${isCurrent ? 'status-running' : isExecuted ? 'status-completed' : 'status-pending'}`}>
                      {isCurrent ? (
                        <>
                          <span className="loading-spinner"></span>
                          执行中
                        </>
                      ) : isExecuted ? (
                        '✓ 完成'
                      ) : (
                        '⏳ 等待'
                      )}
                    </div>
                  </div>
                  
                  {/* Always show output if executed or current */}
                  {(isExecuted || isCurrent) && (
                    renderAgentOutput(agent)
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Analysis (Only show when all agents completed) */}
        {executedAgents.length === sampleData.agents.length && (
          <div className="detailed-analysis">
            <div className="section-title" style={{marginBottom: '1.5rem'}}>
              <span className="section-icon">📈</span>
              详细分析总结
            </div>
            
            <div className="analysis-section">
              <div className="analysis-title">🔍 漏斗诊断与归因分析</div>
              <div className="analysis-content">
                <div className="analysis-item">
                  <div className="analysis-item-title">📉 最大流失节点</div>
                  <div className="analysis-item-content">
                    <div>注册环节，流失率75%</div>
                    <ul>
                      <li>注册流程繁琐，需要填写过多信息</li>
                      <li>用户需要输入手机号、验证码、密码等多步骤</li>
                      <li>页面加载慢，导致用户流失</li>
                    </ul>
                  </div>
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-item-title">🎯 关键成功因素</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>广告创意与用户需求高度匹配（94分）</li>
                      <li>价格策略合理，399元符合用户消费能力</li>
                      <li>0元试用降低用户决策门槛</li>
                      <li>咨询转化率较高（71.11%），说明销售话术有效</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analysis-section">
              <div className="analysis-title">👥 用户群体分析</div>
              <div className="analysis-content">
                <div className="analysis-item">
                  <div className="analysis-item-title">✅ 高转化用户特征</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>已完成在线课程体验的用户（转化率45%）</li>
                      <li>浏览时长超过3分钟的用户</li>
                      <li>主动咨询过的用户</li>
                      <li>家长职业为企业管理者的家庭</li>
                      <li>月均教育支出2000-3000元的家庭</li>
                    </ul>
                  </div>
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-item-title">⚠️ 低转化用户特征</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>仅曝光未点击的用户（转化率2%）</li>
                      <li>浏览课程详情但未注册的用户（转化率15%）</li>
                      <li>价格敏感度较高的用户</li>
                      <li>孩子成绩在及格线附近的用户</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analysis-section">
              <div className="analysis-title">🚀 优化策略（分阶段）</div>
              <div className="analysis-content">
                <div className="analysis-item">
                  <div className="analysis-item-title">⚡ 短期优化（1-2周）</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>简化注册流程，支持手机号一键登录</li>
                      <li>优化落地页加载速度，控制在2秒内</li>
                      <li>优化广告创意，提升CTR至30%以上</li>
                      <li>增加咨询环节的话术培训</li>
                    </ul>
                  </div>
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-item-title">📊 中期优化（1-3月）</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>A/B测试不同广告创意，找到最优方案</li>
                      <li>建立用户分层运营体系</li>
                      <li>实现个性化推荐，提升用户体验</li>
                      <li>建立用户行为预测模型</li>
                    </ul>
                  </div>
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-item-title">🎯 长期优化（3-6月）</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>建立完整的用户生命周期管理体系</li>
                      <li>优化整体转化路径，降低CPA至800元</li>
                      <li>提升用户LTV（生命周期价值）</li>
                      <li>构建智能投放系统，实现自动化优化</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analysis-section">
              <div className="analysis-title">📋 核心优化建议</div>
              <div className="analysis-content">
                <div className="analysis-item" style={{gridColumn: '1 / -1'}}>
                  <div className="analysis-item-title">💡 可执行方案</div>
                  <div className="analysis-item-content">
                    <div style={{marginBottom: '1rem'}}>
                      <strong>1. 优化注册流程</strong>
                      <ul>
                        <li>实现手机号一键登录，3秒内完成注册</li>
                        <li>预估效果：注册率提升50%，从25%提升至37.5%</li>
                      </ul>
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <strong>2. 优化落地页</strong>
                      <ul>
                        <li>采用CDN加速，页面加载时间控制在2秒内</li>
                        <li>优化页面布局，突出核心卖点和行动按钮</li>
                        <li>预估效果：落地率提升20%，从72%提升至86.4%</li>
                      </ul>
                    </div>
                    <div style={{marginBottom: '1rem'}}>
                      <strong>3. 优化广告创意</strong>
                      <ul>
                        <li>使用AI生成多套广告素材，进行A/B测试</li>
                        <li>突出"0元试用"和"7天见效"等核心卖点</li>
                        <li>预估效果：CTR提升30%，从25%提升至32.5%</li>
                      </ul>
                    </div>
                    <div>
                      <strong>4. 提升咨询转化</strong>
                      <ul>
                        <li>增加咨询顾问数量，确保30秒内响应</li>
                        <li>优化话术，强调效果保障和退款承诺</li>
                        <li>预估效果：咨询转化率提升15%，从71.11%提升至81.8%</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analysis-section">
              <div className="analysis-title">📊 预期改善效果</div>
              <div className="analysis-content">
                <div className="analysis-item">
                  <div className="analysis-item-title">🎯 关键指标改善</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li><strong>整体转化率：</strong>1.25% → 2.34%（+87%）</li>
                      <li><strong>CPA：</strong>¥1200 → ¥750（-37.5%）</li>
                      <li><strong>ROI：</strong>149.92% → 280%+（+87%）</li>
                      <li><strong>月度营收增长：</strong>基于125单提升至234单</li>
                    </ul>
                  </div>
                </div>
                
                <div className="analysis-item">
                  <div className="analysis-item-title">💰 收益测算</div>
                  <div className="analysis-item-content">
                    <ul>
                      <li>当前月度GMV：125单 × ¥399 = ¥49,875</li>
                      <li>优化后月度GMV：234单 × ¥399 = ¥93,366</li>
                      <li>月度增长：¥43,491（+87%）</li>
                      <li>年度增长：¥521,892</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="analysis-section">
              <div className="analysis-title">✅ 下一步行动计划</div>
              <div className="analysis-content">
                <div className="analysis-item" style={{gridColumn: '1 / -1'}}>
                  <div className="analysis-item-content">
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                      <div style={{padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
                        <strong style={{color: 'var(--accent-blue)'}}>Week 1:</strong> 
                        优化注册流程，实现一键登录
                      </div>
                      <div style={{padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                        <strong style={{color: 'var(--accent-purple)'}}>Week 2:</strong> 
                        优化落地页加载速度和布局
                      </div>
                      <div style={{padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>
                        <strong style={{color: 'var(--accent-green)'}}>Week 3:</strong> 
                        A/B测试新广告创意
                      </div>
                      <div style={{padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
                        <strong style={{color: 'var(--accent-orange)'}}>Week 4:</strong> 
                        培训销售团队，优化话术
                      </div>
                      <div style={{padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.2)'}}>
                        <strong style={{color: 'var(--accent-pink)'}}>Week 5-8:</strong> 
                        收集数据，持续迭代优化
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
