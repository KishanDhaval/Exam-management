import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Loader2 } from "lucide-react";

export const ExamContext = createContext();

export const ExamContextProvider = ({ children }) => {
  const [exams, setExams] = useState("");
  const [results, setResults] = useState("");
  const [teacherResults, setTeacherResults] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchStudentItem, setFetchStudentItem] = useState(false);
  const [fetchTeacherItem, setFetchTeacherItem] = useState(false);

  const fetchExams = async () => {
    try {
      const { data } = await axiosInstance.get("/exam/");
      setExams(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResults = async () => {
    try {
      const { data } = await axiosInstance.get("/result/student");
      setResults(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/result/teacher");
      setTeacherResults(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherItem]);

  useEffect(() => {
    fetchExams();
    fetchResults();
    setFetchStudentItem(false);
  }, [fetchStudentItem]);

  return (
    <ExamContext.Provider
      value={{
        exams,
        loading,
        setLoading,
        setResults,
        results,
        teacherResults,
        setFetchStudentItem,
        setFetchTeacherItem,
      }}
    >
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
