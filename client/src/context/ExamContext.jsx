import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Loader2 } from "lucide-react";

export const ExamContext = createContext();

export const ExamContextProvider = ({ children }) => {
  const [exams, setExams] = useState("");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetch , setFetch] = useState(false);

  const fetchExams = async () => {
    try {
      const { data } = await axiosInstance.get("/exam/");
      setExams(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResults = async()=>{
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/result/student");
      setResults(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExams();
    fetchResults()
    setFetch(false)
  }, [fetch]);

  return (
    <ExamContext.Provider value={{ exams, loading, setLoading ,  setResults,  results ,  setFetch}}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        children
      )}
    </ExamContext.Provider>
  );
};
