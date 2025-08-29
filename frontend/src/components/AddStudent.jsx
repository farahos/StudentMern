import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AddStudent = () => {
  const courses = ["English", "Arabic", "Math", "Science", "History"];
  const [student, setStudent] = useState({
    studentName: "",
    studentPhone: "",
    course: courses[0],
    motherName: "",
    motherPhone: "",
    studentClass: "",
    fee: "",
    dateRegistration: new Date().toISOString().split("T")[0],
  });
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://studentmern.onrender.com/api/student/getStudents"
      );
      setStudents(res.data);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => fetchStudents(), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://studentmern.onrender.com/api/student/updateStudent/${editId}`,
          student
        );
        toast.success("Student updated!");
      } else {
        await axios.post(
          "https://studentmern.onrender.com/api/student/addStudent",
          student
        );
        toast.success("Student added!");
      }
      setStudent({
        studentName: "",
        studentPhone: "",
        course: courses[0],
        motherName: "",
        motherPhone: "",
        studentClass: "",
        fee: "",
        dateRegistration: new Date().toISOString().split("T")[0],
      });
      setEditId(null);
      fetchStudents();
    } catch {
      toast.error("Failed to save student");
    }
  };

  const handleEdit = (s) => {
    setStudent({
      studentName: s.studentName,
      studentPhone: s.studentPhone,
      course: s.course,
      motherName: s.motherName,
      motherPhone: s.motherPhone,
      studentClass: s.studentClass,
      fee: s.fee,
      dateRegistration: s.dateRegistration.split("T")[0],
    });
    setEditId(s._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Delete Student",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(
                `https://studentmern.onrender.com/api/student/deleteStudent/${id}`
              );
              toast.success("Student deleted!");
              fetchStudents();
            } catch {
              toast.error("Failed to delete");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleImport = async () => {
    if (!file) return toast.error("Select a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        "https://studentmern.onrender.com/api/student/import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Imported successfully!");
      fetchStudents();
      setFile(null);
    } catch {
      toast.error("Failed to import");
    }
  };

  const filteredStudents = students
    .filter((s) => s.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.dateRegistration) - new Date(a.dateRegistration));

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-3xl shadow-lg p-8 transition hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            {editId ? "Update Student" : "Add New Student"}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: "studentName", placeholder: "Student Name" },
              { name: "studentPhone", placeholder: "Student Phone" },
              { name: "motherName", placeholder: "Mother's Name" },
              { name: "motherPhone", placeholder: "Mother's Phone" },
              { name: "studentClass", placeholder: "Class" },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                placeholder={f.placeholder}
                value={student[f.name]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            ))}
            <select
              name="course"
              value={student.course}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {courses.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              name="fee"
              value={student.fee}
              placeholder="Fee"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="date"
              name="dateRegistration"
              value={student.dateRegistration}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white font-semibold transition hover:scale-105 ${
                editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "Update Student" : "Add Student"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setStudent({
                    studentName: "",
                    studentPhone: "",
                    course: courses[0],
                    motherName: "",
                    motherPhone: "",
                    studentClass: "",
                    fee: "",
                    dateRegistration: new Date().toISOString().split("T")[0],
                  });
                }}
                className="w-full py-3 mt-2 rounded-xl bg-gray-400 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Import */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Bulk Import</h3>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="flex-1 border p-2 rounded-xl"
              />
              <button
                onClick={handleImport}
                disabled={!file}
                className={`px-4 py-2 rounded-xl ${
                  file ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-700">Students</h3>
            <input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-gray-500">No students found.</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mt-2 text-blue-500 hover:underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredStudents.map((s) => (
                <div key={s._id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border-l-4 border-blue-500 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-blue-700 text-lg">{s.studentName}</p>
                      <p className="text-gray-600 text-sm">{s.course} | Fee: ${s.fee}</p>
                      <p className="text-gray-500 text-xs">
                        Mother: {s.motherName} ({s.motherPhone})
                      </p>
                      <p className="text-gray-400 text-xs">
                        Registered: {new Date(s.dateRegistration).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(s)} className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
