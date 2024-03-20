import { scrollToElement } from '@/util/fns'
import { ReactNode, useState } from 'react'
import ReactPaginate from 'react-paginate'

interface Props<D> {
	items: D[]
	component: (props: D) => ReactNode
	itemsPerPage: number
	elementIdToScrollOnPageChange: string
}

export const PaginatedItems = <DataType,>({
	items,
	component,
	itemsPerPage,
	elementIdToScrollOnPageChange,
}: Props<DataType>) => {
	const [itemOffset, setItemOffset] = useState(0)

	const endOffset = itemOffset + itemsPerPage
	console.log(`Loading items from ${itemOffset} to ${endOffset}`)
	const currentItems = items.slice(itemOffset, endOffset)
	const pageCount = Math.ceil(items.length / itemsPerPage)

	const handlePageClick = ({ selected }: { selected: number }) => {
		scrollToElement(elementIdToScrollOnPageChange)
		const newOffset = (selected * itemsPerPage) % items.length
		console.log(`User requested page number ${selected}, which is offset ${newOffset}`)
		setItemOffset(newOffset)
	}

	return (
		<>
			<div className='flex flex-col gap-8 px-6 py-8'>
				{currentItems.map((item) => component(item))}
			</div>
			<ReactPaginate
				breakLabel='...'
				nextLabel='>'
				onPageChange={handlePageClick}
				pageRangeDisplayed={2}
				pageCount={pageCount}
				previousLabel='<'
				renderOnZeroPageCount={null}
				className='flex flex-row w-full justify-center items-center bg-brandOrange h-12'
				pageClassName='flex items-center justify-center w-10 h-10 bg-brandOrange'
				activeClassName='circle-highlight text-red-500'
				nextClassName='flex text-white items-center justify-center w-10 h-10 bg-brandOrange '
				previousClassName='flex text-white items-center justify-center w-10 h-10 bg-brandOrange '
				pageLinkClassName='text-lg  text-white no-underline'
				previousLinkClassName='text-lg text-white no-underline'
				disabledLinkClassName='text-white opacity-50 cursor-not-allowed'
				breakClassName='text-lg size-10 flex items-center justify-center text-white no-underline'
			/>
		</>
	)
}
