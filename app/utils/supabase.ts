import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../../consts/app-config';

export class Supabase {
	public client?: SupabaseClient;

	constructor() {
		this.initSupabase();
	}

	private initSupabase(): void {
		this.client = createClient(
			AppConfig.SupabaseURL,
			AppConfig.SupabaseKey,
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
