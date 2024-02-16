import { I18n } from 'i18n-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLocales } from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '../../consts/app-config';
import { stringIsNullOrWhiteSpace } from '../utils/string-is-null-or-white-space';
import { EnTranslations } from '../i18n/consts/en-translations';
import { PtTranslations } from '../i18n/consts/pt-translations';

interface TranslationProps {
	i18n?: I18n;
	locale?: string;
	setLocale?: (locale: string) => void
}

const TranslationContext = createContext<TranslationProps>({});

export const useTranslation = () => {
	return useContext(TranslationContext);
};

export const TranslationProvider = ({ children }: any): React.JSX.Element => {
	const defaultLocale = getLocales()[0].languageCode ?? 'en';

	const [locale, setLocale] = useState<string>(defaultLocale);

	useEffect(() => {
		const getUserLocale = async () => {
			const userLocale = await SecureStore.getItemAsync(AppConfig.localeStorageKey);
			if (userLocale && !stringIsNullOrWhiteSpace(userLocale)) {
				setLocale(userLocale);
			}
		};
		getUserLocale();
	}, []);

	const i18n = new I18n();
	i18n.enableFallback = true;
	i18n.translations = { en: EnTranslations, pt: PtTranslations };
	i18n.locale = locale;

	const value = {
		i18n,
		setLocale,
		locale
	} as TranslationProps;

	return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};