"""
广告流量智能系统 - 多智能体协作平台
云梯构建了一套以用户认知驱动的多智能体协作系统

功能模块：
1. 用户画像分析智能体 - 基于学习数据生成用户认知模型
2. 数据补全智能体 - 结合外部数据源增强用户画像
3. 广告匹配智能体 - 实时识别用户意图并匹配广告
4. 广告生成智能体 - 动态生成个性化广告内容
5. AI销售智能体 - 多轮对话完成销售转化
6. 优化分析智能体 - 全链路数据建模与反馈优化
"""

import os
import json
import base64
from datetime import datetime
from typing import TypedDict, Dict, Any, List
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich import box
from langgraph.graph import StateGraph, END

# 加载环境变量
load_dotenv()

console = Console()

class MultiAgentState(TypedDict):
    """系统状态定义 - 管理整个流程的数据流转"""
    timestamp: str                           # 时间戳
    raw_data: Dict[str, Any]                 # 原始输入数据
    user_profile: Dict[str, Any]            # 用户画像
    enriched_profile: Dict[str, Any]         # 增强后的用户画像
    matched_ads: List[Dict[str, Any]]       # 匹配的广告列表
    ad_creative: Dict[str, Any]              # 广告创意素材
    ad_image_path: str                       # 广告图片保存路径
    sales_dialogue: Dict[str, Any]          # 销售对话记录
    conversion_data: Dict[str, Any]         # 转化漏斗数据
    optimization_report: Dict[str, Any]      # 优化分析报告
    execution_log: List[Dict[str, str]]      # 执行日志


def initialize_state(raw_data: Dict[str, Any]) -> MultiAgentState:
    """初始化系统状态"""
    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "raw_data": raw_data,
        "user_profile": {},
        "enriched_profile": {},
        "matched_ads": [],
        "ad_creative": {},
        "ad_image_path": "",
        "sales_dialogue": {},
        "conversion_data": {},
        "optimization_report": {},
        "execution_log": []
    }


def log_step(state: MultiAgentState, agent: str, message: str):
    """记录执行日志"""
    state["execution_log"].append({
        "agent": agent,
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "message": message
    })


def pretty_print_agent_output(agent_name: str, data: Dict[str, Any], icon: str = "🤖"):
    """美化打印智能体输出"""
    console.print()
    console.print(Panel(f"[bold cyan]{icon} {agent_name}[/bold cyan]", expand=False))
    console.print("─" * 60)
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                console.print(f"[yellow]{key}:[/yellow]")
                console.print(f"  {json.dumps(value, ensure_ascii=False, indent=2)}")
            else:
                console.print(f"[yellow]{key}:[/yellow] {value}")
    else:
        console.print(data)
    
    console.print()


def display_conversion_funnel(conversion_data: Dict[str, Any]):
    """展示转化漏斗"""
    table = Table(title="📊 转化漏斗分析", box=box.ROUNDED)
    table.add_column("阶段", style="cyan")
    table.add_column("数量", style="magenta")
    table.add_column("转化率", style="green")
    table.add_column("流失率", style="red")
    
    stages = ["曝光", "点击", "注册", "付费"]
    values = [conversion_data.get(stage, 0) for stage in stages]
    
    for i, (stage, value) in enumerate(zip(stages, values)):
        conversion_rate = f"{(value / values[0] * 100):.1f}%" if values[0] > 0 else "0%"
        drop_rate = f"{(1 - value / values[i-1]) * 100:.1f}%" if i > 0 and values[i-1] > 0 else "-"
        table.add_row(stage, str(value), conversion_rate, drop_rate if i > 0 else "-")
    
    console.print(table)


# =========================
# 智能体1: 用户画像分析
# =========================
def agent_profile_analysis(state: MultiAgentState) -> MultiAgentState:
    """用户画像分析智能体 - 刻画用户认知水平、学习阶段与潜在需求"""
    
    console.print(Panel.fit("[bold green]🔍 智能体1: 用户画像分析[/bold green]"))
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    raw_data = state["raw_data"]
    
    prompt = f"""
基于小学数学学习数据，深度分析并生成用户画像。

## 原始数据
{json.dumps(raw_data, ensure_ascii=False, indent=2)}

## 分析要求
请从以下维度生成详细的用户画像：

1. **认知水平评估**
   - 数学基础扎实程度
   - 逻辑思维发展水平
   - 具体到薄弱知识点

2. **学习阶段判断**
   - 当前学习进度
   - 知识掌握程度
   - 下一个学习目标

3. **核心问题诊断**
   - 最突出的学习障碍
   - 常见错误类型
   - 理解困难的概念

4. **用户需求分析**
   - 短期需求（考试提分）
   - 中期需求（能力提升）
   - 长期需求（思维培养）

5. **转化意向评估**
   - 付费意愿强度（1-10分）
   - 决策者特征（家长主导/孩子主动）
   - 购买时机判断

请以JSON格式输出，结构清晰，包含所有分析维度。
"""
    
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")
    
    try:
        profile = json.loads(result_text)
    except:
        profile = {"raw_analysis": result_text}
    
    state["user_profile"] = profile
    log_step(state, "用户画像分析", "生成用户认知画像完成")
    
    pretty_print_agent_output("用户画像分析结果", profile, "👤")
    
    return state


# =========================
# 智能体2: 数据补全
# =========================
def agent_data_enrichment(state: MultiAgentState) -> MultiAgentState:
    """数据补全智能体 - 结合外部数据源对画像进行验证与增强"""
    
    console.print(Panel.fit("[bold blue]🔍 智能体2: 数据补全与增强[/bold blue]"))
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    profile = state["user_profile"]
    
    # 模拟外部数据源（实际项目中会调用真实API）
    # 基于手机号进行多维度数据补全
    external_data = {
        # 1. 基础信息补全
        "basic_info": {
            "phone_prefix": "138",  # 移动号段
            "运营商": "中国移动",
            "号码入网时长": "8年",
            "用户等级": "钻石会员",
            "实名认证时间": "2016年",
            "常用联系人数量": 156,
            "常联系人群": ["同事", "家人", "家长群"],
            "手机号段地区": "广东深圳",
            "归属地": "广东省深圳市南山区"
        },
        
        # 2. 设备信息
        "device_info": {
            "device_type": "iPhone 14 Pro",
            "设备价格": "8000+元",
            "操作系统": "iOS 17",
            "屏幕使用时长": "日均6.5小时",
            "学习类APP使用时长": "日均45分钟",
            "社交类APP使用时长": "日均2.5小时",
            "短视频APP使用时长": "日均1.5小时",
            "购物类APP使用时长": "日均30分钟",
            "最近换机时间": "6个月前",
            "常用APP": ["微信", "抖音", "小红书", "淘宝", "京东", "作业帮", "小猿口算", "猿辅导"]
        },
        
        # 3. 位置和行为数据
        "location_behavior": {
            "常住地": "深圳市南山区",
            "工作地": "深圳市南山区科技园",
            "通勤方式": "地铁+步行",
            "通勤时长": "45分钟",
            "常去商圈": ["海岸城", "万象城", "南山书城"],
            "周末活动区域": ["深圳湾公园", "人才公园", "科技园附近"],
            "近期出行": ["广州", "珠海长隆", "厦门"],
            "常去场所": ["星巴克", "喜茶", "健身房", "亲子餐厅"]
        },
        
        # 4. 消费能力评估
        "consumption_ability": {
            "月均消费": "8000-12000元",
            "月均教育支出": "2000-3000元",
            "月均购物支出": "3000-5000元",
            "餐饮消费等级": "中高（人均150-300元）",
            "对在线教育接受度": "非常高",
            "价格敏感度": "中等",
            "品牌偏好": "中高端品牌",
            "消费决策速度": "快（通常当天决定）",
            "促销敏感度": "中等（关注但不一定等促销）",
            "支付方式": ["微信支付", "支付宝", "信用卡"],
            "信用额度": "8万",
            "是否有房贷": "有（房贷15000元/月）",
            "是否有车贷": "有（车贷5000元/月）"
        },
        
        # 5. 家庭结构
        "family_structure": {
            "家庭结构": "核心家庭（一家三口）",
            "孩子数量": 1,
            "孩子年龄": [11],
            "孩子年级": ["小学五年级"],
            "居住情况": "自购房（120平三居室）",
            "家庭年收入": "50-80万",
            "主要收入来源": "夫妻双方工资收入",
            "家长职业": {
                "父亲": "企业技术管理",
                "母亲": "企业管理者"
            },
            "家长学历": {
                "父亲": "本科",
                "母亲": "硕士"
            },
            "家长年龄": {
                "父亲": 38,
                "母亲": 36
            },
            "家庭用车": "宝马5系",
            "家庭保险配置": "全面（寿险+医疗+教育金）"
        },
        
        # 6. 社交网络
        "social_network": {
            "微信好友数": 856,
            "朋友圈活跃度": "中高（每周3-5条）",
            "加入微信群": ["公司群", "家委会群", "年级家长群", "兴趣群"],
            "家委会角色": "家委会成员",
            "KOL倾向": "中等（会分享育儿经验）",
            "信息获取渠道": ["小红书", "公众号", "朋友推荐", "抖音"]
        },
        
        # 7. 兴趣爱好
        "interests": {
            "运动健身": ["健身房锻炼", "跑步", "瑜伽"],
            "美食": ["网红餐厅", "咖啡厅", "烘焙"],
            "旅游": ["亲子游", "周边游", "每年2次长途旅行"],
            "娱乐": ["电影", "音乐会", "展览"],
            "阅读": ["育儿类", "管理类", "心理学"],
            "购物偏好": ["品质生活", "智能家居", "儿童用品", "护肤品"],
            "收藏爱好": ["手办", "乐高"]
        },
        
        # 8. 行为数据
        "behavior_data": {
            "搜索关键词": [
                "小学应用题技巧", "分数运算方法", "数学思维训练",
                "深圳重点初中排名", "小升初政策", "奥数培训",
                "儿童护眼台灯", "学习桌推荐", "一对一辅导价格",
                "儿童益智玩具", "青少年编程", "在线英语课"
            ],
            "浏览历史": [
                "数学提分班", "一对一辅导", "AI学习工具",
                "学而思网校", "猿辅导", "有道精品课",
                "深圳外国语学校", "深圳中学", "百合外国语",
                "儿童学习桌椅", "护眼台灯", "错题打印机"
            ],
            "互动行为": [
                "观看数学视频（日均3个）",
                "下载学习资料（周均2份）",
                "参与打卡活动（完成率80%）",
                "加入家长群讨论",
                "收藏课程页面",
                "分享育儿文章"
            ],
            "下单习惯": [
                "在线课程（倾向体验课后购买）",
                "学习工具（会购买高单价产品）",
                "图书（会购买教辅和课外读物）"
            ]
        },
        
        # 9. 媒体接触
        "media_exposure": {
            "常用社交平台": ["微信", "小红书", "抖音", "微博"],
            "内容偏好": ["育儿教育", "职场发展", "生活方式", "美食探店"],
            "关注KOL类型": ["教育专家", "名校名师", "职场妈妈", "生活博主"],
            "广告接受度": "中等偏高（对有价值的广告愿意点击）",
            "信息搜索习惯": "主动搜索为主，偶尔被种草"
        },
        
        # 10. 教育投入意愿
        "education_investment": {
            "当前教育投入": {
                "在线课程": "1500元/月",
                "线下培训": "1000元/月",
                "学习工具": "500元/月",
                "图书文具": "300元/月"
            },
            "已购买课程": [
                "猿辅导数学系统班（有效期至2025年6月）",
                "有道英语课（已过期）",
                "编程猫体验课（未续费）"
            ],
            "教育期望": {
                "短期": "期中/期末考试进前15名",
                "中期": "小升初进入重点初中重点班",
                "长期": "考入深圳四大名校高中"
            },
            "愿意为教育投入": "上不封顶，但注重性价比",
            "选择机构关注点": ["师资力量", "提分效果", "服务态度", "价格合理"]
        },
        
        # 11. 心理画像
        "psychological_profile": {
            "教育焦虑程度": "中高",
            "决策风格": "理性但易受环境影响",
            "信息获取能力": "强",
            "教育理念": "鸡娃但不盲从，注重方法和效率",
            "时间管理": "较好，能平衡工作和生活",
            "陪伴孩子时间": "每天1.5-2小时",
            "对科技产品态度": "开放，愿意尝试AI教育产品",
            "对传统教育态度": "认可但希望补充"
        },
        
        # 12. 风险偏好
        "risk_preference": {
            "投资风格": "稳健型",
            "理财配置": ["银行理财", "基金定投", "保险"],
            "消费观念": "愿意为品质付费，不追求最便宜",
            "尝试新产品意愿": "中等偏高（会先了解评价）"
        }
    }
    
    prompt = f"""
基于用户画像，结合外部多维度数据源进行深度数据补全与验证增强。

## 用户画像
{json.dumps(profile, ensure_ascii=False, indent=2)}

## 外部数据源（基于手机号的丰富数据）
{json.dumps(external_data, ensure_ascii=False, indent=2)}

## 补全任务
1. **数据交叉验证**：对比画像与外部数据的一致性
2. **画像增强**：补充外部数据中体现的新特征
3. **置信度评估**：评估画像的准确程度（考虑数据来源可靠性）
4. **标签完善**：添加行为标签、兴趣标签、消费标签、媒体标签
5. **预测补充**：基于数据推断潜在需求和购买时机
6. **风险提示**：识别可能的风险点和流失因素
7. **营销时机**：判断最佳触达时机和渠道

## 输出要求
返回增强后的完整用户画像，包含：
- 基础属性（年龄、年级、地区、职业等）
- 认知特征（学习水平、思维能力、兴趣倾向）
- 行为特征（APP使用、搜索习惯、消费习惯）
- 兴趣偏好（教育类、消费类、娱乐类、生活方式）
- 消费能力（支付意愿、消费习惯、品牌偏好）
- 家庭背景（家庭结构、家长角色、教育投入）
- 社交特征（社交圈层、影响力、信息获取渠道）
- 心理画像（焦虑程度、决策风格、价值观）
- 置信度评分（整体可信度、各维度可信度）
- 营销建议（触达渠道、时机、话术要点）

以JSON格式输出。
"""
    
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")
    
    try:
        enriched = json.loads(result_text)
    except:
        enriched = {"raw_enriched": result_text}
    
    enriched["external_data"] = external_data
    state["enriched_profile"] = enriched
    log_step(state, "数据补全", "画像增强与外部数据融合完成")
    
    pretty_print_agent_output("数据补全结果", enriched, "🔗")
    
    return state


# =========================
# 智能体3: 广告匹配
# =========================
def agent_ad_matching(state: MultiAgentState) -> MultiAgentState:
    """广告匹配智能体 - 从广告库中筛选最匹配的商业机会"""
    
    console.print(Panel.fit("[bold purple]🔍 智能体3: 广告匹配[/bold purple]"))
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    profile = state["enriched_profile"]
    
    # 广告主数据库（实际项目中从数据库加载）
    # 确保至少一半是非教辅类广告（生活、科技、娱乐等）
    ad_pool = [
        {
            "ad_id": "AD001",
            "advertiser": "学而思网校",
            "industry": "教育-学科培训",
            "product": "数学思维训练营",
            "price": 2999,
            "target_audience": ["小学3-6年级", "数学薄弱学生"],
            "key_selling_points": ["清华名师授课", "AI个性化学习", "提分显著"],
            "conversion_goal": "课程报名"
        },
        {
            "ad_id": "AD006",
            "advertiser": "网易有道",
            "industry": "教育硬件",
            "product": "有道词典笔X6",
            "price": 1499,
            "target_audience": ["K12学生", "需要英语学习工具"],
            "key_selling_points": ["AI口语评测", "离线使用", "海量词库"],
            "conversion_goal": "产品购买"
        },
        {
            "ad_id": "AD002",
            "advertiser": "猿辅导",
            "industry": "教育-在线课程",
            "product": "系统班课",
            "price": 2400,
            "target_audience": ["小学全年级", "想要系统提升"],
            "key_selling_points": ["完善课程体系", "班主任督学", "无限回放"],
            "conversion_goal": "课程购买"
        },
        {
            "ad_id": "AD007",
            "advertiser": "小米",
            "industry": "智能硬件",
            "product": "小米学习灯Pro",
            "price": 699,
            "target_audience": ["学生家长", "注重护眼"],
            "key_selling_points": ["护眼无频闪", "智能调光", "APP监控"],
            "conversion_goal": "产品购买"
        },
        {
            "ad_id": "AD003",
            "advertiser": "科大讯飞",
            "industry": "教育硬件",
            "product": "AI学习机T20",
            "price": 4999,
            "target_audience": ["K12全学段", "注重硬件性能"],
            "key_selling_points": ["AI精准学", "护眼屏幕", "家长管控"],
            "conversion_goal": "产品购买"
        },
        {
            "ad_id": "AD008",
            "advertiser": "得力文具",
            "industry": "文具用品",
            "product": "错题打印机套装",
            "price": 299,
            "target_audience": ["学生", "需要整理错题"],
            "key_selling_points": ["蓝牙连接", "高清打印", "海量题库"],
            "conversion_goal": "产品购买"
        },
        {
            "ad_id": "AD004",
            "advertiser": "有道精品课",
            "industry": "教育-技巧课",
            "product": "应用题解题技巧",
            "price": 399,
            "target_audience": ["小学4-6年级", "应用题困难"],
            "key_selling_points": ["专项突破", "方法论讲解", "实战练习"],
            "conversion_goal": "课程购买"
        },
        {
            "ad_id": "AD009",
            "advertiser": "奥佳华",
            "industry": "健康产品",
            "product": "儿童护眼仪",
            "price": 599,
            "target_audience": ["学生家长", "关注视力保护"],
            "key_selling_points": ["AI热敷", "眼部放松", "可爱外观"],
            "conversion_goal": "产品购买"
        },
        {
            "ad_id": "AD005",
            "advertiser": "洪恩教育",
            "industry": "教育-趣味学习",
            "product": "数学启蒙课",
            "price": 899,
            "target_audience": ["小学1-3年级", "培养兴趣"],
            "key_selling_points": ["游戏化学习", "趣味性强", "循序渐进"],
            "conversion_goal": "课程订阅"
        },
        {
            "ad_id": "AD010",
            "advertiser": "Keep",
            "industry": "运动健身",
            "product": "儿童体适能课",
            "price": 299,
            "target_audience": ["6-12岁儿童", "需要体育锻炼"],
            "key_selling_points": ["专业教练", "趣味训练", "增高增强"],
            "conversion_goal": "课程订阅"
        }
    ]
    
    prompt = f"""
基于增强后的用户画像，从广告池中选择最匹配的广告机会。

## 用户画像
{json.dumps(profile, ensure_ascii=False, indent=2)}

## 广告池
{json.dumps(ad_pool, ensure_ascii=False, indent=2)}

## 匹配策略
1. **需求匹配度**：广告能否解决用户核心问题
2. **价格匹配度**：广告价格与用户消费能力是否匹配
3. **时机成熟度**：用户当前是否处于最佳购买时机
4. **竞争强度**：同类广告的竞争优势
5. **转化可能性**：从曝光到成交的预估概率

## 输出要求
请选择Top 3最匹配的广告，并为每个广告提供：
- 匹配度评分（0-100分）
- 匹配理由
- 预估转化率
- 推荐优先级（1、2、3）

以JSON格式输出，包含ad_matches数组。
"""
    
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")
    
    try:
        match_result = json.loads(result_text)
        matched_ads = match_result.get("ad_matches", ad_pool[:3])
    except:
        matched_ads = ad_pool[:3]
    
    state["matched_ads"] = matched_ads
    log_step(state, "广告匹配", f"匹配到{len(matched_ads)}个广告机会")
    
    # 展示匹配结果
    console.print()
    console.print(Panel("[bold purple]🎯 广告匹配结果[/bold purple]"))
    
    table = Table(box=box.ROUNDED)
    table.add_column("优先级", style="cyan")
    table.add_column("广告主", style="magenta")
    table.add_column("产品", style="green")
    table.add_column("价格", style="yellow")
    table.add_column("匹配度", style="blue")
    
    for i, ad in enumerate(matched_ads[:3], 1):
        score = ad.get("match_score", 85)
        table.add_row(
            str(i),
            ad.get("advertiser", "未知"),
            ad.get("product", "未知"),
            f"¥{ad.get('price', 0)}",
            f"{score}分"
        )
    
    console.print(table)
    console.print()
    
    return state


# =========================
# 智能体4: 广告生成
# =========================
def agent_ad_creative(state: MultiAgentState) -> MultiAgentState:
    """广告生成智能体 - 动态生成个性化广告创意内容"""
    
    console.print(Panel.fit("[bold orange]🔍 智能体4: 广告创意生成[/bold orange]"))
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    profile = state["enriched_profile"]
    matched_ads = state["matched_ads"]
    
    # 选择最匹配的广告
    primary_ad = matched_ads[0] if matched_ads else {}
    
    prompt = f"""
基于用户画像和匹配的广告，生成极具吸引力的广告创意素材。

## 用户画像（关键特征）
- 认知水平: {profile.get('cognitive_level', '需要了解')}
- 核心问题: {profile.get('core_problems', '学习困难')}
- 学习阶段: {profile.get('learning_stage', '五年级')}
- 转化意向: {profile.get('conversion_intent', '需要提升')}
- 消费能力: {profile.get('consumption_power', '中高')}

## 推荐广告
- 产品: {primary_ad.get('product', '数学提升课程')}
- 广告主: {primary_ad.get('advertiser', '知名教育机构')}
- 价格: ¥{primary_ad.get('price', 0)}
- 卖点: {', '.join(primary_ad.get('key_selling_points', []))}

## 创意要求
生成以下素材：

1. **主标题**（15字以内，超级吸引人）
   - 直击痛点
   - 唤起紧迫感
   - 突出效果

2. **副标题**（20字以内）
   - 补充价值
   - 建立信任

3. **正文文案**（50-80字）
   - 场景化描述
   - 情感共鸣
   - 行动号召

4. **卖点列表**（3-5个）
   - 简短有力
   - 差异化表达

5. **图片描述**（用于AI生成图片）
   - 场景化画面
   - 色彩搭配
   - 人物表情

6. **行动按钮文案**
   - 引导点击

以JSON格式输出，包含所有创意元素。
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.9
    )
    
    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")
    
    try:
        creative = json.loads(result_text)
    except:
        creative = {"raw_creative": result_text}
    
    # 添加示例图片（实际例图）- 本地文件已存在
    example_image_path = "example_ad_creative.jpg"
    example_image_url = "https://pic0.sucaisucai.com/05/80/05880560_2.jpg"
    creative["example_image_url"] = example_image_url
    creative["example_image_local_path"] = example_image_path
    
    # 检查本地图片是否存在
    import os
    if os.path.exists(example_image_path):
        console.print(f"[green]✓[/green] 已加载示例图片: {example_image_path}")
        console.print(f"[cyan]📷 图片大小: {os.path.getsize(example_image_path) / 1024:.1f} KB[/cyan]")
        state["example_image_local_path"] = example_image_path
    else:
        console.print(f"[yellow]⚠[/yellow] 示例图片文件不存在，将从URL加载")
        console.print(f"[cyan]🔗[/cyan] {example_image_url}")
        state["example_image_local_path"] = ""
    
    # 生成AI图片
    image_prompt = creative.get("image_description", "一个小学生在认真学习数学，脸上露出自信的笑容")
    
    try:
        with console.status("[bold yellow]🎨 AI正在生成广告图片...[/bold yellow]"):
            image_response = client.images.generate(
                model="dall-e-3",
                prompt=image_prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
        
        image_url = image_response.data[0].url
        console.print(f"[green]✓[/green] 图片生成成功")
        
        # 保存图片URL（实际项目中会下载到本地）
        image_path = f"ad_creative_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        creative["generated_image_url"] = image_url
        creative["image_prompt"] = image_prompt
        
    except Exception as e:
        console.print(f"[red]✗[/red] 图片生成失败: {str(e)}")
        image_path = ""
        creative["generated_image_url"] = ""
    
    state["ad_creative"] = creative
    state["ad_image_path"] = image_path
    state["example_image_url"] = example_image_url  # 保存到state中
    log_step(state, "广告创意生成", "个性化广告创意生成完成")
    
    # 展示广告创意（包括示例图片）
    console.print()
    console.print(Panel.fit("[bold orange]🎨 广告创意素材[/bold orange]"))
    console.print("─" * 60)
    console.print(f"[yellow]主标题:[/yellow] {creative.get('main_title', creative.get('标题', 'AI生成标题'))}")
    console.print(f"[yellow]副标题:[/yellow] {creative.get('subtitle', creative.get('副标题', 'AI生成副标题'))}")
    console.print()
    console.print("[yellow]正文文案:[/yellow]")
    console.print(f"  {creative.get('body_text', creative.get('正文', creative.get('正文文案', '')))}")
    console.print()
    
    # 展示示例图片信息（更醒目的显示）
    console.print()
    console.print(Panel.fit("[bold cyan]📷 广告创意实际例图[/bold cyan]"))
    console.print(f"[green]▶ 示例图片:[/green] {example_image_url}")
    console.print("[dim]（点击上方链接查看实际广告创意参考图）[/dim]")
    console.print()
    
    # 展示卖点
    selling_points = creative.get('selling_points', creative.get('卖点', []))
    if selling_points:
        console.print("[yellow]核心卖点:[/yellow]")
        for i, point in enumerate(selling_points[:5], 1):
            if isinstance(point, dict):
                console.print(f"  {i}. {point.get('卖点', str(point))}")
            else:
                console.print(f"  {i}. {point}")
        console.print()
    
    # 展示行动按钮
    cta = creative.get('cta', creative.get('行动按钮', creative.get('call_to_action', '')))
    if cta:
        console.print(f"[yellow]行动按钮:[/yellow] {cta}")
        console.print()
    
    return state


# =========================
# 智能体5: AI销售
# =========================
def agent_ai_sales(state: MultiAgentState) -> MultiAgentState:
    """AI销售智能体 - 通过多轮对话完成需求引导与成交转化"""
    
    console.print(Panel.fit("[bold red]🔍 智能体5: AI销售对话[/bold red]"))
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    profile = state["enriched_profile"]
    creative = state["ad_creative"]
    
    # 模拟真实销售对话
    sales_scenario = {
        "user_info": {
            "孩子年级": profile.get("learning_stage", "五年级"),
            "学习问题": profile.get("core_problems", ["应用题困难"]),
            "家长期望": profile.get("family_background", {}).get("期望目标", "提升成绩")
        },
        "product": {
            "名称": creative.get("main_title", "数学提升课程"),
            "价格": "¥2999",
            "核心卖点": creative.get("selling_points", [])
        }
    }
    
    prompt = f"""
模拟一场真实的AI销售对话场景。

## 用户信息
{json.dumps(sales_scenario["user_info"], ensure_ascii=False, indent=2)}

## 产品信息
{json.dumps(sales_scenario["product"], ensure_ascii=False, indent=2)}

## 对话场景
家长通过广告点击进入，现在需要AI销售进行：

1. **开场白**（建立信任）
   - 称呼家长
   - 肯定孩子情况
   - 引入话题

2. **需求挖掘**（3-5轮问答）
   - 了解孩子具体困难
   - 询问学习习惯
   - 探询期望目标
   - 了解之前尝试的方法

3. **产品介绍**（针对性强）
   - 方案如何解决痛点
   - 展示独特优势
   - 提供成功案例

4. **异议处理**
   - 价格异议："2999有点贵"
   - 效果异议："真的能提分吗"
   - 信任异议："没听过这个机构"

5. **成交促成**
   - 优惠方案
   - 限时活动
   - 零风险承诺
   - 行动号召

6. **对话总结**
   - 成交率预测
   - 关键决策因素
   - 下一步跟进建议

## 输出要求
生成完整的对话脚本，包含：
- 对话轮次（User / AI）
- 每轮回复内容
- 情感色彩标注
- 成交概率评估

以JSON格式输出。
"""
    
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")
    
    try:
        dialogue = json.loads(result_text)
        # 如果返回的是list，转换为dict
        if isinstance(dialogue, list):
            dialogue = {"dialogue": dialogue}
    except:
        dialogue = {"dialogue": [{"speaker": "AI", "content": result_text}]}
    
    # 添加销售分析
    dialogue["sales_analysis"] = {
        "estimated_conversion_rate": "35-45%",
        "key_decision_factors": [
            "价格合理性",
            "效果可感知性",
            "机构可信度",
            "时间投入成本"
        ],
        "recommended_follow_up": "3天内再次联系，重点强调效果保障"
    }
    
    state["sales_dialogue"] = dialogue
    log_step(state, "AI销售", "销售对话流程完成")
    
    # 展示销售对话（简化版）
    console.print()
    console.print(Panel("[bold red]💬 AI销售对话示例[/bold red]"))
    
    dialogue_list = dialogue.get("dialogue", [])
    if isinstance(dialogue_list, list):
        dialogue_preview = dialogue_list[:5]  # 只展示前5轮
        for i, turn in enumerate(dialogue_preview, 1):
            if isinstance(turn, dict):
                speaker = turn.get("speaker", "AI")
                content = turn.get("content", "")
            else:
                speaker = "AI"
                content = str(turn)
            console.print(f"[cyan]{i}. [{speaker}][/cyan] {content}")
            console.print()
    
    console.print(Panel.fit(f"[green]预估成交率: {dialogue['sales_analysis']['estimated_conversion_rate']}[/green]"))
    
    return state


# =========================
# 智能体6: 优化分析
# =========================
def agent_optimization(state: MultiAgentState) -> MultiAgentState:
    """优化分析智能体 - 全链路数据建模与反馈优化"""
    
    console.print(Panel.fit("[bold green]🔍 智能体6: 优化分析[/bold green]"))
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # 模拟转化漏斗数据（实际项目中从数据仓库获取）
    conversion_data = {
        "impressions": 10000,      # 曝光
        "clicks": 2500,            # 点击
        "landing": 1800,           # 落地页访问
        "registration": 450,      # 注册
        "consultation": 320,       # 咨询
        "payment": 125,            # 付款
        "revenue": 374875,         # 营收（元）
        "cost": 150000,           # 成本（元）
        "period": "2024-01-01 to 2024-01-31"
    }
    
    # 计算漏斗指标
    funnel_metrics = {
        "ctr": conversion_data["clicks"] / conversion_data["impressions"] * 100,
        "landing_rate": conversion_data["landing"] / conversion_data["clicks"] * 100,
        "registration_rate": conversion_data["registration"] / conversion_data["landing"] * 100,
        "consultation_rate": conversion_data["consultation"] / conversion_data["registration"] * 100,
        "conversion_rate": conversion_data["payment"] / conversion_data["consultation"] * 100,
        "overall_cvr": conversion_data["payment"] / conversion_data["impressions"] * 100,
        "cpa": conversion_data["cost"] / conversion_data["payment"],
        "roi": (conversion_data["revenue"] - conversion_data["cost"]) / conversion_data["cost"] * 100
    }
    
    prompt = f"""
基于全链路转化数据，进行深度优化分析并提供 actionable 的优化建议。

## 转化漏斗数据
{json.dumps(conversion_data, ensure_ascii=False, indent=2)}

## 漏斗指标
{json.dumps(funnel_metrics, ensure_ascii=False, indent=2)}

## 用户画像（用于针对性优化）
{json.dumps(state["enriched_profile"], ensure_ascii=False, indent=2)}

## 分析任务

1. **漏斗诊断**
   - 找出最大流失节点
   - 分析流失原因
   - 对比行业基准

2. **归因分析**
   - 各环节贡献度
   - 关键成功因素
   - 主要阻碍因素

3. **用户群体分析**
   - 高转化用户特征
   - 低转化用户特征
   - 差异化运营建议

4. **优化建议**（每个环节）
   - 曝光阶段：如何提升CTR
   - 点击阶段：如何提升落地率
   - 注册阶段：如何降低门槛
   - 咨询阶段：如何提升意愿
   - 付款阶段：如何促成成交

5. **效果预测**
   - 优化后预期提升
   - ROI改善预测

6. **优先级排序**
   - 快速见效的优化
   - 长期布局的优化

以JSON格式输出完整的优化报告。
"""
    
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": prompt}]
    )
    
    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")
    
    try:
        optimization = json.loads(result_text)
    except:
        optimization = {"raw_optimization": result_text}
    
    optimization["funnel_metrics"] = funnel_metrics
    optimization["raw_data"] = conversion_data
    
    state["conversion_data"] = conversion_data
    state["optimization_report"] = optimization
    log_step(state, "优化分析", "全链路优化分析完成")
    
    # 展示转化漏斗
    display_conversion_funnel(conversion_data)
    
    # 展示关键指标
    console.print()
    metrics_table = Table(title="📈 关键绩效指标", box=box.ROUNDED)
    metrics_table.add_column("指标", style="cyan")
    metrics_table.add_column("数值", style="magenta")
    metrics_table.add_column("说明", style="green")
    
    metrics_table.add_row("点击率 (CTR)", f"{funnel_metrics['ctr']:.2f}%", "曝光到点击")
    metrics_table.add_row("落地率", f"{funnel_metrics['landing_rate']:.2f}%", "点击到访问")
    metrics_table.add_row("注册率", f"{funnel_metrics['registration_rate']:.2f}%", "访问到注册")
    metrics_table.add_row("咨询率", f"{funnel_metrics['consultation_rate']:.2f}%", "注册到咨询")
    metrics_table.add_row("成交率", f"{funnel_metrics['conversion_rate']:.2f}%", "咨询到付款")
    metrics_table.add_row("整体转化率", f"{funnel_metrics['overall_cvr']:.2f}%", "曝光到成交")
    metrics_table.add_row("获客成本 (CPA)", f"¥{funnel_metrics['cpa']:.2f}", "每次获客成本")
    metrics_table.add_row("投资回报率 (ROI)", f"{funnel_metrics['roi']:.2f}%", "投入产出比")
    
    console.print(metrics_table)
    console.print()
    
    # 展示优化建议
    suggestions = optimization.get("optimization_suggestions", [])
    if suggestions and isinstance(suggestions, list):
        console.print(Panel("[bold green]💡 优化建议[/bold green]"))
        for i, suggestion in enumerate(suggestions[:5], 1):
            if isinstance(suggestion, dict):
                console.print(f"{i}. {suggestion.get('建议', str(suggestion))}")
            else:
                console.print(f"{i}. {suggestion}")
        console.print()
    elif suggestions:
        console.print(Panel("[bold green]💡 优化建议[/bold green]"))
        console.print(str(suggestions)[:500])
        console.print()
    
    return state


# =========================
# 构建LangGraph工作流
# =========================
def build_multi_agent_graph():
    """构建多智能体协作图"""
    
    graph = StateGraph(MultiAgentState)
    
    # 添加所有智能体节点
    graph.add_node("profile_analysis", agent_profile_analysis)
    graph.add_node("data_enrichment", agent_data_enrichment)
    graph.add_node("ad_matching", agent_ad_matching)
    graph.add_node("creative_generation", agent_ad_creative)
    graph.add_node("sales_conversation", agent_ai_sales)
    graph.add_node("optimization", agent_optimization)
    
    # 设置入口点
    graph.set_entry_point("profile_analysis")
    
    # 定义工作流顺序
    graph.add_edge("profile_analysis", "data_enrichment")
    graph.add_edge("data_enrichment", "ad_matching")
    graph.add_edge("ad_matching", "creative_generation")
    graph.add_edge("creative_generation", "sales_conversation")
    graph.add_edge("sales_conversation", "optimization")
    graph.add_edge("optimization", END)
    
    return graph.compile()


# =========================
# 执行主程序
# =========================
def main():
    """主程序入口"""
    
    console.print(Panel.fit(
        "[bold cyan]🎯[/bold cyan] [bold white]广告流量智能系统[/bold white] - "
        "[bold green]多智能体协作平台[/bold green]\n"
        "[dim]云梯构建了一套以用户认知驱动的多智能体协作系统[/dim]",
        box=box.DOUBLE
    ))
    
    console.print()
    console.print("[bold yellow]⚠️  注意事项:[/bold yellow]")
    console.print("• 系统将依次执行6个智能体")
    console.print("• 每个智能体的输出将详细展示")
    console.print("• 整个流程预计需要2-5分钟")
    console.print("• 请确保网络连接正常")
    console.print()
    
    # 演示数据
    demo_data = {
        "phone": "138****1234",
        "student_info": {
            "name": "王小明",
            "grade": "小学五年级",
            "age": 11,
            "gender": "男"
        },
        "learning_data": {
            "weak_topics": ["应用题", "分数运算", "几何图形"],
            "recent_scores": {
                "期中考试": 72,
                "月考1": 68,
                "月考2": 75
            },
            "homework_errors": [
                "应用题理解偏差",
                "分数加减法错误",
                "单位换算失误"
            ]
        },
        "dialogue_history": [
            "孩子应用题总是看不懂题意",
            "分数那章学得很吃力",
            "几何题不知道怎么画辅助线"
        ],
        "parent_concerns": [
            "希望快速提升数学成绩",
            "面临小升初压力",
            "愿意投入教育资源"
        ]
    }
    
    console.print(Panel.fit("[bold cyan]📝 输入数据[/bold cyan]"))
    console.print(json.dumps(demo_data, ensure_ascii=False, indent=2))
    console.print()
    
    # 初始化状态
    initial_state = initialize_state(demo_data)
    
    # 构建并执行图
    app = build_multi_agent_graph()
    
    console.print(Panel.fit("[bold green]🚀 开始执行多智能体协作流程[/bold green]"))
    console.print()
    
    try:
        # 执行工作流
        result = app.invoke(initial_state)
        
        # 展示执行日志
        console.print()
        console.print(Panel.fit("[bold green]✅ 执行完成[/bold green]"))
        
        log_table = Table(title="📋 执行日志", box=box.ROUNDED)
        log_table.add_column("时间", style="cyan")
        log_table.add_column("智能体", style="magenta")
        log_table.add_column("状态", style="green")
        
        for log in result["execution_log"]:
            log_table.add_row(log["timestamp"], log["agent"], "✓ 完成")
        
        console.print(log_table)
        console.print()
        
        # 最终总结
        console.print(Panel.fit(
            "[bold yellow]🎉 系统运行成功！[/bold yellow]\n\n"
            f"• 用户画像: {len(result['user_profile'])} 个维度\n"
            f"• 数据增强: 完成外部数据融合\n"
            f"• 广告匹配: {len(result['matched_ads'])} 个机会\n"
            f"• 创意生成: 标题+文案+图片\n"
            f"• 销售对话: 全流程脚本\n"
            f"• 优化建议: 可执行方案",
            box=box.ROUNDED
        ))
        
        # 展示示例图片
        if result.get('example_image_url'):
            console.print()
            console.print(Panel.fit("[bold cyan]📷 广告创意示例图片[/bold cyan]"))
            console.print(f"[green]▶ 示例图片:[/green] {result['example_image_url']}")
            if result.get('example_image_local_path'):
                console.print(f"[green]▶ 本地路径:[/green] {result['example_image_local_path']}")
                # 自动打开图片
                import subprocess
                import platform
                try:
                    if platform.system() == "Darwin":  # macOS
                        subprocess.run(["open", result['example_image_local_path']])
                        console.print("[green]✓[/green] 已自动打开示例图片")
                    elif platform.system() == "Windows":
                        subprocess.run(["start", "", result['example_image_local_path']], shell=True)
                        console.print("[green]✓[/green] 已自动打开示例图片")
                    else:
                        subprocess.run(["xdg-open", result['example_image_local_path']])
                        console.print("[green]✓[/green] 已自动打开示例图片")
                except Exception as e:
                    console.print(f"[yellow]⚠[/yellow] 无法自动打开图片，请手动打开: {result['example_image_local_path']}")
            console.print("[dim]（点击上方链接查看实际广告创意参考图）[/dim]")
        
        return result
        
    except Exception as e:
        console.print(Panel.fit(
            f"[bold red]❌ 执行出错: {str(e)}[/bold red]\n\n"
            "请检查:\n"
            "1. OpenAI API Key 是否配置正确\n"
            "2. 网络连接是否正常\n"
            "3. 依赖包是否完整安装",
            box=box.ROUNDED
        ))
        raise


if __name__ == "__main__":
    main()
