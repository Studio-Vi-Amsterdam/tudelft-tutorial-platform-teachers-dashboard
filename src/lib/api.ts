import axios from 'axios';
import { ArtictesType } from 'src/types/types';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_BACKEND_URL,
});

export const articlesAPI = {
    getArticles(type: ArtictesType) {
        return instance.get(`/${type}/`);
    },
    getSingleArticle(type: ArtictesType, id: number) {
        return instance.get(`/${type}/single/?id=[${id}]`);
    },
};
