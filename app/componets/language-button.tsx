import React from 'react';
import { Button, ButtonGroup, Layout } from '@ui-kitten/components';
import { useTranslation } from '../contex/TranslationContext';
import * as SecureStore from 'expo-secure-store';
import { AppConfig } from '../../consts/app-config';

export const LanguageButton = (): React.ReactElement => {
	const { locale, setLocale, i18n } = useTranslation();

	if (!locale || !setLocale || !i18n) return <></>;

	const handleLocale = async (newLocale: string) => {
		setLocale(newLocale);
		await SecureStore.setItemAsync(AppConfig.localeStorageKey, newLocale);
	};

	return (
		<Layout>
			<ButtonGroup size={'small'}>
				<Button onPress={() => handleLocale('en')} appearance={locale == 'en' ? 'filled' : 'ghost'}>
					{i18n.t('translations.en')}
				</Button>

				<Button onPress={() => handleLocale('pt')} appearance={locale == 'pt' ? 'filled' : 'ghost'}>
					{i18n.t('translations.pt')}
				</Button>
			</ButtonGroup>
		</Layout>
	);
};