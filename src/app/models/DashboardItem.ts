export interface DashboardItem {
    id: string;
    timestamp: Date;
    type: 'news' | 'img';
}

export interface NewsItem extends DashboardItem {
    type: 'news';
    title: string;
    summary: string;
    source: string;
    imageUrl?: string;
}

export interface ImgItem extends DashboardItem {
    type: 'img';
    temperature: number;
    condition: string;
    location: string;
    humidity: number;
    windSpeed: number;
    icon: string;
}