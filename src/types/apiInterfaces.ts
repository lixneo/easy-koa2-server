// API 接口返回的基本结构
interface ApiResponse<T> {
    code: number;
    data: T;
}

// 首页接口
interface HomeResponse extends ApiResponse<{ title: string }> {}

// 获取现存数据日期接口
interface SaveDateResponse extends ApiResponse<string[]> {}

// 保存排行榜数据接口
interface SaveRankingResponse extends ApiResponse<{ msg: string }> {}

// 获取各分区上榜次数接口
interface RankingCountsResponse extends ApiResponse<[string, number][]> {}

// 获取各分区总播放量接口
interface RankingViewsResponse extends ApiResponse<[string, number][]> {}

// 获取各分区总弹幕量接口
interface RankingDanmakusResponse extends ApiResponse<[string, number][]> {}

// 获取各分区互动情况接口
interface RankingInteractResponse extends ApiResponse<{
    [key: string]: {
        likes: number;
        coins: number;
        favorites: number;
        danmakus: number;
        shares: number;
    };
}> {}

// 获取各分区三连情况接口
interface RankingThreeLikesResponse extends ApiResponse<{
    [key: string]: {
        likes: number;
        coins: number;
        favorites: number;
    };
}> {}

// 获取分区每天天播放量情况接口
interface RankingDaysViewsResponse extends ApiResponse<{
    [key: string]: {
        [key: string]: number;
    };
}> {}

// 获取 UP 主上榜次数接口
interface RankingUpCountsResponse extends ApiResponse<{
    [key: string]: number;
}> {}

// 获取标题词云图接口
interface RankingWordCloudResponse extends ApiResponse<{
    [key: string]: number;
}> {}

// 获取 Top 5 UP 主接口
interface RankingTop5UpResponse extends ApiResponse<{
    [key: string]: {
        counts: number;
    };
}> {}

// 获取所有接口数据接口
interface FetchAllResponse extends ApiResponse<{
    dates: SaveDateResponse;
    rankingCounts: RankingCountsResponse;
    rankingViews: RankingViewsResponse;
    rankingDanmakus: RankingDanmakusResponse;
    rankingInteract: RankingInteractResponse;
    rankingThreeLikes: RankingThreeLikesResponse;
    rankingDaysViews: RankingDaysViewsResponse;
    rankingUpCounts: RankingUpCountsResponse;
    rankingWordCloud: RankingWordCloudResponse;
    rankingTop5Up: RankingTop5UpResponse;
}> {} 