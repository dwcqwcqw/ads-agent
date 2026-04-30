"""
Vercel API 入口 - 广告流量智能系统
云梯构建了一套以用户认知驱动的多智能体协作系统
"""

import json
import os
from datetime import datetime
from typing import TypedDict, Dict, Any, List

from dotenv import load_dotenv
from openai import OpenAI
from langgraph.graph import StateGraph, END

# 加载环境变量
load_dotenv()

class MultiAgentState(TypedDict):
    """系统状态定义"""
    timestamp: str
    raw_data: Dict[str, Any]
    user_profile: Dict[str, Any]
    enriched_profile: Dict[str, Any]
    matched_ads: List[Dict[str, Any]]
    ad_creative: Dict[str, Any]
    sales_dialogue: Dict[str, Any]
    conversion_data: Dict[str, Any]
    optimization_report: Dict[str, Any]
    execution_log: List[Dict[str, str]]


def initialize_state(raw_data: Dict[str, Any]) -> MultiAgentState:
    """初始化系统状态"""
    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "raw_data": raw_data,
        "user_profile": {},
        "enriched_profile": {},
        "matched_ads": [],
        "ad_creative": {},
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


def agent_profile_analysis(state: MultiAgentState) -> MultiAgentState:
    """智能体1: 用户画像分析"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    raw_data = state["raw_data"]

    prompt = f"""
基于小学数学学习数据，深度分析并生成用户画像。
## 原始数据
{json.dumps(raw_data, ensure_ascii=False, indent=2)}

请从认知水平、学习阶段、核心问题、用户需求、转化意向等维度生成用户画像，以JSON格式输出。
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")

    try:
        profile = json.loads(result_text)
    except:
        profile = {"raw_analysis": result_text}

    state["user_profile"] = profile
    log_step(state, "用户画像分析", "完成")
    return state


def agent_data_enrichment(state: MultiAgentState) -> MultiAgentState:
    """智能体2: 数据补全"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    profile = state["user_profile"]

    external_data = {
        "basic_info": {"phone_prefix": "138", "运营商": "中国移动"},
        "consumption_ability": {"月均消费": "8000-12000元", "价格敏感度": "中等"},
        "education_investment": {"当前教育投入": "3000元/月"}
    }

    prompt = f"""
基于用户画像结合外部数据进行增强分析。
## 用户画像
{json.dumps(profile, ensure_ascii=False, indent=2)}
## 外部数据
{json.dumps(external_data, ensure_ascii=False, indent=2)}
以JSON格式输出增强后的画像。
"""

    response = client.chat.completions.create(
        model="gpt-4o",
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
    log_step(state, "数据补全", "完成")
    return state


def agent_ad_matching(state: MultiAgentState) -> MultiAgentState:
    """智能体3: 广告匹配"""
    profile = state["enriched_profile"]

    ad_pool = [
        {"ad_id": "AD001", "advertiser": "学而思网校", "product": "数学思维训练营", "price": 2999},
        {"ad_id": "AD002", "advertiser": "猿辅导", "product": "系统班课", "price": 2400},
        {"ad_id": "AD003", "advertiser": "科大讯飞", "product": "AI学习机", "price": 4999},
    ]

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt = f"""
基于用户画像匹配广告，输出Top 3广告及匹配理由，JSON格式。
## 画像
{json.dumps(profile, ensure_ascii=False, indent=2)}
## 广告池
{json.dumps(ad_pool, ensure_ascii=False, indent=2)}
"""

    response = client.chat.completions.create(
        model="gpt-4o",
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
    log_step(state, "广告匹配", f"匹配{len(matched_ads)}个广告")
    return state


def agent_ad_creative(state: MultiAgentState) -> MultiAgentState:
    """智能体4: 广告创意生成"""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    profile = state["enriched_profile"]
    primary_ad = state["matched_ads"][0] if state["matched_ads"] else {}

    prompt = f"""
生成广告创意素材：主标题(15字)、副标题(20字)、正文(50-80字)、卖点列表、行动按钮，JSON格式。
产品：{primary_ad.get('product', '数学提升课程')}
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
        creative = {"main_title": "数学提升课程", "body_text": result_text}

    state["ad_creative"] = creative
    log_step(state, "广告创意", "完成")
    return state


def agent_optimization(state: MultiAgentState) -> MultiAgentState:
    """智能体5: 优化分析"""
    conversion_data = {
        "impressions": 10000, "clicks": 2500, "landing": 1800,
        "registration": 450, "consultation": 320, "payment": 125
    }

    funnel_metrics = {
        "ctr": conversion_data["clicks"] / conversion_data["impressions"] * 100,
        "landing_rate": conversion_data["landing"] / conversion_data["clicks"] * 100,
        "overall_cvr": conversion_data["payment"] / conversion_data["impressions"] * 100
    }

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    prompt = f"""
基于转化漏斗数据生成优化建议。
## 数据
{json.dumps(conversion_data, ensure_ascii=False, indent=2)}
## 指标
{json.dumps(funnel_metrics, ensure_ascii=False, indent=2)}
以JSON格式输出优化建议。
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )

    result_text = response.choices[0].message.content.strip()
    result_text = result_text.replace("```json", "").replace("```", "")

    try:
        optimization = json.loads(result_text)
    except:
        optimization = {"suggestions": result_text}

    state["conversion_data"] = conversion_data
    state["optimization_report"] = optimization
    log_step(state, "优化分析", "完成")
    return state


def build_graph():
    """构建工作流图"""
    graph = StateGraph(MultiAgentState)
    graph.add_node("profile_analysis", agent_profile_analysis)
    graph.add_node("data_enrichment", agent_data_enrichment)
    graph.add_node("ad_matching", agent_ad_matching)
    graph.add_node("creative_generation", agent_ad_creative)
    graph.add_node("optimization", agent_optimization)

    graph.set_entry_point("profile_analysis")
    graph.add_edge("profile_analysis", "data_enrichment")
    graph.add_edge("data_enrichment", "ad_matching")
    graph.add_edge("ad_matching", "creative_generation")
    graph.add_edge("creative_generation", "optimization")
    graph.add_edge("optimization", END)

    return graph.compile()


def handler(request):
    """
    Vercel Serverless Function 入口
    """
    try:
        # 处理CORS
        if request.method == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                },
                "body": ""
            }

        if request.method != "POST":
            return {
                "statusCode": 405,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "只支持POST请求"})
            }

        # 解析请求体
        body = json.loads(request.body) if request.body else {}

        # 使用提供的测试数据或默认数据
        demo_data = body.get("data", {
            "phone": "138****1234",
            "student_info": {
                "name": "王小明",
                "grade": "小学五年级",
                "age": 11
            },
            "learning_data": {
                "weak_topics": ["应用题", "分数运算"],
                "recent_scores": {"期中考试": 72}
            }
        })

        # 初始化状态并执行工作流
        initial_state = initialize_state(demo_data)
        app = build_graph()
        result = app.invoke(initial_state)

        # 返回结果
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "success": True,
                "data": {
                    "user_profile": result["user_profile"],
                    "enriched_profile": result["enriched_profile"],
                    "matched_ads": result["matched_ads"],
                    "ad_creative": result["ad_creative"],
                    "optimization_report": result["optimization_report"],
                    "funnel_metrics": result["conversion_data"]
                },
                "execution_log": result["execution_log"]
            }, ensure_ascii=False)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "success": False,
                "error": str(e)
            })
        }
