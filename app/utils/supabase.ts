import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Supabase {
	public client?: SupabaseClient;

	constructor() {
		this.initSupabase();
	}

	private initSupabase(): void {
		this.client = createClient(
			`${process.env.EXPO_PUBLIC_SUPABSE_URL}`,
			`${process.env.EXPO_PUBLIC_SUPABASE_KEY}`,
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
