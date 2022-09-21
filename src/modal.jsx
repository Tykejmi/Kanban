import React from "react"

function Modal({ textData, handleChange, handleKeyUp, deleteAll, addNewItem, closeModal }) {
	return (
		<div className="modal">
			<div className="modal-wrap">
				<div className="modal-inner-wrap">
					<h4>Add new task</h4>
					<h5>Description</h5>
					<textarea
						type="text"
						value={textData}
						onChange={(e) => handleChange(e)}
						onKeyUp={(e) => handleKeyUp(e)}
					/>
					<button className="add-btn" onClick={addNewItem}>Add To Kanban </button>
					{/*<button onClick={deleteAll}>Delete all</button>*/}
					<button onClick={closeModal} className="close-btn">X</button>
				</div>

			</div>
		</div>

	)
}

export default Modal
