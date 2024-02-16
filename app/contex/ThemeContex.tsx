import React, { createContext, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '../../consts/app-config';
import { stringIsNullOrWhiteSpace } from '../utils/string-is-null-or-white-space';

interface ThemeProps {
	themeMode: 'light' | 'dark',
	setTheme: (srt: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeProps>({
	themeMode: 'light',
	setTheme: (srt: 'light' | 'dark')  => {srt.toLowerCase()},
});

export const useThemeModes = () => {
	return useContext(ThemeContext);
}

export const ThemeProvider = ({ children }: any): React.JSX.Element => {
	const [theme, setTheme] = React.useState('light');

	useEffect(() => {
		const getTheme = async () => {
			const theme = await SecureStore.getItemAsync(AppConfig.themeKey);
			if (!stringIsNullOrWhiteSpace(theme) && (theme === 'light' || theme === 'dark' )) {
				setTheme(theme);
			}
		}
		getTheme();
	}, []);

	const setNewTheme = (str: 'light' | 'dark') => {
		setTheme(str);
		SecureStore.setItemAsync(AppConfig.themeKey, str);
	}

	const value = {
		themeMode: theme,
		setTheme: setNewTheme
	} as ThemeProps;

	return <ThemeContext.Provider value={value} >
		{ children }
	</ThemeContext.Provider>
}