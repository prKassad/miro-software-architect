import {Label} from './Label'
import {h} from 'preact'

export interface IInputProps {
	value: string
	onChange(e): void
	type?: string
	label?: string
}

export const Input = ({value, onChange, type = 'text', label = ''}: IInputProps) => (
	<p>
		<Label>{label}</Label>
		<input
			type={type}
			className="miro-input miro-input--primary miro-input--small"
			value={value}
			onChange={onChange}
			style={{width: '100%'}}
		></input>
	</p>
)
