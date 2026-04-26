export const SECTORS = [
  '航空 ✈️',
  '酒店 🏨',
  '医疗防护 🏥',
  '云办公 💻',
  '游戏娱乐 🎮',
  '电商 🛒',
] as const

export type Sector = (typeof SECTORS)[number]

export interface SectorNewsItem {
  headline: string
  summary: string
  impact: string
  sourceTitle: string
  sourceUrl: string
  sourceDate: string
}

export interface QuarterNews {
  id: number
  label: string
  title: string
  period: string
  marketPulse: string
  decisionHint: string
  highlights: string[]
  sectors: Record<Sector, SectorNewsItem>
}

export const SECTOR_NAMES: Record<Sector, string> = {
  '航空 ✈️': '航空',
  '酒店 🏨': '酒店',
  '医疗防护 🏥': '医疗防护',
  '云办公 💻': '云办公',
  '游戏娱乐 🎮': '游戏娱乐',
  '电商 🛒': '电商',
}

export const SECTOR_COLORS: Record<Sector, string> = {
  '航空 ✈️': '#fb7185',
  '酒店 🏨': '#f59e0b',
  '医疗防护 🏥': '#22c55e',
  '云办公 💻': '#38bdf8',
  '游戏娱乐 🎮': '#c084fc',
  '电商 🛒': '#14b8a6',
}

export const QUARTERS: QuarterNews[] = [
  {
    id: 0,
    label: '2019 Q1',
    title: '增长仍在，局部风险开始冒头',
    period: '2019.01 - 2019.03',
    marketPulse:
      '市场主线仍是消费、出行和平台经济，真正的系统性风险尚未进入大众视野，但航空安全、审批政策和企业数字化已经开始影响板块预期。',
    decisionHint:
      '这一季最容易忽视的是“结构性变化”：表面平静，行业内部已经在悄悄分化。',
    highlights: ['消费在线化延续', '旅游需求仍稳', '游戏版号恢复', '企业协同工具升温'],
    sectors: {
      '航空 ✈️': {
        headline: '737 MAX 停飞让航空板块先感受到不确定性',
        summary:
          '2019 年 3 月埃塞俄比亚航空空难后，波音 737 MAX 在全球范围停飞。即便需求端未崩，航空公司对运力、机队结构和成本的担忧已经明显升温。',
        impact: '航空股在“需求仍稳”和“安全与供给受扰”之间摇摆，资金偏好开始下降。',
        sourceTitle: 'Reuters / Time: Ethiopian Airlines crash lawsuits and 737 MAX fallout',
        sourceUrl: 'https://time.com/5561035/boeing-jackson-musoni-lawsuit-ethiopia-airlines-crash/',
        sourceDate: '2019-03-28',
      },
      '酒店 🏨': {
        headline: '酒店行业仍处常态扩张周期',
        summary:
          '一季度酒店板块没有突发性黑天鹅，市场更关注开店、RevPAR 和会员体系等经营指标。大型酒店集团的口径仍偏积极，行业情绪维持平稳。',
        impact: '板块缺少高弹性故事，但在当时属于稳健消费与出行修复逻辑的一部分。',
        sourceTitle: 'Marriott investor materials: solid 2019 operating momentum',
        sourceUrl: 'https://marriott.gcs-web.com/news-releases/news-release-details/marriott-international-reports-fourth-quarter-2019-results',
        sourceDate: '2020-02-18',
      },
      '医疗防护 🏥': {
        headline: '医疗防护还不是市场焦点',
        summary:
          '这一阶段医疗防护仍被视作相对平稳的防御性板块，需求没有出现爆发式变化，资本关注度明显低于互联网与消费板块。',
        impact: '如果只看当季信息，投资者很难把它当成未来两年的核心主线。',
        sourceTitle: 'WHO PPE shortage warning became the later turning point',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: '协同办公需求缓慢上行，但还没到爆发点',
        summary:
          '远程办公在 2019 年初仍是效率工具而非基础设施。企业数字化转型是中长期题材，但当时更多被当作软件升级与订阅制渗透的延续。',
        impact: '市场会认可成长逻辑，但给出的估值弹性仍显克制。',
        sourceTitle: 'Microsoft FY19 Q3: commercial cloud revenue up 41%',
        sourceUrl: 'https://www.microsoft.com/en-us/Investor/earnings/FY-2019-Q3/press-release-webcast',
        sourceDate: '2019-04-24',
      },
      '游戏娱乐 🎮': {
        headline: '版号恢复重新点燃游戏行业情绪',
        summary:
          '中国监管部门在 3 月继续发放新游戏版号，腾讯和网易相关产品获批。经历 2018 年审批冻结后，市场对内容供给恢复非常敏感。',
        impact: '游戏板块重新获得业绩兑现预期，估值修复逻辑在当季较清晰。',
        sourceTitle: 'CNBC: China regulator approves 95 new video games',
        sourceUrl: 'https://www.cnbc.com/2019/03/08/china-regulator-approves-95-new-video-games-including-from-tencent.html',
        sourceDate: '2019-03-08',
      },
      '电商 🛒': {
        headline: '平台电商继续高增长，但竞争更卷',
        summary:
          '阿里在截至 2019 年 3 月的季度中收入同比增长 51%，用户和 GMV 仍在扩张。与此同时，下沉市场和补贴竞争让市场开始重新审视增长质量。',
        impact: '电商仍是强主线，但“高增长 + 利润率压力”的分歧已经出现。',
        sourceTitle: 'TechCrunch: Alibaba revenue up 51% to $13.9 billion',
        sourceUrl: 'https://techcrunch.com/2019/05/15/alibaba-2019-annual-earnings/',
        sourceDate: '2019-05-15',
      },
    },
  },
  {
    id: 1,
    label: '2019 Q2',
    title: '消费与科技并进，平台竞争加深',
    period: '2019.04 - 2019.06',
    marketPulse:
      '企业云服务、线上零售和内容消费继续扩张，旅行与酒店仍处于温和景气区间，资金偏好逐步向“长期成长”倾斜。',
    decisionHint:
      '当季最容易让人忽略的，不是风险，而是平台型公司对未来流量入口的争夺已经提前打响。',
    highlights: ['云与协同工具提速', '电商继续扩张', '出行板块仍偏稳', '内容供给恢复'],
    sectors: {
      '航空 ✈️': {
        headline: '需求没有大问题，航空更多是宏观顺周期交易',
        summary:
          '二季度航空板块缺乏单一爆点，市场更看经济预期、油价和运力效率。和后来的疫情冲击相比，这一阶段的波动更多属于常规景气周期。',
        impact: '投资者会把航空视为经济活跃度映射，而不是避险或成长主线。',
        sourceTitle: 'IATA: 2019 air passenger demand still posted full-year growth',
        sourceUrl: 'https://www.iata.org/en/iata-repository/publications/economic-reports/air-passenger-monthly---dec-2019/',
        sourceDate: '2020-01-31',
      },
      '酒店 🏨': {
        headline: '酒店板块受益于常规商旅与假日需求',
        summary:
          '酒店行业在这一季更像消费复苏和旅游升级的平稳延伸，市场关注会员体系、品牌升级以及高线城市入住率表现。',
        impact: '板块稳健但弹性一般，通常不是短线最热，却容易被长期资金配置。',
        sourceTitle: 'Marriott investor materials: 2019 maintained global hotel profit margins',
        sourceUrl: 'https://marriott.gcs-web.com/news-releases/news-release-details/marriott-international-reports-fourth-quarter-2019-results',
        sourceDate: '2020-02-18',
      },
      '医疗防护 🏥': {
        headline: '医疗板块仍以常规需求和防御属性为主',
        summary:
          '医疗防护没有明显超预期催化，更多被看作偏稳的配置方向。相比消费互联网，它的交易热度仍然靠后。',
        impact: '如果没有前瞻视角，绝大多数人不会在这一季把医疗防护作为主仓方向。',
        sourceTitle: 'WHO PPE shortage alert later re-rated the sector',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: '云服务收入继续增长，办公协同走出“工具股”形态',
        summary:
          '微软 2019 年 6 月所在季度继续给出强劲云业务表现，市场开始相信企业 SaaS 和协同办公不是边缘需求，而是更大数字化体系的一部分。',
        impact: '云办公的长期估值中枢开始被抬高，但短期还未形成全市场共识。',
        sourceTitle: 'Microsoft FY19 Q4: commercial cloud revenue up 39%',
        sourceUrl: 'https://www.microsoft.com/en-us/Investor/earnings/FY-2019-Q4/press-release-webcast',
        sourceDate: '2019-07-18',
      },
      '游戏娱乐 🎮': {
        headline: '版号恢复后，市场开始回到产品周期交易',
        summary:
          '游戏行业从“监管压制”切回“内容竞争”，投资者重新追踪新品排期、流水和暑期档表现，板块风险偏好改善。',
        impact: '行业从政策修复阶段过渡到基本面验证阶段，弹性开始增强。',
        sourceTitle: 'CNBC: China regulator approves 95 new video games',
        sourceUrl: 'https://www.cnbc.com/2019/03/08/china-regulator-approves-95-new-video-games-including-from-tencent.html',
        sourceDate: '2019-03-08',
      },
      '电商 🛒': {
        headline: '电商平台把增长重心推向下沉市场和新消费',
        summary:
          '阿里 6 月季度业绩显示核心商业和云业务继续支撑增长，但市场已经开始讨论流量成本、补贴效率和长期留存质量。',
        impact: '电商仍强，但纯靠 GMV 讲故事开始变难，竞争结构比表面更激烈。',
        sourceTitle: 'CNBC: Alibaba beats on June-quarter revenue and earnings',
        sourceUrl: 'https://www.cnbc.com/2019/08/15/alibaba-q2-2019-earnings-preview-e-commerce-cloud-to-provide-growth.html',
        sourceDate: '2019-08-15',
      },
    },
  },
  {
    id: 2,
    label: '2019 Q3',
    title: '数字化工具升温，线上娱乐回到视野中心',
    period: '2019.07 - 2019.09',
    marketPulse:
      '企业协同工具首次拿到更可量化的用户增长数据，游戏、内容和平台零售继续扩张，市场开始奖励“可持续数字化渗透”。',
    decisionHint:
      '这一季最值得注意的是，很多后来在 2020 年爆发的板块，2019 年三季度已经先有了用户和基础设施的铺垫。',
    highlights: ['Teams 用户破千万', '游戏重回成长赛道', '平台零售仍强', '线下出行景气延续'],
    sectors: {
      '航空 ✈️': {
        headline: '航空板块仍在正常景气框架内交易',
        summary:
          '在疫情发生前，航空行业并未出现需求断崖，市场对它的判断主要取决于客运增速、票价、油价和汇率等传统变量。',
        impact: '从当季视角看，航空像“普通周期股”，没人会把它当成即将遭遇系统性冲击的高风险资产。',
        sourceTitle: 'IATA: 2019 passenger demand below trend but still solid',
        sourceUrl: 'https://www.iata.org/en/iata-repository/publications/economic-reports/air-passenger-monthly---dec-2019/',
        sourceDate: '2020-01-31',
      },
      '酒店 🏨': {
        headline: '酒店行业保持平稳经营，市场关注效率胜过故事',
        summary:
          '酒店公司在这一阶段更强调开店质量、会员和利润率，行业本身没有强催化，属于典型的稳增长、低波动板块。',
        impact: '如果投资者偏好高弹性题材，酒店在当季并不占优。',
        sourceTitle: 'Marriott investor materials: 2019 achieved record RevPAR index gains',
        sourceUrl: 'https://marriott.gcs-web.com/news-releases/news-release-details/marriott-international-reports-fourth-quarter-2019-results',
        sourceDate: '2020-02-18',
      },
      '医疗防护 🏥': {
        headline: '医疗防护继续被市场忽视',
        summary:
          '没有公共卫生催化的环境下，医疗防护仍然更多依赖常规订单与防御属性，不具备吸引大规模主题资金的事件驱动。',
        impact: '从仓位配置角度看，它更像是“可以配一点”，而不是“必须重仓”。',
        sourceTitle: 'WHO PPE shortage warning would only arrive in 2020',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: 'Microsoft Teams 首次公开 1300 万日活',
        summary:
          '微软在 2019 年 7 月披露 Teams 日活超过 1300 万、周活超过 1900 万。这个数字让市场第一次看到企业协同产品的真实渗透速度。',
        impact: '云办公从“题材概念”升级为“可验证增长”，估值逻辑明显强化。',
        sourceTitle: 'Microsoft 365 Blog: Teams reaches 13 million daily active users',
        sourceUrl: 'https://www.microsoft.com/zh-cn/microsoft-365/blog/2019/07/11/microsoft-teams-reaches-13-million-daily-active-users-introduces-4-new-ways-for-teams-to-work-better-together/',
        sourceDate: '2019-07-11',
      },
      '游戏娱乐 🎮': {
        headline: '游戏重新回到产品周期驱动阶段',
        summary:
          '版号恢复后的市场开始用新品上线、暑期档和用户付费表现重新给游戏公司定价，行业从政策修复走向业绩兑现预期。',
        impact: '这一季的游戏板块更像成长股，短中期弹性明显优于酒店、航空等传统出行板块。',
        sourceTitle: 'CNBC: approvals resumed for Tencent and NetEase titles',
        sourceUrl: 'https://www.cnbc.com/2019/03/08/china-regulator-approves-95-new-video-games-including-from-tencent.html',
        sourceDate: '2019-03-08',
      },
      '电商 🛒': {
        headline: '平台电商增长继续，云业务开始成为估值加分项',
        summary:
          '阿里 6 月季度业绩除了电商本体，还让市场看到云计算与生态协同的额外价值。平台企业不再只是零售股，也被赋予基础设施属性。',
        impact: '电商板块从单纯消费逻辑扩展到“零售 + 云 + 支付 + 物流”的复合估值。',
        sourceTitle: 'CNBC: e-commerce and cloud drive Alibaba results',
        sourceUrl: 'https://www.cnbc.com/2019/08/15/alibaba-q2-2019-earnings-preview-e-commerce-cloud-to-provide-growth.html',
        sourceDate: '2019-08-15',
      },
    },
  },
  {
    id: 3,
    label: '2019 Q4',
    title: '线下消费繁荣，线上平台把景气推到高点',
    period: '2019.10 - 2019.12',
    marketPulse:
      '在疫情前最后一个完整季度，旅行、酒店和电商看起来都很景气，云办公用户继续扩大，但“未知变量”已经在年末开始出现。',
    decisionHint:
      '如果只看这个季度，多数人会继续追逐消费和平台龙头，而低估 2020 年即将发生的剧烈切换。',
    highlights: ['双十一创纪录', 'Teams 日活破 2000 万', '酒店经营稳健', '年末公共卫生异动刚露头'],
    sectors: {
      '航空 ✈️': {
        headline: '航空需求还在增长，但增长斜率已低于长周期趋势',
        summary:
          'IATA 对 2019 全年的复盘显示，全球航空客运需求虽然继续增长，但增速已经放缓。这意味着行业在疫情前并非特别强劲，而是处于偏成熟的景气末段。',
        impact: '板块看似平稳，实际上对外部冲击的缓冲垫已经不厚。',
        sourceTitle: 'IATA: 2019 passenger demand rose 4.2%, below long-term trend',
        sourceUrl: 'https://www.iata.org/en/iata-repository/publications/economic-reports/air-passenger-monthly---dec-2019/',
        sourceDate: '2020-01-31',
      },
      '酒店 🏨': {
        headline: '大型酒店集团仍在讲稳健扩张故事',
        summary:
          'Marriott 在 2019 全年复盘里强调客房增长、RevPAR 指标与全球利润率表现，说明到 2019 年底酒店板块仍是典型的稳健经营行业。',
        impact: '这也解释了为什么疫情冲击到来时，市场对酒店板块的预期下修会非常剧烈。',
        sourceTitle: 'Marriott: solid fourth-quarter and full-year 2019 results',
        sourceUrl: 'https://marriott.gcs-web.com/news-releases/news-release-details/marriott-international-reports-fourth-quarter-2019-results',
        sourceDate: '2020-02-18',
      },
      '医疗防护 🏥': {
        headline: '医疗防护在年末仍未进入主流投资叙事',
        summary:
          '这一季医疗防护尚未享受明显溢价，真正的估值重估要等到 2020 年一季度公共卫生事件全面扩散后才开始。',
        impact: '从 hindsight 看它是机会，但站在当时它并不热门。',
        sourceTitle: 'WHO PPE shortage warning would reshape the next quarter',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: 'Teams 日活升至 2000 万，协同办公加速渗透',
        summary:
          '微软在 2019 年 11 月表示 Teams 日活已超过 2000 万，比 7 月公布的 1300 万继续提升。市场开始把协同办公视为可持续增长赛道。',
        impact: '云办公在疫情前就已具备强趋势，只是 2020 年把这个趋势极端放大。',
        sourceTitle: 'CNBC: Microsoft Teams reaches 20 million daily active users',
        sourceUrl: 'https://www.cnbc.com/2019/11/19/microsoft-teams-reaches-20-million-daily-active-users.html',
        sourceDate: '2019-11-19',
      },
      '游戏娱乐 🎮': {
        headline: '线上娱乐维持高粘性，市场继续按产品和版号交易',
        summary:
          '游戏行业在 2019 年底已回到相对正常的运营节奏，投资者更关心新品、流水和用户留存，而不是政策冻结风险。',
        impact: '这为 2020 年宅家流量爆发提供了不错的基本面起点。',
        sourceTitle: 'CNBC: game approvals resumed after the 2018 freeze',
        sourceUrl: 'https://www.cnbc.com/2019/03/08/china-regulator-approves-95-new-video-games-including-from-tencent.html',
        sourceDate: '2019-03-08',
      },
      '电商 🛒': {
        headline: '双十一再创新高，平台经济站上年度高潮',
        summary:
          '2019 年双十一阿里成交额达到 2684 亿元人民币，继续刷新纪录。直播、折扣、物流和平台协同把电商板块推到年度情绪高点。',
        impact: '电商平台在这一季几乎具备最强确定性，容易让投资者忽视即将到来的供给链扰动与线下冲击。',
        sourceTitle: 'World Economic Forum / Reuters: Alibaba Singles Day sales top $38 billion',
        sourceUrl: 'https://www.weforum.org/stories/2019/11/alibabas-23billion-sales-singles-day-shopping/',
        sourceDate: '2019-11-11',
      },
    },
  },
  {
    id: 4,
    label: '2020 Q1',
    title: '疫情打断旧逻辑，板块分化突然加速',
    period: '2020.01 - 2020.03',
    marketPulse:
      '这一季是整个叙事的分水岭。线下出行和酒店迅速承压，医疗防护、云办公、游戏娱乐与电商同时抬升，市场开始从“经济周期”切换到“疫情受益”。',
    decisionHint:
      '真正难的不是看见趋势，而是在趋势刚出现时愿不愿意相信旧世界已经变了。',
    highlights: ['WHO 宣布国际关注突发公共卫生事件', '航空酒店急跌', 'PPE 供给紧张', '宅经济开始爆发'],
    sectors: {
      '航空 ✈️': {
        headline: '旅行限制与退票潮迅速压垮航空情绪',
        summary:
          '3 月航空公司开始大规模削减航班、冻结招聘并停放飞机。航空不再是景气跟踪标的，而是第一批承受疫情冲击的核心板块。',
        impact: '资金从“复苏顺周期”快速切换到“需求塌陷防御”，航空估值中枢被重置。',
        sourceTitle: 'AP / Boston.com: airlines slash flights as virus cuts travel',
        sourceUrl: 'https://www.boston.com/travel/travel/2020/03/10/airlines-slash-flights-freeze-hiring-as-virus-cuts-travel/',
        sourceDate: '2020-03-10',
      },
      '酒店 🏨': {
        headline: '酒店行业面对入住率断崖和裁员风险',
        summary:
          '疫情扩散后，酒店行业迅速从稳健经营转向现金流保卫战。美国酒店和住宿协会甚至警告行业可能流失数百万岗位。',
        impact: '酒店从“稳健消费”瞬间切成“高杠杆承压板块”，市场风险偏好明显退潮。',
        sourceTitle: 'Axios: hotel industry could lose 4 million jobs from coronavirus impact',
        sourceUrl: 'https://www.axios.com/2020/03/17/hotel-industry-lose-4-million-jobs-coronavirus',
        sourceDate: '2020-03-17',
      },
      '医疗防护 🏥': {
        headline: 'WHO 警告口罩、防护服和手套供应严重受扰',
        summary:
          '2 月 WHO 表示 PPE 需求暴增至平时的数十倍到上百倍，价格飙升且供应链严重失衡。医疗防护从边缘配置品直接变成全球最紧缺的现实资产。',
        impact: '板块估值和业绩预期被同时上修，成为疫情初期最直接的受益方向之一。',
        sourceTitle: 'Al Jazeera / Reuters: WHO says global PPE supplies are scarce',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: '远程办公从备选方案变成必须方案',
        summary:
          '企业与学校大规模改为线上协作，视频会议和协同平台快速渗透。云办公在 2020 年一季度完成了从中长期逻辑到刚需基础设施的切换。',
        impact: '市场开始给“在线协同”更高估值溢价，成长确定性大幅提升。',
        sourceTitle: 'Microsoft Teams usage growth and 2020 remote-work shift',
        sourceUrl: 'https://www.microsoft.com/en-us/microsoft-365/blog/2020/10/28/microsoft-teams-reaches-115-million-dau-plus-a-new-daily-collaboration-minutes-metric-for-microsoft-365/',
        sourceDate: '2020-10-28',
      },
      '游戏娱乐 🎮': {
        headline: '宅家时间拉长，线上娱乐时长明显抬升',
        summary:
          '在居家隔离背景下，游戏和线上娱乐开始承接新增流量。行业尚未在一季度完全兑现财务数据，但用户行为变化已经很清楚。',
        impact: '游戏板块提前进入“疫情受益”定价区间，资金博弈热度迅速升高。',
        sourceTitle: 'Reuters coverage later validated by Nintendo lockdown-driven boom',
        sourceUrl: 'https://www.investing.com/news/technology-news/nintendo-reports-428-jump-in-quarterly-profit-smashes-estimates-2255963',
        sourceDate: '2020-08-06',
      },
      '电商 🛒': {
        headline: '线下受限后，线上零售承担更多基础消费需求',
        summary:
          '消费者囤货、到家配送和平台履约能力在一季度变得更重要。电商从可选消费渠道，转向维持日常生活运转的重要基础设施。',
        impact: '平台零售的韧性被重新定价，物流与履约能力的重要性同步上升。',
        sourceTitle: 'CNBC: Alibaba cloud and commerce strength framed 2020 demand',
        sourceUrl: 'https://www.cnbc.com/2019/08/15/alibaba-q2-2019-earnings-preview-e-commerce-cloud-to-provide-growth.html',
        sourceDate: '2019-08-15',
      },
    },
  },
  {
    id: 5,
    label: '2020 Q2',
    title: '宅经济全面爆发，旧经济承压最深',
    period: '2020.04 - 2020.06',
    marketPulse:
      '二季度是疫情交易最极致的阶段。云办公、医疗防护、游戏、电商集体走强，航空与酒店在业绩和预期两端同时受挫。',
    decisionHint:
      '这一季最考验仓位切换速度。很多人已经知道谁受益，但没法在剧烈波动里拿住它。',
    highlights: ['Zoom 用户暴涨', '酒店入住率探底', 'PPE 高景气延续', '游戏需求受锁定措施刺激'],
    sectors: {
      '航空 ✈️': {
        headline: '航空板块进入最艰难阶段',
        summary:
          '国际与国内出行限制在二季度全面体现，航空公司大规模减班停飞，收入模型被打断，行业修复时间也无法准确预估。',
        impact: '市场对航空的定价从“短期亏损”升级为“长期恢复不确定”，估值承压加深。',
        sourceTitle: 'AP / Boston.com: airlines slash flights and freeze hiring',
        sourceUrl: 'https://www.boston.com/travel/travel/2020/03/10/airlines-slash-flights-freeze-hiring-as-virus-cuts-travel/',
        sourceDate: '2020-03-10',
      },
      '酒店 🏨': {
        headline: '酒店入住率与 RevPAR 深度受损',
        summary:
          'Hilton 表示一季度 RevPAR 已明显下滑，而二季度行业表现更弱。酒店板块在疫情最严峻阶段面临现金流、入住率和扩张节奏三重压力。',
        impact: '资金很难给出乐观预期，板块修复更多依赖政策和疫情拐点，而非单纯经营改善。',
        sourceTitle: 'PhocusWire: Hilton Q1 2020 results reflect pandemic damage',
        sourceUrl: 'https://www.phocuswire.com/hilton-q1-2020',
        sourceDate: '2020-05-07',
      },
      '医疗防护 🏥': {
        headline: '防护用品供需错配把医疗板块推上高景气',
        summary:
          '口罩、手套、防护服和检测相关需求在二季度持续高位，PPE 相关公司进入订单和产能双扩张阶段。',
        impact: '这是医疗防护估值最亢奋的一段时间，市场把它视作疫情中少数高确定性增长板块。',
        sourceTitle: 'Al Jazeera / Reuters: PPE demand surged up to 100-fold',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: 'Zoom 宣布单日会议参与者突破 3 亿',
        summary:
          '4 月 Zoom 披露 4 月 22 日的单日会议参与者超过 3 亿，远高于 2019 年 12 月的 1000 万量级。云办公在二季度完成了用户渗透的爆炸式跃迁。',
        impact: '市场开始把远程协作当成新基础设施，行业龙头获得极高溢价。',
        sourceTitle: 'CNBC: Zoom says meeting participants surged to 300 million',
        sourceUrl: 'https://www.cnbc.com/2020/04/23/zoom-shares-pop-after-users-grow-from-to-300-million.html',
        sourceDate: '2020-04-23',
      },
      '游戏娱乐 🎮': {
        headline: 'Nintendo 利润暴增，居家娱乐逻辑被财报验证',
        summary:
          '任天堂在 4-6 月季度经营利润同比暴增，Animal Crossing 和 Switch 硬件需求显著提升。宅家场景把游戏板块从预期交易变成了业绩交易。',
        impact: '游戏娱乐在二季度成为最强的“业绩能见度 + 情绪热度”组合之一。',
        sourceTitle: 'Reuters / Investing: Nintendo profit jumps on lockdown gaming boom',
        sourceUrl: 'https://www.investing.com/news/technology-news/nintendo-reports-428-jump-in-quarterly-profit-smashes-estimates-2255963',
        sourceDate: '2020-08-06',
      },
      '电商 🛒': {
        headline: '线上零售与配送体系获得结构性强化',
        summary:
          '线下消费受限反而凸显平台零售、到家配送和数字支付的重要性。电商不只是受益于订单，更受益于用户习惯的加速迁移。',
        impact: '板块逻辑从短期替代需求，向长期渗透率上升进一步延伸。',
        sourceTitle: 'CNBC: cloud and commerce keep Alibaba momentum strong',
        sourceUrl: 'https://www.cnbc.com/2019/08/15/alibaba-q2-2019-earnings-preview-e-commerce-cloud-to-provide-growth.html',
        sourceDate: '2019-08-15',
      },
    },
  },
  {
    id: 6,
    label: '2020 Q3',
    title: '修复与高景气并存，分化开始变细',
    period: '2020.07 - 2020.09',
    marketPulse:
      '疫情交易进入第二阶段。最受益的赛道继续兑现业绩，但市场开始思考高估值是否透支；与此同时，酒店与出行出现局部修复迹象。',
    decisionHint:
      '这一季难点不在判断方向，而在识别哪些板块是趋势延续，哪些已经开始进入预期见顶阶段。',
    highlights: ['Zoom 财报爆表', 'Marriott 看到恢复苗头', 'Nintendo 业绩验证宅娱乐', '板块从一致上涨转向细分分化'],
    sectors: {
      '航空 ✈️': {
        headline: '航空有修复预期，但恢复远未完成',
        summary:
          '随着部分地区出行恢复，航空板块开始从纯粹的悲观定价中缓慢回升，但国际航线和商务出行仍然严重受限。',
        impact: '行业进入“交易复苏预期”阶段，但基本面还不足以支撑彻底反转。',
        sourceTitle: 'Reuters market coverage: travel stocks react to vaccine and reopening hopes',
        sourceUrl: 'https://www.investing.com/news/stock-market-news/vaccineled-rally-stalls-in-europe-as-travel-shares-slide-2349579',
        sourceDate: '2020-11-17',
      },
      '酒店 🏨': {
        headline: 'Marriott 三季度提到中国恢复领先全球',
        summary:
          'Marriott 在三季度财报中表示，大中华区入住率恢复领先其他地区，显示酒店行业开始出现区域性修复，而不是同步全面回暖。',
        impact: '酒店板块从“没有底”转向“先看中国与休闲游复苏”的结构性博弈。',
        sourceTitle: 'Marriott Q3 2020: Greater China occupancy reached 61%',
        sourceUrl: 'https://marriott.gcs-web.com/news-releases/news-release-details/marriott-international-reports-third-quarter-2020-results',
        sourceDate: '2020-11-06',
      },
      '医疗防护 🏥': {
        headline: '医疗防护热度仍高，但市场开始关心持续性',
        summary:
          '经过上半年的急涨后，市场开始问一个更难的问题：PPE 与检测需求能持续多久，哪些公司能把疫情红利转成长期能力。',
        impact: '板块仍强，但从情绪驱动转向业绩与持续性筛选。',
        sourceTitle: 'WHO and PPE shortage backdrop remained central in 2020',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: 'Zoom 股价单日暴涨 41%，市场确认高增长仍在继续',
        summary:
          '9 月 Zoom 财报显示收入和利润远超预期，股价单日大涨 41%。这说明远程办公热潮并未随着部分复工而迅速消退。',
        impact: '云办公从“疫情题材”进一步升级为“高增长财报股”。',
        sourceTitle: 'CNBC: Zoom surges 41% after blowout earnings',
        sourceUrl: 'https://www.cnbc.com/2020/09/01/zooms-stock-surges-41percent-on-earnings-adding-over-37-billion-in-value.html',
        sourceDate: '2020-09-01',
      },
      '游戏娱乐 🎮': {
        headline: 'Nintendo 业绩证明宅娱乐不是一次性脉冲',
        summary:
          '任天堂 4-6 月季度利润大增，Switch 和 Animal Crossing 销售火爆，说明居家娱乐需求已经在业绩端充分兑现。',
        impact: '游戏板块在三季度仍具备高景气，但市场也开始担心后续高基数。',
        sourceTitle: 'CNBC: Nintendo profit surges 428% on lockdown boom',
        sourceUrl: 'https://www.cnbc.com/2020/08/06/nintendo-q1-earnings-profits-surge-428percent-animal-crossing-sales-double.html',
        sourceDate: '2020-08-06',
      },
      '电商 🛒': {
        headline: '电商高景气延续，平台能力比单点促销更重要',
        summary:
          '三季度的电商逻辑不再只是“订单增加”，而是平台在物流、支付、云和商家运营层面的系统能力被进一步放大。',
        impact: '资金继续偏好头部平台，因为它们在非常时期展现出更强韧性和更高壁垒。',
        sourceTitle: 'CNBC: Alibaba commerce and cloud remain key growth engines',
        sourceUrl: 'https://www.cnbc.com/2019/08/15/alibaba-q2-2019-earnings-preview-e-commerce-cloud-to-provide-growth.html',
        sourceDate: '2019-08-15',
      },
    },
  },
  {
    id: 7,
    label: '2020 Q4',
    title: '疫苗预期带来再平衡，旧经济开始反弹',
    period: '2020.10 - 2020.12',
    marketPulse:
      '四季度出现明显再平衡。云办公、电商等高景气板块仍强，但疫苗进展让航空、酒店这类被压制最久的资产开始获得修复交易机会。',
    decisionHint:
      '这一季最难的是应对风格切换。高景气还在，但市场已经提前交易“世界恢复正常”之后的下一轮机会。',
    highlights: ['疫苗突破带动旅行股反弹', '双十一再创新高', 'Teams 日活 1.15 亿', '中国酒店修复领先'],
    sectors: {
      '航空 ✈️': {
        headline: '疫苗消息推动航空和旅行股集体反弹',
        summary:
          '11 月和 12 月围绕疫苗有效性与接种启动的消息，市场开始重新定价航空和旅行板块。它们虽然基本面仍弱，但修复预期显著增强。',
        impact: '航空从“持续杀估值”切换到“提前炒复苏”，波动和弹性同时上升。',
        sourceTitle: 'Reuters: travel stocks rally on vaccine rollout hopes',
        sourceUrl: 'https://ng.investing.com/news/stock-market-news/us-stocksfutures-cheer-vaccine-rollout-as-travel-stocks-rally-315201',
        sourceDate: '2020-12-14',
      },
      '酒店 🏨': {
        headline: '酒店板块开始看到更明确的中国修复信号',
        summary:
          'Marriott 在四季度财报里提到，中国内地 RevPAR 在 12 月同比降幅已经收窄到不足 10%。这让市场相信酒店修复并非遥不可及。',
        impact: '板块从纯粹看现金流，转向观察“先修复区域”的弹性溢价。',
        sourceTitle: 'Marriott Q4 2020: mainland China RevPAR down less than 10% in December',
        sourceUrl: 'https://marriott.gcs-web.com/news-releases/news-release-details/marriott-international-reports-fourth-quarter-2020-results',
        sourceDate: '2021-02-18',
      },
      '医疗防护 🏥': {
        headline: '防护需求仍高，但市场开始提前计算回落周期',
        summary:
          '随着疫苗研发推进，医疗防护板块虽然仍有现实需求支撑，但资金已经开始讨论 2021 年后供需可能回归常态的问题。',
        impact: '板块从高景气主升段，逐步进入高位分化与兑现阶段。',
        sourceTitle: 'WHO PPE shortage backdrop remained central through 2020',
        sourceUrl: 'https://www.aljazeera.com/economy/2020/2/7/coronavirus-prices-of-face-masks-soaring-supplies-scarce-who',
        sourceDate: '2020-02-07',
      },
      '云办公 💻': {
        headline: 'Microsoft Teams 日活达到 1.15 亿',
        summary:
          '10 月微软宣布 Teams 日活达到 1.15 亿，并披露 Microsoft 365 单日协作时长超过 300 亿分钟。远程与混合办公被正式确认成长期结构性趋势。',
        impact: '云办公仍是强主线，但估值已经明显计入长期红利，博弈难度上升。',
        sourceTitle: 'Microsoft 365 Blog: Teams reaches 115 million DAU',
        sourceUrl: 'https://www.microsoft.com/en-us/microsoft-365/blog/2020/10/28/microsoft-teams-reaches-115-million-dau-plus-a-new-daily-collaboration-minutes-metric-for-microsoft-365/',
        sourceDate: '2020-10-28',
      },
      '游戏娱乐 🎮': {
        headline: '游戏板块仍受益于线上娱乐习惯固化',
        summary:
          '虽然疫苗预期使部分资金开始切向线下复苏，但线上娱乐习惯已被显著强化，游戏行业在四季度仍具备较强韧性。',
        impact: '板块从单边强势进入高位震荡，核心看点转向产品周期和用户留存。',
        sourceTitle: 'CNBC: Nintendo lockdown-era demand validated by profit surge',
        sourceUrl: 'https://www.cnbc.com/2020/08/06/nintendo-q1-earnings-profits-surge-428percent-animal-crossing-sales-double.html',
        sourceDate: '2020-08-06',
      },
      '电商 🛒': {
        headline: '2020 双十一把线上消费推到新的历史高度',
        summary:
          '2020 年双十一期间，阿里和京东合计销售额达到约 1150 亿美元，再创纪录。疫情强化后的线上消费习惯，在四季度被集中兑现。',
        impact: '电商板块在四季度既享受消费旺季，也享受了疫情期间用户行为固化带来的长期溢价。',
        sourceTitle: 'CNBC: Alibaba and JD set Singles Day records totaling $115 billion',
        sourceUrl: 'https://www.cnbc.com/2020/11/12/singles-day-2020-alibaba-and-jd-rack-up-record-115-billion-of-sales.html',
        sourceDate: '2020-11-12',
      },
    },
  },
]
