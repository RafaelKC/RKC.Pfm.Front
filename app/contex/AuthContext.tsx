import React, { createContext, useContext, useEffect, useState } from 'react';
import { HttpService } from '../utils/http-service';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '../../consts/app-config';
import { stringIsNullOrWhiteSpace } from '../utils/string-is-null-or-white-space';


class Result<T = null> {
	public error = false;
	public msg?: string;
	public data?: T;
}

interface LoginResult {
	success: boolean;
	token: string;
	refreshToken: string;
}

interface AuthProps {
	authState?: { token: string | null; authenticated: boolean | null };
	onRegister?: (
		email: string,
		password: string,
		name: string,
	) => Promise<Result>;
	onLogin?: (email: string, password: string) => Promise<Result<LoginResult>>;
	onLogout?: () => Promise<Result>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any): React.JSX.Element => {
	const [authState, setAuthState] = useState<{
		token: string | null;
		authenticated: boolean | null;
	}>({
		token: null,
		authenticated: null,
	});

	useEffect(() => {
		const loadToken = async () => {
			const token = await SecureStore.getItemAsync(
				AppConfig.authTokenStorageKey,
			);
			const hasToken = !stringIsNullOrWhiteSpace(token);

			if (hasToken) {
				try {
					const isLoged = await HttpService.get('auth/is-login-valid')
					if (isLoged) {
						setAuthState({
							token: token,
							authenticated: true,
						});
					} else {
						await SecureStore.deleteItemAsync(AppConfig.authTokenStorageKey)
					}
				} catch  {
					await SecureStore.deleteItemAsync(AppConfig.authTokenStorageKey)
				}
			}
		};
		loadToken().then();
	}, []);

	const register = async (
		email: string,
		password: string,
		name: string,
	): Promise<Result> => {
		try {
			await HttpService.post<void>('users', { email, password, name });
			return { error: false };
		} catch (e) {
			return { error: true };
		}
	};

	const login = async (
		email: string,
		password: string,
	): Promise<Result<LoginResult>> => {
		try {
			const result = await HttpService.post<LoginResult>('auth/login', {
				email,
				password,
			});

			if (result.data && result.data.success) {
				setAuthState({
					token: result.data.token,
					authenticated: true,
				});
				await SecureStore.setItemAsync(
					AppConfig.authTokenStorageKey,
					result.data.token
				);

				return { error: false };
			}
			return { error: true };
		} catch (e) {
			return { error: true };
		}
	};

	const logout = async (): Promise<Result> => {
		try {
			setAuthState({
				token: null,
				authenticated: false,
			});
			await SecureStore.deleteItemAsync(AppConfig.authTokenStorageKey);
			await HttpService.post('auth/logout');
			return { error: false };
		} catch (e) {
			return { error: true };
		}
	};

	const value = {
		onRegister: register,
		onLogin: login,
		onLogout: logout,
		authState,
	} as AuthProps;

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
