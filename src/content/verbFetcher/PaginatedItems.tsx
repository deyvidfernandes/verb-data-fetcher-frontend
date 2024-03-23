import { ReactNode } from 'react'
import ReactPaginate from 'react-paginate'

interface Props<D> {
	items: D[]
	component: (verbData: D) => ReactNode
	itemsPerPage: number
	page: number
	onPageChange: (selectedItem: {
		selected: number
	}) => void
}

export const PaginatedItems = <DataType,>({
	items,
	component,
	itemsPerPage,
	page,
	onPageChange,
}: Props<DataType>) => {
	const newOffset = (page * itemsPerPage) % items.length

	const endOffset = newOffset + itemsPerPage
	const currentItems = items.slice(newOffset, endOffset)
	const pageCount = Math.ceil(items.length / itemsPerPage)

	return (
		<>
			<div className='flex flex-col gap-8 px-6 py-8'>
				{currentItems.map((item) => component(item))}
			</div>
			<ReactPaginate
				breakLabel='...'
				nextLabel='>'
				onPageChange={onPageChange}
				pageRangeDisplayed={2}
				pageCount={pageCount}
				forcePage={page}
				previousLabel='<'
				renderOnZeroPageCount={null}
				className='flex flex-row w-full justify-center items-center text-white bg-brandOrange h-12'
				pageClassName='flex items-center justify-center w-10 h-10'
				pageLinkClassName='text-lg no-underline'
				activeClassName='circle-highlight'
				nextClassName='flex items-center justify-center w-10 h-10'
				previousClassName='flex items-center justify-center w-10 h-10'
				disabledLinkClassName='opacity-50 cursor-not-allowed'
				breakClassName='text-lg size-10 flex items-center justify-center no-underline'
			/>
		</>
	)
}
