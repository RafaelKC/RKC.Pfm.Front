import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '../../consts/app-config';
import { stringIsNullOrWhiteSpace } from './string-is-null-or-white-space';

class AxiosResponse<T> {
	data?: T;
}

export class HttpService {
	public static async post<R>(
		route: string,
		body?: object,
	): Promise<AxiosResponse<R>> {
		const config = await this.getConfig();
		return axios.post<any, AxiosResponse<R>>(route, body, config);
	}

	public static async get<R>(
		route: string,
		params?: object,
	): Promise<AxiosResponse<R>> {
		const config = await this.getConfig();
		config.params = params;

		return axios.get<any, AxiosResponse<R>>(route, config);
	}

	public static async put<R>(
		route: string,
		body?: object,
	): Promise<AxiosResponse<R>> {
		const config = await this.getConfig();

		return axios.put<any, AxiosResponse<R>>(route, body, config);
	}

	public static async delete<R>(
		route: string,
	): Promise<AxiosResponse<R>> {
		const config = await this.getConfig();

		return axios.delete<any, AxiosResponse<R>>(route, config);
	}
	private static async getConfig<T = null>(): Promise<AxiosRequestConfig<T>> {
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
