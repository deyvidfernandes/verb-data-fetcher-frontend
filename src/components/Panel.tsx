import { ReactNode } from 'react'

type Props = {
   header: ReactNode,
   children: ReactNode
}

const Panel = (props: Props) => {
	const {header, children} = props

   return (
      <div className='h-fit w-full border-orange border-2 rounded-lg'>
         <div className='h-10'>{header}</div>
         <hr className='border-t-2 border-orange'/>
         <div>{children}</div>
      </div>
   )

}

export default Panel
