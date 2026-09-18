import { createContext, useState } from "react";
import Modal from "../components/UI/Modal/Modal";


export const ModalContext = createContext()

export const ModalProvider = ({children})=>{
    const [modal,setModal]=useState(null)

    const openModal = (content)=>{
      setModal(content)
    }
    const closeModal= ()=>{
      setModal(null)
    }
  return (
    <ModalContext.Provider value={{openModal,closeModal}}>
      {children}
  
    <Modal show={!!modal} onClose={closeModal}>{modal}</Modal>

    </ModalContext.Provider>
  )
}