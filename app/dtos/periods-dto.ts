import { PeriodState } from '../enums/period-state.enum';

export class PeriodsDto {
	public id: string;
	public name: string;
	public start: Date;
	public end: Date;
	public isSchema: boolean;
	public idSchemaPeriod?: string;
	public state: PeriodState;
}