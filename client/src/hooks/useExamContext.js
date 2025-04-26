import { useContext } from "react";
import { ExamContext } from "../context/ExamContext";

export const useExamContext =()=>{
    const context = useContext(ExamContext)

    if(!context){
        throw Error('useExamContext must be used inside an ExamContextProvider')
    }

    return context
}
