import React, { useState } from 'react';
import Login from './app/screens/login';
import { ApplicationProvider, Button, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AuthProvider, useAuth } from './app/contex/AuthContex';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Periods } from './app/screens/periods';
import { TranslationProvider, useTranslation } from './app/contex/TranslationContex';
import * as NavigationBar from 'expo-navigation-bar';


const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
	const { authState, onLogout } = useAuth();
	const { i18n } = useTranslation();

	NavigationBar.setBackgroundColorAsync('white')

	if (!i18n) {
		return <></>
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{authState?.authenticated ? (
					<Stack.Screen
						name={i18n.t('interface.periods')}
						component={Periods}
						options={{
							headerRight: () => (
								<Button appearance='ghost' size='medium' onPress={onLogout}>
									{i18n.t('interface.exit')}
								</Button>
							),
						}}></Stack.Screen>
				) : (
					<Stack.Screen name={i18n.t('interface.login')} component={Login}></Stack.Screen>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<AuthProvider>
			<TranslationProvider>
				<ApplicationProvider {...eva} theme={eva.light}>
					<App />
				</ApplicationProvider>
			</TranslationProvider>
		</AuthProvider>
	</>
);
