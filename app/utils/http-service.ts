import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '../../consts/app-config';
import { stringIsNullOrWhiteSpace } from './string-is-null-or-white-space';

class AxiosResponse<T> {
	data?: T;
}

export class HttpService {
	constructor() {
		axios.interceptors.response.use(response => {
			return response;
		}, error => {
			if (error.response.status === 401) {
				SecureStore.deleteItemAsync(AppConfig.authTokenStorageKey);
			}
			return error;
		});
	}

	public async post<R>(
		route: string,
		body?: object,
	): Promise<AxiosResponse<R>> {
		const config = await this.getConfig();
		return axios.post<any, AxiosResponse<R>>(route, body, config);
	}

	private async getConfig<T = null>(): Promise<AxiosRequestConfig<T>> {
		const config = {} as AxiosRequestConfig<T>;

		config.baseURL = process.env.EXPO_PUBLIC_BACK_URL;

		const authToken = await SecureStore.getItemAsync(
			AppConfig.authTokenStorageKey,
		);

		if (!stringIsNullOrWhiteSpace(authToken)) {
			config.headers = {
				Authorization: `Bearer ${authToken}`,
			};
		}
		return config;
	}
}
