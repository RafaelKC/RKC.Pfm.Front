import React, { useEffect, useRef } from 'react';
import Login from './app/screens/auth/login';
import { ApplicationProvider, Icon, IconRegistry, useTheme } from '@ui-kitten/components';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useThemeModes } from './app/contex/ThemeContex';
import { DrawerLayoutAndroid, TouchableWithoutFeedback } from 'react-native';
import { DrawerModa } from './app/componets/drawer-modal';
import { styles } from './styles';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
	const drawer = useRef<DrawerLayoutAndroid>(null);
	const { authState } = useAuth();
	const { i18n } = useTranslation();
	const theme = useTheme();
	const { themeMode } = useThemeModes();

	useEffect(() => {
		NavigationBar.setBackgroundColorAsync( theme['background-basic-color-1']);
	}, [themeMode]);

	if (!i18n) {
		return <></>;
	}

	const NotAuthenticated = () => (
		<Stack.Navigator screenOptions={{
			headerStyle: {
				backgroundColor: theme['background-basic-color-1'],
			},
			headerTintColor: theme['text-basic-color'],
		}}>
			<Stack.Screen name={i18n.t(Screens.login)} navigationKey={Screens.login} component={Login}></Stack.Screen>
			<Stack.Screen name={i18n.t(Screens.register)} navigationKey={Screens.register} component={Register}></Stack.Screen>
		</Stack.Navigator>
	);

	const Authenticated = () => (
		<Stack.Navigator screenOptions={{
			headerStyle: {
				backgroundColor: theme['background-basic-color-1'],
			},
			headerTintColor: theme['text-basic-color'],
			headerRight: () => (
				<>
					<TouchableWithoutFeedback onPress={() => drawer.current?.openDrawer()}>
						<Icon name='menu-outline' fill={theme['text-basic-color']} style={styles.icon}></Icon>
					</TouchableWithoutFeedback>
				</>
			)
		}} >
			<Stack.Screen
				name={i18n.t(Screens.periods)}
				component={Periods}
				navigationKey={Screens.periods}></Stack.Screen>
		</Stack.Navigator>
	);

	return (
		<NavigationContainer>
			<DrawerLayoutAndroid
				ref={drawer}
				drawerWidth={300}
				drawerPosition={'right'}
				renderNavigationView={() => <DrawerModa drawer={drawer}/>}>
				{authState?.authenticated ? <Authenticated />: <NotAuthenticated />}
			</DrawerLayoutAndroid>
		</NavigationContainer>
	);
}

const ThemedApp = (): React.JSX.Element => {
	const { themeMode } = useThemeModes();
	return <ApplicationProvider {...eva} theme={eva[themeMode]}>
		<App/>
	</ApplicationProvider>
}

export default () => (
	<>
		<IconRegistry icons={EvaIconsPack} />
		<SafeAreaProvider>
			<SupabaseProvider>
				<AuthProvider>
					<TranslationProvider>
						<ThemeProvider>
							<ThemedApp />
						</ThemeProvider>
					</TranslationProvider>
				</AuthProvider>
			</SupabaseProvider>
		</SafeAreaProvider>
	</>
);
