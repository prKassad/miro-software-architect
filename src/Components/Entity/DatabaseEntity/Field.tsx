import {DataBaseFieldType, IEntityFieldMeta} from '../../../Interfaces'

import {Checkbox} from '../../Reusable/Checkbox'
import {Input} from '../../Reusable/Input'
import {Selector} from '../../Reusable/Selector'
import {h} from 'preact'

export interface IDatabaseEntityFieldProps {
	field: IEntityFieldMeta
	setField(field: IEntityFieldMeta)
	index: number
}

const getArrayFieldTypes = () => {
	return Object.keys(DataBaseFieldType)
		.filter((k) => typeof DataBaseFieldType[k as any] === 'number')
		.map((v) => ({value: DataBaseFieldType[v], text: v}))
}

export const DatabaseEntityField = ({field, setField}: IDatabaseEntityFieldProps) => (
	<div>
		<Input
			label="Name"
			value={field.name}
			onChange={(e) =>
				setField({
					...field,
					name: e.currentTarget.value,
				})
			}
		></Input>
		<Selector
			label="Data type"
			value={field.type}
			onChange={(e) => {
				setField({
					...field,
					type: Number.parseInt(e.currentTarget.value),
				})
			}}
			options={getArrayFieldTypes()}
		></Selector>
		<Input
			label="Default value"
			value={field.defaultValue}
			onChange={(e) =>
				setField({
					...field,
					defaultValue: e.currentTarget.value,
				})
			}
		></Input>
		<Input
			label="Length"
			value={typeof field.length == 'number' ? '' + field.length : ''}
			onChange={(e) =>
				setField({
					...field,
					length: Number.parseInt(e.currentTarget.value) > 0 ? Number.parseInt(e.currentTarget.value) : null,
				})
			}
		></Input>
		<Checkbox
			value="Auto increment"
			checked={field.autoIncrement}
			onChange={(e) =>
				setField({
					...field,
					autoIncrement: e.currentTarget.checked,
				})
			}
		/>
		<Checkbox
			value="Primary key"
			checked={field.primaryKey}
			onChange={(e) =>
				setField({
					...field,
					primaryKey: e.currentTarget.checked,
				})
			}
		/>
		<Checkbox
			value="Not null"
			checked={field.notNull}
			onChange={(e) =>
				setField({
					...field,
					notNull: e.currentTarget.checked,
				})
			}
		/>
		<Checkbox
			value="Unique"
			checked={field.unique}
			onChange={(e) =>
				setField({
					...field,
					unique: e.currentTarget.checked,
				})
			}
		/>
		<Checkbox
			value="Foregin key"
			checked={field.foreginKey}
			onChange={(e) =>
				setField({
					...field,
					foreginKey: e.currentTarget.checked,
				})
			}
		/>
	</div>
)
