import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConsulProvider } from './consul';

export class Supabase {
	public client?: SupabaseClient;

	constructor() {
		this.initSupabase();
	}

	private async initSupabase(): Promise<void> {
		const consulConfig = await new ConsulProvider().configuration();

		this.client = createClient(
			consulConfig.supabaseUrl,
			consulConfig.supabaseUrl,
			{
				auth: {
					storage: AsyncStorage,
					autoRefreshToken: true,
					persistSession: true,
					detectSessionInUrl: false,
				},
			},
		);
	}
}
