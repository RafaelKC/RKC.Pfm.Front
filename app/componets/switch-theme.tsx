import React, { useState } from 'react';
import { useThemeModes } from '../contex/ThemeContex';
import { Layout, Text, Toggle } from '@ui-kitten/components';
import { useTranslation } from '../contex/TranslationContext';

export function SwitchTheme(): React.JSX.Element {
	const { themeMode, setTheme } = useThemeModes();
	const { i18n } = useTranslation();
	const [checked, setChecked] = useState(themeMode === 'dark');

	if (i18n == null) {
		return <></>;
	}

	const handleChanged = () => {
		setChecked(!checked);
		const nextTheme = checked ? 'light' : 'dark';
		setTheme(nextTheme);
	};

	return (
		<Layout>
			<Toggle checked={checked} onChange={handleChanged}>
				<Text>{i18n.t(`interface.dark`)}</Text>
			</Toggle>
		</Layout>
	);
}