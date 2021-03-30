import {h} from 'preact'

export enum ButtonType {
	PRIMARY,
	SECONDARY,
}

export interface IButtonProps {
	children: string
	onClick(e): void
	type?: ButtonType
	textColor?: string | null
}

export const Button = ({children: text, textColor = null, onClick, type = ButtonType.PRIMARY}: IButtonProps) => (
	<button
		class={`miro-btn miro-btn--${ButtonType[type].toString().toLowerCase()} miro-btn--small`}
		onClick={onClick}
		// @ts-ignore
		style={{width: '100%', color: textColor}}
	>
		{text}
	</button>
)
