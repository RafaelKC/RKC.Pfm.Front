import React, { useState } from 'react';
import { Button, Icon, Layout, Spinner, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { RkcInput } from '../../componets/rkc-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contex/AuthContext';
import { useTranslation } from '../../contex/TranslationContext';
import { LanguageButton } from '../../componets/language-button';
import { NavigationProp } from '@react-navigation/native';
import { Screens } from '../screens.conts';

const userSchema = z.object({
	name: z.string().min(3),
	password: z.string().min(8),
	email: z.string().email(),
});

type UserType = z.infer<typeof userSchema>;

export default function Register({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [saving, setSaving] = useState(false);

	const { i18n } = useTranslation();
	if (!i18n) {
		return <></>;
	}

	const { onRegister, onLogin } = useAuth();

	const form = useForm<UserType>({
		resolver: zodResolver(userSchema),
	});

	const toggleSecureEntry = (): void => {
		setSecureTextEntry(!secureTextEntry);
	};

	const handleUser = async (user: UserType): Promise<void> => {
		setSaving(true);
		if (onRegister && onLogin) {
			const result = await onRegister(user.email, user.password, user.name);
			if (result.error) {
				Alert.alert(i18n.t('authentication.erro'), i18n.t('authentication.ActionError'));
				return;
			}
			const loginResult = await onLogin(user.email, user.password);
			if (loginResult.error)
				Alert.alert(i18n.t('authentication.erro'), i18n.t('authentication.ActionError'));
		}
		setSaving(false);
	};

	const renderIcon = (): React.ReactElement => (
		<TouchableWithoutFeedback onPress={toggleSecureEntry}>
			<Icon style={styles.icon} fill='#8F9BB3' name={secureTextEntry ? 'eye-off' : 'eye'} />
		</TouchableWithoutFeedback>
	);

	return (
		<Layout style={styles.layout}>
			<Layout style={styles.layoutInput}>
				<Text category='h4'>{i18n.t('authentication.title')}</Text>

				<RkcInput
					control={form.control}
					name='name'
					style={styles.input}
					label={i18n.t('authentication.name')}
					placeholder={i18n.t('authentication.namePlaceholder')}
				/>

				<RkcInput
					textContentType='emailAddress'
					autoCapitalize='none'
					autoComplete='email'
					control={form.control}
					name='email'
					style={styles.input}
					label={i18n.t('authentication.name')}
					placeholder={i18n.t('authentication.emailPlaceholder')}
				/>

				<RkcInput
					textContentType='password'
					autoCapitalize='none'
					autoComplete='password'
					control={form.control}
					name='password'
					style={styles.input}
					label={i18n.t('authentication.password')}
					placeholder={i18n.t('authentication.passwordPlaceholder')}
					accessoryRight={renderIcon}
					secureTextEntry={secureTextEntry}
				/>

				<Layout style={styles.buttonContainer}>
					<Button
						disabled={!form.formState.isValid || saving}
						onPress={form.handleSubmit(handleUser)}
						style={styles.button}
						status='primary'>
						{i18n.t('authentication.create')}
					</Button>

					{saving ? (
						<></>
					) : (
						<Button
							disabled={saving}
							style={styles.buttonCriar}
							status='primary'
							onPress={() => navigation.navigate(i18n.t(Screens.login))}
							appearance='ghost'>
							{i18n.t('authentication.doLogin')}
						</Button>
					)}

					{saving ? <Spinner /> : <></>}
				</Layout>
			</Layout>

			<LanguageButton></LanguageButton>
		</Layout>
	);
}

const styles = StyleSheet.create({
	icon: {
		width: 24,
		height: 24,
	},
	layoutInput: {
		gap: 16,
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	layout: {
		display: 'flex',
		width: '100%',
		height: '100%',
		paddingVertical: 64,
		paddingHorizontal: 32,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	input: {
		width: '100%',
	},
	buttonContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	button: {
		width: 100,
	},
	buttonCriar: {
		width: 150,
	},
});
