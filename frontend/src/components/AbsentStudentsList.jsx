// AbsentStudentsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AbsentStudentsList = () => {
  const [absentStudents, setAbsentStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('https://studentmern.onrender.com/api/student/studentClass');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch absent students when class or date changes
  useEffect(() => {
    const fetchAbsentStudents = async () => {
      if (!selectedClass) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`https://studentmern.onrender.com/api/attendance/absent/${selectedClass}/${selectedDate}`
        );
        setAbsentStudents(response.data);
      } catch (error) {
        console.error('Error fetching absent students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsentStudents();
  }, [selectedClass, selectedDate]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Absent Students List</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {absentStudents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    {selectedClass ? "No absent students found" : "Please select a class"}
                  </td>
                </tr>
              ) : (
                absentStudents.map(student => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.studentClass}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.motherPhone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AbsentStudentsList;