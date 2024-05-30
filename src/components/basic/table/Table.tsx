import { ListComponent, ListComponentArray } from '@/util/types'
import './index.css'

interface Props {
	headers: ListComponent[]
	data: ListComponentArray[]
	noDataMessage?: string
}

export const Table = ({ headers, data, noDataMessage }: Props) => {
	const tableBodyNodes = data.map((row) => {
		if (row.components.length > headers.length)
			throw new Error('Row has more cells than headers')

		return (
			<tr key={row.key}>
				{row.components.map((cell) => (
					<td key={cell.key}>
						<div className='flex items-center justify-center py-4 px-6'>
							{cell.component}
						</div>
					</td>
				))}
			</tr>
		)
	})

	const tableHeaderNodes = headers.map((header) => (
		<th key={header.key}>{header.component}</th>
	))
	console.log(tableBodyNodes)

	return (
		<div className='w-full border-2 border-brandOrange rounded-lg overflow-hidden max-h-96 overflow-y-auto'>
			<table className='w-full unique-border-table'>
				<thead>
					<tr>{tableHeaderNodes}</tr>
				</thead>
				<tbody>
					{tableBodyNodes.length ? tableBodyNodes : (
						<tr>
							<td colSpan={tableHeaderNodes.length}>
								<p className='align-middle text-center font-medium text-orange-300 text-xl py-4'>
									{noDataMessage}
								</p>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
