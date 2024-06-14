import axios from 'axios';
import { ArtictesType } from 'src/types/types';
import { getAuthToken } from './cookies';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_BACKEND_URL,
});

instance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token && !config.url?.includes('/auth')) {
            config.headers['Authorization'] = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const articlesAPI = {
    getArticles(type: ArtictesType) {
        return instance.get(`/${type}/`);
    },
    getSingleArticle(type: ArtictesType, id: number) {
        return instance.get(`/${type}/single/?id=${id}`);
    },
    postArticle(type: ArtictesType, payload: any) {
        return instance.post(`/${type}/create`, payload);
    },
    deleteArticle(type: ArtictesType, id: number) {
        const payload = {
            id: id,
        };
        return instance.delete(`/${type}/single/delete`, { data: payload });
    },
    updateArticle(type: ArtictesType, payload: any) {
        return instance.put(`/${type}/single/update`, payload);
    },
};

export const chaptersAPI = {
    getArticleChapters(parentId: number) {
        return instance.get(`/chapters/id=${parentId}/`);
    },
    getSingleChapter(chapterId: number) {
        return instance.get(`/chapters/single?id=${chapterId}`);
    },
};

export const taxonomiesAPI = {
    getKeywords() {
        return instance.get(`/keywords/`);
    },
    createKeyword(keyword: string) {
        const payload = {
            keyword: keyword,
        };
        return instance.post(`/keywords/create`, payload);
    },
};

export const authAPI = {
    auth(token: string) {
        return instance.post('/auth', { auth_key: token });
    },
};
