import React, { useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { IndexPath, Layout, ListItem, SelectItem, useStyleSheet } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RkcCheckbox } from '../../componets/rkc-checkbox';
import { RkcInput } from '../../componets/rkc-input';
import { RkcMonthPicker } from '../../componets/rkc-month-picker';
import { IRKCSelectOptions, RkcSelect, SelectRenderItemInfo } from '../../componets/rkc-select';
import { PeriodsDto } from '../../dtos/periods-dto';
import { PagedFilteredInput } from '../../dtos/commun/paged-filtered-input';
import { PeriodsGetListInput } from '../../dtos/periods-get-list-input';
import { PeriodService } from '../../services/period-service';
import { PagedResult } from '../../dtos/commun/paged-result';
import Moment from 'moment/moment';

const periodsFormSchema = z
	.object({
		isSchema: z.boolean(),
		severalPeriods: z.boolean(),
		name: z.string().min(4),
		startMonth: z.date(),
		endMonth: z.date().nullable(),
		idSchemaPeriod: z.string().nullable(),
	})
	.partial()
	.superRefine((data, ctx) => {
		if (
			data.endMonth &&
			data.startMonth &&
			data.severalPeriods &&
			data.endMonth <= data.startMonth
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['endMonth'],
				message: 'end month must be before start month',
			});
		}
	});

type PeriodsFormType = z.infer<typeof periodsFormSchema>;

export function PeriodsCreate({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
    const styles = useStyleSheet(baseStyles);

    const form = useForm<PeriodsFormType>({
        resolver: zodResolver(periodsFormSchema),
    });

    useEffect(() => {
        form.resetField('endMonth')
    }, [form.watch('severalPeriods')]);

    useEffect(() => {
        form.resetField('endMonth')
        form.resetField('severalPeriods')
        form.resetField('idSchemaPeriod')
    }, [form.watch('isSchema')]);

	const loadSchemaPeriods = async (filter: PagedFilteredInput) => {
		const input = filter as PeriodsGetListInput;
		input.orderAscending = true;
		input.endOnOrBeforeFilter = new Date();
		input.maxResultCount = 10;
		input.schemasFilter = true
		return await PeriodService.getList(input);
	}

	const renderItem = (info: SelectRenderItemInfo<PeriodsDto>): React.ReactElement => (
		<SelectItem
			title={info.item.name}
			key={info.item.id}
		/>
	);

	const selectOptions:IRKCSelectOptions<PeriodsDto> = {
			loadItems: loadSchemaPeriods,
			renderItems: renderItem,
			label: 'Periodos Esquema',
			getItemValue: (period: PeriodsDto) => period.id,
			getRenderValue: (period: PeriodsDto) => period.name,
		}

    return (
      <Layout style={styles.backgroud} level="1">
          <Layout style={styles.form}>
              <Layout style={styles.checkboxContainer} level="1">
                  <RkcCheckbox
                    control={form.control}
                    name='isSchema'
                  > Is Schema </RkcCheckbox>

                  {/*{form.watch().isSchema ? <></> : <RkcCheckbox*/}
                  {/*    control={form.control}*/}
                  {/*    name='severalPeriods'*/}
                  {/*> Generae sevaral months </RkcCheckbox>}*/}

              </Layout>

              <RkcInput control={form.control}  name='name' label="Name" autoCapitalize="sentences"/>

              { form.watch().isSchema ? <></> : <Layout style={styles.monthsContainer}>
                  <RkcMonthPicker
                      style={styles.monthInputs}
                      label={form.watch().severalPeriods ? 'Mês inicial' : 'Mês'}
                      control={form.control} name='startMonth'
                  />

                  { !form.watch().severalPeriods ? <></> :
                      <RkcMonthPicker
                          style={styles.monthInputs}
                          label={'Mês final'}
                          control={form.control}
													name='endMonth'
                      />
                  }
              </Layout> }

						{ form.watch().isSchema ? <></> : <RkcSelect
							name='idSchemaPeriod'
							control={form.control}
							options={selectOptions}
						/> }

          </Layout>
      </Layout>
    );
}

const baseStyles = StyleSheet.create({
    backgroud: {
        height: '100%',
        padding: 24,
        display: 'flex',
        gap: 8,
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    form: {
        height: '100%',
        display: 'flex',
        gap: 32,
    },
    monthsContainer: {
        // display: 'flex',
        // flexDirection: "row",
        // justifyContent: 'space-between',
        // maxWidth: '100%'
    },
    monthInputs: {
        // minWidth: '45%',
    }
});
