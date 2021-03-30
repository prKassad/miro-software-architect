import {Label} from './Label'
import {h} from 'preact'

export interface IInputProps {
	text: string
	onChange?(e): void
	label?: string
	height?: number
}

export const Textarea = ({text, height = 100, onChange = () => {}, label = ''}: IInputProps) => (
	<p>
		<Label>{label}</Label>
		<textarea
			className="miro-input miro-input--primary miro-input--small"
			value={text}
			onChange={onChange}
			style={{resize: 'none', width: '100%', height: `${height}px`}}
		></textarea>
	</p>
)
