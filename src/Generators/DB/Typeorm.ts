import {IDataBaseModel, IDatabaseGenerator} from '../../Interfaces'

export class TypeormDatabaseGenerator implements IDatabaseGenerator {
	generate(model: IDataBaseModel): string {
		return 'Coming soon'
	}
}
