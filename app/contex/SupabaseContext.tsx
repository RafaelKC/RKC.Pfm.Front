import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SupabaseProps {
	supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseProps>({
	supabase: {} as SupabaseClient
});

export const useSupabase = () => {
	return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }: any): React.JSX.Element => {
	const value = {
		supabase: createClient(
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
		)
	} as SupabaseProps;

	return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}