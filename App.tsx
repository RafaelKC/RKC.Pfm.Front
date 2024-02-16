import React from 'react';
import Login from './app/screens/auth/login';
import { ApplicationProvider, Button, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AuthProvider, useAuth } from './app/contex/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Periods } from './app/screens/periods';
import { TranslationProvider, useTranslation } from './app/contex/TranslationContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Screens } from './app/screens/screens.conts';
import Register from './app/screens/auth/register';
import { SupabaseProvider } from './app/contex/SupabaseContext';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
	const { authState, onLogout } = useAuth();
	const { i18n } = useTranslation();

	NavigationBar.setBackgroundColorAsync('white');

	if (!i18n) {
		return <></>;
	}

	const NotAuthenticated = () => (
		<Stack.Navigator>
			<Stack.Screen name={i18n.t(Screens.login)} navigationKey={Screens.login} component={Login}></Stack.Screen>
			<Stack.Screen name={i18n.t(Screens.register)} navigationKey={Screens.register} component={Register}></Stack.Screen>
		</Stack.Navigator>
	);

	const Authenticated = () => (
		<Stack.Navigator>
			<Stack.Screen
				name={i18n.t(Screens.periods)}
				component={Periods}
				navigationKey={Screens.periods}
				options={{
					headerRight: () => (
						<Button appearance='ghost' size='medium' onPress={onLogout}>
							{i18n.t('interface.exit')}
						</Button>
					)
				}}></Stack.Screen>
		</Stack.Navigator>
	);

	return (
		<NavigationContainer>
			{authState?.authenticated ? <Authenticated />: <NotAuthenticated />}
		</NavigationContainer>
	);
}

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<SupabaseProvider>
			<AuthProvider>
				<TranslationProvider>
					<ApplicationProvider {...eva} theme={eva.light}>
						<App />
					</ApplicationProvider>
				</TranslationProvider>
			</AuthProvider>
		</SupabaseProvider>
	</>
);
