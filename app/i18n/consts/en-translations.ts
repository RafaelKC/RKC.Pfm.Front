import { ITranslations } from '../i-translations';

export const EnTranslations: ITranslations = {
	authentication: {
		create: 'Create',
		createUser: 'Create user',
		doLogin: 'Do Login',
		email: 'Email',
		emailPlaceholder: 'my@mail.com',
		enter: 'Ok',
		name: 'Name',
		namePlaceholder: 'Bob McGrow',
		password: 'Password',
		passwordPlaceholder: '123qwe',
		title: 'Financial Management',
		erro: 'Error',
		userNameRequired: 'You must provide a username to continue.',
		ActionError: 'Error performing action, please try again or wait.',
	},
	interface: {
		exit: 'Exit',
		login: 'Login',
		periods: 'Periods',
		register: 'New User',
		dark: 'Dark mode',
		light: 'Light mode',
		periodsCreate: 'Create Periods',
	},
	translations: {
		pt: 'Portuguese',
		en: 'English',
	},
	components: {
		list: {
			load: 'Load items',
			empty: 'No items, reload?',
			error: 'Error, reload?',
		},
	},
	screens: {
		periods: {
			oldestFirst: 'Oldest first',
			newestFirst: 'Newest first',
		},
	},
};