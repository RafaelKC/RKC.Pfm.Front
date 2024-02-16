import { PagedFilteredInput } from './commun/paged-filtered-input';

export class PeriodsGetListInput extends PagedFilteredInput{
	public endOnOrBeforeFilter?: Date;
	public orderAscending = true;
	public schemasFilter = false;
}