import React from 'react';
import { Button, Layout, useStyleSheet } from '@ui-kitten/components';
import { useAuth } from '../contex/AuthContext';
import { useTranslation } from '../contex/TranslationContext';
import { DrawerLayoutAndroid, StyleSheet } from 'react-native';
import { LanguageButton } from './language-button';
import { SwitchTheme } from './switch-theme';

export function DrawerModa({
	drawer,
}: {
	drawer: React.RefObject<DrawerLayoutAndroid>;
}): React.JSX.Element {
	const { onLogout, authState } = useAuth();
	const { i18n } = useTranslation();
	const styles = useStyleSheet(baseStyles);
	if (i18n == null) return <></>;

	return (
		<Layout style={styles.background}>
			{
				authState?.authenticated
					? <Button
						appearance='ghost'
						size='medium'
						onPress={() => {
							if (onLogout) {
								onLogout();
							}
							drawer.current?.closeDrawer();
						}}>
						{i18n.t('interface.exit')}
					</Button>
					: <></>
			}

			<SwitchTheme></SwitchTheme>
			<LanguageButton></LanguageButton>
		</Layout>
	);
}

const baseStyles = StyleSheet.create({
	background: {
		height: '100%',
		width: '100%',
		backgroundColor: 'background-basic-color-1',
		display: 'flex',
		gap: 8,
		alignItems: 'flex-end',
		padding: 16,
		paddingTop: 32
	}
});