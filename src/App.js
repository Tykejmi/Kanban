import React, {useState, useRef, useEffect} from "react"
import Modal from "./modal"
import logo from "./logo.svg"


const data = [
{	
	title: "Todo",
	items: ["Task xy"]
},
{	
	title: "Doing",
	items: []
},
{	
	title: "Done",
	items: []
}
]

function getLocalStorage(){
  let list = localStorage.getItem("list");
  if(list){
    return JSON.parse(localStorage.getItem("list"))
  }
  else{
    return data
      }
}




function App() {
	 
	const [list, setList] = useState(getLocalStorage)
	
/* DRAG AND DROP LOGIC*/
	const [isDragging, setIsDragging] = useState(false)
	const draggedItem = useRef(null)
	const draggedNode = useRef(null)

	function handleDragStart(e, index, innerIndex){
		draggedItem.current = [index, innerIndex]
		draggedNode.current = e.target
		draggedNode.current.addEventListener("dragend", handleDragEnd)
		setTimeout(()=>{
			setIsDragging(true)
		},)
	}
	function handleDragEnd(){
		draggedNode.current.removeEventListener("dragend", handleDragEnd)
		draggedItem.current = (null)
		draggedNode.current = (null)
		setIsDragging(false)
	}
	function handleDragEnter(e, index, innerIndex){
		const [currentIndex, currentInnerIndex] = draggedItem.current
        setList (prev=>{
			let newList = JSON.parse(JSON.stringify(prev))
			newList[index].items.splice(innerIndex, 0, newList[currentIndex].items.splice(currentInnerIndex, 1)[0])
			draggedItem.current = [index, innerIndex]
			return 	newList 
        })
	}
	function getStyles(index, innerIndex) {
		const [currentIndex, currentInnerIndex] = draggedItem.current
		if(currentIndex == index && currentInnerIndex == innerIndex){
			return "dragged-item item"
		}
		 else return "item"
	}
/* ADDDING NEW ITEMS LOGIC*/
	const [textData, setTextData] = useState("")

	function handleChange(e){
		setTextData(e.target.value)
	}
	// TOHLE POZDĚJI PŘEDĚLAT NA FORM 
	function handleKeyUp(e){
		if(e.keyCode == 13){
		addNewItem()
	}
}

	function addNewItem(){
		if(textData !== ""){
			setList(prev=>{
				let newArr = [...prev]
				newArr[0].items.push(textData)
				return newArr
			})
			setTextData("")
			closeModal()
			}
		}
	

	function deleteAll(){
		setList(prev=>{
				let newArr = [...prev]
				newArr.forEach(item=>{
					item.items = []
				})
				return newArr
			})
	}

	function deleteItem(index, innerIndex){
		setList(prev=>{
		let	newArr = [...prev]
		let resArr = []
			newArr.forEach((item, itemI)=>{
				if(index == itemI){
				resArr = item.items.filter((arrItem, arrItemIndex)=>{
						return  innerIndex != arrItemIndex
					})
				}
			})
			newArr[index].items = resArr
			return newArr
		})
	}


 useEffect(()=>{
    localStorage.setItem("list", JSON.stringify (list))
  }, [list])


/*MODAL LOGIC*/
const [isModalOpen, setIsModalOpen] = useState(false)

function openModal(){
	setIsModalOpen(true)
}
function closeModal(){
	setIsModalOpen(false)
}

	return (
		<div className = "outer-wrap">
		<header>
			<div className="header-logo">
					<img src = {logo} />
					<h1>KANBAN - TYKEJMI</h1>
			</div>
			<button onClick={openModal}> + Add New Task</button>
		</header>
			<div className = "inner-wrap">
				{list.map((item, index) => {
					return(
						<div 
						className = "col"
						onDragEnter = {isDragging && !item.items.length ? (e) => handleDragEnter(e, index, 0) : null}
						key = {index}
						
						> 
							<h4>{item.title}</h4>
							{item.items.map((innerItem, innerIndex) => {
								return(
									<div 
									className = {isDragging ? getStyles(index, innerIndex) : "item"}
									draggable
									onDragStart = { (e)=> handleDragStart(e, index, innerIndex)}
									onDragEnter = {(e) => handleDragEnter(e, index, innerIndex)}
									key = {innerIndex}
									>
										<p>{innerItem}</p>
										<button className="close-btn" onClick={() => deleteItem(index, innerIndex)}>X</button>
									</div>
									)
							})}
						</div>
						)
				})}
			</div>
			{isModalOpen && 
			<Modal 
			addNewItem = {addNewItem}
			textData={textData}
			handleChange={handleChange}
			handleKeyUp={handleKeyUp}
			deleteAll ={deleteAll}
			closeModal={closeModal}

			/>
		}
			
		</div>
	)
}

export default App;
