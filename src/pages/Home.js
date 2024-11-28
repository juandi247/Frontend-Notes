import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]); // Estado para notas archivadas
  const [showModal, setShowModal] = useState(false); // Modal para nuevas notas
  const [showArchivedModal, setShowArchivedModal] = useState(false); // Modal para archivadas
  const [newNote, setNewNote] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [error, setError] = useState(null); // Manejo de errores
  const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState(null);
const [newCategory, setNewCategory] = useState("");
const [showCategoryModal, setShowCategoryModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal confirmación eliminar
const [noteToDelete, setNoteToDelete] = useState(null); // Nota a eliminar


const [showEditModal, setShowEditModal] = useState(false); // Estado para el modal de edición
const [editNote, setEditNote] = useState({ title: "", category: "", content: "" }); // Estado para la nota que se edita


const [editSuccessMessage, setEditSuccessMessage] = useState(""); // Estado para el mensaje de confirmación


const navigate = useNavigate(); // Inicializa useNavigate


const handleLogout = () => {
    // Eliminar el token de localStorage
    localStorage.removeItem("authToken");
    // Redirigir al usuario a la página de login
    navigate("/"); // Asegúrate de tener la ruta '/login' configurada en tu enrutador
  };



  //validate TOKEN
  
  









// Auth token for authentication
  const token = localStorage.getItem("authToken");
  console.log(token);





//unarchive notes
const handleUnarchiveNote = async (id) => {
    try {
      const response = await fetch(
        `https://backendnotes-production.up.railway.app/note/unarchive/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Usar el token de autenticación
          },
        }
      );
  
      if (response.ok) {
        // Actualizar las listas de notas
        const updatedNote = await response.json();
  
        // Eliminar la nota archivada de la lista de archivadas
        setArchivedNotes((prevArchivedNotes) =>
          prevArchivedNotes.filter((note) => note.id !== id)
        );
  
        // Agregar la nota a la lista de notas no archivadas
        setNotes((prevNotes) => [...prevNotes, updatedNote]);
        loadNotes();
        // Cerrar el modal de notas archivadas después de desarchivar
        setShowArchivedModal(false);
        
      } else {
        throw new Error("Failed to unarchive the note");
      }
    } catch (error) {
      console.error('Error unarchiving note:', error);
      setError('Failed to unarchive the note. Please try again.');
    }
  };





  //archive notes
  const handleArchiveNote = async (id) => {
    try {
      const response = await fetch(
        `https://backendnotes-production.up.railway.app/note/archive/${id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Usar el token de autenticación
          },
        }
      );
  
      if (response.ok) {
        
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== id) // Eliminar la nota archivada de las notas activas
        
        );
        setShowEditModal(false); // Esto cierra el modal

  
        // Puedes dejar la API encargada de actualizar las notas archivadas al abrir la sección correspondiente
      } else {
        throw new Error("Failed to archive the note");
      }
    } catch (error) {
      console.error('Error archiving note:', error);
      setError('Failed to archive the note. Please try again.');
    }
  };
  


  //edit  
  const handleEditNote = (note) => {
    setEditNote({
        id: note.id, 
        title: note.title,
        category: note.categoryName,
        content: note.content
      });
      setShowEditModal(true);
    };
  

    const handleSaveEdit = async () => {
        // Creamos un objeto con los datos que se van a enviar
        const updatedNote = {
          title: editNote.title,
          content: editNote.content,
        };
        console.log(editNote.id)
      
        try {
            const response = await fetch(
              `https://backendnotes-production.up.railway.app/note/edit/${editNote.id}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                mode: "cors",
                body: JSON.stringify(updatedNote),
              }
            );
      
            if (response.ok) {
              // Mostrar mensaje de éxito por 2 segundos
              setEditSuccessMessage("Note updated successfully!");
              setTimeout(() => setEditSuccessMessage(""), 2000); // Ocultar el mensaje después de 2 segundos
      
              // Actualizar las notas en el estado sin recargar
              setNotes((prevNotes) =>
                prevNotes.map((note) =>
                  note.id === editNote.id ? { ...note, ...updatedNote } : note
                )
              );
      
              setShowEditModal(false); // Cerrar el modal
            } else {
              throw new Error("Failed to update the note");
            }
          } catch (error) {
            console.error('Error updating note:', error);
            setError('Failed to update the note. Please try again.');
          }
        };



      
  
    const handleCancelEdit = () => {
      setShowEditModal(false);
    };















  // Función para mostrar el modal de confirmación
const handleShowDeleteConfirmation = (id) => {
    setNoteToDelete(id); // Establece la nota seleccionada para eliminar
    setShowDeleteModal(true); // Muestra el modal
  };
  


  // Función para eliminar la nota
  const handleDeleteNote = (id) => {
    fetch(`https://backendnotes-production.up.railway.app/note/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => {
        if (response.ok) {
          // Actualiza las notas después de la eliminación
          setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
          setShowDeleteModal(false);
        } else {
          throw new Error("Failed to delete note");
        }
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        setError("Error deleting note");
        setShowDeleteModal(false);
      });
  };















  useEffect(() => {
    fetch("https://backendnotes-production.up.railway.app/category/get", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Error fetching categories");
      });
  }, [token]);
  
  // Filtrar notas por categoría
 // Filtrar las notas por categoría seleccionada
 const filteredNotes = selectedCategory
    ? notes.filter((note) => note.categoryName === selectedCategory) // Ajustado a `categoryName`
    : notes;


    const handleAddCategory = () => {
        fetch("https://backendnotes-production.up.railway.app/category/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategory }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Failed to create category");
          })
          .then((data) => {
            setCategories((prevCategories) => [...prevCategories, data]);
            setNewCategory(""); // Limpiar el campo de la nueva categoría
            setShowCategoryModal(false); // Cerrar el modal
          })
          .catch((error) => {
            console.error("Error creating category:", error);
            setError("Error creating category");
          });
      };


  

  // Cargar notas no archivadas
  useEffect(() => {
    if (!token) {
      setError("No token found");
      navigate("/")
      return;
    }

    fetch("https://backendnotes-production.up.railway.app/note/unarchived", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => {
        console.error("Error fetching notes:", error);
        setError("Error fetching notes");
      });
  }, [token,navigate]);



  const loadNotes = async () => {
    if (!token) {
      setError("No token found");
      return;
    }

    try {
      const response = await fetch("https://backendnotes-production.up.railway.app/note/unarchived", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        throw new Error("Failed to fetch unarchived notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Error fetching notes");
    }
  };

  useEffect(() => {
    const fetchArchivedNotes = () => {
      fetch("https://backendnotes-production.up.railway.app/note/archived", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => setArchivedNotes(data))
        .catch((error) => {
          console.error("Error fetching archived notes:", error);
          setError("Error fetching archived notes");
        });
    };
  
    if (showArchivedModal) {
      fetchArchivedNotes();
    }
  }, [showArchivedModal, token]);  // Se agregan las dependencias necesarias
  










  const handleAddNote = () => {
    // Validación de los campos
    if (!newNote.title || !newNote.content || !newNote.category) {
      setError("Please fill in all fields (title, category, content).");
      return; // No continuar si hay campos vacíos
    }
  
    // Crear el objeto con los datos de la nueva nota
    const noteData = {
      title: newNote.title,
      content: newNote.content,
      categoryname: newNote.category, // Enviar la categoría con 'categoryname' como especifica la API
    };
  
    // Realizar la solicitud POST a la API para crear la nota
    fetch("https://backendnotes-production.up.railway.app/note/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(noteData),  // Asegúrate de que se envíe correctamente el JSON
    })
      .then((response) => {
        console.log("AAAA");
        console.log("Category being sent:", newNote.category); // Verifica qué valor tiene la categoría
        console.log("Response status:", response.status);  // Imprimir el estado de la respuesta
        return response.json();  // Convertimos la respuesta a JSON
      })
      .then((data) => {
  console.log("Response data:", data);  // Imprimir el contenido de la respuesta
 // Verifica si la respuesta fue exitosa
    setNotes((prevNotes) => [...prevNotes, data]);  // Agregar la nueva nota a las notas existentes
    setShowModal(false);  // Cerrar el modal

    // Llamar a la función para recargar las notas archivadas
   
  
      })
      .catch((error) => {
        console.error("Error creating note:", error);
        setError("There was an error while creating the note.");
      });



    };








    return (
        <div className="flex h-screen bg-black text-white">
          {/* Sidebar con Categorías */}
          <div className="w-1/4 p-6 bg-gray-900">
            <h2 className="text-xl font-semibold mb-6">Categories</h2>
            <ul>
              {/* Botón para "All Notes" */}
              <li className="mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left ${selectedCategory === null ? "text-white font-bold" : "text-gray-300"} hover:text-white`}
                >
                  All Notes
                </button>
              </li>


      
              {/* Botones para cada categoría */}
              {categories.map((category) => (
                <li key={category.id} className="mb-4">
                  <button
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left ${selectedCategory === category.name ? "text-white font-bold" : "text-gray-300"} hover:text-white`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => setShowCategoryModal(true)}
              className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white"
            >
              + New Category
            </button>
      
            <button
              onClick={() => {
                setShowArchivedModal(true);
              }}
              className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white"
            >
              View Archived Notes
            </button>
            {/* Botón Logout abajo, pegado a la esquina */}
      <button
        onClick={handleLogout} // Asegúrate de definir la función handleLogout
  className="absolute bottom-4 left-4 px-10 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded"
      >
        Logout
      </button>
    
          </div>




      
          {/* Panel de Notas */}
          <div className="flex-1 p-6 bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {selectedCategory ? `Category: ${selectedCategory}` : "All Notes"}
              </h2>
              <button
                onClick={() => setShowModal(true)}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                + New Notes
              </button>
            </div>



      
            {/* Manejo de errores */}
            {error && <div className="text-red-500">{error}</div>}



      
            <div className="overflow-y-auto h-[80vh]">
  {filteredNotes.map((note) => (
    <div key={note.id} className="relative bg-gray-900 p-4 rounded-lg shadow-lg mb-4">
      <h3 className="text-xl font-semibold">{note.title}</h3>
      <p className="text-sm text-gray-400">Category: {note.categoryName}</p>
      <p className="text-gray-300 mt-2">{note.content}</p>

      {/* Botón Eliminar */}
      <button
        onClick={() => handleShowDeleteConfirmation(note.id)}
        className="absolute bottom-9 right-16 p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
      >
        X
      </button>

      {/* Botón Editar */}
      <button
            onClick={() => handleEditNote(note)}
            className="absolute bottom-9 right-6 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
          >
            ✎
          </button>


        

      {/* Modal Confirmación Eliminar */}
      {showDeleteModal && noteToDelete === note.id && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowDeleteModal(false)} // Cierra el modal si se hace clic fuera
        >
          <div
            className="bg-gray-900 p-6 rounded-lg w-1/3"
            onClick={(e) => e.stopPropagation()} // Previene que el clic en el modal lo cierre
          >
            <h3 className="text-2xl font-semibold mb-4">Are you sure you want to delete this note?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="bg-red-600 py-2 px-4 rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

     {showEditModal && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    onClick={() => setShowEditModal(false)} // Cierra el modal si se hace clic fuera
  >
    <div
      className="bg-gray-900 p-6 rounded-lg w-1/3"
      onClick={(e) => e.stopPropagation()} // Previene que el clic en el modal lo cierre
    >
      <h3 className="text-2xl font-semibold mb-4">Edit Note</h3>
      <input
        type="text"
        value={editNote.title}
        onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
        className="mb-4 p-2 w-full bg-gray-800 text-white rounded-lg"
        placeholder="Title"
      />
      <textarea
        value={editNote.content}
        onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
        className="mb-4 p-2 w-full bg-gray-800 text-white rounded-lg"
        placeholder="Content"
      />
      {/* Aseguramos la distribución de los botones */}
      <div className="flex justify-evenly space-x-4">
        
        <button
          onClick={handleCancelEdit}
          className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEdit}
          className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-500"
        >
          Save
        </button>
        <button
  onClick={() => handleArchiveNote(editNote.id)} // Archivar la nota
  className="bg-yellow-600 py-2 px-4 rounded hover:bg-yellow-500"
>
  Archive
</button>

       
      </div>
    </div>
  </div>
)}

          
{/* Mensaje de Confirmación después de editar */}
{editSuccessMessage && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-green-800 text-white p-4 rounded-lg shadow-lg">
      <span>{editSuccessMessage}</span>
    </div>
  </div>
)}
        </div>
      ))}
    </div>
</div>
      
          {/* Modal para agregar una nota */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-900 p-6 rounded-lg w-1/3">
      <h3 className="text-2xl font-semibold mb-4">New Note</h3>
      
      <div className="mb-4">
        <label className="block text-gray-300">Title</label>
        <input
          type="text"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-300">Category</label>
        <select
          value={newNote.category}
          onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
          className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
        >
          <option value="" disabled>Select a category</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))
          ) : (
            <option value="" disabled>No categories available</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300">Content</label>
        <textarea
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleAddNote}
          className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-500"
        >
          Add Note
        </button>
      </div>
    </div>
  </div>
)}




      
          {/* Modal para agregar una categoría */}
          {showCategoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-gray-900 p-6 rounded-lg w-1/3">
                <h3 className="text-2xl font-semibold mb-4">New Category</h3>
                <div className="mb-4">
                  <label className="block text-gray-300">Category Name</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-500"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          )}
      



{showArchivedModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-900 p-6 rounded-lg w-2/3">
      <h3 className="text-2xl font-semibold mb-4">Archived Notes</h3>
      <div className="overflow-y-auto h-[60vh]">
        {archivedNotes.map((note) => (
          <div key={note.id} className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-400">{note.categoryName}</p>
            <p className="text-gray-300 mt-2">{note.content.slice(0, 100)}...</p>
            {/* Botón de Unarchive alineado a la derecha */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleUnarchiveNote(note.id)}
                className="py-1 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded"
              >
                Unarchive
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowArchivedModal(false)}
        className="mt-4 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded"
      >
        Close
      </button>
    </div>
  </div>
)}
</div>
      );
    };      
export default Home;

