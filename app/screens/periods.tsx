import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import { Icon, Layout, List, ListItem, Text, useStyleSheet, useTheme } from '@ui-kitten/components';
import { Skeleton } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { PeriodService } from '../services/period-service';
import { PeriodsGetListInput } from '../dtos/periods-get-list-input';
import { PeriodState } from '../enums/period-state.enum';
import { PeriodsDto } from '../dtos/periods-dto';
import { PagedResult } from '../dtos/commun/paged-result';
import { useTranslation } from '../contex/TranslationContext';

export function Periods(): React.JSX.Element {
	const [loaded, setLoaded] = useState(false);
	const [ascending, setAscending] = useState(true);
	const [pagedResult, setPagedResult] = useState<PagedResult<PeriodsDto>>();
	const { locale } = useTranslation();

	const theme = useTheme();
	const styles = useStyleSheet(baseStyles);

	const loadPeriods = async () => {
		const input = new PeriodsGetListInput();
		input.orderAscending = ascending;
		input.endOnOrBeforeFilter = new Date();
		input.maxResultCount = 10;

		const periods = await PeriodService.getList(input);
		if (Boolean(periods)) {
			setLoaded(true);
			setPagedResult(periods);
		}
	};

	useEffect(() => {
		setLoaded(false);
		loadPeriods();
	}, [ascending]);

	useEffect(() => {
		Moment.locale(locale ?? 'en');
	}, [locale]);

	const handleAcendingChange = () => {
		setAscending(!ascending);
	};

	const stateIcon = (state: PeriodState) => {
		let icon = 'checkmark-circle-2-outline';
		let color = theme['color-success-focus'];

		if (state === PeriodState.Current) {
			icon = 'play-circle-outline';
			color = theme['color-info-400'];
		}
		if (state === PeriodState.Finalized) {
			icon = 'minus-circle-outline';
			color = theme['color-warning-default'];
		}

		return (props: any) => <Icon {...props} fill={color} name={icon} />;
	};

	const renderItem = ({ item }: { item: PeriodsDto }): React.ReactElement => (
		<ListItem
			style={styles.listItem}
			title={Moment(item.start).format('MMM YY')}
			description={item.name}
			accessoryRight={stateIcon(item.state)}
		/>
	);

	const LoadedScreen = (): React.JSX.Element => (
		<List data={pagedResult?.items} renderItem={renderItem} style={styles.list} />
	);

	return (
		<Layout style={styles.backgroud} level='2'>
			<Layout style={styles.actonsContainer}>
				<TouchableWithoutFeedback onPress={handleAcendingChange}>
					<Icon
						name={ascending ? 'arrow-up-outline' : 'arrow-down-outline'}
						style={styles.icon}
						fill={theme['text-basic-color']}></Icon>
				</TouchableWithoutFeedback>
				<Text category='label' style={styles.actionText}>
					{ascending ? 'Mais antigas primeiro' : 'Mais novas primeiro'}
				</Text>
			</Layout>
			{loaded ? <LoadedScreen /> : <LondingScreen />}
		</Layout>
	);
}

const LondingScreen = (): React.JSX.Element[] => {
	const skenletons = new Array<React.JSX.Element>();

	for (let i = 0; i < 9; i++) {
		skenletons.push(
			<Skeleton
				LinearGradientComponent={LinearGradient}
				animation='wave'
				style={baseStyles.skeleton}
				height={75}
				key={i}
			/>,
		);
	}

	return skenletons;
};

const baseStyles = StyleSheet.create({
	backgroud: {
		height: '100%',
		padding: 16,
		display: 'flex',
		gap: 8,
	},
	skeleton: {
		width: '100%',
		borderRadius: 5,
	},
	icon: {
		width: 28,
		height: 28,
	},
	actionText: {
		color: 'text-basic-color',
	},
	actonsContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'background-basic-color-2',
	},
	listItem: {
		backgroundColor: 'background-basic-color-4',
		borderRadius: 5,
		height: 75,
	},
	list: {
		backgroundColor: 'invisivble',
	},
});
