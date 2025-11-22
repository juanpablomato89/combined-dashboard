export interface DashboardItem {
    id: string;
    timestamp: Date;
    type: 'news' | 'img';
}

export interface NewsItem extends DashboardItem {
    type: 'news';
    urlToImage?: string;
    name?: string;
    title?: string;
    description?: string;
    url?: string;
    date: Date;
}

export interface ImgItem extends DashboardItem {
    type: 'img';
    previewURL: number;
    largeImageURL: string;
    likes: string;
    views: number;
    date: Date;
}