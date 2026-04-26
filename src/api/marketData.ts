const API_URL = "https://openapi.iwencai.com/v1/query2data";

function getApiKey(): string {
  return localStorage.getItem('iwencai_api_key') || '';
}

export interface MarketResult {
  success: boolean;
  query: string;
  count: number;
  code_count: number;
  datas: Record<string, string>[];
  error?: string;
}

export async function fetchMarketData(query: string, limit: string = '20'): Promise<MarketResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: false,
      query,
      count: 0,
      code_count: 0,
      datas: [],
      error: '请先设置API密钥'
    };
  }

  try {
    const payload = {
      query,
      page: '1',
      limit,
      is_cache: '1',
      expand_index: 'true'
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status_code !== 0) {
      return {
        success: false,
        query,
        count: 0,
        code_count: 0,
        datas: [],
        error: result.status_msg || 'API请求失败'
      };
    }

    return {
      success: true,
      query,
      count: result.datas?.length || 0,
      code_count: result.code_count || 0,
      datas: result.datas || []
    };
  } catch (err) {
    return {
      success: false,
      query,
      count: 0,
      code_count: 0,
      datas: [],
      error: err instanceof Error ? err.message : '网络请求失败'
    };
  }
}

export async function fetchIndexData(): Promise<MarketResult> {
  return fetchMarketData('上证指数 沪深300 创业板指 科创50 最新行情');
}

export async function fetchSectorData(): Promise<MarketResult> {
  return fetchMarketData('行业板块涨跌排名');
}

export async function fetchStockNews(): Promise<MarketResult> {
  return fetchMarketData('今日A股重要新闻');
}

export function setApiKey(key: string): void {
  localStorage.setItem('iwencai_api_key', key);
}

export function getStoredApiKey(): string {
  return localStorage.getItem('iwencai_api_key') || '';
}
